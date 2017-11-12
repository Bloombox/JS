
/**
 * Bloombox: Orders
 *
 * @fileoverview Provides the ability to submit orders for pickup and delivery.
 */

/*global goog */

goog.provide('bloombox.shop.SchedulingType');

goog.provide('bloombox.shop.order.Order');
goog.provide('bloombox.shop.order.OrderException');
goog.provide('bloombox.shop.order.OrderScheduling');
goog.provide('bloombox.shop.order.Type');

goog.require('bloombox.config');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

goog.require('bloombox.product.Key');
goog.require('bloombox.product.Kind');
goog.require('bloombox.product.Weight');

goog.require('bloombox.shop.Customer');
goog.require('bloombox.shop.CustomerName');
goog.require('bloombox.shop.Item');
goog.require('bloombox.shop.Routine');

goog.require('bloombox.shop.order.DeliveryLocation');
goog.require('bloombox.shop.order.customerFromResponse');

goog.require('bloombox.shop.rpc.ShopRPC');

goog.require('proto.commerce.Item');
goog.require('proto.commerce.Order');
goog.require('proto.commerce.OrderScheduling');
goog.require('proto.commerce.OrderType');
goog.require('proto.commerce.ProductVariant');
goog.require('proto.commerce.ProductWeight');
goog.require('proto.commerce.SchedulingType');
goog.require('proto.commerce.VariantSpec');

goog.require('proto.services.shop.v1.OrderError');
goog.require('proto.services.shop.v1.SubmitOrder.Request');
goog.require('proto.services.shop.v1.SubmitOrder.Response');

goog.require('proto.temporal.Instant');


// -- Structures -- //

/**
 * Callback function for order submission.
 *
 * @typedef {function(?string, ?bloombox.shop.order.Order, ?number=)}
 */
bloombox.shop.OrderCallback;


/**
 * Specifies types of orders.
 *
 * @enum {number}
 * @export
 */
bloombox.shop.order.Type = {
  'PICKUP': proto.commerce.OrderType.PICKUP,
  'DELIVERY': proto.commerce.OrderType.DELIVERY
};


/**
 * Specifies types of order scheduling.
 *
 * @enum {number}
 * @export
 */
bloombox.shop.SchedulingType = {
  'ASAP': proto.commerce.SchedulingType.ASAP,
  'TIMED': proto.commerce.SchedulingType.TIMED
};


/**
 * Represents an exception that occurred while preparing or submitting
 * an order.
 *
 * @param {string} message Exception error message.
 * @constructor
 * @export
 */
bloombox.shop.order.OrderException = function OrderException(message) {
  this.message = message;
};


// -- Order Scheduling -- //

/**
 * Specifies scheduling options for an order.
 *
 * @param {bloombox.shop.SchedulingType} scheduling Scheduling type to apply.
 * @param {?number} desiredTime Desired time to set for delivery or pickup.
 * @constructor
 * @export
 */
bloombox.shop.order.OrderScheduling = function OrderScheduling(scheduling,
                                                               desiredTime) {
  this.scheduling = scheduling;
  this.desiredTime = desiredTime;
};


/**
 * Export this order scheduling specification as a proto object suitable
 * for use in an RPC.
 *
 * @return {proto.commerce.OrderScheduling} Proto order scheduling spec.
 * @package
 */
bloombox.shop.order.OrderScheduling.prototype.export = function() {
  let protob = new proto.commerce.OrderScheduling();
  protob.setScheduling(/** @type {proto.commerce.SchedulingType<number>} */ (
      this.scheduling));

  // set desired time, if applicable
  if (this.desiredTime !== null) {
    let desiredTime = new proto.temporal.Instant();
    desiredTime.setTimestamp(this.desiredTime);
    protob.setDesiredTime(desiredTime);
  }
  return protob;
};


/**
 * Retrieve the scheduling type for this scheduling spec.
 * @return {bloombox.shop.SchedulingType} Scheduling type.
 * @export
 */
bloombox.shop.order.OrderScheduling.prototype.getScheduling = function() {
  return this.scheduling;
};


