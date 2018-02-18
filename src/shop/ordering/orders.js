
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
 * Bloombox: Orders
 *
 * @fileoverview Provides the ability to submit orders for pickup and delivery.
 */

/*global goog */

goog.provide('bloombox.shop.SchedulingType');

goog.provide('bloombox.shop.order.Order');
goog.provide('bloombox.shop.order.OrderException');
goog.provide('bloombox.shop.order.OrderScheduling');
goog.provide('bloombox.shop.order.Status');
goog.provide('bloombox.shop.order.Type');

goog.require('bloombox.config.active');

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

goog.require('bloombox.shop.rpc.ShopRPC');

goog.require('bloombox.telemetry.event');

goog.require('proto.bloombox.schema.services.shop.v1.GetOrder.Response');
goog.require('proto.bloombox.schema.services.shop.v1.OrderError');
goog.require('proto.bloombox.schema.services.shop.v1.SubmitOrder.Request');
goog.require('proto.bloombox.schema.services.shop.v1.SubmitOrder.Response');

goog.require('proto.opencannabis.commerce.Item');
goog.require('proto.opencannabis.commerce.Order');
goog.require('proto.opencannabis.commerce.OrderScheduling');
goog.require('proto.opencannabis.commerce.OrderStatus');
goog.require('proto.opencannabis.commerce.OrderType');
goog.require('proto.opencannabis.commerce.ProductVariant');
goog.require('proto.opencannabis.commerce.ProductWeight');
goog.require('proto.opencannabis.commerce.SchedulingType');
goog.require('proto.opencannabis.commerce.VariantSpec');

goog.require('proto.opencannabis.temporal.Instant');


// -- Structures -- //
/**
 * Callback function for order submission.
 *
 * @typedef {function(?string, ?bloombox.shop.order.Order, ?number=)}
 */
bloombox.shop.OrderCallback;


/**
 * Callback function for order retrieval.
 *
 * @typedef {function(?proto.bloombox.schema.services.shop.v1.OrderError,
 *                    ?bloombox.shop.order.Order,
 *                    ?number=)}
 */
bloombox.shop.OrderGetCallback;


/**
 * Specifies types of orders.
 *
 * @enum {number}
 * @export
 */
bloombox.shop.order.Type = {
  'PICKUP': proto.opencannabis.commerce.OrderType.PICKUP,
  'DELIVERY': proto.opencannabis.commerce.OrderType.DELIVERY
};


/**
 * Specifies statuses an order may be in.
 *
 * @enum {number}
 * @export
 */
bloombox.shop.order.Status = {
  'PENDING': proto.opencannabis.commerce.OrderStatus.PENDING,
  'REJECTED': proto.opencannabis.commerce.OrderStatus.REJECTED,
  'APPROVED': proto.opencannabis.commerce.OrderStatus.APPROVED,
  'ASSIGNED': proto.opencannabis.commerce.OrderStatus.ASSIGNED,
  'EN_ROUTE': proto.opencannabis.commerce.OrderStatus.EN_ROUTE,
  'FULFILLED': proto.opencannabis.commerce.OrderStatus.FULFILLED
};


/**
 * Specifies types of order scheduling.
 *
 * @enum {number}
 * @export
 */
bloombox.shop.SchedulingType = {
  'ASAP': proto.opencannabis.commerce.SchedulingType.ASAP,
  'TIMED': proto.opencannabis.commerce.SchedulingType.TIMED
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
  this.type = scheduling;
  this.desiredTime = desiredTime;
};


/**
 * Export this order scheduling specification as a proto object suitable
 * for use in an RPC.
 *
 * @return {proto.opencannabis.commerce.OrderScheduling} Proto order scheduling
 *         spec.
 * @package
 */
