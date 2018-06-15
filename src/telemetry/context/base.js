
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
 * Bloombox Telemetry: Context
 *
 * @fileoverview Provides tools for detecting, specifying, and merging event
 * contexts.
 */

/*global goog */

goog.require('bloombox.INTERNAL');
goog.require('bloombox.VERSION');
goog.require('bloombox.config.active');

goog.require('bloombox.logging.log');

goog.require('bloombox.menu.Section');

goog.require('bloombox.telemetry.Collection');
goog.require('bloombox.telemetry.buildBrowserContext');
goog.require('bloombox.telemetry.buildNativeContext');
goog.require('bloombox.telemetry.buildWebappContext');

goog.require('bloombox.util.Exportable');
goog.require('bloombox.util.Serializable');

goog.require('proto.bloombox.schema.analytics.Context');
goog.require('proto.bloombox.schema.analytics.Scope');
goog.require('proto.bloombox.schema.analytics.context.APIClient');
goog.require('proto.bloombox.schema.analytics.context.BrowserDeviceContext');
goog.require('proto.bloombox.schema.analytics.context.DeviceApplication');
goog.require('proto.bloombox.schema.analytics.context.DeviceLibrary');
goog.require('proto.bloombox.schema.analytics.context.NativeDeviceContext');

goog.require('proto.bloombox.schema.identity.UserKey');
goog.require('proto.bloombox.schema.partner.LocationKey');
goog.require('proto.bloombox.schema.partner.PartnerDeviceKey');
goog.require('proto.bloombox.schema.partner.PartnerKey');
goog.require('proto.opencannabis.commerce.OrderKey');
goog.require('proto.opencannabis.structs.VersionSpec');

goog.provide('bloombox.telemetry.Context');
goog.provide('bloombox.telemetry.ContextException');


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
 * @param {?proto.bloombox.schema.analytics.context.DeviceApplication=} opt_app
 *        Application context, generated or provided by the partner.
 * @param {proto.bloombox.schema.analytics.context.BrowserDeviceContext=} opt_browser
 *        Optional. Explicit browser device context info to override
 *        whatever globally-gathered info would normally be sent. When
 *        generating global context, this property is specified as the detected
 *        info.
 * @param {proto.bloombox.schema.analytics.context.NativeDeviceContext=} opt_native
 *        Optional. Explicit native device context, such as information about
 *        the underlying hardware or display. When generating global context,
 *        this property is specified as the detected info.
 * @constructor
 * @implements {bloombox.util.Exportable<proto.bloombox.schema.analytics.Context>}
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
                                      opt_app,
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
   * Web application context.
   *
   * @type {?proto.bloombox.schema.analytics.context.DeviceApplication}
   */
  this.app = opt_app || null;

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
    partnerKey = new proto.bloombox.schema.partner.PartnerKey();
    partnerKey.setCode(opt_partner);
  } else {
    partnerKey = null;
  }

  // make us a partner key
  let locationKey;
  if (opt_partner && opt_location) {
    locationKey = new proto.bloombox.schema.partner.LocationKey();
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
   * @type {?proto.bloombox.schema.partner.LocationKey}
   * @public
   */
  this.location = locationKey;

  // device the device key, if any
  let deviceKey;
  if (opt_device && typeof opt_device === 'string') {
    deviceKey = new proto.bloombox.schema.partner.PartnerDeviceKey();
    deviceKey.setUuid(/** @type {string} */ (opt_device));
    deviceKey.setLocation(locationKey);
  } else {
    deviceKey = null;
  }

  /**
   * Known device key or UUID to attribute this event to. Defaults to `null`,
   * indicating an anonymous device, like a user's browser.
   *
   * @type {?proto.bloombox.schema.partner.PartnerDeviceKey}
   * @public
   */
  this.device = deviceKey;

  // decode the user key, if any
  let user;
  if (opt_user) {
    let userKey = new proto.bloombox.schema.identity.UserKey();
    userKey.setUid(opt_user);
    user = userKey;
  } else {
    user = null;
  }

  /**
   * User key to attribute this event to. Defaults to `null`, indicating no
   * currently-active user.
   *
   * @type {?proto.bloombox.schema.identity.UserKey}
   * @public
   */
  this.user = user;

  // decode the order key, if any
  let order;
  if (opt_order) {
    let orderKey = new proto.opencannabis.commerce.OrderKey();
    orderKey.setId(opt_order);
    order = orderKey;
  } else {
    order = null;
  }

  /**
   * Menu section to attach to this call, for a section-scoped commercial event.
   * Must be specified for an `item` to be attached.
   *
   * @type {?proto.opencannabis.products.menu.section.Section}
   */
  this.section = opt_section || null;

  /**
   * Item key to attach to this call, for an item-scoped commercial event.
   * Requires that a section be specified.
   *
   * @type {?proto.opencannabis.base.ProductKey}
   */
  this.item = opt_item ? opt_item.export() : null;

  /**
   * Order key to attribute this event to. Defaults to `null`, indicating no
   * currently-active order.
   *
   * @type {?proto.opencannabis.commerce.OrderKey}
   */
  this.order = order;

  // attach browser context, if any
  /**
   * Browser context, if any, or `null`.
   * @type {?proto.bloombox.schema.analytics.context.BrowserDeviceContext}
   * @public
   */
  this.browser = opt_browser || null;

  // attach native context, if any
  /**
   * Native context, if any, or `null`.
   * @type {?proto.bloombox.schema.analytics.context.NativeDeviceContext}
   * @public
   */
  this.native = opt_native || null;
};


