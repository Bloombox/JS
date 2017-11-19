
/**
 * Bloombox Telemetry: Context
 *
 * @fileoverview Provides tools for detecting, specifying, and merging event
 * contexts.
 */

/*global goog */

goog.require('bloombox.VERSION');
goog.require('bloombox.config');

goog.require('bloombox.logging.log');

goog.require('bloombox.util.Exportable');
goog.require('bloombox.util.generateUUID');

goog.require('goog.labs.userAgent.device');
goog.require('goog.userAgent');
goog.require('goog.userAgent.platform');
goog.require('goog.userAgent.product');

goog.require('proto.analytics.BrowserDeviceContext');
goog.require('proto.analytics.Collection');
goog.require('proto.analytics.Context');
goog.require('proto.analytics.DeviceApplication');
goog.require('proto.analytics.DeviceLibrary');
goog.require('proto.analytics.DeviceOS');
goog.require('proto.analytics.DeviceType');
goog.require('proto.analytics.OSType');
goog.require('proto.commerce.OrderKey');
goog.require('proto.identity.UserKey');
goog.require('proto.partner.PartnerDeviceKey');
goog.require('proto.partner.PartnerKey');
goog.require('proto.partner.PartnerLocationKey');
goog.require('proto.structs.NamedVersion');
goog.require('proto.structs.VersionSpec');

goog.provide('bloombox.telemetry.Collection');
goog.provide('bloombox.telemetry.Context');
goog.provide('bloombox.telemetry.ContextException');

goog.provide('bloombox.telemetry.buildBrowserContext');
goog.provide('bloombox.telemetry.globalContext');
goog.provide('bloombox.telemetry.resolveFingerprint');
goog.provide('bloombox.telemetry.resolveSessionID');



// - Event Collections - //
/**
 * Named event collection.
 *
 * @param {string} name Name for this collection.
 * @constructor
 * @implements {bloombox.util.Exportable<proto.analytics.Collection>}
 * @public
 */
bloombox.telemetry.Collection = function Collection(name) {
  /**
   * Name for this collection.
   *
   * @type {string}
   * @export
   */
  this.name = name;
};


/**
 * Static method to construct a `Collection` with an arbitrary string name.
 *
 * @param {string} name Name for this collection.
 * @return {bloombox.telemetry.Collection} Constructed collection.
 * @export
 */
bloombox.telemetry.Collection.named = function(name) {
  return new bloombox.telemetry.Collection(name);
};


/**
 * Export this `Collection` as an `analytics.Collection` message.
 *
 * @return {proto.analytics.Collection} JS PB message.
 */
bloombox.telemetry.Collection.prototype.export = function() {
  let collection = new proto.analytics.Collection();
  collection.setName(this.name);
  return collection;
};


// - Master Context - //
/**
 * Indicates an error happened while building or merging event context.
 *
 * @param {string} message Error message for the exception.
 * @constructor
 */
bloombox.telemetry.ContextException = function ContextException(message) {
  /**
   * Exception message.
   *
   * @type {string}
   */
  this.message = message;
};


/**
 * Gathered event context.
 *
 * @param {?bloombox.telemetry.Collection} collection Collection to file this
 *        event against.
 * @param {?string} partner Partner code to apply to this context.
 * @param {?string} location Location code to apply to this context.
 * @param {string} fingerprint Unique device UUID for the active device.
 * @param {string} session Unique session UUID for the active session.
 * @param {?string=} opt_user Optional. User key to apply to this context.
 * @param {?string=} opt_device Optional. Device key to apply to this context.
 *        This is different from the device fingerprint, in that it uniquely
 *        identifies a known device, rather than being a generic opaque token
 *        that distinguishes one device context from another.
 * @param {?string=} opt_order Optional. Order key to apply to this context.
 * @param {proto.analytics.BrowserDeviceContext=} opt_browser Optional. Explicit
 *        browser device context info to override whatever globally-gathered
 *        info would normally be sent. When generating global context, this
 *        property is specified as the detected info.
 * @constructor
 * @implements {bloombox.util.Exportable}
 * @throws {bloombox.telemetry.ContextException}
 * @package
 */
