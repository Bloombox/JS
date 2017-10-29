
/**
 * Bloombox: Doctor's Recommendation
 *
 * @fileoverview Provides an object specification for a doctor's rec to legally
 * purchase cannabis.
 */

/*global goog */

goog.provide('bloombox.identity.DoctorRec');
goog.provide('bloombox.identity.RecException');

goog.require('bloombox.identity.ContactInfo');

goog.require('proto.person.Name');
goog.require('proto.temporal.Date');


/**
 * Represents an exception that occurred while creating or validating a doctor's
 * rec.
 *
 * @param {string} message Exception error message.
 * @constructor
 */
bloombox.identity.RecException = function RecException(message) {
  this.message = message;
};


// -- Doctor's Rec -- //

/**
 * Recommendation from a doctor for cannabis.
 *
 * @param {string} id Recommendation ID.
 * @param {?string} doctorId ID for the doctor who issued the rec.
 * @param {string} expirationDate Expiration date, in format YYYY-MM-DD.
 * @param {string} state State or province code, for example, "CA".
 * @param {string} doctorFirstName Issuing doctor's first name.
 * @param {string} doctorLastName Issuing doctor's last name.
 * @param {string} doctorPhoneNumber Issuing doctor's phone number.
 * @param {?string=} country Country code, for example, "USA".
 * @param {?string=} doctorWebsite Doctor's website.
 * @constructor
 * @export
 */
bloombox.identity.DoctorRec = function DoctorRec(id,
                                                 doctorId,
                                                 expirationDate,
                                                 state,
                                                 doctorFirstName,
                                                 doctorLastName,
                                                 doctorPhoneNumber,
                                                 country,
                                                 doctorWebsite) {
  // checks/validations
  if (!id || !(typeof id === 'string'))
    throw new bloombox.identity.RecException(
      'Invalid rec ID: \'' + id + '\'.');
  if (doctorId !== null &&
     (!doctorId || !(typeof doctorId === 'string')))
    throw new bloombox.identity.RecException(
      'Invalid doctor ID: \'' + doctorId + '\'.');
  if (!expirationDate || !(typeof expirationDate === 'string'))
    throw new bloombox.identity.RecException(
      'Invalid rec issuance date: \'' + expirationDate + '\'.');
  if (!state || !(typeof state === 'string') || state.length !== 2)
    throw new bloombox.identity.RecException(
      'Invalid rec jurisdiction state: \'' + state + '\'.');
  if (!doctorFirstName || !(typeof doctorFirstName === 'string'))
    throw new bloombox.identity.RecException(
      'Invalid physician first name: \'' + doctorFirstName + '\'.');
  if (!doctorLastName || !(typeof doctorLastName === 'string'))
    throw new bloombox.identity.RecException(
      'Invalid physician last name: \'' + doctorLastName + '\'.');
  if (!doctorPhoneNumber || !(typeof doctorPhoneNumber === 'string'))
    throw new bloombox.identity.RecException(
      'Invalid physician phone number: \'' + doctorPhoneNumber + '\'.');

  // setup a name object
  let doctorName = new proto.person.Name();
  doctorName.setFirstName(doctorFirstName);
  doctorName.setLastName(doctorLastName);

  // make objects for instants
  let expirationObj = new proto.temporal.Date();
  expirationObj.setIso8601(expirationDate);

  // assign properties

  /**
   * Recommendation ID.
   * @type {string}
   * @public
   */
  this.id = id;

  /**
   * Doctor ID, if present.
   * @type {?string}
   * @public
   */
  this.doctorId = doctorId || null;

  /**
   * Expiration date instant.
   * @type {proto.temporal.Date}
   * @public
   */
  this.expirationDate = expirationObj;

  /**
   * State code, like "CA".
   * @type {string}
   * @public
   */
  this.state = state;

  /**
   * Country code, like "USA".
   * @type {string}
   * @public
   */
  this.country = country || 'USA';

  /**
   * Doctor's name.
   * @type {proto.person.Name}
   * @public
   */
  this.doctorName = doctorName;

  /**
   * Doctor's phone.
   * @type {string}
   * @public
   */
  this.doctorPhone = doctorPhoneNumber;

  /**
   * Doctor's website.
   * @type {?string}
   * @public
   */
  this.doctorWebsite = doctorWebsite || null;
};
