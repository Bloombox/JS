
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
 * Bloombox Identity: Profile
 *
 * @fileoverview User identity profile.
 */

goog.require('bloombox.menu.Section');

goog.require('bloombox.product.Grow');
goog.require('bloombox.product.Species');

goog.require('bloombox.testing.CannabinoidRatio');
goog.require('bloombox.testing.subjective.Feeling');
goog.require('bloombox.testing.subjective.PotencyEstimate');
goog.require('bloombox.testing.subjective.TasteNote');

goog.require('bloombox.util.Exportable');
goog.require('bloombox.util.Serializable');

goog.require('proto.identity.ConsumerPreferences');
goog.require('proto.identity.ConsumerProfile');
goog.require('proto.identity.EnrollmentSource');
goog.require('proto.identity.MenuPreferences');

goog.provide('bloombox.identity.ConsumerProfile');
goog.provide('bloombox.identity.ConsumerType');
goog.provide('bloombox.identity.EnrollmentSource');
goog.provide('bloombox.identity.MenuPreferences');
goog.provide('bloombox.identity.ProfileException');


// -- Enrollment Sources -- //
/**
 * Sources for an enrollment.
 *
 * @export
 * @enum {proto.identity.EnrollmentSource}
 */
bloombox.identity.EnrollmentSource = {
  'UNSPECIFIED': proto.identity.EnrollmentSource.UNSPECIFIED,
  'ONLINE': proto.identity.EnrollmentSource.ONLINE,
  'INTERNAL_APP': proto.identity.EnrollmentSource.INTERNAL_APP,
  'PARTNER_APP': proto.identity.EnrollmentSource.PARTNER_APP,
  'IN_STORE': proto.identity.EnrollmentSource.IN_STORE
};


/**
 * Types of customer profiles.
 *
 * @export
 * @enum {proto.identity.ConsumerType}
 */
bloombox.identity.ConsumerType = {
  'UNVALIDATED': proto.identity.ConsumerType.UNVALIDATED,
  'RECREATIONAL': proto.identity.ConsumerType.RECREATIONAL,
  'MEDICAL': proto.identity.ConsumerType.MEDICAL
};


/**
 * Represents an exception that occurred while preparing a consumer profile.
 *
 * @param {string} message Exception error message.
 * @constructor
 * @export
 */
bloombox.identity.ProfileException = function ProfileException(message) {
  this.message = message;
};


// -- Profile -- //
/**
 * Specifies a profile that may be attached to a consumer, specifying various
 * details that relate to how they consume cannabis.
 *
 * @param {bloombox.identity.EnrollmentSource} source Enrollment source.
 * @param {string} channel Enrollment channel.
 * @param {bloombox.identity.MenuPreferences} menu_prefs User's menu prefs.
 * @param {bloombox.identity.ConsumerType=} opt_type Optional explicit consumer
 *        profile type. Defaults to 'UNVALIDATED', and is auto-detected by the
 *        server with aggressive preference towards 'RECREATIONAL'.
 * @throws {bloombox.identity.ProfileException} If params provided are invalid.
 * @constructor
 * @implements {bloombox.util.Serializable}
 * @export
 */
bloombox.identity.ConsumerProfile = function ConsumerProfile(source,
                                                             channel,
                                                             menu_prefs,
                                                             opt_type) {
  /**
   * Source for this enrollment.
   *
   * @export
   * @type {bloombox.identity.EnrollmentSource}
   */
  this.source = source;

  /**
   * Channel name for this enrollment.
   *
   * @export
   * @type {string}
   */
  this.channel = channel;

  // noinspection JSUnusedGlobalSymbols
  /**
   * Specifies menu preferences for this user.
   *
   * @export
   * @type {bloombox.identity.MenuPreferences}
   */
  this.menuPreferences = menu_prefs;

  /**
   * Type of consumer profile.
   *
   * @export
   * @type {bloombox.identity.ConsumerType}
   */
  this.type = opt_type || bloombox.identity.ConsumerType.UNVALIDATED;
};


/**
 * Export the current consumer profile as a native JS object.
 *
 * @public
 * @return {Object} Raw object representing this consumer profile.
 */
bloombox.identity.ConsumerProfile.prototype.serialize = function() {
  return {
    'type': this.type,
    'enrollmentSource': this.source,
    'enrollmentChannel': this.channel,
    'preferences': {
      'menu': this.menuPreferences.serialize()
    }
  };
};


