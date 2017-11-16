
/**
 * Bloombox Identity: Profile
 *
 * @fileoverview User identity profile.
 */

goog.require('bloombox.menu.Section');

goog.require('bloombox.testing.subjective.Feeling');
goog.require('bloombox.testing.subjective.PotencyEstimate');
goog.require('bloombox.testing.subjective.TasteNote');

goog.require('proto.identity.ConsumerPreferences');
goog.require('proto.identity.ConsumerProfile');
goog.require('proto.identity.EnrollmentSource');
goog.require('proto.identity.MenuPreferences');
goog.require('proto.products.menu.section.Section');
goog.require('proto.structs.labtesting.Subjective.Feeling');
goog.require('proto.structs.labtesting.Subjective.PotencyEstimate');
goog.require('proto.structs.labtesting.Subjective.TasteNote');

goog.provide('bloombox.identity.ConsumerProfile');
goog.provide('bloombox.identity.EnrollmentSource');
goog.provide('bloombox.identity.MenuPreferences');
goog.provide('bloombox.identity.ProfileException');


// -- Enrollment Sources -- //
/**
 * Sources for an enrollment.
 *
 * @export
 * @typedef {proto.identity.EnrollmentSource}
 */
bloombox.identity.EnrollmentSource;

goog.exportSymbol('bloombox.identity.EnrollmentSource',
  proto.identity.EnrollmentSource);

goog.exportSymbol('bloombox.identity.EnrollmentSource.ONLINE',
  proto.identity.EnrollmentSource.ONLINE);

goog.exportSymbol('bloombox.identity.EnrollmentSource.INTERNAL_APP',
  proto.identity.EnrollmentSource.INTERNAL_APP);

goog.exportSymbol('bloombox.identity.EnrollmentSource.PARTNER_APP',
  proto.identity.EnrollmentSource.PARTNER_APP);

goog.exportSymbol('bloombox.identity.EnrollmentSource.IN_STORE',
  proto.identity.EnrollmentSource.IN_STORE);


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
 * @throws {bloombox.identity.ProfileException} If params provided are invalid.
 * @constructor
 * @export
 */
bloombox.identity.ConsumerProfile = function ConsumerProfile(source,
                                                             channel,
                                                             menu_prefs) {
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
};


/**
 * Export the current consumer profile as a native JS object.
 *
 * @public
 * @return {Object} Raw object representing this consumer profile.
 */
bloombox.identity.ConsumerProfile.prototype.export = function() {
  return {
    'enrollmentSource': this.source,
    'enrollmentChannel': this.channel,
    'preferences': {
      'menu': this.menuPreferences.export()
    }
  };
};


// -- Menu Preferences -- //
/**
 * Specifies a structure that allows a user to enumerate menu-related
 * preferences for their consumption profile.
 *
 * @param {Array<bloombox.menu.Section>=} opt_sections Sections to initialize.
 * @param {Array<bloombox.testing.subjective.Feeling>=} opt_feelings Feelings to
 *        initialize.
 * @param {Array<bloombox.testing.subjective.TasteNote>=} opt_tastes Taste notes
 *        to initialize.
 * @param {?bloombox.testing.subjective.PotencyEstimate=} opt_potency
 *        Desired potency level.
 * @constructor
 */
bloombox.identity.MenuPreferences = function MenuPreferences(opt_sections,
                                                             opt_feelings,
                                                             opt_tastes,
                                                             opt_potency) {
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
   * Desired potency level.
   *
   * @export
   * @type {bloombox.testing.subjective.PotencyEstimate}
   */
  this.potency = (
    opt_potency || bloombox.testing.subjective.PotencyEstimate.LIGHT);
};

/**
 * Export the current set of menu preferences as a native JS object.
 *
 * @public
 * @return {Object} Raw object representing this set of menu prefs.
 */
bloombox.identity.MenuPreferences.prototype.export = function() {
  return {
    'section': this.sections ? new Set(this.sections) : [],
    'feeling': this.feelings ? new Set(this.feelings) : [],
    'tasteNote': this.tastes ? new Set(this.tastes) : [],
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
