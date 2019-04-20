
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
 * Bloombox Telemetry: RPC Pool
 *
 * @fileoverview Provides RPC tools for managing a pool of XHRs.
 */

/*global goog */

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');
goog.require('bloombox.logging.warn');

goog.require('bloombox.telemetry.MAX_XHRs');
goog.require('bloombox.telemetry.OperationStatus');
goog.require('bloombox.telemetry.Routine');
goog.require('bloombox.telemetry.XHR_DEBOUNCE');
goog.require('bloombox.telemetry.XHR_RETRIES');
goog.require('bloombox.telemetry.XHR_TIMEOUT');

goog.require('bloombox.telemetry.internals.EventQueue');
goog.require('bloombox.telemetry.internals.HTTP_HEADERS');

goog.require('bloombox.telemetry.internals.LocalStats');
goog.require('bloombox.telemetry.internals.QueuedEvent');
goog.require('bloombox.telemetry.internals.active');
goog.require('bloombox.telemetry.internals.enabled');

goog.require('bloombox.telemetry.internals.statistics');

goog.require('bloombox.telemetry.internals.stats.recordPing');
goog.require('bloombox.telemetry.internals.stats.recordRPCError');
goog.require('bloombox.telemetry.internals.stats.recordRPCSent');
goog.require('bloombox.telemetry.internals.stats.recordRPCSuccess');

goog.require('bloombox.util.debounced');
goog.require('bloombox.util.generateUUID');

goog.require('goog.net.XhrManager');

goog.provide('bloombox.telemetry.abort');
goog.provide('bloombox.telemetry.enqueue');

goog.provide('bloombox.telemetry.internals._sendEvent');

goog.provide('bloombox.telemetry.internals.rpcpool.MAX_XHRs');
goog.provide('bloombox.telemetry.internals.rpcpool.MIN_XHRs');
goog.provide('bloombox.telemetry.internals.rpcpool.RPC_POOL');
goog.provide('bloombox.telemetry.internals.rpcpool.WITH_CREDENTIALS');
goog.provide('bloombox.telemetry.internals.rpcpool.XHR_RETRIES');
goog.provide('bloombox.telemetry.internals.rpcpool.XHR_TIMEOUT');


// - Constants and Types - //
/**
 * Minimum number of XHRs to create.
 *
 * @const {number}
 */
bloombox.telemetry.internals.rpcpool.MIN_XHRs = 1;


/**
 * Maximum number of XHRs to create.
 *
 * @const {number}
 */
bloombox.telemetry.internals.rpcpool.MAX_XHRs = bloombox.telemetry.MAX_XHRs;


/**
 * Maximum number of retries.
 *
 * @const {number}
 */
bloombox.telemetry.internals.rpcpool.XHR_RETRIES = (
  bloombox.telemetry.XHR_RETRIES);


/**
 * XHR timeout interval.
 *
 * @const {number}
 */
bloombox.telemetry.internals.rpcpool.XHR_TIMEOUT = (
  bloombox.telemetry.XHR_TIMEOUT);


/**
 * Whether to include credentials in RPC requests.
 *
 * @const {boolean}
 */
bloombox.telemetry.internals.rpcpool.WITH_CREDENTIALS = false;


/**
 * Value for maximum priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.MAX_PRIORITY = 5;


/**
 * Value for elevated priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.ELEVATED_PRIORITY = 50;


/**
 * Value for normal priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.NORMAL_PRIORITY = 100;


/**
 * Value for minimum priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.MIN_PRIORITY = 999;


/**
 * Value for impression data priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.IMPRESSION_PRIORITY = (
  bloombox.telemetry.internals.rpcpool.MIN_PRIORITY);


/**
 * Value for view data priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.VIEW_PRIORITY = (
  bloombox.telemetry.internals.rpcpool.NORMAL_PRIORITY);


/**
 * Value for conversion data priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.CONVERSION_PRIORITY = (
  bloombox.telemetry.internals.rpcpool.ELEVATED_PRIORITY);


/**
 * Enumerates priority by RPC routine.
 *
 * @enum {number}
 */