// -- Menu Preferences -- //
/**
 * Specifies a structure that allows a user to enumerate menu-related
 * preferences for their consumption profile.
 *
 * @param {Array<bloombox.menu.Section>=} opt_sections Sections to initialize.
 * @param {Array<bloombox.product.Species>=} opt_species Species to initialize.
 * @param {Array<bloombox.product.Grow>=} opt_grows Grows to initialize.
 * @param {Array<bloombox.testing.subjective.Feeling>=} opt_feelings Feelings to
 *        initialize.
 * @param {Array<bloombox.testing.subjective.TasteNote>=} opt_tastes Taste notes
 *        to initialize.
 * @param {?bloombox.testing.subjective.PotencyEstimate=} opt_potency
 *        Desired potency level.
 * @param {?bloombox.testing.CannabinoidRatio=} opt_ratio Ratio to initialize.
 * @implements {bloombox.util.Serializable}
 * @constructor
 * @export
 */
bloombox.identity.MenuPreferences = function MenuPreferences(opt_sections,
                                                             opt_species,
                                                             opt_grows,
                                                             opt_feelings,
                                                             opt_tastes,
                                                             opt_potency,
                                                             opt_ratio) {
  /**
   * Preferred menu sections/product types.
   *
   * @export
   * @type {Set<bloombox.menu.Section>}
   */
  this.sections = new Set(opt_sections || []);

  /**
   * Preferred feelings or target states.
   *
   * @export
   * @type {Set<bloombox.testing.subjective.Feeling>}
   */
  this.feelings = new Set(opt_feelings || []);

  /**
   * Preferred tastes.
   *
   * @export
   * @type {Set<bloombox.testing.subjective.TasteNote>}
   */
  this.tastes = new Set(opt_tastes || []);

  /**
   * Preferred species types.
   *
   * @export
   * @type {Set<bloombox.product.Species>}
   */
  this.species = new Set(opt_species || []);

  /**
   * Preferred grow types.
   *
   * @export
   * @type {Set<bloombox.product.Grow>}
   */
  this.grows = new Set(opt_grows || []);

  /**
   * Desired potency level.
   *
   * @export
   * @type {bloombox.testing.subjective.PotencyEstimate}
   */
  this.potency = (opt_potency ||
    bloombox.testing.subjective.PotencyEstimate.LIGHT);

  /**
   * Desired cannabinoid ratio.
   *
   * @type {bloombox.testing.CannabinoidRatio}
   */
  this.ratio = (opt_ratio ||
    bloombox.testing.CannabinoidRatio.NO_CANNABINOID_PREFERENCE);
};

/**
 * Export the current set of menu preferences as a native JS object.
 *
 * @public
 * @return {Object} Raw object representing this set of menu prefs.
 */
bloombox.identity.MenuPreferences.prototype.serialize = function() {
  return {
    'section': this.sections ? Array.from(this.sections) : [],
    'feeling': this.feelings ? Array.from(this.feelings) : [],
    'tasteNote': this.tastes ? Array.from(this.tastes) : [],
    'grow': this.grows ? Array.from(this.grows) : [],
    'species': this.species ? Array.from(this.species) : [],
    'cannabinoidRatio': this.ratio,
    'desiredPotency': this.potency
  };
};

// noinspection JSUnusedGlobalSymbols
/**
 * Clear all current preferred sections.
 *
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.clearSections = function() {
  this.sections.clear();
  return this;
};

// noinspection JSUnusedGlobalSymbols
/**
 * Add a preferred menu section.
 *
 * @param {bloombox.menu.Section} section Section to add.
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.addSection = function(section) {
  this.sections.add(section);
  return this;
};

// noinspection JSUnusedGlobalSymbols
/**
 * Clear all current preferred species.
 *
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.clearSpecies = function() {
  this.species.clear();
  return this;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Add a preferred species type.
 *
 * @param {bloombox.product.Species} species Species to add.
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.addSpecies = function(species) {
  this.species.add(species);
  return this;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Clear all current preferred grow types.
 *
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.clearGrows = function() {
  this.grows.clear();
  return this;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Add a preferred grow type.
 *
 * @param {bloombox.product.Grow} grow Grow type to add.
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.addGrow = function(grow) {
  this.grows.add(grow);
  return this;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Clear all current preferred feelings.
 *
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.clearFeelings = function() {
  this.feelings.clear();
  return this;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Add a preferred target feeling or state.
 *
 * @param {bloombox.testing.subjective.Feeling} feeling Feeling to add.
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.addFeeling = function(feeling) {
  this.feelings.add(feeling);
  return this;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Clear currently-set preferred tastes.
 *
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.clearTastes = function() {
  this.tastes.clear();
  return this;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Add a preferred taste.
 *
 * @param {bloombox.testing.subjective.TasteNote} taste Taste note to add.
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.addTaste = function(taste) {
  this.tastes.add(taste);
  return this;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Set the user's desired potency level.
 *
 * @param {bloombox.testing.subjective.PotencyEstimate} potency Desired potency
 *        level to set.
 * @export
 * @return {bloombox.identity.MenuPreferences} Self, for chainability.
 */
bloombox.identity.MenuPreferences.prototype.setPotency = function(potency) {
  this.potency = potency;
  return this;
};
