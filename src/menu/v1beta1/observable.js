/*
 * Copyright 2019, Momentum Ideas, Co. All rights reserved.
 *
 * Source and object computer code contained herein is the private intellectual
 * property of Bloombox, a California Limited Liability Corporation. Use of this
 * code in source form requires permission in writing before use or the
 * assembly, distribution, or publishing of derivative works, for commercial
 * purposes or any other purpose, from a duly authorized officer of Momentum
 * Ideas Co.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox: Observable Menu
 *
 * @fileoverview Provides an interface into a menu payload which maintains a
 *               live connection to the Bloombox Cloud, and applies updates to
 *               itself as changes occur in underlying catalog storage.
 */

/*global goog */

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');
goog.require('grpc.web.StatusCode');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent');

goog.provide('bloombox.menu.ObservableMenu');
goog.provide('bloombox.menu.ObservableReadyCallback');


// -- Type Definitions -- //
/**
 * Defines a callback interface, for a function which is called when a given
 * `ObservableMenu` is ready to relay update events, after the initial base menu
 * catalog payload has either been received and installed, or recalled from the
 * cache against a given menu fingerprint.
 *
 * @typedef {function(!proto.opencannabis.products.menu.Menu,
 *                    string,
 *                    boolean)}
 */
bloombox.menu.ObservableReadyCallback;

/**
 * Defines a callback interface, for a function which is called when menu update
 * events are received during a menu streaming session. These events occur only
 * after the initial base menu is resolved, either from local cache storage or
 * a full catalog payload from the server.
 *
 * @typedef {function(!proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent)}
 */
bloombox.menu.ObservableMenuReactor;


/**
 * Defines a stream end callback, which is dispatched after the stream is
 * closed, but before the `cancelCallback`, if indeed it was cancelled. This
 * function is called whether or not the stream terminates gracefully.
 *
 * @typedef {function()}
 */
bloombox.menu.ObservableMenuEndCallback;


/**
 * Defines a callback that is dispatched in the event the stream is cancelled,
 * for any reason (by the user, or by the engine, if the stream is ending and
 * must be re-established).
 *
 * @typedef {function()}
 */
bloombox.menu.ObservableMenuCancelCallback;

/**
 * Defines a callback that is dispatched when/if the status of the stream
 * changes, via a response from the server. The method is passed the code
 * indicating the status of the latest response, including any details
 * provided, and metadata attached to the response.
 *
 * @typedef {function(!grpc.web.StatusCode,
 *                    ?string,
 *                    !Object<string, string>=)}
 */
bloombox.menu.ObservableMenuStatusCallback;


/**
 * Defines a callback that is dispatched in the event of an error during
 * stream processing, or emitted over the stream. Passed as part of the
 * callback is a boolean which indicates whether the stream was terminated
 * or if it lives on. `true` if the connection is still alive, `false` if
 * the connection has been cancelled, or will be cancelled.
 *
 * @typedef {function(boolean, *)}
 */
bloombox.menu.ObservableMenuErrorCallback;


// -- Configuration -- //
/**
 * Defines the amount of time a menu streaming session can last, before it must
 * be re-established.
 *
 * @define {number} bloombox.menu.STREAM_TIMEOUT Defines the maximum amount of
 *         time, in milliseconds, that a streaming menu session can last.
 */
bloombox.menu.STREAM_TIMEOUT = goog.define(
  'bloombox.menu.STREAM_TIMEOUT', 1000 * (60 * 8));


/**
 * Define the maximum amount of time to wait for an initial menu payload. After
 * this many milliseconds, if we have not received an initial base menu payload,
 * and have not received confirmation of our given fingerprint (if applicable),
 * the stream is considered dead.
 *
 * @define {number} bloombox.menu.INITIAL_TIMEOUT Defines the max amount of time
 *         to wait for a fingerprint indication or raw menu catalog to use as a
 *         base for comparisons.
 */
bloombox.menu.INITIAL_TIMEOUT = goog.define(
  'bloombox.menu.INITIAL_TIMEOUT', 5000);


