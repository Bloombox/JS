
/**
 * Bloombox: Person
 *
 * @fileoverview Provides a central object to express a human being.
 */

/*global goog */

goog.provide('bloombox.identity.ContactInfo');
goog.provide('bloombox.identity.Person');
goog.provide('bloombox.identity.PersonException');
goog.provide('bloombox.identity.StreetAddress');

goog.require('proto.person.Name');
goog.require('proto.temporal.Date');


/**
 * Represents an exception that occurred while creating or validating a user.
 *
 * @param {string} message Exception error message.
 * @constructor
 */
bloombox.identity.PersonException = function PersonException(message) {
  this.message = message;
};


// -- Street Address -- //

/**
 * Physical street address for a user/person.
 *
 * @param {string} firstLine First address line.
 * @param {?string} secondLine Second address line, if any.
 * @param {string} city City name.
 * @param {string} state State or province code, like "CA".
 * @param {string} zip USPS zipcode.
 * @param {?string=} country Optional country code. Defaults to "USA".
 * @throws {bloombox.identity.PersonException} If provided data is not valid.
 * @constructor
 * @export
 */
bloombox.identity.StreetAddress = function StreetAddress(firstLine,
                                                         secondLine,
                                                         city,
                                                         state,
                                                         zip,
                                                         country) {
  // checks/validations
  if (!firstLine || !(typeof firstLine === 'string'))
    throw new bloombox.identity.PersonException(
      'Invalid first address line: \'' + firstLine + '\'.');
  if (!city || !(typeof city === 'string'))
    throw new bloombox.identity.PersonException(
      'Invalid address city: \'' + city + '\'.');
  if (!zip || !(typeof zip === 'string'))
    throw new bloombox.identity.PersonException(
      'Invalid address zip: \'' + zip + '\'.');
  if (!state || !(typeof state === 'string'))
    throw new bloombox.identity.PersonException(
      'Invalid address state: \'' + state + '\'.');

  /**
   * First address line.
   * @type {string}
   * @export
   */
  this.firstLine = firstLine;

  /**
   * Second address line, if any.
   * @type {?string}
   * @export
   */
  this.secondLine = secondLine || null;

  /**
   * City name.
   * @type {string}
   * @export
   */
  this.city = city;

  /**
   * State code, like "CA" for California.
   * @type {string}
   * @export
   */
  this.state = state;

  /**
   * USPS zipcode.
   * @type {string}
   * @export
   */
  this.zip = zip;

  /**
   * Country code, like "US" for United States.
   * @type {string}
   * @export
   */
  this.country = country || 'USA';
};


// -- Contact Info -- //

/**
 * Contact information for a user.
 *
 * @param {?string} emailAddress Email address for a user.
 * @param {?string} phoneNumber Phone number for a user.
 * @param {?bloombox.identity.StreetAddress=} streetAddress Street
 *        address for a user.
 * @throws {bloombox.identity.PersonException} If provided data is not valid.
 * @constructor
 * @export
 */
bloombox.identity.ContactInfo = function ContactInfo(emailAddress,
                                                     phoneNumber,
                                                     streetAddress) {
  if (!emailAddress || !(typeof emailAddress === 'string'))
    throw new bloombox.identity.PersonException(
      'Invalid email address: \'' + emailAddress + '\'.');

  /**
   * Email address.
   * @type {string}
   * @export
   */
  this.emailAddress = emailAddress;

  /**
   * Phone number.
   * @type {?string}
   * @export
   */
  this.phoneNumber = phoneNumber || null;

  /**
   * Street address.
   * @type {?bloombox.identity.StreetAddress}
   * @export
   */
  this.streetAddress = streetAddress || null;
};


// -- Person -- //

/**
 * Represents a human being, with contact info and a date of birth.
 *
 * @param {string} firstName Person's given name.
 * @param {string} lastName Person's family name.
 * @param {bloombox.identity.ContactInfo} contactInfo Contact info for this
 *        person.
 * @param {?string} dateOfBirth Date of birth for this person, in YYYY-MM-DD
 *        format.
 * @constructor
 * @export
 */
bloombox.identity.Person = function Person(firstName,
                                           lastName,
                                           contactInfo,
                                           dateOfBirth) {
  if (!firstName || !(typeof firstName === 'string'))
    throw new bloombox.identity.PersonException(
      'Invalid first name: \'' + firstName + '\'.');
  if (!lastName || !(typeof lastName === 'string'))
    throw new bloombox.identity.PersonException(
      'Invalid last name: \'' + lastName + '\'.');
  if (!contactInfo)
    throw new bloombox.identity.PersonException(
      'Invalid contact info: \'' + lastName + '\'.');
  if (dateOfBirth !== null &&
     (!dateOfBirth || !(typeof dateOfBirth === 'string')))
    throw new bloombox.identity.PersonException(
      'Invalid date of birth (must be in YYYY-MM-DD format): \'' +
      dateOfBirth + '\'.');

  // setup a name object
  let name = new proto.person.Name();
  name.setFirstName(firstName);
  name.setLastName(lastName);

  // setup an instant object
  let instant = new proto.temporal.Date();
  if (dateOfBirth !== null) {
    instant.setIso8601(dateOfBirth);
  }

  /**
   * Person's name.
   * @type {proto.person.Name}
   * @export
   */
  this.name = name;

  /**
   * Person's contact info.
   * @type {bloombox.identity.ContactInfo}
   * @export
   */
  this.contactInfo = contactInfo;

  /**
   * Person's date of birth.
   * @type {?proto.temporal.Date}
   * @export
   */
  this.dateOfBirth = dateOfBirth !== null ? instant : null;
};
