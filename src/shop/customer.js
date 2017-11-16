
/**
 * Bloombox Shop: Customer
 *
 * @fileoverview Provides a Customer object for ordering/commerce.
 */

/*global goog */

goog.require('bloombox.identity.ContactInfo');
goog.require('bloombox.identity.Person');

goog.require('proto.commerce.Customer');
goog.require('proto.contact.ContactInfo');
goog.require('proto.contact.EmailAddress');
goog.require('proto.contact.PhoneNumber');
goog.require('proto.geo.Address');
goog.require('proto.geo.Location');
goog.require('proto.identity.ConsumerProfile');

goog.require('proto.person.Name');

goog.provide('bloombox.shop.Customer');
goog.provide('bloombox.shop.CustomerException');
goog.provide('bloombox.shop.CustomerName');

goog.provide('bloombox.shop.order.customerFromResponse');



/**
 * Represents an exception that occurred while preparing a customer.
 *
 * @param {string} message Exception error message.
 * @constructor
 * @export
 */
bloombox.shop.CustomerException = function CustomerException(message) {
  this.message = message;
};


// -- Customer -- //
/**
 * Specifies a customer's name.
 *
 * @typedef {{firstName: string, lastName: string}}
 */
bloombox.shop.CustomerName;


/**
 * Specifies a customer attached to an order, who is requesting the order be
 * fulfilled.
 *
 * @param {bloombox.identity.Person} person The human who is this customer.
 * @param {string} foreignID Foreign system ID, for submitting the order (i.e.
 *                 Greenbits).
 * @throws {bloombox.shop.CustomerException} If params provided are invalid.
 * @constructor
 * @export
 */
