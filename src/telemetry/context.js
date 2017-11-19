
/**
 * Bloombox Telemetry: Context
 *
 * @fileoverview Provides tools for detecting, specifying, and merging event
 * contexts.
 */

/*global goog */

goog.require('bloombox.util.Exportable');

goog.require('proto.analytics.BrowserDeviceContext');
goog.require('proto.analytics.Collection');
goog.require('proto.analytics.Context');
goog.require('proto.commerce.OrderKey');
goog.require('proto.identity.UserKey');

goog.require('proto.partner.PartnerDeviceKey');
goog.require('proto.partner.PartnerKey');
goog.require('proto.partner.PartnerLocationKey');

goog.provide('bloombox.telemetry.Collection');
goog.provide('bloombox.telemetry.Context');
goog.provide('bloombox.telemetry.ContextException');
goog.provide('bloombox.telemetry.globalContext');


// - Event Collections - //
/**
 * Named event collection.
 *
 * @param {string} name Name for this collection.
 * @constructor
 * @implements {bloombox.util.Exportable}
 * @package
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
 * @param {string=} opt_user Optional. User key to apply to this context.
 * @param {string=} opt_device Optional. Device key to apply to this context.
 *        This is different from the device fingerprint, in that it uniquely
 *        identifies a known device, rather than being a generic opaque token
 *        that distinguishes one device context from another.
 * @param {string=} opt_order Optional. Order key to apply to this context.
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
                                      opt_order) {
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
};


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


/**
 * Retrieve globally gathered/specified context. Caching is applied to reduce
 * overhead. To force a re-gather of expensively calculated information, pass
 * `opt_force_fresh` as truthy.
 *
 * @param {boolean=} opt_force_fresh Force a fresh load of global context.
 * @return {bloombox.telemetry.Context} Global context.
 * @package
 */
bloombox.telemetry.globalContext = function(opt_force_fresh) {
  //let forceFresh = opt_force_fresh || false;
  // @TODO: implement this
};