bloombox.telemetry.internals.RoutinePriority = {
  'PING': (
    bloombox.telemetry.internals.rpcpool.MAX_PRIORITY),
  'EVENT': (
    bloombox.telemetry.internals.rpcpool.NORMAL_PRIORITY),
  'EXCEPTION': (
    bloombox.telemetry.internals.rpcpool.ELEVATED_PRIORITY),
  'SECTION_IMPRESSION': (
    bloombox.telemetry.internals.rpcpool.IMPRESSION_PRIORITY),
  'SECTION_VIEW': (
    bloombox.telemetry.internals.rpcpool.VIEW_PRIORITY),
  'SECTION_ACTION': (
    bloombox.telemetry.internals.rpcpool.CONVERSION_PRIORITY),
  'PRODUCT_IMPRESSION': (
    bloombox.telemetry.internals.rpcpool.IMPRESSION_PRIORITY),
  'PRODUCT_VIEW': (
    bloombox.telemetry.internals.rpcpool.VIEW_PRIORITY),
  'PRODUCT_ACTION': (
    bloombox.telemetry.internals.rpcpool.CONVERSION_PRIORITY),
  'ORDER_ACTION': (
    bloombox.telemetry.internals.rpcpool.CONVERSION_PRIORITY)
};


// - Internals - //
/**
 * Main RPC pool for sending telemetry RPCs.
 *
 * @type {goog.net.XhrManager}
 * @package
 */
bloombox.telemetry.internals.RPC_POOL = new goog.net.XhrManager(
  bloombox.telemetry.internals.rpcpool.XHR_RETRIES,
  bloombox.telemetry.internals.HTTP_HEADERS,
  bloombox.telemetry.internals.rpcpool.MIN_XHRs,
  bloombox.telemetry.internals.rpcpool.MAX_XHRs,
  bloombox.telemetry.internals.rpcpool.XHR_TIMEOUT,
  bloombox.telemetry.internals.rpcpool.WITH_CREDENTIALS);


bloombox.telemetry.internals.RPC_POOL
  .setTimeoutInterval(bloombox.telemetry.internals.rpcpool.XHR_TIMEOUT);


/**
 * Queue for events to be sent, eventually, via the RPC pool.
 *
 * @type {bloombox.telemetry.internals.EventQueue}
 * @package
 */
bloombox.telemetry.internals.EVENT_QUEUE = (
  new bloombox.telemetry.internals.EventQueue());


// - Flush - //
/**
 * Flush any queued events by sending them to the RPC pool. By default, this
 * will follow the configured batching rules, unless `opt_all` is passed, in
 * which case the system will try to flush all queued events at once.
 *
 * @param {boolean=} opt_all Optionally flush the entire queue.
 */
bloombox.telemetry.internals.flush = function(opt_all) {
  let stats = bloombox.telemetry.internals.statistics();
  let amountToFetch = 0;
  if (opt_all) {
    // get queue count as count to fetch
    amountToFetch = stats.queued;
  }
  let dequeued = bloombox.telemetry.internals.EVENT_QUEUE.dequeue((
    function(queuedEvent) {
      // for each event that we de-queue,
      bloombox.telemetry.internals._sendEvent(queuedEvent);
      bloombox.telemetry.internals.stats.recordRPCSent();
      if (queuedEvent.callback) queuedEvent.callback(true, null);
  }), amountToFetch || null);

  if ((stats.queued - dequeued) > 0) {
    // we have tasks remaining in the queue - perform at least one more tick
    bloombox.telemetry.internals.tick();
  }
};


/**
 * Send a single event to the RPC pool.
 *
 * @param {bloombox.telemetry.internals.QueuedEvent} queuedEvent Event to send.
 * @package
 */
bloombox.telemetry.internals._sendEvent = function(queuedEvent) {
  bloombox.logging.log(
    'Sending telemetry event.', queuedEvent.uuid, queuedEvent.rpc);
  let rpc = queuedEvent.rpc;
  let boundCallback = bloombox.telemetry.internals.rpcCallback(queuedEvent);

  let serializedPayload = (rpc.payload ? JSON.stringify(rpc.payload) :
    undefined);

  if (rpc.rpcMethod === bloombox.telemetry.Routine.PING)
    bloombox.telemetry.internals.stats.recordPing();

  bloombox.telemetry.internals.RPC_POOL.send(
    queuedEvent.uuid,
    rpc.endpoint,
    rpc.httpMethod,
    serializedPayload,
    rpc.headers,
    queuedEvent.priority,
    boundCallback,
    bloombox.telemetry.internals.rpcpool.XHR_RETRIES,
    goog.net.XhrIo.ResponseType.TEXT,
    bloombox.telemetry.internals.rpcpool.WITH_CREDENTIALS);
};


/**
 * Prepare an RPC callback function.
 *
 * @param {bloombox.telemetry.internals.QueuedEvent} queuedEvent Event being
 *        called back for.
 * @return {function(goog.events.Event)} Responder function.
 */
