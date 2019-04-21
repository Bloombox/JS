
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
 * Bloombox: Delivery
 *
 * @fileoverview Provides logic specific to delivery orders.
 */

/*global goog */

goog.provide('bloombox.shop.order.DeliveryLocation');
goog.provide('bloombox.shop.order.DeliveryLocation.fromResponse');

goog.require('bloombox.identity.StreetAddress');

goog.require('bloombox.rpc.FALLBACK');

goog.require('proto.opencannabis.commerce.DeliveryDestination');
goog.require('proto.opencannabis.geo.Address');


if (bloombox.rpc.FALLBACK) {
  // -- Delivery Location -- //

  /**
   * Specifies the location for a delivery.
   *
   * @param {bloombox.identity.StreetAddress} streetAddress Delivery address.
   * @param {?string=} instructions Delivery instructions, if any.
   * @constructor
   * @export
   */
  bloombox.shop.order.DeliveryLocation = function DeliveryLocation(streetAddress,
                                                                   instructions) {
    /**
     * Street address for delivery.
     * @type {bloombox.identity.StreetAddress}
     */
    this.streetAddress = streetAddress;

    /**
     * Special instructions for delivery, if any.
     * @type {?string}
     */
    this.deliveryInstructions = instructions || null;
  };


  /**
   * Decode a delivery location from a raw proto object response.
   *
   * @param {?Object} protob Raw response object.
   * @return {?bloombox.shop.order.DeliveryLocation} Decoded delivery location
   *         object, or `null` if none could be decoded.
   */
  bloombox.shop.order.DeliveryLocation.fromResponse = function(protob) {
    if ((typeof protob === 'object') &&
      (typeof protob['destination'] === 'object')) {
      // decode location
      let data = /** @type {Object} */ (protob['destination']);
      let address = /** @type {Object|undefined} */ (data['address']);
      let instructions = /** @type {string|null|undefined} */ (
        data['instructions']);

      if (typeof address === 'object') {
        // decode address
        let firstLine = /** @type {string|undefined|null} */ (
          address['firstLine']);
        let secondLine = /** @type {string|undefined|null} */ (
          address['secondLine']) || null;
        let city = /** @type {string|undefined|null} */ (
          address['city']);
        let state = /** @type {string|undefined|null} */ (
          address['state']);
        let zipcode = /** @type {string|undefined|null} */ (
          address['zipcode']);

        if (typeof firstLine === 'string' &&
          typeof city === 'string' &&
          typeof state === 'string' &&
          typeof zipcode === 'string') {
          // we are good to go
          return new bloombox.shop.order.DeliveryLocation(
            new bloombox.identity.StreetAddress(
              firstLine,
              secondLine,
              city,
              state,
              zipcode),
            instructions);
        } else {
          // invalid address
          bloombox.logging.error(
            'Failed to decode delivery address data.',
            {'data': data, 'address': address});
        }
      }
    }
    return null;
  };


  /**
   * Export a proto that specifies this delivery location.
   *
   * @return {proto.opencannabis.commerce.DeliveryDestination} Exported proto.
   * @public
   */
  bloombox.shop.order.DeliveryLocation.prototype.export = function() {
    let protobuf = new proto.opencannabis.commerce.DeliveryDestination();
    let address = new proto.opencannabis.geo.Address();

    address.setFirstLine(this.streetAddress.firstLine);
    if (this.streetAddress.secondLine !== null)
      address.setSecondLine(this.streetAddress.secondLine);
    address.setCity(this.streetAddress.city);
    address.setState(this.streetAddress.state);
    address.setZipcode(this.streetAddress.zip);
    protobuf.setAddress(address);

    if (this.deliveryInstructions !== null)
      protobuf.setInstructions(this.deliveryInstructions);
    return protobuf;
  };


  /**
   * Retrieve the street address associated with this delivery location.
   *
   * @return {bloombox.identity.StreetAddress} Delivery street address.
   * @export
   */
  bloombox.shop.order.DeliveryLocation.prototype.getAddress = function() {
    return this.streetAddress;
  };


  /**
   * Set special delivery instructions.
   * @param {string} ins Special instructions.
   * @export
   */
  bloombox.shop.order.DeliveryLocation.prototype.setInstructions = function(ins) {
    this.deliveryInstructions = ins;
  };

// noinspection JSUnusedGlobalSymbols
  /**
   * Clear any special delivery instructions.
   * @export
   */
  bloombox.shop.order.DeliveryLocation.prototype.clearInstructions = function() {
    this.deliveryInstructions = null;
  };

}
