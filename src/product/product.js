
/*
 * Copyright 2018, Bloombox, LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox: Products
 *
 * @fileoverview Provides structures and logic related to individual products.
 */

/*global goog */

goog.provide('bloombox.product.Key');
goog.provide('bloombox.product.Kind');
goog.provide('bloombox.product.Weight');

goog.require('bloombox.util.Exportable');

goog.require('proto.opencannabis.base.ProductKey');
goog.require('proto.opencannabis.base.ProductKind');
goog.require('proto.opencannabis.structs.pricing.PricingWeightTier');


/**
 * Specifies kinds of products.
 *
 * @enum {proto.opencannabis.base.ProductKind}
 * @export
 */
bloombox.product.Kind = {
  'FLOWERS': proto.opencannabis.base.ProductKind.FLOWERS,
  'EDIBLES': proto.opencannabis.base.ProductKind.EDIBLES,
  'EXTRACTS': proto.opencannabis.base.ProductKind.EXTRACTS,
  'PREROLLS': proto.opencannabis.base.ProductKind.PREROLLS,
  'APOTHECARY': proto.opencannabis.base.ProductKind.APOTHECARY,
  'CARTRIDGES': proto.opencannabis.base.ProductKind.CARTRIDGES,
  'PLANTS': proto.opencannabis.base.ProductKind.PLANTS,
  'MERCHANDISE': proto.opencannabis.base.ProductKind.MERCHANDISE
};


/**
 * Specifies weights products are sold at.
 *
 * @enum {proto.opencannabis.structs.pricing.PricingWeightTier}
 * @export
 */
bloombox.product.Weight = {
  'NO_WEIGHT': proto.opencannabis.structs.pricing.PricingWeightTier.NO_WEIGHT,
  'HALFGRAM': proto.opencannabis.structs.pricing.PricingWeightTier.HALFGRAM,
  'GRAM': proto.opencannabis.structs.pricing.PricingWeightTier.GRAM,
  'EIGHTH': proto.opencannabis.structs.pricing.PricingWeightTier.EIGHTH,
  'QUARTER': proto.opencannabis.structs.pricing.PricingWeightTier.QUARTER,
  'HALF': proto.opencannabis.structs.pricing.PricingWeightTier.HALF,
  'OZ': proto.opencannabis.structs.pricing.PricingWeightTier.OUNCE,
  'OUNCE': proto.opencannabis.structs.pricing.PricingWeightTier.OUNCE
};


// -- Product Key -- //

/**
 * Specifies a key for a product.
 *
 * @param {string} id ID of the product.
 * @param {bloombox.product.Kind} kind Kind of product this key is for.
 * @constructor
 * @implements {bloombox.util.Exportable<proto.opencannabis.base.ProductKey>}
 * @export
 */
bloombox.product.Key = function Key(id,
                                    kind) {
  /**
   * ID for this key.
   * @type {string}
   * @public
   */
  this.id = id;

  /**
   * Kind of item for this key.
   * @type {bloombox.product.Kind}
   * @public
   */
  this.kind = kind;
};


/**
 * Inflate a key kind object from a raw value.
 *
 * @param {string|number} rawKind Raw kind to inflate.
 * @return {bloombox.product.Kind} Kind for the key. Defaults to FLOWERS.
 */
bloombox.product.Key.inflateKind = function(rawKind) {
  if (typeof rawKind === 'string' || typeof rawKind === 'number') {
    switch (rawKind) {
      case 'FLOWERS': return bloombox.product.Kind.FLOWERS;
      case 0: return bloombox.product.Kind.FLOWERS;
      case 'EDIBLES': return bloombox.product.Kind.EDIBLES;
      case 1: return bloombox.product.Kind.EDIBLES;
      case 'EXTRACTS': return bloombox.product.Kind.EXTRACTS;
      case 2: return bloombox.product.Kind.EXTRACTS;
      case 'PREROLLS': return bloombox.product.Kind.PREROLLS;
      case 3: return bloombox.product.Kind.PREROLLS;
      case 'APOTHECARY': return bloombox.product.Kind.APOTHECARY;
      case 4: return bloombox.product.Kind.APOTHECARY;
      case 'CARTRIDGES': return bloombox.product.Kind.CARTRIDGES;
      case 5: return bloombox.product.Kind.CARTRIDGES;
      case 'PLANTS': return bloombox.product.Kind.CARTRIDGES;
      case 6: return bloombox.product.Kind.CARTRIDGES;
      case 'MERCHANDISE': return bloombox.product.Kind.MERCHANDISE;
      case 7: return bloombox.product.Kind.MERCHANDISE;
    }
  }
  return bloombox.product.Kind.FLOWERS;
};


/**
 * Export this key as a proto, suitable for use in an RPC.
 *
 * @return {proto.opencannabis.base.ProductKey} Exported proto.
 * @public
 */
bloombox.product.Key.prototype.export = function() {
  let protobuf = new proto.opencannabis.base.ProductKey();
  protobuf.setId(this.id);
  protobuf.setType(/** @type {proto.opencannabis.base.ProductKind} */ (
    this.kind));
  return protobuf;
};


/**
 * Retrieve the ID for this key.
 * @return {string} ID for this key.
 * @export
 */
bloombox.product.Key.prototype.getId = function() {
  return this.id;
};


/**
 * Retrieve the kind for this key.
 * @return {bloombox.product.Kind} Kind for this key.
 * @export
 */
bloombox.product.Key.prototype.getKind = function() {
  return this.kind;
};
