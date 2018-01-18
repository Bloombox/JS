
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

goog.require('proto.base.ProductKey');
goog.require('proto.base.ProductKind');
goog.require('proto.base.ProductType');
goog.require('proto.commerce.ProductWeight');


/**
 * Specifies kinds of products.
 *
 * @enum {proto.base.ProductKind}
 * @export
 */
bloombox.product.Kind = {
  'FLOWERS': proto.base.ProductKind.FLOWERS,
  'EDIBLES': proto.base.ProductKind.EDIBLES,
  'EXTRACTS': proto.base.ProductKind.EXTRACTS,
  'PREROLLS': proto.base.ProductKind.PREROLLS,
  'APOTHECARY': proto.base.ProductKind.APOTHECARY,
  'CARTRIDGES': proto.base.ProductKind.CARTRIDGES,
  'PLANTS': proto.base.ProductKind.PLANTS,
  'MERCHANDISE': proto.base.ProductKind.MERCHANDISE
};


/**
 * Specifies weights products are sold at.
 *
 * @enum {proto.commerce.ProductWeight}
 * @export
 */
bloombox.product.Weight = {
  'NO_WEIGHT': proto.commerce.ProductWeight.NO_WEIGHT,
  'HALFGRAM': proto.commerce.ProductWeight.HALFGRAM,
  'GRAM': proto.commerce.ProductWeight.GRAM,
  'EIGHTH': proto.commerce.ProductWeight.EIGHTH,
  'QUARTER': proto.commerce.ProductWeight.QUARTER,
  'HALF': proto.commerce.ProductWeight.HALF,
  'OZ': proto.commerce.ProductWeight.OZ
};


// -- Product Key -- //

/**
 * Specifies a key for a product.
 *
 * @param {string} id ID of the product.
 * @param {bloombox.product.Kind} kind Kind of product this key is for.
 * @constructor
 * @implements {bloombox.util.Exportable<proto.base.ProductKey>}
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
 * @return {proto.base.ProductKey} Exported proto.
 * @public
 */
bloombox.product.Key.prototype.export = function() {
  let protobuf = new proto.base.ProductKey();
  protobuf.setId(this.id);

  let protoType = new proto.base.ProductType();
  protoType.setKind(/** @type {proto.base.ProductKind} */ (this.kind));
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
