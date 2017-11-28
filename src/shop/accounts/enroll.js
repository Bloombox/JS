
/**
 * Bloombox: Enroll
 *
 * @fileoverview Provides a method to enroll a new customer.
 */

/*global goog */

goog.provide('bloombox.shop.enroll.EnrollCallback');
goog.provide('bloombox.shop.enroll.Enrollment');
goog.provide('bloombox.shop.enroll.EnrollmentException');
goog.provide('bloombox.shop.enroll.EnrollmentSource');

goog.require('bloombox.config.active');

goog.require('bloombox.identity.ConsumerProfile');
goog.require('bloombox.identity.ContactInfo');
goog.require('bloombox.identity.DoctorRec');
goog.require('bloombox.identity.ID');
goog.require('bloombox.identity.Person');
goog.require('bloombox.identity.PersonException');
goog.require('bloombox.identity.StreetAddress');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');
goog.require('bloombox.logging.warn');

goog.require('bloombox.shop.Customer');

goog.require('bloombox.shop.Routine');
goog.require('bloombox.shop.rpc.ShopRPC');

goog.require('proto.identity.EnrollmentSource');
goog.require('proto.services.shop.v1.EnrollMember');
goog.require('proto.services.shop.v1.EnrollmentError');


/**
 * Callback function type definition for enroll RPCs.
 *
 * @typedef {function(boolean, ?proto.services.shop.v1.EnrollmentError, ?bloombox.shop.Customer)}
 */
bloombox.shop.enroll.EnrollCallback;


/**
 * Represents an exception that occurred while preparing or submitting
 * a verification request.
 *
 * @param {string} message Exception error message.
 * @constructor
 * @export
 */
bloombox.shop.enroll.EnrollmentException = function VerifyException(message) {
  this.message = message;
};


/**
 * Source attribution for the enrollment.
 *
 * @enum {proto.identity.EnrollmentSource}
 * @export
 */
bloombox.shop.enroll.EnrollmentSource = {
  'UNSPECIFIED': proto.identity.EnrollmentSource.UNSPECIFIED,
  'ONLINE': proto.identity.EnrollmentSource.ONLINE,
  'INTERNAL_APP': proto.identity.EnrollmentSource.INTERNAL_APP,
  'PARTNER_APP': proto.identity.EnrollmentSource.PARTNER_APP,
  'IN_STORE': proto.identity.EnrollmentSource.IN_STORE
};


// -- Enrollment -- //

/**
 * Request to enroll a new user, including their driver's license, doctor's
 * recommendation for cannabis, contact info, and account password.
 *
 * @param {bloombox.shop.enroll.EnrollmentSource} source Source type for this
 *        enrollment.
 * @param {string} channel Channel source identifier for this enrollment.
 * @param {bloombox.identity.Person} person Person enrolling for the account.
 * @param {bloombox.identity.DoctorRec} rec Person's doctor rec.
 * @param {bloombox.identity.ID} license Person's driver's license or other ID.
 * @param {?string=} opt_password User's password. Optional.
 * @param {?bloombox.identity.ConsumerProfile=} opt_profile Consumer profile.
 * @constructor
 * @export
 */