/**
 * Retrieve the desired delivery or pickup target time.
 * @return {?number} Target time, or `null` if not applicable.
 * @export
 */
bloombox.shop.order.OrderScheduling.prototype.getDesiredTime = function() {
  return this.desiredTime;
};


// -- Order -- //

/**
 * Specifies an order that can be submitted for pickup or delivery.
 *
 * @param {bloombox.shop.order.Type} orderType Type of order to build.
 * @param {bloombox.shop.Customer} customer Customer submitting the order.
 * @param {?bloombox.shop.order.DeliveryLocation} location Delivery location.
 * @param {string=} notes Order notes or special instructions.
 * @throws {bloombox.shop.order.OrderException} If params provided are invalid.
 * @constructor
 * @export
 */
bloombox.shop.order.Order = function Order(orderType,
                                           customer,
                                           location,
                                           notes) {
  // check order type
  if (!(orderType === bloombox.shop.order.Type.PICKUP ||
        orderType === bloombox.shop.order.Type.DELIVERY))
    throw new bloombox.shop.order.OrderException(
      'Invalid order type provided. Must be DELIVERY or PICKUP.');

  // check customer
  if (!(typeof customer === 'object' && (
      typeof customer.export === 'function')))
    throw new bloombox.shop.order.OrderException(
      'Invalid customer provided for order.');

  // check location
  if (orderType === bloombox.shop.order.Type.DELIVERY &&
      (location === null || !(typeof location === 'object') || !location))
    // we need a location - it's type `DELIVERY` - but we didn't get one
    throw new bloombox.shop.order.OrderException(
      'Order type was DELIVERY, but no destination info was provided.');

  // okay everything is valid
  this.type = orderType;
  this.customer = customer;
  this.items = [];
  this.location = location;
  this.notes = notes || null;
  this.scheduling = new bloombox.shop.order.OrderScheduling(
    bloombox.shop.SchedulingType.ASAP, null);
  this.createdAt = {
    timestamp: +(new Date())
  };
};


// noinspection JSUnusedGlobalSymbols
/**
 * Set an order to ASAP-style scheduling.
 *
 * @return {bloombox.shop.order.Order} Subject order, for chainability.
 * @export
 */