bloombox.telemetry.Context = function(collection,
                                      partner,
                                      location,
                                      fingerprint,
                                      session,
                                      opt_user,
                                      opt_device,
                                      opt_order,
                                      opt_browser) {
  /**
   * Collection to apply this event to.
   *
   * @type {?proto.analytics.Collection}
   * @public
   */
  this.collection = collection.export();

  /**
   * Unique fingerprint for this device context. Always present.
   *
   * @type {string}
   */
  this.fingerprint = fingerprint;

  /**
   * Session ID for this user/browser session context.
   *
   * @type {string}
   */
  this.session = session;

  // make us a partner key
  let partnerKey;
  if (partner !== null) {
    partnerKey = new proto.partner.PartnerKey();
    partnerKey.setCode(partner);
  } else {
    partnerKey = null;
  }

  /**
   * Partner code.
   *
   * @type {?proto.partner.PartnerKey}
   * @public
   */
  this.partner = partnerKey;

  // make us a partner key
  let locationKey;
  if (partner !== null && location !== null) {
    locationKey = new proto.partner.PartnerLocationKey();
    locationKey.setCode(location);
    locationKey.setPartner(partnerKey);
  } else if (partner === null && location !== null) {
    // failure: must specify a partner to specify a location
    throw new bloombox.telemetry.ContextException(
      'Cannot provide location context without partner context.');
  } else {
    // no location-level context
    locationKey = null;
  }

  /**
   * Location code.
   *
   * @type {?proto.partner.PartnerLocationKey}
   * @public
   */
  this.location = locationKey;


  // decode the user key, if any
  let user;
  if (opt_user) {
    let userKey = new proto.identity.UserKey();
    userKey.setUid(opt_user);
    user = userKey;
  } else {
    user = null;
  }

  /**
   * User key to attribute this event to. Defaults to `null`, indicating no
   * currently-active user.
   *
   * @type {?proto.identity.UserKey}
   */
  this.user = user;

  // decode the order key, if any
  let order;
  if (opt_order) {
    let orderKey = new proto.commerce.OrderKey();
    orderKey.setId(opt_order);
    order = orderKey;
  } else {
    order = null;
  }

  /**
   * Order key to attribute this event to. Defaults to `null`, indicating no
   * currently-active order.
   *
   * @type {?proto.commerce.OrderKey}
   */
  this.order = order;

  // device the device key, if any
  let deviceKey;
  if (opt_device && typeof opt_device === 'string') {
    deviceKey = new proto.partner.PartnerDeviceKey();
    deviceKey.setUuid(/** @type {string} */ (opt_device));
    deviceKey.setLocation(locationKey);
  } else {
    deviceKey = null;
  }

  /**
   * Known device key or UUID to attribute this event to. Defaults to `null`,
   * indicating an anonymous device, like a user's browser.
   *
   * @type {?proto.partner.PartnerDeviceKey}
   */
  this.device = deviceKey;

  // attach browser context, if any
  /**
   * Browser context, if any, or `null`.
   * @type {?proto.analytics.BrowserDeviceContext}
   */
  this.browser = opt_browser || null;
};


/**
 * Export the current analytics context as a protobuf message.
 *
 * @return {proto.analytics.Context}
 */