bloombox.shop.order.OrderScheduling.prototype.export = function() {
  let protob = new proto.opencannabis.commerce.OrderScheduling();
  protob.setScheduling(
    /** @type {proto.opencannabis.commerce.SchedulingType<number>} */ (
      this.type));

  // set desired time, if applicable
  if (this.desiredTime !== null) {
    let desiredTime = new proto.opencannabis.temporal.Instant();
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
bloombox.shop.order.OrderScheduling.prototype.getType = function() {
  return this.type;
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
  /**
   * Order ID, which defaults to `null` until the order has been submitted to
   * the shop service, and a resulting ID is assigned and sent back.
   *
   * @type {?string}
   * @package
   */
  this.id = null;

  /**
   * Type of the order, either DELIVERY or PICKUP.
   *
   * @type {bloombox.shop.order.Type}
   * @package
   */
  this.type = orderType;

  /**
   * Status for this order.
   *
   * @type {bloombox.shop.order.Status}
   * @package
   */
  this.status = bloombox.shop.order.Status['PENDING'];

  /**
   * Customer who submitted the order.
   *
   * @type {bloombox.shop.Customer}
   * @package
   */
  this.customer = customer;

  /**
   * Constituent items that are being ordered as part of this order.
   *
   * @type {Array<bloombox.shop.Item>}
   * @package
   */
  this.items = [];

  /**
   * Location to deliver this order to, if it is a delivery order.
   *
   * @type {bloombox.shop.order.DeliveryLocation}
   * @package
   */
  this.location = location;

  /**
   * Arbitrary notes attached to this order, if any.
   *
   * @type {?string}
   * @package
   */
  this.notes = notes || null;

  /**
   * Scheduling type for this order. Either ASAP or a scheduled time.
   *
   * @type {bloombox.shop.order.OrderScheduling}
   * @package
   */
  this.scheduling = new bloombox.shop.order.OrderScheduling(
    bloombox.shop.SchedulingType.ASAP, null);

  /**
   * When this order was created.
   *
   * @type {{timestamp: number}}
   * @package
   */
  this.createdAt = {'timestamp': +(new Date())};
};


/**
 * Set the ID for an order, once it has been submitted to the server.
 *
 * @param {string} id Order ID.
 * @package
 */
bloombox.shop.order.Order.prototype.setId = function(id) {
  this.id = id;
};


/**
 * Get the ID/key for this order.
 *
 * @return {?string}
 * @export
 */
bloombox.shop.order.Order.prototype.getId = function() {
  return this.id;
};


/**
 * Set the status of this order, after retrieving it/updating status from the
 * server.
 *
 * @param {bloombox.shop.order.Status} status Order status.
 * @protected
 */
bloombox.shop.order.Order.prototype.setStatus = function(status) {
  this.status = status;
};


/**
 * Current status of this order.
 *
 * @return {bloombox.shop.order.Status}
 * @export
 */
bloombox.shop.order.Order.prototype.getStatus = function() {
  return this.status;
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
 * Retrieve the scheduling spec for this order, specifying if it is desired ASAP
 * or at a specified time. The default case is ASAP for both PICKUP and DELIVERY
 * orders.
 *
 * @return {bloombox.shop.order.OrderScheduling}
 * @export
 */
bloombox.shop.order.Order.prototype.getScheduling = function() {
  return this.scheduling;
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
 * Get the type of order this is, either PICKUP or DELIVERY.
 *
 * @return {bloombox.shop.order.Type} Order type.
 * @export
 */
bloombox.shop.order.Order.prototype.getType = function() {
  return this.type;
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
 * Get the notes for the order.
 * @return {?string} Order notes, or `null` if no notes were specified.
 * @export
 */
bloombox.shop.order.Order.prototype.getNotes = function() {
  return this.notes;
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
 * Return the delivery location information attached to this order, if any.
 *
 * @return {?bloombox.shop.order.DeliveryLocation} Delivery location info, or
 *         `null` if none is attached to the order.
 * @export
 */
bloombox.shop.order.Order.prototype.getLocation = function() {
  return this.location || null;
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


// noinspection JSUnusedGlobalSymbols
/**
 * Retrieve the items on this order.
 *
 * @return {Array<bloombox.shop.Item>} Items that are part of this order.
 * @export
 */
bloombox.shop.order.Order.prototype.getItems = function() {
  return this.items;
};


/**
 * Inflate a wire order type into a JS SDK order type.
 *
 * @param {proto.opencannabis.commerce.OrderType|string|number} type Proto type
 *        from an order to inflate into a JS SDK order type.
 * @return {bloombox.shop.order.Type} Inflated order type.
 * @throws {bloombox.shop.order.OrderException} If the type provided is not
 *         valid or cannot be identified.
 * @package
 */
bloombox.shop.order.Order.inflateType = function(type) {
  if (type === null || type === undefined)
    throw new bloombox.shop.order.OrderException(
      'Invalid underlying order type value: "' + type + '".');
  switch (type) {
    case 'PICKUP': return bloombox.shop.order.Type.PICKUP;
    case 'DELIVERY': return bloombox.shop.order.Type.DELIVERY;
    case 0: return bloombox.shop.order.Type.PICKUP;
    case 1: return bloombox.shop.order.Type.DELIVERY;
  }
  bloombox.logging.warn('Unable to resolve order type with value "' +
    type + '".');
  throw new bloombox.shop.order.OrderException(
    'Invalid underlying order type value: "' + type + '".');
};


/**
 * Inflate a wire order status into a JS SDK order status.
 *
 * @param {proto.opencannabis.commerce.OrderStatus|string|number} status Proto
 *        status from an order to inflate into a JS SDK order status.
 * @return {bloombox.shop.order.Status} Inflated order status.
 * @throws {bloombox.shop.order.OrderException} If the status provided is not
 *         valid or cannot be identified.
 * @package
 */
bloombox.shop.order.Order.inflateStatus = function(status) {
  if (status === null || status === undefined)
    throw new bloombox.shop.order.OrderException(
      'Invalid underlying order status value: "' + status + '".');
  switch (status) {
    case 'PENDING': return bloombox.shop.order.Status.PENDING;
    case 'APPROVED': return bloombox.shop.order.Status.APPROVED;
    case 'REJECTED': return bloombox.shop.order.Status.REJECTED;
    case 'ASSIGNED': return bloombox.shop.order.Status.ASSIGNED;
    case 'EN_ROUTE': return bloombox.shop.order.Status.EN_ROUTE;
    case 'FULFILLED': return bloombox.shop.order.Status.FULFILLED;
    case 0: return bloombox.shop.order.Status.PENDING;
    case 1: return bloombox.shop.order.Status.APPROVED;
    case 2: return bloombox.shop.order.Status.REJECTED;
    case 3: return bloombox.shop.order.Status.ASSIGNED;
    case 4: return bloombox.shop.order.Status.EN_ROUTE;
    case 5: return bloombox.shop.order.Status.FULFILLED;
  }
  bloombox.logging.warn('Unable to resolve order status with value "' +
    status + '". Defaulting to "PENDING".');
  return bloombox.shop.order.Status.PENDING;
};


/**
 * Inflate order scheduling information from a raw data object.
 *
 * @param {?Object} data Raw data object from an order response.
 * @return {proto.opencannabis.commerce.OrderScheduling} Order scheduling spec
 *         object.
 */
bloombox.shop.order.Order.inflateScheduling = function(data) {
  let scheduling = new proto.opencannabis.commerce.OrderScheduling();
  if (typeof data === 'object') {
    let type = proto.opencannabis.commerce.SchedulingType.ASAP;

    // decode scheduling type, which should default to 'ASAP'
    if (data.hasOwnProperty('scheduling') &&
       (typeof data['scheduling'] === 'object') &&
       ((typeof data['scheduling']['scheduling'] === 'string') ||
        (typeof data['scheduling']['scheduling'] === 'number'))) {
      switch (data['scheduling']['scheduling'].toUpperCase()) {
        case 'ASAP':
          type = proto.opencannabis.commerce.SchedulingType.ASAP;
          break;
        case 0:
          type = proto.opencannabis.commerce.SchedulingType.ASAP;
          break;
        case 'TIMED':
          type = proto.opencannabis.commerce.SchedulingType.TIMED;
          break;
        case 1:
          type = proto.opencannabis.commerce.SchedulingType.TIMED;
          break;
        default:
          type = proto.opencannabis.commerce.SchedulingType.ASAP;
          break;
      }
    }
    scheduling.setScheduling(type);

    // decode scheduled time, if available
    let desiredTime = /** @type {?number} */ (null);
    if (data.hasOwnProperty('desiredTime') &&
       (typeof data['desiredTime'] === 'object')) {
      // handle ISO8601
      if (typeof data['desiredTime']['iso8601'] === 'string') {
        desiredTime = +(new Date(data['desiredTime']['iso8601']));
      } else if (typeof data['desiredTime']['timestamp'] === 'number') {
        desiredTime = data['desiredTime']['timestamp'];
      } else {
        bloombox.logging.warn('Unable to decode desired order time.', data);
      }
      let timestamp = new proto.opencannabis.temporal.Instant();
      timestamp.setTimestamp(desiredTime);
      scheduling.setDesiredTime(timestamp);
    }
  }
  return scheduling;
};


/**
 * Inflate a shop order from its underlying proto object.
 *
 * @param {proto.opencannabis.commerce.Order} protob Commercial order object.
 * @param {bloombox.shop.Customer} customer Customer object for the order.
 * @param {?bloombox.shop.order.DeliveryLocation} location Delivery destination
 *        spec object, if applicable.
 * @param {Array<Object>} items Array of raw items to be attached to the order.
 * @return {bloombox.shop.order.Order} Inflated SDK order object.
 * @throws {bloombox.shop.order.OrderException} If required information is not
 *         provided by the underlying runtime.
 * @package
 */
bloombox.shop.order.Order.fromProto = function(protob,
                                               customer,
                                               location,
                                               items) {
  // @TODO: decode additional properties here once they are available
  let targetId = protob.getId();
  let underlyingOrderType = protob.getType();
  let underlyingStatus = protob.getStatus();
  let notes = protob.getNotes();

  let status = bloombox.shop.order.Order.inflateStatus(underlyingStatus);
  let type = bloombox.shop.order.Order.inflateType(underlyingOrderType);
  try {
    let order = new bloombox.shop.order.Order(
      type, customer, location, notes);
    order.setId(targetId);
    order.setStatus(status);

    if (Array.isArray(items) && items.length > 0) {
      // process items from order
      for (let orderI = 0; orderI < items.length; orderI++) {
        // for each order, attempt to inflate. if we can inflate it, add it to
        // the order we are decoding and either way continue on.
        let inflatedItem = bloombox.shop.Item.fromResponse(items[orderI]);
        if (inflatedItem !== null) {
          // we have an inflated item
          order.addItem(inflatedItem);
        } else {
          // failed to inflate the item
          bloombox.logging.warn('Unable to decode order item. Skipping.', {
            'index': orderI,
            'id': protob.getId()
          });
        }
      }
    }
    return order;
  } catch (e) {
    bloombox.logging.error('Failed to construct fetched Order object.', {
      'error': e,
      'orderId': targetId,
      'status': status
    });
    throw e;  // rethrow
  }
};


/**
 * Retrieve a copy of this order from the server, and update the properties on
 * it accordingly.
 *
 * @param {bloombox.shop.OrderGetCallback} callback Callback to dispatch once
 *        the order update has completed.
 * @throws {bloombox.shop.order.OrderException} If no order ID is specified on
 *        the current order, indicating it has not successfully been submitted
 *        to the shop service yet.
 * @export
 */
bloombox.shop.order.Order.prototype.update = function(callback) {
  // check for a valid order ID
  if (this.id === null)
    throw new bloombox.shop.order.OrderException(
      'Cannot update order with no ID.');

  let subject = this;

  bloombox.shop.order.Order.retrieve(this.id, function(err, order) {
    if (err !== null || order === null) {
      // could not retrieve order update
      if (err !== null) {
        // an error occurred
        bloombox.logging.error(
          'Failed to retrieve updated order from server. Got error: "' +
          err.toString() + ', for order ID "' + subject.id + '".', {
            'error': err,
            'order': order
          });
        callback(err, null);
      } else {
        // got no error and no order
        bloombox.logging.error(
          'Failed to retrieve updated order from server. Additionally ' +
          'got no error. Order ID "' + subject.id + '".', {
            'error': err,
            'order': order,
            'subject': subject
          });
        callback(null, null);
      }
    } else {
      // update the order from the response
      if (order.getStatus())
        subject.setStatus(
          bloombox.shop.order.Order.inflateStatus(order.getStatus()));

      // dispatch callback, we're done
      callback(null, subject);
    }
  });
};


/**
 * Send analytics data after an order has been submitted.
 *
 * @param {?string} orderId Resulting ID of the order, if submission to the shop
 *        service was completed successfully.
 * @param {proto.bloombox.schema.services.shop.v1.OrderError=} opt_error Error
 *        that was encountered when submitting the order, if any.
 * @param {number=} opt_status Status that the RPC method got back from the
 *        server, if submission was not successful.
 */
bloombox.shop.order.Order.prototype.sendAnalytics = function(orderId,
                                                             opt_error,
                                                             opt_status) {
  let totalItems = 0;
  let itemKeys = /** @type {Object} */ ({});
  let itemsBySection = /** @type {Object} */ ({});
  let uniqueItemKeys = [];
  let uniqueSections = [];
  this.items.map((function(item) {
    let itemId = item.key.getId();

    // update total count
    totalItems += item.count;

    // update unique item keys and item counts
    if (!itemKeys[itemId]) {
      itemKeys[itemId] = item.count;
      uniqueItemKeys.push(itemId);
    } else {
      itemKeys[itemId] += item.count;
    }

    // update unique sections and section counts
    let section = item.key.getKind();
    if (!itemsBySection[section]) {
      itemsBySection[section] = item.count;
      uniqueSections.push(section);
    } else {
      itemsBySection[section] += item.count;
    }
  }));

  // @TODO: actual order telemetry event instead of a generic one
  bloombox.telemetry.event(
    bloombox.telemetry.InternalCollection.ORDERS,
    {'action': opt_error ? 'error' : 'order',
     'status': opt_status ? opt_status : 200,
     'order': {
      'id': orderId,
      'type': this.type,
      'items': uniqueItemKeys,
      'sections': uniqueSections,
      'stats': {
        'countByKey': itemKeys,
        'countBySection': itemsBySection,
        'hasOrderNotes': (
          typeof this.getNotes() === 'string' && this.getNotes().length > 0),
        'uniqueItemCount': this.items.length,
        'totalItemCount': totalItems || 1
      }}}).send();
};


/**
 * Retrieve an order by its key, which is returned after submission of an order
 * to the shop service.
 *
 * @param {string} key Key for the desired order.
 * @param {bloombox.shop.OrderGetCallback} callback Callback to dispatch with
 *        the resulting order.
 * @throws {bloombox.shop.order.OrderException} If no order ID is specified on
 *        the current order, indicating it has not successfully been submitted
 *        to the shop service yet.
 * @export
 */
bloombox.shop.order.Order.retrieve = function(key, callback) {
  // check for a valid order ID
  if (key === null || key.length === 0)
    throw new bloombox.shop.order.OrderException(
      'Cannot retrieve an order with no ID.');

  let done = false;

  let config = bloombox.config.active();
  let partner = config.partner;
  let location = config.location;

  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  // make the RPC to retrieve it
  new bloombox.shop.rpc.ShopRPC(
    /** @type {bloombox.shop.Routine} */ (
      bloombox.shop.Routine.GET_ORDER), 'GET', [
      'partners',
      partner,
      'locations',
      location,
      'orders',
      key
    ].join('/'))
    .send((function(response) {
      if (done) return;
      if (response !== null) {
        done = true;

        bloombox.logging.log(
          'Response received for order fetch RPC.', response);

        // decode the response
        let inflated = (
          new proto.bloombox.schema.services.shop.v1.GetOrder.Response());
        if (response['success'] === true || response['order']) {
          // extract and decode order
          inflated.setSuccess(true);

          let rawOrder = /** @type {Object|null|undefined} */ (
            response['order']);
          if (rawOrder !== null && rawOrder !== undefined &&
              typeof rawOrder === 'object') {
            // inflate the order and call back
            let orderId = /** @type {string} */ (rawOrder['id']);
            let orderType = /** @type {string} */ (rawOrder['type']);
            let orderStatus = /** @type {string} */ (rawOrder['status']);
            let orderNotes = /** @type {string|null|undefined} */ (
              rawOrder['notes']);
            let orderScheduling = /** @type {Object} */ (
              rawOrder['scheduling']);
            let orderItems = /** @type {Array<Object>} */ (rawOrder['item']);

            // if any of those properties look wrong, it's an error
            if (!orderId ||
                  !(typeof orderId === 'string') ||
                  orderId.length < 1 ||
                !orderType ||
                  !(typeof orderType === 'string') ||
                  orderType.length < 1) {
              // order details are invalid
              bloombox.logging.error(
                'Failed to decode required order details after order ' +
                'retrieval RPC.', {
                  'orderId': orderId,
                  'orderType': orderType
                });
            } else {
              // resolve order type and status
              let objOrderType = (
                bloombox.shop.order.Order.inflateType(orderType));
              let objOrderStatus = (
                bloombox.shop.order.Order.inflateStatus(
                  orderStatus || 0));
              let objOrderScheduling = (
                bloombox.shop.order.Order.inflateScheduling(orderScheduling));

              let customerObj = bloombox.shop.Customer.fromResponse(rawOrder);
              let locationObj = (
                bloombox.shop.order.DeliveryLocation.fromResponse(rawOrder));

              // @TODO: decode order items, and created-at

              // build inflated order object
              let orderObj = (
                new proto.opencannabis.commerce.Order());
              orderObj.setId(orderId);
              orderObj.setType(
                /** @type {proto.opencannabis.commerce.OrderType} */ (
                  objOrderType));
              orderObj.setStatus(
                /** @type {proto.opencannabis.commerce.OrderStatus} */ (
                  objOrderStatus));
              orderObj.setScheduling(objOrderScheduling);
              if (orderNotes) orderObj.setNotes(orderNotes);

              if (orderItems) {

              } else {
                bloombox.logging.warn('Unable to decode items for order.', {
                  'items': orderItems,
                  'data': rawOrder});
              }

              let sdkOrder = bloombox.shop.order.Order.fromProto(
                orderObj, customerObj, locationObj, orderItems);
              callback(null, sdkOrder);
            }
          }
        } else {
          // it failed, with no error
          // @TODO order error support here
          bloombox.logging.error(
            'Order retrieval RPC failed for unknown reason.', response);
          callback(null, null);
        }
      }
    }), function(status) {
      // we got an error
      bloombox.logging.error(
        'Order retrieval RPC failed with status: ', status);
      callback(null, null, status);
    });
};


/**
 * Submit the order for fulfillment.
 *
 * @param {bloombox.shop.OrderCallback} callback Order callback.
 * @export
 */
bloombox.shop.order.Order.prototype.send = function(callback) {
  // set basic properties
  let payload = new proto.opencannabis.commerce.Order();
  payload.setType(
    /** @type {proto.opencannabis.commerce.OrderType<number>} */ (this.type));

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
    let protob = /** @type {!proto.opencannabis.commerce.Item} */ (
      itemobj.export());
    payload.addItem(protob);
  });

  let done = false;

  let config = bloombox.config.active();
  let partner = config.partner;
  let location = config.location;

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
          'variant': variant.getVariant()
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
      if (response !== null) {
        done = true;

        bloombox.logging.log(
          'Response received for order submission RPC.', response);

        // decode the response
        let inflated = (
          new proto.bloombox.schema.services.shop.v1.SubmitOrder.Response());
        if (response['error'])
          inflated.setError(response['error']);
        inflated.setOrderId(response['orderId']);

        if ((
          inflated.getError() === (
            proto.bloombox.schema.services.shop.v1.OrderError.NO_ERROR)) &&
            inflated.getOrderId()) {
          this.id = inflated.getOrderId();
          callback(/** @type {string} */ (inflated.getOrderId()), this, null);
          this.sendAnalytics(inflated.getOrderId());
          return;
        } else {
          let error = inflated.getError();
          bloombox.logging.error(
              'Server indicated order submission failed.',
            {'response': response, 'error': error});
          callback(null, null, error);
          this.sendAnalytics(null, error);
        }
      }
      callback(null, null);  // an error occurred
    }).bind(this), function(status) {
      // we got an error
      bloombox.logging.error(
          'Order submission RPC failed with status: ', status);
      callback(null, null, status);
      this.sendAnalytics(null, null, status);
    });
};