bloombox.shop.Customer = function Customer(person,
                                           foreignID) {
  // validate foreign ID
  if (!(typeof foreignID === 'string' && foreignID.length > 0))
    throw new bloombox.shop.CustomerException(
      'Invalid customer foreign ID. Must be a valid string over length 1.');

  /**
   * Human being who is this customer.
   * @type {bloombox.identity.Person}
   * @public
   */
  this.person = person;

  /**
   * Foreign ID for this customer.
   * @type {string}
   * @public
   */
  this.foreignId = foreignID;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Set the customer's phone number. In some cases, verifying a customer returns
 * a record that does not include a valid phone number. For submission of PICKUP
 * or DELIVERY orders, you can add the updated phone number via this method.
 *
 * @param {?string} phone Phone number to set, or `null` to clear it. Must be a
 *        valid E164-formatted telephone number.
 * @return {bloombox.shop.Customer} For chain-ability.
 * @throws {bloombox.shop.CustomerException} If the provided value is invalid.
 * @export
 */
bloombox.shop.Customer.prototype.setPhoneNumber = function(phone) {
  if (phone !== null && (phone[0] !== '+' ||
      phone.length < 5 ||
      phone.length > 16))
    throw new bloombox.shop.CustomerException(
      'Invalid phone number: ' + phone);
  this.person.contactInfo.phoneNumber = phone === null ? null : phone;
  return this;
};


/**
 * Build a customer object from a proto customer response.
 *
 * @param {Object} proto Protobuf object.
 * @return {bloombox.shop.Customer} Inflated customer object.
 * @throws {bloombox.shop.CustomerException} If the name, email, or foreign ID
 *         could not be resolved.
 * @export
 */
bloombox.shop.order.customerFromResponse = function(proto) {
  if (typeof proto !== 'object' || !proto)
    throw new bloombox.shop.CustomerException(
      'Failed to resolve customer for response.');
  if (!('customer' in proto))
    throw new bloombox.shop.CustomerException(
      'Failed to resolve customer.');
  if (!('foreignId' in proto['customer']))
    throw new bloombox.shop.CustomerException(
      'Failed to resolve foreign ID.');
  if (!('person' in proto['customer']))
    throw new bloombox.shop.CustomerException(
      'Failed to resolve person.');
  if (!('name' in proto['customer']['person']))
    throw new bloombox.shop.CustomerException(
      'Failed to resolve person\'s name.');
  if (!('contact' in proto['customer']['person']))
    throw new bloombox.shop.CustomerException(
      'Failed to resolve contact info.');
  if (!('email' in proto['customer']['person']['contact']))
    throw new bloombox.shop.CustomerException(
      'Failed to resolve email spec.');
  if (!('address' in proto['customer']['person']['contact']['email']))
    throw new bloombox.shop.CustomerException(
      'Failed to resolve email address.');

  let phone;
  if (typeof proto['customer']['person']['contact']['phone'] === 'object' &&
      typeof (
        proto['customer']['person']['contact']['phone']['e164']) === 'string') {
    phone = /** @type {string} */ (
      proto['customer']['person']['contact']['phone']['e164']);
  } else {
    phone = null;
  }

  let contactInfo = new bloombox.identity.ContactInfo(
    proto['customer']['person']['contact']['email']['address'],
    phone === null ? phone : null,
    null);

  let person = new bloombox.identity.Person(
    proto['customer']['person']['name']['firstName'],
    proto['customer']['person']['name']['lastName'],
    contactInfo,
    proto['customer']['person']['dateOfBirth'] || null);

  return new bloombox.shop.Customer(
    person,
    proto['customer']['foreignId']);
};


/**
 * Export this customer to a proto we can use in an RPC.
 *
 * @return {proto.commerce.Customer} Customer proto.
 * @throws {bloombox.shop.CustomerException} If data is missing/invalid.
 * @public
 */
bloombox.shop.Customer.prototype.export = function() {
  let customer = new proto.commerce.Customer();

  // prep customer name
  let name = new proto.person.Name();
  name.setFirstName(this.person.name.getFirstName());
  name.setLastName(this.person.name.getLastName());

  let contactInfo = new proto.contact.ContactInfo();
  let contactLocation = new proto.geo.Location();
  let contactAddress = new proto.geo.Address();

  // prep street address, if available
  if (this.person.contactInfo.streetAddress !== null) {
    contactAddress.setFirstLine(
      this.person.contactInfo.streetAddress.firstLine);
    if (this.person.contactInfo.streetAddress.secondLine !== null)
      contactAddress.setSecondLine(
        /** @type {string} */ (
          this.person.contactInfo.streetAddress.secondLine));
    contactAddress.setCity(this.person.contactInfo.streetAddress.city);
    contactAddress.setState(this.person.contactInfo.streetAddress.state);
    contactAddress.setZipcode(this.person.contactInfo.streetAddress.zip);
    contactAddress.setCountry(this.person.contactInfo.streetAddress.country);
    contactLocation.setAddress(contactAddress);
    contactInfo.setLocation(contactLocation);
  }

  // prep contact info
  let emailAddress = new proto.contact.EmailAddress();

  // casting this because orders require an email address
  if (!(typeof this.person.contactInfo.emailAddress === 'string') ||
      (this.person.contactInfo.emailAddress.length < 3) ||
      (this.person.contactInfo.emailAddress.split('@').length !== 2))
    throw new bloombox.shop.CustomerException(
      'Must provide a valid email address.');
  emailAddress.setAddress(/** @type {string} */ (
    this.person.contactInfo.emailAddress));
  contactInfo.setEmail(emailAddress);

  // casting this because orders require a phone number
  if (this.person.contactInfo.phoneNumber === null) {
    throw new bloombox.shop.CustomerException(
      'Must provide a valid phone number.');
  }
  let phoneNumber = new proto.contact.PhoneNumber();
  phoneNumber.setE164(
    /** @type {string} */ (this.person.contactInfo.phoneNumber));
  contactInfo.setPhone(phoneNumber);

  // set foreign ID
  customer.setForeignId(this.foreignId);
  return customer;
};
