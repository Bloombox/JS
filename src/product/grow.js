
/**
 * Bloombox Products: Grow
 *
 * @fileoverview Enumerates product grow types.
 */

goog.require('proto.structs.Grow');

goog.provide('bloombox.product.Grow');


// -- Grows -- //
/**
 * Product grow types.
 *
 * @export
 * @enum {proto.structs.Grow}
 */
bloombox.product.Grow = {
  'GENERIC': proto.structs.Grow.GENERIC,
  'INDOOR': proto.structs.Grow.INDOOR,
  'GREENHOUSE': proto.structs.Grow.GREENHOUSE,
  'OUTDOOR': proto.structs.Grow.OUTDOOR
};
