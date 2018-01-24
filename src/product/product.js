
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
goog.require('proto.opencannabis.base.ProductType');
goog.require('proto.opencannabis.commerce.ProductWeight');


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
 * @enum {proto.opencannabis.commerce.ProductWeight}
 * @export
 */
bloombox.product.Weight = {
  'NO_WEIGHT': proto.opencannabis.commerce.ProductWeight.NO_WEIGHT,
  'HALFGRAM': proto.opencannabis.commerce.ProductWeight.HALFGRAM,
  'GRAM': proto.opencannabis.commerce.ProductWeight.GRAM,
  'EIGHTH': proto.opencannabis.commerce.ProductWeight.EIGHTH,
  'QUARTER': proto.opencannabis.commerce.ProductWeight.QUARTER,
  'HALF': proto.opencannabis.commerce.ProductWeight.HALF,
  'OZ': proto.opencannabis.commerce.ProductWeight.OZ
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
 * Export this key as a proto, suitable for use in an RPC.
 *
 * @return {proto.opencannabis.base.ProductKey} Exported proto.
 * @public
 */
bloombox.product.Key.prototype.export = function() {
  let protobuf = new proto.opencannabis.base.ProductKey();
  protobuf.setId(this.id);

  let protoType = new proto.opencannabis.base.ProductType();
  protoType.setKind(/** @type {proto.opencannabis.base.ProductKind} */ (
    this.kind));
  protobuf.setType(protoType);
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