bloombox.telemetry.Context.prototype.export = function() {
  let context = new proto.analytics.Context();

  // resolve fingerprint and session
  if (!this.fingerprint)
    throw new bloombox.telemetry.ContextException(
      'Missing device fingerprint ID.');
  if (!this.session)
    throw new bloombox.telemetry.ContextException(
      'Missing device session ID.');

  // attach required client context, and group by session
  context.setFingerprint(this.fingerprint);
  context.setGroup(this.session);

  // attach misc context
  if (this.collection !== null) context.setCollection(this.collection);
  if (this.user !== null) context.setUser(this.user);
  if (this.order !== null) context.setOrder(this.order);

  // calculate partner context
  if (this.partner !== null) {
    if (this.location !== null) {
      if (this.device !== null) {
        // full device->location->partner context
        context.setDevice(this.device);
      } else {
        // location->partner context
        context.setLocation(this.location);
      }
    } else {
      // partner-only context
      context.setPartner(this.partner);
    }
  }

  // device context

  return context;
};


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
 * The key used in local storage to locally fingerprint a web browser-based
 * device.
 *
 * @const {string}
 * @package
 */
bloombox.telemetry.DEVICE_FINGERPRINT_KEY = 'bb:v1:t.df';


/**
 * The key used in session storage to indicate the session ID.
 *
 * @const {string}
 * @package
 */
bloombox.telemetry.SESSION_ID_KEY = 'bb:v1:t.sid';


/**
 * Resolve the device fingerprint, by creating it if it does not yet exist, or
 * returning the existing one if it does.
 *
 * @return {string} Global device fingerprint.
 */
bloombox.telemetry.resolveFingerprint = function() {
  if (bloombox.telemetry.DEVICE_FINGERPRINT === null) {
    // try to fetch it from local storage
    let existingFingerprint = (
     window['localStorage'].getItem(bloombox.telemetry.DEVICE_FINGERPRINT_KEY));

    if (existingFingerprint && typeof existingFingerprint === 'string') {
      // we found it, load the existing one from local storage
      bloombox.telemetry.DEVICE_FINGERPRINT = existingFingerprint;
    } else {
      // we could not find one in local storage. generate one, persist it
      // in local storage and locally, and return.
      let newDeviceFingerprint = bloombox.util.generateUUID();
      bloombox.telemetry.DEVICE_FINGERPRINT = newDeviceFingerprint;
      window['localStorage'].setItem(
        bloombox.telemetry.DEVICE_FINGERPRINT_KEY, newDeviceFingerprint);
      bloombox.logging.log('Established device fingerprint: "' +
        newDeviceFingerprint + "'.");
    }
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
    // try to fetch it from local storage
    let existingID = (
      window['sessionStorage'].getItem(bloombox.telemetry.SESSION_ID_KEY));

    if (existingID && typeof existingID === 'string') {
      // we found it, load the existing one from local storage
      bloombox.telemetry.SESSION_ID = existingID;
    } else {
      // we could not find one in local storage. generate one, persist it
      // in local storage and locally, and return.
      let newSessionID = bloombox.util.generateUUID();
      bloombox.telemetry.SESSION_ID = newSessionID;
      window['localStorage'].setItem(
        bloombox.telemetry.SESSION_ID_KEY, newSessionID);
      bloombox.logging.log('Established user session at ID: "' +
        newSessionID + "'.");
    }
  }
  return bloombox.telemetry.SESSION_ID;
};


/**
 * Build local browser context from the available environment.
 *
 * @return {proto.analytics.BrowserDeviceContext}
 * @package
 */