bloombox.shop.order.Order.prototype.setSchedulingTypeASAP = function() {
  this.scheduling = new bloombox.shop.order.OrderScheduling(
    bloombox.shop.SchedulingType.ASAP, null);
  return this;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Set an order to a specific target delivery time.
 *
 * @param {number} ts Timestamp for delivery target.
 * @return {bloombox.shop.order.Order} Subject order, for chainability.
 * @throws {bloombox.shop.order.OrderException} If the provided timestamp is not
 *         valid.
 * @export
 */
bloombox.shop.order.Order.prototype.setSchedulingTypeTimed = function(ts) {
  // check timestamp
  if (!((typeof ts === 'number') && (ts > 100)))
    throw new bloombox.shop.order.OrderException(
      'Invalid timestamp provided for setSchedulingTypeTimed.');

  this.scheduling = new bloombox.shop.order.OrderScheduling(
    bloombox.shop.SchedulingType.TIMED, ts);
  return this;
};


/**
 * Set the type of order.
 *
 * @param {bloombox.shop.order.Type} type Type to set the order to.
 * @return {bloombox.shop.order.Order} Subject order, for chain-ability.
 * @throws {bloombox.shop.order.OrderException} If the provided type isn't valid
 * @export
 */
bloombox.shop.order.Order.prototype.setType = function(type) {
  // check validity
  if (type !== bloombox.shop.order.Type.PICKUP && (
      type !== bloombox.shop.order.Type.DELIVERY))
    throw new bloombox.shop.order.OrderException(
      'Invalid order type provided to Order.setType. ' +
        'Must be one of `bloombox.shop.order.Type.DELIVERY` ' +
        'or `bloombox.shop.order.Type.PICKUP`.');

  this.type = type;
  return this;
};


/**
 * Set the notes for the order.
 *
 * @param {?string} notes Notes for the order, or `null` to unset notes.
 * @return {bloombox.shop.order.Order} Subject order, for chain-ability.
 * @throws {bloombox.shop.order.OrderException} If the provided type isn't valid
 * @export
 */
bloombox.shop.order.Order.prototype.setNotes = function(notes) {
  // check validity
  if (notes === null) {
    // we're clearing notes
    this.notes = null;
  } else if (typeof notes === 'string' && notes.length > 0) {
    // it's notes
    this.notes = notes;
  } else {
    // it's an invalid type
    throw new bloombox.shop.order.OrderException(
      'Notes for order aren\'t valid: \'' + notes + '\'.');
  }
  return this;
};


/**
 * Set the location for a delivery order.
 *
 * @param {?bloombox.shop.order.DeliveryLocation} location Location to set.
 * @return {bloombox.shop.order.Order} Subject order, for chain-ability.
 * @throws {bloombox.shop.order.OrderException} If the provided location isn't
 *         valid in some way.
 * @export
 */
bloombox.shop.order.Order.prototype.setLocation = function(location) {
  // check validity
  if (location !== null && (!(typeof location === 'object') ||
        !(typeof location.export === 'function')))
    throw new bloombox.shop.order.OrderException(
      'Invalid delivery destination provided to Order.setLocation.');

  this.location = location;
  return this;
};


/**
 * Get the type of order.
 * @return {bloombox.shop.order.Type} Order type.
 * @export
 */
bloombox.shop.order.Order.prototype.getType = function() {
  return this.type;
};


/**
 * Get the notes for the order.
 * @return {?string} Order notes, or `null` if no notes were specified.
 * @export
 */
bloombox.shop.order.Order.prototype.getNotes = function() {
  return this.notes;
};


/**
 * Set the customer for this order.
 *
 * @param {bloombox.shop.Customer} customer Customer to set.
 * @return {bloombox.shop.order.Order} Subject order, for chain-ability.
 * @throws {bloombox.shop.order.OrderException} If the provided customer is not
 *         valid in some way.
 * @export
 */
bloombox.shop.order.Order.prototype.setCustomer = function(customer) {
  // check validity
  if (customer !== null && (!(typeof customer === 'object') ||
        !(typeof customer.export === 'function')))
    throw new bloombox.shop.order.OrderException(
      'Invalid customer provided to Order.setCustomer.');

  this.customer = customer;
  return this;
};


/**
 * Get the customer for this order.
 * @return {bloombox.shop.Customer} Order customer.
 * @export
 */
bloombox.shop.order.Order.prototype.getCustomer = function() {
  return this.customer;
};


/**
 * Add an item to this order.
 *
 * @param {bloombox.shop.Item} item Item to add to the order.
 * @return {bloombox.shop.order.Order} Subject order, for chain-ability.
 * @throws {bloombox.shop.order.OrderException} If the provided item is not
 *         valid in some way.
 * @export
 */
bloombox.shop.order.Order.prototype.addItem = function(item) {
  // check validity
  if (item !== null && (!(typeof item === 'object') ||
        !(typeof item.export === 'function')))
    throw new bloombox.shop.order.OrderException(
      'Invalid item provided to Order.addItem');

  this.items.push(item);
  return this;
};


/**
 * Submit the order for fulfillment.
 *
 * @param {bloombox.shop.OrderCallback} callback Order callback.
 * @export
 */
bloombox.shop.order.Order.prototype.send = function(callback) {
  // set basic properties
  let payload = new proto.commerce.Order();
  payload.setType(/** @type {proto.commerce.OrderType<number>} */ (this.type));

  // add notes, if any are specified
  let notes = this.notes;
  if (notes !== null) payload.setNotes(notes);

  // add the customer proto
  let customer = this.customer.export();
  payload.setCustomer(customer);

  // add scheduling info
  let scheduling = this.scheduling.export();
  payload.setScheduling(scheduling);

  // add location info, if it's delivery
  if (this.type === bloombox.shop.order.Type.DELIVERY) {
    let location = this.location.export();
    payload.setDestination(location);
  }

  this.items.map(function(item) {
    let itemobj = /** @type {bloombox.shop.Item} */ (item);
    let protob = /** @type {!proto.commerce.Item} */ (itemobj.export());
    payload.addItem(protob);
  });

  let done = false;

  let partner = bloombox.config.partner;
  let location = bloombox.config.location;

  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  let serializedItems = this.items.map(function(item) {
    return {
      'count': item.count || 1,
      'key': {
        'id': item.key.id,
        'type': {
          'kind': item.key.kind
        }
      },
      'variant': item.variants.map(function(variant) {
        let baseVariant = {
          'variant': variant.getVariant(),
        };

        if (variant.getWeight()) {
          baseVariant['weight'] = variant.getWeight();
        } else if (variant.getSize()) {
          baseVariant['size'] = variant.getSize();
        } else if (variant.getColor()) {
          baseVariant['color'] = variant.getColor();
        }
        return baseVariant;
      })
    };
  });

  let payloadObject = {
    'type': payload.getType(),
    'partnerCode': partner,
    'locationCode': location,
    'customer': {
      'person': {
        'name': {
          'firstName': this.customer.person.name.getFirstName(),
          'lastName': this.customer.person.name.getLastName()
        },
        'contact': {
          'email': {'address': this.customer.person.contactInfo.emailAddress},
          'phone': {'e164': this.customer.person.contactInfo.phoneNumber}
        }
      },
      'foreignId': this.customer.foreignId
    },
    'scheduling': {
      'scheduling': payload.getScheduling().getScheduling()
    },
    'item': serializedItems
  };

  if (typeof payload.getNotes() === 'string') {
    payloadObject['notes'] = payload.getNotes();
  }

  if (payload.getType() === bloombox.shop.order.Type.DELIVERY) {
    if (!payload.getDestination() || !payload.getDestination().getAddress())
      throw new bloombox.shop.order.OrderException(
        'Missing destination information, but order type is DELIVERY.');
    payloadObject['destination'] = {
      'address': {
        'firstLine': payload.getDestination().getAddress().getFirstLine(),
        'city': payload.getDestination().getAddress().getCity(),
        'state': payload.getDestination().getAddress().getState(),
        'zipcode': payload.getDestination().getAddress().getZipcode(),
        'country': 'USA'  // @TODO maybe make this configurable
      }
    };
    if (payload.getNotes())
      payloadObject['notes'] = payload.getNotes();

    if (payload.getDestination().getAddress().getSecondLine())
      payloadObject['destination']['address']['secondLine'] = (
        payload.getDestination().getAddress().getSecondLine());

    if (payload.getDestination().getInstructions())
      payloadObject['destination']['instructions'] = (
        payload.getDestination().getInstructions());
  }

  // make the RPC
  new bloombox.shop.rpc.ShopRPC(
    /** @type {bloombox.shop.Routine} */ (
      bloombox.shop.Routine.SUBMIT_ORDER), 'POST', [
        'partners',
        partner,
        'locations',
        location,
        'orders'
    ].join('/'), payloadObject)
    .send((function(response) {
      if (done) return;
      if (response != null) {
        done = true;

        bloombox.logging.log(
          'Response received for order submission RPC.', response);

        // decode the response
        let inflated = new proto.services.shop.v1.SubmitOrder.Response();
        if (response['error'])
          inflated.setError(response['error']);
        inflated.setOrderId(response['orderId']);

        if ((
          inflated.getError() === proto.services.shop.v1.OrderError.NO_ERROR) &&
            inflated.getOrderId()) {
          this.id = inflated.getOrderId();
          callback(/** @type {string} */ (inflated.getOrderId()), this, null);
          return;
        } else {
          bloombox.logging.error(
              'Server indicated order submission failed.', response);
          callback(null, null, inflated.getError());
        }
      }
      callback(null, null);  // an error occurred
    }).bind(this), function(status) {
      // we got an error
      bloombox.logging.error(
          'Order submission RPC failed with status: ', status);
      callback(null, null, status);
    });
};