bloombox.telemetry.internals.rpcCallback = function(queuedEvent) {
  /**
   * Event responder.
   *
   * @param {goog.events.Event} event
   */
  function respond(event) {
    if (event.type === goog.net.EventType.COMPLETE) {
      let xhr = event.target;
      let contentType = xhr.getResponseHeader('Content-Type');
      let contentLength = xhr.getResponseHeader('Content-Length');
      let status = xhr.getStatus();

      // parse status
      if (status === 200 ||
          status === 201 ||
          status === 202 ||
          status === 204) {
        bloombox.logging.log('Finished telemetry RPC.',
          {'queuedEvent': queuedEvent, 'event': event, 'xhr': xhr});

        if (!contentLength || parseInt(contentLength, 10) === 0) {
          // no response body but still successful
          let opStatus = bloombox.telemetry.OperationStatus.OK;
          queuedEvent.rpc.successCallback(opStatus);
        } else {
          // we have a response body
          if (contentType === 'application/json' ||
              contentType.startsWith('application/json')) {
            let status = bloombox.telemetry.OperationStatus.OK;
            bloombox.telemetry.internals.stats.recordRPCSuccess();
            queuedEvent.rpc.successCallback(status);
          }
        }
      }
    } else if (event.type === goog.net.EventType.ERROR) {
      let xhr = event.target;
      let status = xhr.getStatus();

      // the runtime reports that an error occurred
      bloombox.logging.error('An error occurred while fulfilling a telemetry ' +
                             'service RPC.',
        {'queuedEvent': queuedEvent, 'event': event, 'xhr': event.target});
      let opStatus = bloombox.telemetry.OperationStatus.ERROR;
      let err = bloombox.telemetry.TelemetryError.UNKNOWN;
      bloombox.telemetry.internals.stats.recordRPCError();
      queuedEvent.rpc.failureCallback(opStatus, err, status);
    }
  }

  return respond;
};


// - Tick - //
/**
 * Internal tick dispatch function. Called when the debouncer is triggered.
 *
 * @package
 */
bloombox.telemetry.internals._doTick = function() {
  // check if we are enabled
  if (bloombox.telemetry.internals.enabled()) {
    if (bloombox.telemetry.internals.active()) {
      // we are active and enabled. gather subsystem stats.
      let stats = bloombox.telemetry.internals.statistics();
      if (stats.queued > 0) {
        // we have events to send
        if (bloombox.telemetry.internals.RPC_POOL.getOutstandingCount() >= (
            bloombox.telemetry.internals.rpcpool.MAX_XHRs)) {
          // we already have the max number of XHRs. wait until the next tick.
          bloombox.telemetry.internals.tick();
        } else {
          // we can send events - we have space
          bloombox.telemetry.internals.flush();
        }
      } else {
        bloombox.logging.log('No telemetry RPCs to send.');
      }
    } else {
      bloombox.logging.log('Tick skipped: telemetry is not active.');

      // system is enabled but not active. wait until the next tick.
      bloombox.telemetry.internals.tick();
    }
  } else {
    bloombox.logging.warn('Tick skipped: telemetry is not enabled.');
  }
};

/**
 * Advance the telemetry subsystem by one step. This involves checking if the
 * pool has any room for work, then adding a batch of events to the pool if it
 * does, or aborting if it doesn't.
 *
 * @package
 */
bloombox.telemetry.internals.tick = bloombox.util.debounced(
  bloombox.telemetry.XHR_DEBOUNCE, function() {
  // perform one tick
  bloombox.telemetry.internals._doTick();
}, true);


// - Enqueue - //
/**
 * Enqueue an event to eventually be sent.
 *
 * @param {bloombox.telemetry.rpc.TelemetryRPC} rpc Event RPC to enqueue.
 * @param {bloombox.telemetry.TelemetryOptions=} options Options specific to
 *        this event invocation and underlying RPC. Optional.
 * @return {Promise<?number>} Promise for event completion.
 * @public
 */
bloombox.telemetry.enqueue = function(rpc, options) {
  let priority = (
    bloombox.telemetry.internals.RoutinePriority[rpc.rpcMethod]);
  let uuid = bloombox.util.generateUUID();
  let ev = bloombox.telemetry.prepareQueuedEvent(rpc, priority, uuid, options);

  return new Promise((resolve, reject) => {
    // enqueue the event
    bloombox.telemetry.internals.EVENT_QUEUE
      .enqueue(priority, ev, (ok, err) => {
      // if there was an error or it could not be submitted, reject
      if (!ok || err) {
        reject(err);
      } else {
        resolve(ok);
      }
    });

    // trigger one tick
    bloombox.telemetry.internals.tick();
  });
};


// - Abort - //
/**
 * Abort an in-flight RPC by its UUID.
 *
 * @param {string} uuid UUID to abort.
 * @public
 */
bloombox.telemetry.abort = function(uuid) {
  bloombox.telemetry.internals.RPC_POOL.abort(uuid);
};
