
/*
 * Copyright 2018, Bloombox, LLC. All rights reserved.
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
 * Bloombox Telemetry Context: State
 *
 * @fileoverview Mounts and manages global event context state, such as the
 * device fingerprint, session ID, order ID, user ID, and so on.
 */

/*global goog */

goog.provide('bloombox.telemetry.GlobalStateException');
goog.provide('bloombox.telemetry.globalContext');
goog.provide('bloombox.telemetry.notifyUserID');
goog.provide('bloombox.telemetry.resolveFingerprint');
goog.provide('bloombox.telemetry.resolveSessionID');

goog.require('bloombox.telemetry.Context');
goog.require('bloombox.util.generateUUID');

goog.require('proto.bloombox.schema.analytics.context.ApplicationType');
goog.require('proto.bloombox.schema.analytics.context.DeviceApplication');

goog.require('stackdriver.notifyFingerprint');


// - Global Context - //
/**
 * Globally-cached context singleton for values that are detected or loaded or
 * computed expensively by the runtime. Merged into event-level context before
 * events are sent.
 *
 * @type {?bloombox.telemetry.Context}
 * @package
 */
bloombox.telemetry.GLOBAL_CONTEXT = null;


/**
 * Globally-cached unique fingerprint for this device. Persisted in local
 * browser storage. Null means it is not yet initialized.
 *
 * @type {?string}
 * @package
 */
bloombox.telemetry.DEVICE_FINGERPRINT = null;


/**
 * Session-scoped token to indicate the border between different user sessions.
 * Leverages session storage instead of local storage. Null means it is not yet
 * initialized.
 *
 * @type {?string}
 * @package
 */
bloombox.telemetry.SESSION_ID = null;


/**
 * Globally-cached unique order ID for the next order this user submits.
 * Persisted and used until an order succeeds, at which point it is rotated,
 * to prevent duplicate orders.
 *
 * @type {?string}
 * @package
 */
bloombox.telemetry.ORDER_ID = null;


/**
 * Globally-set user ID, to send along with analytics context.
 *
 * @type {?string}
 * @package
 */
bloombox.telemetry.USER_ID = null;


/**
 * Enumerates kinds of global state the system supports.
 *
 * @enum {number}
 */
bloombox.telemetry.GlobalStateType = {
  PERSISTED: 0,
  SESSION: 1
};


/**
 * Specifies the storage type for each global state value.
 *
 * @enum {bloombox.telemetry.GlobalStateType}
 * @package
 */
bloombox.telemetry.GlobalStateTypeMap = {
  FINGERPRINT: bloombox.telemetry.GlobalStateType.PERSISTED,
  SESSION_ID: bloombox.telemetry.GlobalStateType.SESSION,
  ORDER_ID: bloombox.telemetry.GlobalStateType.PERSISTED,
  USER_ID: bloombox.telemetry.GlobalStateType.SESSION
};


/**
 * Enumerates the different global context values, and their keys within the
 * underlying persistence mechanism, which is handled by `GlobalStateTypeMap`.
 *
 * @enum {string}
 */
bloombox.telemetry.GlobalState = {
  FINGERPRINT: 'bb:v1:t.df',
  SESSION_ID: 'bb:v1:t.sid',
  ORDER_ID: 'bb:v1:t.oid',
  USER_ID: 'bb:v1:t.uid'
};


/**
 * Indicates an exception that was encountered while working with global state.
 * This could mean a state type could not be resolved, or a state key could not
 * be found, for a given state item.
 *
 * @param {string} msg Error message.
 * @constructor
 * @public
 */
bloombox.telemetry.GlobalStateException = function GlobalStateException(msg) {
  /**
   * Error message.
   *
   * @type {string}
   */
  this.message = msg;
};


/**
 * Format the exception according to its message.
 *
 * @return {string} Message value.
 */
bloombox.telemetry.GlobalStateException.prototype.toString = function() {
  return this.message;
};


/**
 * Resolve global state type for a given global state item.
 *
 * @param {bloombox.telemetry.GlobalState} item Item to retrieve state for.
 * @return {bloombox.telemetry.GlobalStateTypeMap} Type of state for the item
 *         in question. If it cannot be located, the exception class
 *         `bloombox.telemetry.GlobalStateException` is thrown.
 * @throws {bloombox.telemetry.GlobalStateException} If a given state value is
 *         requested, but its state type or key cannot be resolved.
 * @package
 */
