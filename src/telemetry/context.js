
/*
 * Copyright 2017, Bloombox, LLC. All rights reserved.
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
 * Bloombox Telemetry: Context
 *
 * @fileoverview Provides tools for detecting, specifying, and merging event
 * contexts.
 */

/*global goog */

goog.require('bloombox.VERSION');
goog.require('bloombox.config.active');

goog.require('bloombox.logging.log');

goog.require('bloombox.menu.Section');

goog.require('bloombox.util.Exportable');
goog.require('bloombox.util.Serializable');
goog.require('bloombox.util.b64');
goog.require('bloombox.util.generateUUID');

goog.require('goog.labs.userAgent.device');
goog.require('goog.userAgent');
goog.require('goog.userAgent.platform');
goog.require('goog.userAgent.product');

goog.require('proto.analytics.Context');
goog.require('proto.analytics.Scope');
goog.require('proto.analytics.context.APIClient');
goog.require('proto.analytics.context.BrowserDeviceContext');
goog.require('proto.analytics.context.Collection');
goog.require('proto.analytics.context.DeviceApplication');
goog.require('proto.analytics.context.DeviceLibrary');
goog.require('proto.analytics.context.DeviceOS');
goog.require('proto.analytics.context.DeviceRole');
goog.require('proto.analytics.context.DeviceScreen');
goog.require('proto.analytics.context.NativeDeviceContext');
goog.require('proto.analytics.context.OSType');
goog.require('proto.analytics.context.PixelSize');
goog.require('proto.analytics.context.ScreenOrientation');
goog.require('proto.commerce.OrderKey');
goog.require('proto.device.DeviceType');
goog.require('proto.identity.UserKey');
goog.require('proto.partner.PartnerDeviceKey');
goog.require('proto.partner.PartnerKey');
goog.require('proto.partner.PartnerLocationKey');
goog.require('proto.structs.VersionSpec');

goog.provide('bloombox.telemetry.Collection');
goog.provide('bloombox.telemetry.Context');
goog.provide('bloombox.telemetry.ContextException');

goog.provide('bloombox.telemetry.buildBrowserContext');
goog.provide('bloombox.telemetry.buildNativeContext');
goog.provide('bloombox.telemetry.globalContext');
goog.provide('bloombox.telemetry.resolveFingerprint');
goog.provide('bloombox.telemetry.resolveSessionID');


// - Event Collections - //
/**
 * Named event collection.
 *
 * @param {string} name Name for this collection.
 * @param {boolean=} opt_skipb64encode Whether to skip base64 encoding. Pass as
 *        truthy when the collection name is already base64 encoded.
 * @constructor
 * @implements {bloombox.util.Exportable<proto.analytics.context.Collection>}
 * @implements {bloombox.util.Serializable}
 * @public
 */
