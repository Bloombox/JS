
/**
 * Bloombox Products: Species
 *
 * @fileoverview Enumerates product species types.
 */

goog.require('proto.structs.Species');

goog.provide('bloombox.product.Species');


// -- Species -- //
/**
 * Product species types.
 *
 * @export
 * @enum {proto.structs.Species}
 */
bloombox.product.Species = {
  'UNSPECIFIED': proto.structs.Species.UNSPECIFIED,
  'SATIVA': proto.structs.Species.SATIVA,
  'HYBRID_SATIVA': proto.structs.Species.HYBRID_SATIVA,
  'HYBRID': proto.structs.Species.HYBRID,
  'HYBRID_INDICA': proto.structs.Species.HYBRID_INDICA,
  'INDICA': proto.structs.Species.INDICA
};
