
/**
 * Bloombox Utils: Inflatable
 *
 * @fileoverview Provides a basic interface for structures that are capable of
 * creating themselves from a protobuf message corresponding to their structure.
 */

/*global goog */

goog.provide('bloombox.util.Inflatable');


// - Interface: Inflatable - //
/**
 * Specifies an interface for an object that can be inflated from a low-level
 * protobuf message corresponding to its own type.
 *
 * @template M, T
 * @interface
 * @public
 */
bloombox.util.Inflatable = function Inflatable() {};


/**
 * Import a protobuf object.
 *
 * @param {M} protob Protobuf message to inflate.
 * @return {T} Inflated object from the protobuf message.
 * @public
 */
bloombox.util.Inflatable.prototype.setFromProto = function(protob) {};
