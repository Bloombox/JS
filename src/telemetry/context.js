
/**
 * Bloombox Telemetry: Context
 *
 * @fileoverview Provides tools for detecting, specifying, and merging event
 * contexts.
 */

/*global goog */

goog.require('bloombox.util.Exportable');

goog.provide('bloombox.telemetry.Collection');
goog.provide('bloombox.telemetry.Context');
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


// - Master Context - //
/**
 * Gathered event context.
 *
 * @param {bloombox.telemetry.Collection} collection Collection to file this
 *        event against.
 * @constructor
 * @implements {bloombox.util.Exportable}
 * @package
 */
bloombox.telemetry.Context = function(collection) {
  /**
   * Collection to apply this event to.
   *
   * @type {bloombox.telemetry.Collection}
   */
  this.collection = collection;
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
  let forceFresh = opt_force_fresh || false;
  // @TODO: implement this
};
