
/*
 * Copyright 2019, Momentum Ideas, Co.
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
 * Bloombox: Government ID
 *
 * @fileoverview Provides an object specification for a user's
 * government-issued ID.
 */

/*global goog */

goog.provide('bloombox.identity.ID');
goog.provide('bloombox.identity.IDException');
goog.provide('bloombox.identity.IDType');

goog.require('proto.bloombox.identity.IDType');
goog.require('proto.opencannabis.temporal.Date');


/**
 * Represents an exception that occurred while creating or validating a user's
 * government ID.
 *
 * @param {string} message Exception error message.
 * @constructor
 */
bloombox.identity.IDException = function IDException(message) {
  this.message = message;
};


/**
 * Specifies supported types of government ID.
 *
 * @enum {proto.bloombox.identity.IDType}
 * @export
 */
bloombox.identity.IDType = {
  'USDL': proto.bloombox.identity.IDType.USDL,
  'PASSPORT': proto.bloombox.identity.IDType.PASSPORT
};


// -- License -- //
/**
 * Specifies an object structure for expressing a user's government ID.
 *
 * @param {bloombox.identity.IDType} type Type for the ID.
 * @param {string} id ID number for the identifying document.
 * @param {string} expirationDate Expiration date, in YYYY-MM-DD format.
 * @param {string} birthDate Birth date, in YYYY-MM-DD format.
 * @param {string} jurisdiction State jurisdiction that issued the license,
 *        for instance, "CALIFORNIA".
 * @param {?string=} country Country of issuance, defaults to "USA".
 * @throws {bloombox.identity.IDException} If the provided data is invalid.
 * @constructor
 * @export
 */
bloombox.identity.ID = function ID(type,
                                   id,
                                   expirationDate,
                                   birthDate,
                                   jurisdiction,
                                   country) {
  if (!id || !(typeof id === 'string'))
    throw new bloombox.identity.IDException(
      'Invalid driver\'s license ID: \'' + id + '\'.');
  if (!expirationDate || !(typeof expirationDate === 'string'))
    throw new bloombox.identity.IDException(
      'Invalid driver\'s license expiry date: \'' + expirationDate + '\'.');
  if (!birthDate || !(typeof birthDate === 'string'))
    throw new bloombox.identity.IDException(
      'Invalid driver\'s license birth date: \'' + birthDate + '\'.');
  if (!jurisdiction || !(typeof jurisdiction === 'string'))
    throw new bloombox.identity.IDException(
      'Invalid driver\'s license issuance jurisdiction: \'' +
      jurisdiction + '\'.');

  // setup an instant object
  let expirationObj = new proto.opencannabis.temporal.Date();
  expirationObj.setIso8601(expirationDate);

  let birthObj = new proto.opencannabis.temporal.Date();
  birthObj.setIso8601(birthDate);

  /**
   * Type of the ID we're storing.
   * @type {bloombox.identity.IDType}
   * @public
   */
  this.type = type;

  /**
   * ID number or string for this document.
   * @type {string}
   * @public
   */
  this.id = id;

  /**
   * Document expiration date.
   * @type {proto.opencannabis.temporal.Date}
   * @public
   */
  this.expirationDate = expirationObj;

  /**
   * Document birth date.
   * @type {proto.opencannabis.temporal.Date}
   * @public
   */
  this.birthDate = birthObj;

  /**
   * Document's issuance jurisdiction.
   * @type {string}
   * @public
   */
  this.jurisdiction = jurisdiction.toUpperCase();

  /**
   * Country of origin. Defaults to "USA".
   * @type {string}
   * @public
   */
  this.country = country || 'USA';
};
