
/**
 * Bloombox Utils: Serializable
 *
 * @fileoverview Provides a basic interface for structures that are capable of
 * exporting themselves into native JavaScript structures.
 */

/*global goog */

goog.provide('bloombox.util.Serializable');


// - Interface: Exportable - //
/**
 * Specifies an interface for an object that can be exported to a raw JavaScript
 * structure, suitable for transmission across-the-wire, and inflation by a
 * compatible JSON engine.
 *
 * @interface
 * @public
 */
bloombox.util.Serializable = function Serializable() {};

/**
 * Export the object into a native JavaScript structure that is serializable
 * into JSON.
 *
 * @return {Object}
 * @public
 */
bloombox.util.Serializable.prototype.serialize = function() {};