bloombox.telemetry.Collection = function Collection(name, opt_skipb64encode) {
  /**
   * Name for this collection.
   *
   * @type {string}
   * @export
   */
  this.name = opt_skipb64encode ? name : bloombox.util.b64.encode(name);
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
 * @return {proto.analytics.context.Collection} JS PB message.
 */
bloombox.telemetry.Collection.prototype.export = function() {
  let collection = new proto.analytics.context.Collection();
  collection.setName(this.name);
  return collection;
};


/**
 * Render this collection object into a JSON-serializable structure suitable for
 * use over-the-wire.
 *
 * @return {Object}
 * @public
 */
bloombox.telemetry.Collection.prototype.serialize = function() {
  return {
    'name': this.name
  };
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
 * @param {?bloombox.telemetry.Collection=} opt_collection Collection to file
 *        this event against.
 * @param {?string=} opt_partner Partner code to apply to this context.
 * @param {?string=} opt_location Location code to apply to this context.
 * @param {?string=} opt_fingerprint Unique device UUID for the active device.
 * @param {?string=} opt_session Unique session UUID for the active session.
 * @param {?string=} opt_user Optional. User key to apply to this context.
 * @param {?string=} opt_device Optional. Device key to apply to this context.
 *        This is different from the device fingerprint, in that it uniquely
 *        identifies a known device, rather than being a generic opaque token
 *        that distinguishes one device context from another.
 * @param {?bloombox.menu.Section=} opt_section Menu section to specify for the
 *        hit. Generates a section-scoped commercial event under the hood.
 *        Optional.
 * @param {?bloombox.product.Key=} opt_item Item key to specify for the hit.
 *        Generates an item-scoped commercial event under the hood. Optional.
 * @param {?string=} opt_order Optional. Order key to apply to this context.
 * @param {proto.analytics.context.BrowserDeviceContext=} opt_browser Optional.
 *        Explicit browser device context info to override whatever
 *        globally-gathered info would normally be sent. When generating global
 *        context, this property is specified as the detected info.
 * @param {proto.analytics.context.NativeDeviceContext=} opt_native Optional.
 *        Explicit native device context, such as information about the
 *        underlying hardware or display. When generating global context, this
 *        property is specified as the detected info.
 * @constructor
 * @implements {bloombox.util.Exportable<proto.analytics.Context>}
 * @implements {bloombox.util.Serializable}
 * @throws {bloombox.telemetry.ContextException}
 * @public
 */
bloombox.telemetry.Context = function(opt_collection,
                                      opt_partner,
                                      opt_location,
                                      opt_fingerprint,
                                      opt_session,
                                      opt_user,
                                      opt_device,
                                      opt_section,
                                      opt_item,
                                      opt_order,
                                      opt_browser,
                                      opt_native) {
  /**
   * Collection to apply this event to.
   *
   * @type {?bloombox.telemetry.Collection}
   * @public
   */
  this.collection = opt_collection || null;

  /**
   * Unique fingerprint for this device context. Always present.
   *
   * @type {?string}
   * @public
   */
  this.fingerprint = opt_fingerprint || null;

  /**
   * Session ID for this user/browser session context.
   *
   * @type {?string}
   * @public
   */
  this.session = opt_session || null;

  // make us a partner key
  let partnerKey;
  if (opt_partner) {
    partnerKey = new proto.partner.PartnerKey();
    partnerKey.setCode(opt_partner);
  } else {
    partnerKey = null;
  }

  // make us a partner key
  let locationKey;
  if (opt_partner && opt_location) {
    locationKey = new proto.partner.PartnerLocationKey();
    locationKey.setCode(opt_location);
    locationKey.setPartner(partnerKey);
  } else if (opt_partner && opt_location) {
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
   * @public
   */
  this.device = deviceKey;

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
   * @public
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
   * Menu section to attach to this call, for a section-scoped commercial event.
   * Must be specified for an `item` to be attached.
   *
   * @type {?proto.products.menu.section.Section}
   */
  this.section = opt_section || null;

  /**
   * Item key to attach to this call, for an item-scoped commercial event.
   * Requires that a section be specified.
   *
   * @type {?proto.base.ProductKey}
   */
  this.item = opt_item ? opt_item.export() : null;

  /**
   * Order key to attribute this event to. Defaults to `null`, indicating no
   * currently-active order.
   *
   * @type {?proto.commerce.OrderKey}
   */
  this.order = order;

  // attach browser context, if any
  /**
   * Browser context, if any, or `null`.
   * @type {?proto.analytics.context.BrowserDeviceContext}
   * @public
   */
  this.browser = opt_browser || null;

  // attach native context, if any
  /**
   * Native context, if any, or `null`.
   * @type {?proto.analytics.context.NativeDeviceContext}
   * @public
   */
  this.native = opt_native || null;
};


/**
 * Serialize the protobuf form of a version specification.
 *
 * @param {proto.structs.VersionSpec} protob Version spec.
 * @return {Object} Serialized version spec.
 */
bloombox.telemetry.Context.resolveVersion = function(protob) {
  if (protob && protob.getName())
    return {
      'name': protob.getName()
    };
  return {};
};


/**
 * Serialize the protobuf form of native device context, into an object usable
 * over-the-wire.
 *
 * @param {proto.analytics.context.NativeDeviceContext} protob Native context.
 * @return {Object} Serialized native context.
 */
bloombox.telemetry.Context.serializeNativeContext = function(protob) {
  return {
    'type': protob.getType(),
    'role': protob.getRole(),
    'os': {
      'type': protob.getOs().getType(),
      'version': (
        bloombox.telemetry.Context.resolveVersion(protob.getOs().getVersion()))
    },
    'screen': {
      'screen': {
        'width': protob.getScreen().getScreen().getWidth(),
        'height': protob.getScreen().getScreen().getHeight()
      },
      'viewport': {
        'width': protob.getScreen().getViewport().getWidth(),
        'height': protob.getScreen().getViewport().getHeight()
      },
      'density': protob.getScreen().getDensity(),
      'orientation': protob.getScreen().getOrientation()
    }
  };
};


/**
 * Serialize the protobuf form of local browser context, into an object usable
 * over-the-wire.
 *
 * @param {proto.analytics.context.BrowserDeviceContext} protob Browser context.
 * @return {Object} Serialized browser context.
 */
bloombox.telemetry.Context.serializeBrowserContext = function(protob) {
  return {
    'browserType': protob.getBrowserType(),
    'version': bloombox.telemetry.Context.resolveVersion(protob.getVersion()),
    'language': protob.getLanguage(),
    'userAgent': protob.getUserAgent(),
    'touchpoints': protob.getTouchpoints(),
    'hardwareConcurrency': protob.getHardwareConcurrency(),
    'colorDepth': protob.getColorDepth()
  };
};


/**
 * Render a protobuf message representing this context, into a native JavaScript
 * object that is suitable for transmission over-the-wire.
 *
 * @param {proto.analytics.Context} context Context proto to render.
 * @return {Object} Serialized version of the proto object.
 * @public
 */
bloombox.telemetry.Context.serializeProto = function(context) {
  let baseContext = {};

  // string data
  if (context.getCollection() && context.getCollection().getName())
    baseContext['collection'] = {'name': context.getCollection().getName()};
  if (context.getFingerprint())
    baseContext['fingerprint'] = context.getFingerprint();
  if (context.getGroup())
    baseContext['group'] = context.getGroup();

  // key contexts
  if (context.getUserKey() && context.getUserKey().getUid())
    baseContext['user_key'] = {'uid': context.getUserKey().getUid()};

  // handle partner/commercial scope
  if (context.getScope()) {
    let scopeObj = {};
    if (context.getScope().getPartner()) {
      scopeObj['partner'] = context.getScope().getPartner();
    }

    if (context.getScope().getCommercial()) {
      scopeObj['commercial'] = context.getScope().getCommercial();
    }
    if (context.getScope().getOrder()) {
      scopeObj['order'] = context.getScope().getOrder();
    }
    baseContext['scope'] = scopeObj;
  }

  // app context
  if (context.getApp().getType()) {
    baseContext['app'] = {
      'type': context.getApp().getType(),
      'origin': context.getApp().getOrigin()
    };
  }

  // library context
  if (context.getLibrary().getVariant()) {
    baseContext['library'] = {
      'variant': context.getLibrary().getVariant(),
      'version': (
        bloombox.telemetry.Context.resolveVersion(
          context.getLibrary().getVersion()))
    };
  }

  // browser context
  if (context.hasBrowser()) {
    // it has browser context -> serialize it
    baseContext['browser'] = (
      bloombox.telemetry.Context.serializeBrowserContext(
        context.getBrowser()));
  }

  // native context
  if (context.hasNative()) {
    // it has native context -> serialize it
    baseContext['native'] = (
      bloombox.telemetry.Context.serializeNativeContext(
        context.getNative()));
  }
  return baseContext;
};


/**
 * Render this context object into a JSON-serializable structure suitable for
 * use over-the-wire.
 *
 * @return {Object}
 * @public
 */
bloombox.telemetry.Context.prototype.serialize = function() {
  let baseContext = {};

  // add collection, if present
  if (this.collection)
    baseContext['collection'] = this.collection.serialize();

  // add fingerprint, if present
  if (this.fingerprint)
    baseContext['fingerprint'] = this.fingerprint;

  // add session key, if present
  if (this.session)
    baseContext['group'] = this.session;

  // add user key, if present
  if (this.user)
    baseContext['userKey'] = {
      'uid': this.user.getUid()
    };

  // consider partner context, etc
  let partnerScope = /** @type {?string} */ (null);

  if (this.location) {
    if (this.device) {
      partnerScope = [
        this.location.getPartner().getCode(),
        this.location.getCode(),
        this.device.getUuid()].join('/');
    } else {
      partnerScope = [
        this.location.getPartner().getCode(),
        this.device.getUuid()].join('/');
    }
  } else {
    if (this.partner) {
      partnerScope = this.location.getPartner().getCode();
    }
  }
  if (partnerScope)
    baseContext['scope'] = {
      'partner': partnerScope
    };

  // consider commercial context
  // @TODO: section and product key for commercial scope
  if (this.order) {
    if (!baseContext['scope']) {
      baseContext['scope'] = {
        'order': this.order.getId()
      };
    }
  }

  // consider browser context
  if (this.browser)
    baseContext['browser'] = (
      bloombox.telemetry.Context.serializeBrowserContext(this.browser));
  if (this.native)
    baseContext['native'] = (
      bloombox.telemetry.Context.serializeNativeContext(this.native));
  return baseContext;
};


/**
 * Export the current analytics context as a protobuf message.
 *
 * @return {proto.analytics.Context}
 * @public
 */
bloombox.telemetry.Context.prototype.export = function() {
  let context = new proto.analytics.Context();

  // attach required client context, and group by session
  if (this.fingerprint) context.setFingerprint(this.fingerprint);
  if (this.session) context.setGroup(this.session);

  // attach misc context
  if (this.collection) context.setCollection(this.collection.export());
  if (this.user) context.setUserKey(this.user);

  let scope = new proto.analytics.Scope();

  // calculate partner context
  if (this.location) {
    if (this.device) {
      // full device->location->partner context
      scope.setPartner(
        'partner/' + this.location.getPartner().getCode() +
        'location/' + this.location.getCode() +
        'device/' + this.device.getUuid());
    } else {
      // partner -> location context
      scope.setPartner(
        'partner/' + this.location.getPartner().getCode() +
        'location/' + this.location.getCode());
    }
  }

  // detect application type and version
  let origin = window.document['origin'];
  let app = new proto.analytics.context.DeviceApplication();
  app.setOrigin(origin);
  context.setApp(app);

// detect library type and version
  let libraryVersion = bloombox.VERSION;
  let libraryVariant = bloombox.VARIANT;

  let libObj = new proto.analytics.context.DeviceLibrary();
  let libVersionObj = new proto.structs.VersionSpec();
  libVersionObj.setName(libraryVersion);
  libObj.setVersion(libVersionObj);
  libObj.setVariant(libraryVariant);
  libObj.setClient(proto.analytics.context.APIClient.JAVA_SCRIPT);
  context.setLibrary(libObj);

  // device context
  if (this.browser) context.setBrowser(this.browser);
  if (this.native) context.setNative(this.native);
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
     window.localStorage.getItem(bloombox.telemetry.DEVICE_FINGERPRINT_KEY));

    if (existingFingerprint && typeof existingFingerprint === 'string') {
      // we found it, load the existing one from local storage
      bloombox.telemetry.DEVICE_FINGERPRINT = existingFingerprint;
    } else {
      // we could not find one in local storage. generate one, persist it
      // in local storage and locally, and return.
      let newDeviceFingerprint = bloombox.util.generateUUID();
      bloombox.telemetry.DEVICE_FINGERPRINT = newDeviceFingerprint;
      window.localStorage.setItem(
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
      window.sessionStorage.getItem(bloombox.telemetry.SESSION_ID_KEY));

    if (existingID && typeof existingID === 'string') {
      // we found it, load the existing one from local storage
      bloombox.telemetry.SESSION_ID = existingID;
    } else {
      // we could not find one in local storage. generate one, persist it
      // in local storage and locally, and return.
      let newSessionID = bloombox.util.generateUUID();
      bloombox.telemetry.SESSION_ID = newSessionID;
      window.sessionStorage.setItem(
        bloombox.telemetry.SESSION_ID_KEY, newSessionID);
      bloombox.logging.log('Established user session at ID: "' +
        newSessionID + "'.");
    }
  }
  return bloombox.telemetry.SESSION_ID;
};


/**
 * Build native device context from the available environment.
 *
 * @return {proto.analytics.context.NativeDeviceContext}
 * @package
 */
bloombox.telemetry.buildNativeContext = function() {
  let native = new proto.analytics.context.NativeDeviceContext();

  // detect device type
  let deviceType = proto.device.DeviceType.UNKNOWN_DEVICE_TYPE;
  if (goog.labs.userAgent.device.isDesktop)
    deviceType = proto.device.DeviceType.DESKTOP;
  else if (goog.labs.userAgent.device.isTablet)
    deviceType = proto.device.DeviceType.TABLET;
  else if (goog.labs.userAgent.device.isMobile)
    deviceType = proto.device.DeviceType.PHONE;
  native.setType(deviceType);
  native.setRole(proto.analytics.context.DeviceRole.CLIENT);

  // touchpoints, concurrency and color depth
  if (window.screen) {
    // build screen information
    let viewportHeight = window.screen.availHeight;
    let viewportWidth = window.screen.availWidth;
    let screenHeight = window.screen.height;
    let screenWidth = window.screen.width;
    let pixelDensity = window.devicePixelRatio;

      let pixelSizeViewport = new proto.analytics.context.PixelSize();
    pixelSizeViewport.setHeight(viewportHeight);
    pixelSizeViewport.setWidth(viewportWidth);

    let pixelSizeScreen = new proto.analytics.context.PixelSize();
    pixelSizeScreen.setHeight(screenHeight);
    pixelSizeScreen.setWidth(screenWidth);

    let deviceScreen = new proto.analytics.context.DeviceScreen();
    deviceScreen.setViewport(pixelSizeViewport);
    deviceScreen.setScreen(pixelSizeScreen);
    deviceScreen.setDensity(pixelDensity);
    deviceScreen.setOrientation((window.innerHeight > window.innerWidth) ?
      proto.analytics.context.ScreenOrientation.LANDSCAPE :
      proto.analytics.context.ScreenOrientation.PORTRAIT);
    native.setScreen(deviceScreen);
  }

  // detect OS type and version
  let osType = proto.analytics.context.OSType.OS_UNKNOWN;
  let osVersion = goog.userAgent.platform.VERSION;

  if (goog.userAgent.IPAD ||
    goog.userAgent.IPHONE ||
    goog.userAgent.IPOD ||
    goog.userAgent.IOS)
    osType = proto.analytics.context.OSType.IOS;
  else if ((goog.userAgent.WINDOWS ||
      goog.userAgent.EDGE_OR_IE) &&
    goog.userAgent.MOBILE)
    osType = proto.analytics.context.OSType.WINDOWS_PHONE;
  else if (goog.userAgent.WINDOWS ||
    goog.userAgent.EDGE_OR_IE)
    osType = proto.analytics.context.OSType.WINDOWS;
  else if (goog.userAgent.product.ANDROID)
    osType = proto.analytics.context.OSType.ANDROID;
  else if (goog.userAgent.MAC)
    osType = proto.analytics.context.OSType.MACOS;
  else if (goog.userAgent.LINUX)
    osType = proto.analytics.context.OSType.LINUX;

  let osObj = new proto.analytics.context.DeviceOS();
  let osVersionObj = new proto.structs.VersionSpec();
  osVersionObj.setName(osVersion);
  osObj.setType(osType);
  osObj.setVersion(osVersionObj);
  native.setOs(osObj);
  return native;
};


/**
 * Build local browser context from the available environment.
 *
 * @return {proto.analytics.context.BrowserDeviceContext}
 * @package
 */
bloombox.telemetry.buildBrowserContext = function() {
  let context = new proto.analytics.context.BrowserDeviceContext();
  let language = navigator.language;
  let ua = navigator.userAgent;
  context.setLanguage(language);
  context.setUserAgent(ua);

  if (typeof navigator.maxTouchPoints === 'number')
    context.setTouchpoints(navigator.maxTouchPoints);
  if (typeof navigator.hardwareConcurrency === 'number')
    context.setHardwareConcurrency(navigator.hardwareConcurrency);
  if (window.screen && typeof window.screen.colorDepth === 'number')
    // set color depth
    context.setColorDepth(window.screen.colorDepth);

  // detect browser type and version
  let browserVersion = goog.userAgent.VERSION;
  let browserType = (
    proto.analytics.context.BrowserType.BROWSER_UNKNOWN);
  if (goog.userAgent.product.CHROME)
    browserType = (
      proto.analytics.context.BrowserType.CHROME);
  else if (goog.userAgent.product.SAFARI)
    browserType = (
      proto.analytics.context.BrowserType.SAFARI);
  else if (goog.userAgent.product.FIREFOX)
    browserType = (
      proto.analytics.context.BrowserType.FIREFOX);
  else if (goog.userAgent.product.OPERA)
    browserType = (
      proto.analytics.context.BrowserType.OPERA);
  else if (goog.userAgent.EDGE_OR_IE)
    browserType = (
      proto.analytics.context.BrowserType.IE_OR_EDGE);
  context.setBrowserType(browserType);

  // browser version mount
  let browserVersionObj = new proto.structs.VersionSpec();
  browserVersionObj.setName(browserVersion);
  context.setVersion(browserVersionObj);
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
    let config = bloombox.config.active();
    let partnerCode = config.partner || null;
    let locationCode = config.location || null;
    let deviceFingerprint = bloombox.telemetry.resolveFingerprint();
    let sessionID = bloombox.telemetry.resolveSessionID();
    let nativeContext = bloombox.telemetry.buildNativeContext();
    let browserContext = bloombox.telemetry.buildBrowserContext();

    // calculate global context
    bloombox.telemetry.GLOBAL_CONTEXT = new bloombox.telemetry.Context(
      null,
      partnerCode,
      locationCode,
      deviceFingerprint,
      sessionID,
      null,  // @TODO: ability to use logged-in user
      null,  // @TODO: do we need a device here?
      null,  // section key is set by callers
      null,  // item key is set by callers
      null,  // @TODO: ability to use active order
      browserContext,
      nativeContext);
  }
  return bloombox.telemetry.GLOBAL_CONTEXT;
};
