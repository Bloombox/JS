
/**
 * Bloombox Utils: Exportable
 *
 * @fileoverview Provides a basic interface for structures that are capable of
 * exporting themselves into corresponding Protobuf message structures.
 */

/*global goog */

goog.provide('bloombox.util.Exportable');


// - Interface: Exportable - //
/**
 * Specifies an interface for an object that can be exported to some protobuf
 * message structure that corresponds with its own type. Implementors specify
 * a method, `export`, that can output a prepared, corresponding PB.
 *
 * @interface
 * @public
 */
bloombox.util.Exportable = function() {};

/**
 * Export the subject exportable object into a protobuf message structure,
 * prepared and initialized with values from the higher-order object.
 *
 * @return {jspb.Message}
 * @public
 */
bloombox.util.Exportable.prototype.export = function() {};
