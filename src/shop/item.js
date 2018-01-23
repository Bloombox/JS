
/*
 * Copyright 2018, Bloombox, LLC. All rights reserved.
 *
 * Source and object computer code contained herein is the private intellectual
 * property of Bloombox, a California Limited Liability Corporation. Use of this
 * code in source form requires permission in writing before use or the
 * assembly, distribution, or publishing of derivative works, for commercial
 * purposes or any other purpose, from a duly authorized officer of Momentum
 * Ideas Co.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox Shop: Items
 *
 * @fileoverview Provides expression of shop inventory objects.
 */

/*global goog */
goog.provide('bloombox.shop.Item');

goog.require('bloombox.util.Exportable');

goog.require('proto.opencannabis.commerce.Item');
goog.require('proto.opencannabis.commerce.VariantSpec');
goog.require('proto.opencannabis.temporal.Instant');


// -- Item -- //
/**
 * Specifies an item that is being ordered as part of an Order.
 *
 * @param {bloombox.product.Key} key Key for the item.
 * @param {number} count Count of this item to add to the order.
 * @implements {bloombox.util.Exportable<proto.opencannabis.commerce.Item>}
 * @constructor
 * @export
 */
bloombox.shop.Item = function Item(key,
                                   count) {
  /**
   * Key for this product item.
   *
   * @type {bloombox.product.Key}
   */
  this.key = key;

  /**
   * Count of this item to be ordered.
   *
   * @type {number}
   */
  this.count = count;

  /**
   * Variant specifications for this item.
   *
   * @type {Array<!proto.opencannabis.commerce.VariantSpec>}
   */
  this.variants = [];
};


/**
 * Prepare a proto from an order item, suitable for use in an RPC.
 *
 * @return {proto.opencannabis.commerce.Item} Prepared proto.
 * @public
 */
bloombox.shop.Item.prototype.export = function() {
  let protob = new proto.opencannabis.commerce.Item();

  // set key
  let protoKey = this.key.export();
  protob.setKey(protoKey);

  // set count
  protob.setCount(this.count || 1);

  // prepare variant specs
  this.variants.map(function(item) {
    protob.addVariant(/** @type {!proto.opencannabis.commerce.VariantSpec} */ (
      item));
  });
  return protob;
};


/**
 * Add a product variant.
 *
 * @param {proto.opencannabis.commerce.ProductVariant} type Type of variance to
 *        specify.
 * @param {*} content Content to specify as part of this variance.
 * @return {bloombox.shop.Item} Subject item, for chain-ability.
 * @package
 */
bloombox.shop.Item.prototype._addVariant = function(type, content) {
  // make a variant spec
  let variantSpec = new proto.opencannabis.commerce.VariantSpec();
  variantSpec.setVariant(type);

  switch (type) {
    case proto.opencannabis.commerce.ProductVariant.SIZE:
      variantSpec.setSize(/** @type {string} */ (content));
      break;
    case proto.opencannabis.commerce.ProductVariant.WEIGHT:
      variantSpec.setWeight(
        /** @type {proto.opencannabis.commerce.ProductWeight} */ (content));
      break;
    case proto.opencannabis.commerce.ProductVariant.COLOR:
      variantSpec.setColor(/** @type {string} */ (content));
      break;
  }

  // add it to variants
  this.variants.push(variantSpec);

  // return self for chain-ability
  return this;
};


/**
 * Add a weight variance specification to this item.
 *
 * @param {bloombox.product.Weight} weight Weight to specify.
 * @return {bloombox.shop.Item} Subject item, for chain-ability.
 * @export
 */
bloombox.shop.Item.prototype.addWeightVariant = function(weight) {
  return this._addVariant(proto.opencannabis.commerce.ProductVariant.WEIGHT,
    weight);
};


// noinspection JSUnusedGlobalSymbols
/**
 * Add a size variance specification to this item.
 *
 * @param {string} size Size to specify.
 * @return {bloombox.shop.Item} Subject item, for chain-ability.
 * @export
 */
bloombox.shop.Item.prototype.addSizeVariant = function(size) {
  return this._addVariant(proto.opencannabis.commerce.ProductVariant.SIZE,
    size);
};


// noinspection JSUnusedGlobalSymbols
/**
 * Add a color variance specification to this item.
 *
 * @param {string} color Color to specify.
 * @return {bloombox.shop.Item} Subject item, for chain-ability.
 * @export
 */
bloombox.shop.Item.prototype.addColorVariant = function(color) {
  return this._addVariant(proto.opencannabis.commerce.ProductVariant.COLOR,
    color);
};
