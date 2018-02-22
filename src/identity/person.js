
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
 * Bloombox: Person
 *
 * @fileoverview Provides a central object to express a human being.
 */

/*global goog */

goog.provide('bloombox.identity.ContactInfo');
goog.provide('bloombox.identity.Person');
goog.provide('bloombox.identity.PersonException');
goog.provide('bloombox.identity.StreetAddress');

goog.require('proto.opencannabis.person.Name');
goog.require('proto.opencannabis.temporal.Date');


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
   * @public
   */
  this.firstLine = firstLine;

  /**
   * Second address line, if any.
   * @type {?string}
   * @public
   */
  this.secondLine = secondLine || null;

  /**
   * City name.
   * @type {string}
   * @public
   */
  this.city = city;

  /**
   * State code, like "CA" for California.
   * @type {string}
   * @public
   */
  this.state = state;

  /**
   * USPS zipcode.
   * @type {string}
   * @public
   */
  this.zip = zip;

  /**
   * Country code, like "US" for United States.
   * @type {string}
   * @public
   */
  this.country = country || 'USA';
};


/**
 * Retrieve the first line of this address.
 *
 * @return {string} Address first line.
 * @export
 */
bloombox.identity.StreetAddress.prototype.getFirstLine = function() {
  return this.firstLine;
};


/**
 * Retrieve the second line of this address, or `null`, if none is specified.
 *
 * @return {?string} Second address line, or `null`.
 * @export
 */
bloombox.identity.StreetAddress.prototype.getSecondLine = function() {
  return this.secondLine || null;
};


/**
 * Retrieve the city value of this address.
 *
 * @return {string} City name.
 * @export
 */
bloombox.identity.StreetAddress.prototype.getCity = function() {
  return this.city;
};


/**
 * Retrieve the state value of this address, in abbreviated form.
 *
 * @return {string} State value of this address, i.e. 'CA'.
 * @export
 */
bloombox.identity.StreetAddress.prototype.getState = function() {
  return this.state;
};


/**
 * Retrieve the zipcode value of this address.
 *
 * @return {string} USPS zipcode, i.e. '95616'.
 * @export
 */
bloombox.identity.StreetAddress.prototype.getZipcode = function() {
  return this.zip;
};


/**
 * Inflate a street address object from a raw object response.
 *
 * @param {?Object} obj Response object to inflate from.
 * @return {?bloombox.identity.StreetAddress} Inflated street address object.
 */
bloombox.identity.StreetAddress.fromResponse = function(obj) {
  if (obj['firstLine'] && obj['city'] && obj['state'] && obj['zipcode'])
    return new bloombox.identity.StreetAddress(
      obj['firstLine'],
      obj['secondLine'] || null,
      obj['city'],
      obj['state'],
      obj['zipcode'],
      obj['country'] || 'USA');
  return null;  // fail gracefully
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
   *
   * @type {string}
   * @export
   */
  this.emailAddress = emailAddress;

  /**
   * Phone number.
   *
   * @type {?string}
   * @export
   */
  this.phoneNumber = phoneNumber || null;

  /**
   * Street address.
   *
   * @type {?bloombox.identity.StreetAddress}
   * @export
   */
  this.streetAddress = streetAddress || null;
};


/**
 * Return this user's email address.
 *
 * @return {string} User's email address.
 * @export
 */
bloombox.identity.ContactInfo.prototype.getEmailAddress = function() {
  return this.emailAddress;
};


/**
 * Return this user's phone number.
 *
 * @return {?string} User's phone number.
 * @export
 */
bloombox.identity.ContactInfo.prototype.getPhoneNumber = function() {
  return this.phoneNumber;
};


/**
 * Return this user's street address.
 *
 * @return {bloombox.identity.StreetAddress} User's street address.
 * @export
 */
bloombox.identity.ContactInfo.prototype.getStreetAddress = function() {
  return this.streetAddress;
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
  let name = new proto.opencannabis.person.Name();
  name.setFirstName(firstName);
  name.setLastName(lastName);

  // setup an instant object
  let instant = new proto.opencannabis.temporal.Date();
  if (dateOfBirth !== null) {
    instant.setIso8601(dateOfBirth);
  }

  /**
   * Person's name.
   *
   * @type {proto.opencannabis.person.Name}
   * @public
   */
  this.name = name;

  /**
   * Person's contact info.
   *
   * @type {bloombox.identity.ContactInfo}
   * @public
   */
  this.contactInfo = contactInfo;

  /**
   * Person's date of birth.
   *
   * @type {?proto.opencannabis.temporal.Date}
   * @public
   */
  this.dateOfBirth = dateOfBirth !== null ? instant : null;
};


/**
 * Get the user's first name.
 *
 * @return {string} User's given name.
 * @export
 */
bloombox.identity.Person.prototype.getFirstName = function() {
  return this.name.getFirstName();
};


/**
 * Get the user's last name.
 *
 * @return {string} User's family name.
 * @export
 */
bloombox.identity.Person.prototype.getLastName = function() {
  return this.name.getLastName();
};


/**
 * Return this user's contact info.
 *
 * @return {bloombox.identity.ContactInfo} Contact info for this user.
 * @export
 */
bloombox.identity.Person.prototype.getContactInfo = function() {
  return this.contactInfo;
};


/**
 * Get the user's date of birth.
 *
 * @return {?string} User's date of birth.
 * @export
 */
bloombox.identity.Person.prototype.getDateOfBirth = function() {
  return this.dateOfBirth !== null ? this.dateOfBirth.getIso8601() : null;
};