// -- Implementation -- //
goog.scope(function() {
  // -- Observable Menu -- //
  /**
   * Defines the notion of an 'observable' menu, which resolves an initial base
   * menu payload, and then commences listening for changes on that menu payload.
   * When changes occur in underlying catalog storage, receive them via an
   * observer, apply them to local storage, and dispatch them forth as applicable.
   *
   * Since the observable menu may be constructed before a base menu payload is
   * resolved and available, a Promise-like interface is exposed, where invoking
   * code can pick up the base menu and begin listening for changes after the
   * initial sync has completed, via the `onReady` method.
   */
  bloombox.menu.ObservableMenu = goog.defineClass(null, {
    /**
     * Construct a new observable menu, given the details of the stream's request
     * and promise for the initial menu event. In some cases, a `localMenu` and
     * `fingerprint` may be provided to hopefully alleviate the need to transmit
     * a full base menu.
     *
     * @param {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent>} eventStream
     *        Server-sent stream of events, each describing a change in underlying
     *        menu data.
     * @param {?string=} fingerprint Active fingerprint value, if a local menu is
     *        provided. Required parameter if `localMenu` is not null, and requires
     *        a `localMenu` if specified.
     * @param {proto.opencannabis.products.menu.Menu=} localMenu If a menu catalog
     *        is already present on the local client in some form, we indicate as
     *        as much here, by nominating that menu to be used as the base. If a
     *        `localMenu` is specified, one must also specify a `fingerprint`.
     * @constructor
     */
    constructor: function(eventStream, fingerprint, localMenu) {
      /**
       * Stream of events, sent by the server, the first of which should describe
       * the initial menu catalog. Subsequent events describe delta updates to the
       * underlying menu data which should be applied locally, and forwarded to
       * any listening clients.
       *
       * @type {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent>}
       */
      this.stream = eventStream;

      /**
       * Defines a property for the base menu, which is not necessarily available
       * to us yet. The base menu payload is used to compare against for diff
       * updates, and it is provided by the `initialPromise` given to this object
       * when it was constructed.
       *
       * @private
       * @type {?proto.opencannabis.products.menu.Menu}
       */
      this.baseMenu = localMenu || null;

      /**
       * Holds the currently-active menu fingerprint, which identifies the menu
       * data held by the client with a distinct state identifier, derived from
       * hashing the data in the menu payload. This updates with each streamed
       * menu event, and if it matches the initial menu payload's fingerprint, we
       * use the local menu copy (`localMenu`) rather than receiving an initial
       * full menu payload.
       *
       * If `fingerprint` is specified, `localMenu` must be specified, and vice-
       * versa.
       *
       * @private
       * @type {?string}
       */
      this.fingerprint = localMenu ? (fingerprint || null) : null;

      /**
       * Keeps track of the time (in milliseconds since the Unix epoch) this menu
       * stream has been open, so we can cease and revive the connection according
       * to the stream timeout. Stored as a timestamp indicating when the
       * observable menu was created.
       *
       * @const
       * @private
       * @type {number}
       */
      this.established = +(new Date());

      /**
       * When the base menu is initially ready, this callback is called. It
       * starts out null, but then is filled in by the first, and each
       * subsequent, invocation of `onReady`.
       *
       * @private
       * @type {?bloombox.menu.ObservableReadyCallback}
       */
      this.baseMenuReady = null;

      /**
       * Event observer function. Dispatched each time a menu change is received
       * so that outer code may react to the change. Always called after data
       * consistency can be guaranteed locally.
       *
       * @private
       * @type {?bloombox.menu.ObservableMenuReactor}
       */
      this.observer = null;

      /**
       * Indicates whether the initial base menu has yet been resolved, either
       * from a fingerprint indication from the server, or a fresh/full menu
       * catalog payload. After this flag is set to `true`, the observable menu
       * is processing updates.
       *
       * @type {boolean}
       */
      this.initialMenuReady = false;

      /**
       * Defines a stream end callback, which is dispatched after the stream is
       * closed, but before the `cancelCallback`, if indeed it was cancelled.
       * This function is called whether or not the stream terminates
       * gracefully.
       *
       * @type {?bloombox.menu.ObservableMenuEndCallback}
       */
      this.endCallback = null;

      /**
       * Defines a callback that is dispatched in the event the stream is
       * cancelled, for any reason (by the user, or by the engine, if the stream
       * is ending and must be re-established).
       *
       * @type {?bloombox.menu.ObservableMenuCancelCallback}
       */
      this.cancelCallback = null;

      /**
       * Defines a callback that is dispatched in the event of an error during
       * stream processing, or emitted over the stream. Passed as part of the
       * callback is a boolean which indicates whether the stream was terminated
       * or if it lives on. `true` if the connection is still alive, `false` if
       * the connection has been cancelled, or will be cancelled.
       *
       * @type {?bloombox.menu.ObservableMenuErrorCallback}
       */
      this.errCallback = null;

      /**
       * Defines a callback that is dispatched when/if the status of the stream
       * changes, via a response from the server. The method is passed the code
       * indicating the status of the latest response, including any details
       * provided, and metadata attached to the response.
       *
       * @type {?bloombox.menu.ObservableMenuStatusCallback}
       */
      this.statusCallback = null;
    },

    /**
     * Check this observable menu for a valid session state. If the established
     * time of this session has exceeded or meets the maximum timeout for a live
     * menu stream, tell the appropriate callbacks, and cancel it. Once the
     * stream is closed, re-establish the stream, if so directed.
     *
     * @param {function()} proceed Function to call to proceed with processing,
     *        once a valid session has been established or otherwise acquired.
     * @param {function()} reject Function to call if the session needs to be
     *        rotated, to let the outer code know it is re-establishing.
     * @param {boolean=} reset Whether to re-set a `setTimeout` to dispatch this
     *        function. If set to `true`, will check again in 30 seconds.
     */
    check: function(proceed, reject, reset) {
      const now = +(new Date());

      if (now >= (this.established + bloombox.menu.STREAM_TIMEOUT)) {
        // it's expired or is about to expire. also, don't re-set if it's
        // already expired.
        reject();
      } else {
        // we're good
        proceed();

        if (reset)
          setTimeout(function() {
            // log, check, and re-set if needed
            bloombox.logging.log('Re-checking live menu stream...');
            this.check(proceed, reject, true);
          }, 30 * 1000);
      }
    },

    process: function() {
      bloombox.logging.log('Establishing live menu session...');

      this.stream.on('data', function(responsePayload) {
        const response = (
          /** @type {proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent} */ (
          responsePayload));

        if (!this.initialMenuReady) {
          // we are processing an initial payload
          bloombox.logging.log(
            'Processing initial menu stream notification...',
            {'response': response});

          const newFingerprint = response.getFingerprint();
          if (newFingerprint && newFingerprint === this.fingerprint) {
            // fingerprints match: we can use the local menu.
            bloombox.logging.log(
              'Server indicates local menu is sufficient as a base.');
            if (this.baseMenuReady)
              this.baseMenuReady(this.baseMenu, this.fingerprint, true);

          } else {
            // fingerprints don't match: that's okay, we should have a catalog
            // in this response then.
            if (!response.hasCatalog()) {
              // error: no base menu provided, and the local one doesn't match.
              bloombox.logging.error(
                'Received invalid base menu response from server. ' +
                'Terminating stream.');
              this.cancel();
              return this;

            } else {
              // we have a catalog to use as the base menu.
              const newBaseMenu = response.getCatalog();
              bloombox.logging.log(
                'Received base catalog from server. Updating fingerprint...',
                {'catalog': newBaseMenu, 'fingerprint': response.getFingerprint()});

              // update base menu and fingerprint value
              this.baseMenu = newBaseMenu;
              this.fingerprint = response.getFingerprint();

              if (this.baseMenuReady)
                this.baseMenuReady(this.baseMenu, this.fingerprint, false);
            }
          }

        } else {
          // we are processing an update payload
          bloombox.logging.log(
            'Processing menu stream update...',
            {'event': response, 'fingerprint': response.getFingerprint()});

          if (response.getFingerprint() !== this.fingerprint)
            this.fingerprint = response.getFingerprint();

          if (this.observer)
            this.observer(response);
        }
      });

      this.stream.on('status', function(statusPayload) {
        const statusCode = /** @type {grpc.web.StatusCode} */ (
          statusPayload.code);
        const statusDetails = /** @type {string} */ (
          statusPayload.details);
        const statusMetadata = /** @type {(!Object<string, string>|undefined)} */ (
          statusPayload.metadata);

        bloombox.logging.log('Live menu stream updated status.',
          {'code': statusCode,
           'details': statusDetails,
           'metadata': statusMetadata});

        if (this.statusCallback)
          this.statusCallback(statusCode, statusDetails, statusMetadata);
      });

      this.stream.on('error', function(err) {
        // log it and dispatch callback if applicable
        bloombox.logging.error(
          'An error occurred while processing a live menu stream. Cancelling.',
          {'err': err});
        if (this.errCallback) this.errCallback(false, err);
        this.cancel();
      });

      this.stream.on('end', function() {
        // stream end signal
        bloombox.logging.log('Menu event stream closed.');
        if (this.endCallback) this.endCallback();
      });
      return this;
    },

    /**
     * Event subscription function, which provides callbacks to dispatch after the
     * initial menu payload is received from the server (or otherwise resolved
     * from the local cache), and after update/diff events are received from the
     * server upon that menu.
     *
     * @param {bloombox.menu.ObservableReadyCallback} callback Callable to
     *        dispatch once the base menu is ready. An indication is made here as
     *        to whether the payload was fresh or the server indicated the local
     *        payload was suitable.
     * @param {bloombox.menu.ObservableMenuReactor} observer Event observer that
     *        is dispatched each time a menu stream update event is received. When
     *        this function is dispatched, the engine has already applied the
     *        enclosed update to local menu storage.
     * @param {boolean=} oneshot If passed as `true`, don't re-set the streaming
     *        session after it expires. Optional.
     * @return {bloombox.menu.ObservableMenu} Self, for method chaining.
     * @public
     */
    onReady: function(callback, observer, oneshot) {
      this.baseMenuReady = callback;
      this.observer = observer;
      this.check(() => {
        this.process();
      }, () => {
        this.cancel();
      }, !oneshot);
      return this;
    },

    /**
     * Cancel the observable menu's event stream, ceasing updates for good. This
     * should be called before a given observable menu object is discarded, to
     * clean-up client and server-side listeners, and so on.
     *
     * @param {bloombox.menu.ObservableMenuCancelCallback=} callback Callback to
     *        dispatch once the stream has been cancelled. Dispatched after any
     *        previously-set cancel callback.
     * @returns {bloombox.menu.ObservableMenu} Self, for method chaining.
     */
    cancel : function(callback) {
      this.stream.cancel();
      if (this.cancelCallback) this.cancelCallback();
      callback();
      return this;
    }
  });
});
