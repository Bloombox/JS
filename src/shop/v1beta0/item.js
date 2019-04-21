
/*
 * Copyright 2019, Momentum Ideas, Co. All rights reserved.
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

goog.require('bloombox.product.Key');
goog.require('bloombox.product.Kind');
goog.require('bloombox.product.Weight');
goog.require('bloombox.rpc.FALLBACK');
goog.require('bloombox.util.Exportable');

goog.require('proto.opencannabis.commerce.Item');
goog.require('proto.opencannabis.commerce.VariantSpec');

goog.require('proto.opencannabis.structs.pricing.PricingWeightTier');

goog.require('proto.opencannabis.temporal.Instant');


if (bloombox.rpc.FALLBACK) {
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
   * Retrieve the product key associated with this order item.
   *
   * @return {bloombox.product.Key} Item key.
   * @export
   */
  bloombox.shop.Item.prototype.getKey = function() {
    return this.key;
  };


  /**
   * Return the count desired of this item.
   *
   * @return {number} Count desired.
   * @export
   */
  bloombox.shop.Item.prototype.getCount = function() {
    return this.count;
  };


  /**
   * Get the weight variant for this item, if any.
   *
   * @return {bloombox.product.Weight} Weight variant for this product, if any, or
   *         `Weight.NO_WEIGHT` if none is specified.
   * @export
   */
  bloombox.shop.Item.prototype.getWeightVariant = function() {
    // look for a weight variant
    for (let variantI = 0; variantI < this.variants.length; variantI++) {
      let variantSpec = this.variants[variantI];
      if (variantSpec.hasWeight()) {
        return /** @type {bloombox.product.Weight} */ (
          variantSpec.getWeight());
      }
    }
    return bloombox.product.Weight.NO_WEIGHT;
  };


  /**
   * Retrieve the size variant specified for this item, if any.
   *
   * @return {?string} Variant size string, if any, or `null`.
   * @export
   */
  bloombox.shop.Item.prototype.getSizeVariant = function() {
    // look for a weight variant
    for (let variantI = 0; variantI < this.variants.length; variantI++) {
      let variantSpec = this.variants[variantI];
      if (variantSpec.hasSize()) {
        return variantSpec.getSize();
      }
    }
    return null;
  };


  /**
   * Retrieve the cp;pr variant specified for this item, if any.
   *
   * @return {?string} Variant size string, if any, or `null`.
   * @export
   */
  bloombox.shop.Item.prototype.getColorVariant = function() {
    // look for a weight variant
    for (let variantI = 0; variantI < this.variants.length; variantI++) {
      let variantSpec = this.variants[variantI];
      if (variantSpec.hasColor()) {
        return variantSpec.getColor();
      }
    }
    return null;
  };


  /**
   * Inflate a product weight from a raw string or numerical reference.
   *
   * @param {string|number} rawWeight Raw weight value (i.e. 'EIGHTH' or '3').
   * @return {bloombox.product.Weight} Weight value.
   */
  bloombox.shop.Item.inflateWeight = function(rawWeight) {
    if (typeof rawWeight === 'string' || typeof rawWeight === 'number') {
      switch (rawWeight) {
        case 'NO_WEIGHT': return bloombox.product.Weight.NO_WEIGHT;
        case 0: return bloombox.product.Weight.NO_WEIGHT;
        case 'HALFGRAM': return bloombox.product.Weight.HALFGRAM;
        case 1: return bloombox.product.Weight.HALFGRAM;
        case 'GRAM': return bloombox.product.Weight.GRAM;
        case 2: return bloombox.product.Weight.GRAM;
        case 'EIGHTH': return bloombox.product.Weight.EIGHTH;
        case 3: return bloombox.product.Weight.EIGHTH;
        case 'QUARTER': return bloombox.product.Weight.QUARTER;
        case 4: return bloombox.product.Weight.QUARTER;
        case 'HALF': return bloombox.product.Weight.HALF;
        case 5: return bloombox.product.Weight.HALF;
        case 'OZ': return bloombox.product.Weight.OZ;
        case 6: return bloombox.product.Weight.OZ;
      }
    }
    return bloombox.product.Weight.NO_WEIGHT;
  };


  /**
   * Decode a variant specification and attach it to the given item.
   *
   * @param {?Object} protob Raw protobuf object for the variant spec.
   * @param {bloombox.shop.Item} item Item to add the variant to, if found.
   */
  bloombox.shop.Item.decodeVariant = function(protob,
                                              item) {
    // decode variant data
    if (typeof protob === 'object' && item) {
      // try decoding variant weight
      if (typeof protob['weight'] === 'string' ||
        typeof protob['weight'] === 'number') {
        // decode weight
        let decodedWeight = bloombox.shop.Item.inflateWeight(protob['weight']);
        item.addWeightVariant(decodedWeight);
      } else if (typeof protob['size'] === 'string') {
        item.addSizeVariant(protob['size']);
      } else if (typeof protob['color'] === 'string') {
        item.addColorVariant(protob['color']);
      }
    }
  };


  /**
   * Decode an order item from a raw object response.
   *
   * @param {?Object} protob Raw object to decode an item from.
   * @return {?bloombox.shop.Item} Decoded item, if one can be decoded, otherwise
   *         `null` is returned.
   */
  bloombox.shop.Item.fromResponse = function(protob) {
    if (typeof protob === 'object') {
      // extract basic properties first
      let rawKey = /** @type {Object|null|undefined} */ (protob['key']);
      let rawCount = /** @type {number|null|undefined} */ (protob['count']);
      let rawVariants = /** @type {Array<Object>|null|undefined} */ (
        protob['variant']);

      if ((typeof rawKey === 'object') && (typeof rawCount === 'number')) {
        // decode key first
        if (typeof rawKey['id'] === 'string') {
          let rawKeyId = rawKey['id'];
          let rawKeyType = /** @type {bloombox.product.Kind} */ (
            bloombox.product.Kind.FLOWERS);

          if (typeof rawKey['type'] === 'object') {
            // we have a key type
            if (rawKey['type']['kind']) {
              // we have a kind to resolve
              rawKeyType = bloombox.product.Key.inflateKind(
                rawKey['type']['kind']);
            }
          } else if (typeof rawKey['type'] === 'string' ||
            typeof rawKey['type'] === 'number') {
            rawKeyType = bloombox.product.Key.inflateKind(
              rawKey['type']);
          }

          // create our key
          let key = new bloombox.product.Key(rawKeyId, rawKeyType);

          // we can proceed: we have the required info to make an item
          let item = new bloombox.shop.Item(key, rawCount || 1);

          // attempt to decode variants
          if (rawVariants && Array.isArray(rawVariants)) {
            for (let variantI = 0; variantI < rawVariants.length; variantI++) {
              bloombox.shop.Item.decodeVariant(
                rawVariants[variantI], item);
            }
          }
          return item;
        }
      }
    }
    return null;
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
          /** @type {proto.opencannabis.structs.pricing.PricingWeightTier} */ (
            content));
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

}
