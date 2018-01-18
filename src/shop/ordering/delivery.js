
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
 * Bloombox: Delivery
 *
 * @fileoverview Provides logic specific to delivery orders.
 */

/*global goog */

goog.provide('bloombox.shop.order.DeliveryLocation');

goog.require('bloombox.identity.StreetAddress');

goog.require('proto.commerce.DeliveryDestination');
goog.require('proto.geo.Address');


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
 * Export a proto that specifies this delivery location.
 *
 * @return {proto.commerce.DeliveryDestination} Exported proto.
 * @public
 */
bloombox.shop.order.DeliveryLocation.prototype.export = function() {
  let protobuf = new proto.commerce.DeliveryDestination();
  let address = new proto.geo.Address();

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