bloombox.telemetry._resolveStateType = function(item) {
  // resolve global state type and key
  let stateType = /** @type {?bloombox.telemetry.GlobalStateTypeMap} */ (null);
  switch (item) {
    case bloombox.telemetry.GlobalState.FINGERPRINT:
      stateType = bloombox.telemetry.GlobalStateTypeMap.FINGERPRINT;
      break;
    case bloombox.telemetry.GlobalState.SESSION_ID:
      stateType = bloombox.telemetry.GlobalStateTypeMap.SESSION_ID;
      break;
    case bloombox.telemetry.GlobalState.ORDER_ID:
      stateType = bloombox.telemetry.GlobalStateTypeMap.ORDER_ID;
      break;
    case bloombox.telemetry.GlobalState.USER_ID:
      stateType = bloombox.telemetry.GlobalStateTypeMap.USER_ID;
      break;
  }
  if (stateType === null) throw new bloombox.telemetry.GlobalStateException(
    'Failed to resolve global state of type: \'' + stateType + '\'.');
  return stateType;
};


/**
 * Resolve an item stored in either persistent or session state.
 *
 * @param {bloombox.telemetry.GlobalState} item Item to retrieve state for.
 * @return {?string} State item, or `null`, if a value could not be located.
 * @throws {bloombox.telemetry.GlobalStateException} If a given state value is
 *         requested, but its state type or key cannot be resolved.
 * @package
 */
bloombox.telemetry._resolveGlobalState = function(item) {
  let stateType = bloombox.telemetry._resolveStateType(item);
  if (stateType === null) throw new bloombox.telemetry.GlobalStateException(
      'Failed to resolve global state of type: \'' + stateType + '\'.');

  // fetch according to type
  let stateValue = /** @type {?string} */ (null);
  switch (stateType) {
    case bloombox.telemetry.GlobalStateType.PERSISTED:
      stateValue = /** @type {?string} */ (window.localStorage.getItem(item));
      break;

    case bloombox.telemetry.GlobalStateType.SESSION:
      stateValue = /** @type {?string} */ (window.sessionStorage.getItem(item));
      break;
  }
  if (!stateValue || (typeof stateValue !== 'string'))
    return null;
  return stateValue;
};


/**
 * Store an item in global state. If the item is not a native string, encode it
 * using `JSON.stringify` before storing. Setting a value to `null` triggers any
 * value stored at the subject key to be cleared.
 *
 * @param {bloombox.telemetry.GlobalState} item Item to set in persistence.
 * @param {?Object|string} value Value to set for the global state item. Passing
 *        `null` clears any set value.
 * @package
 */
bloombox.telemetry._setGlobalState = function(item, value) {
  let stateType = bloombox.telemetry._resolveStateType(item);

  // resolve value to store, optionally encoding in JSON
  let toStore = /** @type {?string} */ (null);
  if (typeof value === 'string' && value) {
    toStore = value;
  } else {
    if (value === null) {
      // we're clearing stuff, do nothing
    } else {
      toStore = JSON.stringify(value);
    }
  }

  // fetch according to type
  switch (stateType) {
    case bloombox.telemetry.GlobalStateType.PERSISTED:
      if (toStore !== null) {
        window.localStorage.setItem(item, /** @type {string} */ (toStore));
      } else {
        window.localStorage.removeItem(item);
      }
      break;

    case bloombox.telemetry.GlobalStateType.SESSION:
      if (toStore !== null) {
        window.sessionStorage.setItem(item, /** @type {string} */ (toStore));
      } else {
        window.sessionStorage.removeItem(item);
      }
      break;
  }
};


/**
 * Look for a state item that should be a UUID. If it's found, return it. If it
 * cannot be found, generate a UUID, set it at that state item, and return it.
 *
 * @param {bloombox.telemetry.GlobalState} item Global state item.
 * @return {string} UUID stored for the given state item.
 * @package
 */
bloombox.telemetry._resolveGlobalStateUUID = function(item) {
  let stateValue = /** {?string} */ (
    bloombox.telemetry._resolveGlobalState(item));
  if (stateValue === null) {
    // create it
    stateValue = bloombox.util.generateUUID();
    bloombox.telemetry._setGlobalState(
      item, /** @type {string} */ (stateValue));
  }
  return stateValue;
};


/**
 * Resolve the device fingerprint, by creating it if it does not yet exist, or
 * returning the existing one if it does.
 *
 * @return {string} Global device fingerprint.
 */