bloombox.telemetry.buildBrowserContext = function() {
  let context = new proto.analytics.BrowserDeviceContext();

  // detect browser type and version
  let browserVersion = goog.userAgent.VERSION;
  let browserType = proto.analytics.BrowserDeviceContext.Type.BROWSER_UNKNOWN;
  if (goog.userAgent.CHROME)
    browserType = proto.analytics.BrowserDeviceContext.Type.CHROME;
  else if (goog.userAgent.product.SAFARI)
    browserType = proto.analytics.BrowserDeviceContext.Type.SAFARI;
  else if (goog.userAgent.FIREFOX)
    browserType = proto.analytics.BrowserDeviceContext.Type.FIREFOX;
  else if (goog.userAgent.OPERA)
    browserType = proto.analytics.BrowserDeviceContext.Type.OPERA;
  else if (goog.userAgent.EDGE_OR_IE)
    browserType = proto.analytics.BrowserDeviceContext.Type.IE_OR_EDGE;
  context.setBrowserType(browserType);

  // detect device type
  let deviceType = proto.analytics.DeviceType.UNKNOWN_DEVICE_TYPE;
  if (goog.labs.userAgent.device.isDesktop)
    deviceType = proto.analytics.DeviceType.DESKTOP;
  else if (goog.labs.userAgent.device.isTablet)
    deviceType = proto.analytics.DeviceType.TABLET;
  else if (goog.labs.userAgent.device.isMobile)
    deviceType = proto.analytics.DeviceType.PHONE;
  context.setDeviceType(deviceType);

  let browserVersionObj = new proto.structs.VersionSpec();
  let browserVersionName = new proto.structs.NamedVersion();
  browserVersionName.setName(browserVersion);
  browserVersionObj.setNamedVersion(browserVersionName);
  context.setVersion(browserVersionObj);

  // detect OS type and version
  let osType = proto.analytics.OSType.OS_UNKNOWN;
  let osVersion = goog.userAgent.platform.VERSION;

  if (goog.userAgent.IPAD ||
      goog.userAgent.IPHONE ||
      goog.userAgent.IPOD ||
      goog.userAgent.IOS)
    osType = proto.analytics.OSType.IOS;
  else if ((goog.userAgent.WINDOWS ||
            goog.userAgent.EDGE_OR_IE) &&
            goog.userAgent.MOBILE)
    osType = proto.analytics.OSType.WINDOWS_PHONE;
  else if (goog.userAgent.WINDOWS ||
           goog.userAgent.EDGE_OR_IE)
    osType = proto.analytics.OSType.WINDOWS;
  else if (goog.userAgent.product.ANDROID)
    osType = proto.analytics.OSType.ANDROID;
  else if (goog.userAgent.MAC)
    osType = proto.analytics.OSType.MACOS;
  else if (goog.userAgent.LINUX)
    osType = proto.analytics.OSType.LINUX;

  let osObj = new proto.analytics.DeviceOS();
  let osVersionObj = new proto.structs.VersionSpec();
  let osVersionName = new proto.structs.NamedVersion();
  osVersionName.setName(osVersion);
  osVersionObj.setNamedVersion(osVersionName);
  osObj.setType(osType);
  osObj.setVersion(osVersionObj);

  // detect application type and version
  let origin = window['document'].origin;
  let app = new proto.analytics.DeviceApplication();
  app.setOrigin(origin);
  context.setApp(app);

  // detect library type and version
  let libraryVersion = bloombox.VERSION;
  let libraryVariant = bloombox.VARIANT;

  let libObj = new proto.analytics.DeviceLibrary();
  let libVersionObj = new proto.structs.VersionSpec();
  let libVersionName = new proto.structs.NamedVersion();
  libVersionName.setName(libraryVersion);
  libVersionObj.setNamedVersion(libVersionName);
  libObj.setVersion(libVersionObj);
  libObj.setVariant(libraryVariant);
  context.setLibrary(libObj);

  return context;
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
    let config = bloombox.config;
    let partnerCode = config.partner || null;
    let locationCode = config.location || null;
    let deviceFingerprint = bloombox.telemetry.resolveFingerprint();
    let sessionID = bloombox.telemetry.resolveSessionID();
    let browserContext = bloombox.telemetry.buildBrowserContext();

    // calculate global context
    bloombox.telemetry.GLOBAL_CONTEXT = new bloombox.telemetry.Context(
      null,
      partnerCode,
      locationCode,
      deviceFingerprint,
      sessionID,
      null,  // @TODO: ability to use logged-in user
      null,  // @TODO: ability to use active device
      null,  // @TODO: ability to use active order
      browserContext);
  }
  return bloombox.telemetry.GLOBAL_CONTEXT;
};