/**
 * Serialize the protobuf form of a version specification.
 *
 * @param {proto.opencannabis.structs.VersionSpec} protob Version spec.
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
 * @param {proto.bloombox.schema.analytics.context.NativeDeviceContext} protob
 *        Native context.
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
 * @param {proto.bloombox.schema.analytics.context.BrowserDeviceContext} protob
 *        Browser context.
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
 * @param {proto.bloombox.schema.analytics.Context} context Context proto to
 *        render.
 * @return {Object} Serialized version of the proto object.
 * @public
 */
bloombox.telemetry.Context.serializeProto = function(context) {
  let baseContext = {};
  if (context.getCollection() && context.getCollection().getName())
    baseContext['collection'] = {'name': context.getCollection().getName()};
  if (context.getFingerprint())
    baseContext['fingerprint'] = context.getFingerprint();
  if (context.getGroup())
    baseContext['group'] = context.getGroup();

  // key contexts
  if (context.getUserKey() && context.getUserKey().getUid())
    baseContext['userKey'] = {'uid': context.getUserKey().getUid()};

  // handle partner/commercial scope
  if (context.hasScope()) {
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
  if (context.hasApp()) {
    baseContext['app'] = {
      'type': context.getApp().getType()
    };

    if (context.getApp().hasWeb()) {
      let webContext = {
        'origin': context.getApp().getWeb().getOrigin()
      };
      if (context.getApp().getWeb().getLocation())
        webContext['location'] = context.getApp().getWeb().getLocation();
      if (context.getApp().getWeb().getAnchor())
        webContext['anchor'] = context.getApp().getWeb().getAnchor();
      if (context.getApp().getWeb().getTitle())
        webContext['title'] = context.getApp().getWeb().getTitle();
      if (context.getApp().getWeb().getReferrer())
        webContext['referrer'] = context.getApp().getWeb().getReferrer();
      if (context.getApp().getWeb().getProtocol())
        webContext['protocol'] = context.getApp().getWeb().getProtocol();
      baseContext['app']['web'] = webContext;
    }
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
  if (this.order) {
    if (!baseContext['scope']) {
      baseContext['scope'] = {
        'order': this.order.getId()
      };
    }
  }

  if (this.section !== null) {
    if (!baseContext['scope'])
      baseContext['scope'] = {};
    let commercialScope = (
      'section/' + this.section.toString());
    if (this.item !== null) {
      // full section + item scope
      commercialScope += '/item/' + this.item.getId();
    }
    baseContext['scope']['commercial'] = commercialScope;
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
 * @return {proto.bloombox.schema.analytics.Context}
 * @public
 */
bloombox.telemetry.Context.prototype.export = function() {
  let context = new proto.bloombox.schema.analytics.Context();

  // attach required client context, and group by session
  if (this.fingerprint) context.setFingerprint(this.fingerprint);
  if (this.session) context.setGroup(this.session);

  // attach misc context
  if (this.collection) context.setCollection(this.collection.export());
  if (this.user) context.setUserKey(this.user);

  let scope = new proto.bloombox.schema.analytics.Scope();

  // calculate partner context
  if (this.location) {
    let basePartnerScope = (
      'partner/' + this.location.getPartner().getCode() + '/' +
      'location/' + this.location.getCode());
    if (this.device) {
      // full device->location->partner context
      scope.setPartner(basePartnerScope + '/' +
        'device/' + this.device.getUuid());
    } else {
      // partner -> location context
      scope.setPartner(basePartnerScope);
    }
    context.setScope(scope);
  }

  // detect application type and version
  if (this.app) {
    context.setApp(this.app);
  } else {
    let appContext = (
      new proto.bloombox.schema.analytics.context.DeviceApplication());
    let webContext = bloombox.telemetry.buildWebappContext();
    appContext.setWeb(webContext);
    context.setApp(appContext);
  }

// detect library type and version
  let libraryVersion = bloombox.VERSION;
  let libraryVariant = bloombox.VARIANT;

  let libObj = new proto.bloombox.schema.analytics.context.DeviceLibrary();
  let libVersionObj = new proto.opencannabis.structs.VersionSpec();
  libVersionObj.setName(libraryVersion);
  libObj.setVersion(libVersionObj);
  libObj.setVariant(libraryVariant);
  libObj.setClient((
    proto.bloombox.schema.analytics.context.APIClient.JAVA_SCRIPT));
  context.setLibrary(libObj);

  // device context
  if (this.browser) context.setBrowser(this.browser);
  if (this.native) context.setNative(this.native);
  return context;
};