bloombox.telemetry.resolveFingerprint = function() {
  if (bloombox.telemetry.DEVICE_FINGERPRINT === null) {
    // establish our spot in-memory, it's potentially in local storage
    bloombox.telemetry.DEVICE_FINGERPRINT = (
      bloombox.telemetry._resolveGlobalStateUUID(
        bloombox.telemetry.GlobalState.FINGERPRINT));
    stackdriver.notifyFingerprint(bloombox.telemetry.DEVICE_FINGERPRINT);
  }
  return bloombox.telemetry.DEVICE_FINGERPRINT;
};


/**
 * Resolve the session ID, by creating it if it does not yet exist, or returning
 * the existing one if it does.
 *
 * @return {string} Session-scoped UUID.
 * @package
 */
bloombox.telemetry.resolveSessionID = function() {
  if (bloombox.telemetry.SESSION_ID === null) {
    // establish session value, check session storage first
    bloombox.telemetry.SESSION_ID = (
      bloombox.telemetry._resolveGlobalStateUUID(
        bloombox.telemetry.GlobalState.SESSION_ID));
  }
  return bloombox.telemetry.SESSION_ID;
};


/**
 * Resolve the order ID, by creating it if it does not yet exist, or returning
 * the existing one if it does.
 *
 * @return {string} Order-scoped UUID.
 * @package
 */
bloombox.telemetry.resolveOrderID = function() {
  if (bloombox.telemetry.ORDER_ID === null) {
    // establish session value, check session storage first
    bloombox.telemetry.ORDER_ID = (
      bloombox.telemetry._resolveGlobalStateUUID(
        bloombox.telemetry.GlobalState.ORDER_ID));
  }
  return bloombox.telemetry.ORDER_ID;
};


/**
 * Resolve the user ID, if any is currently set.
 *
 * @return {?string} User ID, or `null` if currently unset.
 * @package
 */
bloombox.telemetry.resolveUserID = function() {
  return bloombox.telemetry.USER_ID;
};


/**
 * Notify the telemetry layer of a ready-to-use user ID.
 *
 * @param {string} userId User ID value to set.
 * @public
 */
bloombox.telemetry.notifyUserID = function(userId) {
  bloombox.telemetry.USER_ID = userId;
};


/**
 * Retrieve globally gathered/specified context. Caching is applied to reduce
 * overhead. To force a re-gather of expensively calculated information, pass
 * `opt_force_fresh` as truthy.
 *
 * @param {boolean=} opt_force_fresh Force a fresh load of global context.
 * @return {bloombox.telemetry.Context} Global context.
 * @public
 */
bloombox.telemetry.globalContext = function(opt_force_fresh) {
  let forceFresh = opt_force_fresh || false;
  if (bloombox.telemetry.GLOBAL_CONTEXT === null || forceFresh) {
    // grab global config
    let config = bloombox.config.active();
    let partnerCode = config.partner || null;
    let locationCode = config.location || null;
    let deviceFingerprint = bloombox.telemetry.resolveFingerprint();
    let sessionID = bloombox.telemetry.resolveSessionID();
    let orderID = bloombox.telemetry.resolveOrderID();
    let nativeContext = bloombox.telemetry.buildNativeContext();
    let browserContext = bloombox.telemetry.buildBrowserContext();

    // build app context
    let webContext = bloombox.telemetry.buildWebappContext();
    let appContext = (
      new proto.bloombox.schema.analytics.context.DeviceApplication());
    appContext.setWeb(webContext);

    if (bloombox.INTERNAL) {
      // it's a bloombox app
      appContext.setType((
        proto.bloombox.schema.analytics.context.ApplicationType.INTERNAL));
    } else {
      // it's a partner-side app
      appContext.setType((
        proto.bloombox.schema.analytics.context.ApplicationType.PARTNER));
    }

    let deviceId = /** @type {?string} */ (
      window['__BLOOMBOX_DEVICE__'] || null);

    // calculate global context
    bloombox.telemetry.GLOBAL_CONTEXT = new bloombox.telemetry.Context(
      null,
      partnerCode,
      locationCode,
      deviceFingerprint,
      sessionID,
      bloombox.telemetry.resolveUserID(),
      deviceId,
      null,  // section key is set by callers
      null,  // item key is set by callers
      orderID,
      appContext,
      browserContext,
      nativeContext);
  }
  return bloombox.telemetry.GLOBAL_CONTEXT;
};