bloombox.shop.enroll.Enrollment = function Enrollment(source,
                                                      channel,
                                                      person,
                                                      rec,
                                                      license,
                                                      opt_password,
                                                      opt_profile) {
  /**
   * Enrollment source.
   *
   * @export
   * @type {bloombox.shop.enroll.EnrollmentSource}
   */
  this.source = source;

  /**
   * Channel source identifier.
   *
   * @export
   * @type {string}
   */
  this.channel = channel;

  /**
   * Person who is enrolling.
   *
   * @export
   * @type {bloombox.identity.Person}
   */
  this.person = person;

  /**
   * Doctor's recommendation.
   *
   * @export
   * @type {bloombox.identity.DoctorRec}
   */
  this.doctorRec = rec;

  /**
   * Person's driver's license.
   *
   * @export
   * @type {bloombox.identity.ID}
   */
  this.license = license;

  /**
   * Base64-encoded account password, if provided.
   *
   * @public
   * @type {?string}
   */
  this.password = (opt_password !== null && opt_password !== undefined) ? btoa(
      /** @type {string} */ (opt_password)) : null;

  /**
   * User's profile. Defaults to null.
   *
   * @export
   * @type {?bloombox.identity.ConsumerProfile}
   */
  this.profile = opt_profile || null;

  /**
   * Dry-run status for this enrollment. When truthy, this will prevent the
   * subject user from being written to any persistence or external systems.
   * The enrollment is still verified and logged, though, for testing.
   *
   * @export
   * @type {boolean}
   */
  this.dryRun = false;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Activate dry run mode.
 *
 * @return {bloombox.shop.enroll.Enrollment} Self, for chain-ability.
 * @export
 */
bloombox.shop.enroll.Enrollment.prototype.enableDryRun = function() {
  this.dryRun = true;
  return this;
};


/**
 * Send the RPC to enroll a user.
 *
 * @param {bloombox.shop.enroll.EnrollCallback} callback Enrollment callback.
 * @export
 */
bloombox.shop.enroll.Enrollment.prototype.send = function(callback) {
  let config = bloombox.config.active();
  let partner = config.partner;
  let location = config.location;

  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  let rawObject = {
    'person': {
      'name': {
        'firstName': this.person.name.getFirstName(),
        'lastName': this.person.name.getLastName()
      },
      'contact': {
        'email': {'address': this.person.contactInfo.emailAddress},
        'phone': {'e164': this.person.contactInfo.phoneNumber},
        'location': {
          'address': {
            'firstLine': this.person.contactInfo.streetAddress.firstLine,
            'secondLine': this.person.contactInfo.streetAddress.secondLine,
            'city': this.person.contactInfo.streetAddress.city,
            'state': this.person.contactInfo.streetAddress.state,
            'zipcode': this.person.contactInfo.streetAddress.zip,
            'country': this.person.contactInfo.streetAddress.country
          }
        }
      },
      'dateOfBirth': {
        'iso8601': this.person.dateOfBirth.getIso8601()
      }
    },
    'source': this.source,
    'channel': this.channel,
    'doctorRec': {
      'id': this.doctorRec.id,
      'expirationDate': {
        'iso8601': this.doctorRec.expirationDate.getIso8601()
      },
      'state': this.doctorRec.state,
      'country': this.doctorRec.country,
      'doctor': {
        'name': {
          'firstName': this.doctorRec.doctorName.getFirstName(),
          'lastName': this.doctorRec.doctorName.getLastName()
        },
        'contact': {
          'phone': {'e164': this.doctorRec.doctorPhone}
        }
      }
    },
    'governmentId': {
      'id': this.license.id,
      'expireDate': {
        'iso8601': this.license.expirationDate.getIso8601()
      },
      'birthDate': {
        'iso8601': this.license.birthDate.getIso8601()
      },
      'license': {
        'jurisdiction': this.license.jurisdiction.toUpperCase()
      }
    }
  };

  // copy in user profile
  if (this.profile !== null) {
    rawObject['consumerProfile'] = this.profile.serialize();
  }

  // copy in password, if it's there
  if (this.password !== null) rawObject['password'] = this.password;

  // copy in doctor website, if it's there
  if (this.doctorRec.doctorWebsite !== null)
    rawObject['doctorRec']['person']['contact']['website'] = {
      'uri': this.doctorRec.doctorWebsite
    };

  if (this.dryRun === true)
    rawObject['dryRun'] = true;

  bloombox.logging.info('Enrolling user...',
    {'payload': rawObject, 'enrollment': this});

  const rpc = new bloombox.shop.rpc.ShopRPC(
    /** @type {bloombox.shop.Routine} */ (bloombox.shop.Routine.ENROLL_USER),
    'POST', [
      'partners', partner,
      'locations', location,
      'members'].join('/'), rawObject);

  let done = false;
  let personObj = this.person;

  rpc.send(function(response) {
    if (done) return;
    if (response != null) {
      done = true;

      bloombox.logging.log('Response received for enrollment RPC.', response);
      let inflated = new proto.services.shop.v1.EnrollMember.Response();
      if (response['error']) {
        // an error occurred
        inflated.setError(response['error']);
        callback(false, inflated.getError(), null);
      } else {
        if (response['id'] && response['foreignId']) {
          // we have a resulting customer object and ID
          inflated.setId(response['id']);
          inflated.setForeignId(response['foreignId']);
          let customer = new bloombox.shop.Customer(
            personObj,
            response['foreignId']);

          bloombox.logging.log('Decoded customer from response.', customer);
          callback(true, null, customer);
        } else {
          bloombox.logging.error(
            'Failed to find customer or ID in response.',
            response);
          callback(false, null, null);
        }
      }
    } else {
      bloombox.logging.warn('Failed to inflate RPC.', response);
      callback(false, null, null);
    }
  }, function(status) {
    bloombox.logging.error(status ?
      'Enrollment RPC failed with unexpected status: \'' + status + '\'.' :
        'Enrollment RPC response failed to be decoded.');
    callback(false, null, null);
  });
};
