
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
