
/**
 * Bloombox Testing: Subjective
 *
 * @fileoverview User-subjective testing.
 */

goog.require('proto.structs.labtesting.Subjective');
goog.require('proto.structs.labtesting.Subjective.Feeling');
goog.require('proto.structs.labtesting.Subjective.PotencyEstimate');
goog.require('proto.structs.labtesting.Subjective.TasteNote');

goog.provide('bloombox.testing.subjective.Feeling');
goog.provide('bloombox.testing.subjective.PotencyEstimate');
goog.provide('bloombox.testing.subjective.TasteNote');


// -- Feelings -- //
/**
 * Subjective feelings experienced during testing.
 *
 * @export
 * @enum {proto.structs.labtesting.Subjective.Feeling}
 */
bloombox.testing.subjective.Feeling = {
  'NO_FEELING_PREFERENCE': (
    proto.structs.labtesting.Subjective.Feeling.NO_FEELING_PREFERENCE),
  'GROUNDING': proto.structs.labtesting.Subjective.Feeling.GROUNDING,
  'SLEEP': proto.structs.labtesting.Subjective.Feeling.SLEEP,
  'CALMING': proto.structs.labtesting.Subjective.Feeling.CALMING,
  'STIMULATING': proto.structs.labtesting.Subjective.Feeling.STIMULATING,
  'FUNNY': proto.structs.labtesting.Subjective.Feeling.FUNNY,
  'FOCUS': proto.structs.labtesting.Subjective.Feeling.FOCUS,
  'PASSION': proto.structs.labtesting.Subjective.Feeling.PASSION
};


// -- Potency Estimate -- //
/**
 * General potency level estimate.
 *
 * @export
 * @enum {proto.structs.labtesting.Subjective.PotencyEstimate}
 */
bloombox.testing.subjective.PotencyEstimate = {
  'LIGHT': proto.structs.labtesting.Subjective.PotencyEstimate.LIGHT,
  'MEDIUM': proto.structs.labtesting.Subjective.PotencyEstimate.MEDIUM,
  'HEAVY': proto.structs.labtesting.Subjective.PotencyEstimate.HEAVY,
  'SUPER': proto.structs.labtesting.Subjective.PotencyEstimate.SUPER
};


// -- Taste Notes -- //
/**
 * Aroma and flavor notes.
 *
 * @export
 * @enum {proto.structs.labtesting.Subjective.TasteNote}
 */
bloombox.testing.subjective.TasteNote = {
  'NO_TASTE_PREFERENCE': (
    proto.structs.labtesting.Subjective.TasteNote.NO_TASTE_PREFERENCE),
  'SWEET': proto.structs.labtesting.Subjective.TasteNote.SWEET,
  'SOUR': proto.structs.labtesting.Subjective.TasteNote.SOUR,
  'SPICE': proto.structs.labtesting.Subjective.TasteNote.SPICE,
  'SMOOTH': proto.structs.labtesting.Subjective.TasteNote.SMOOTH,
  'CITRUS': proto.structs.labtesting.Subjective.TasteNote.CITRUS,
  'PINE': proto.structs.labtesting.Subjective.TasteNote.PINE,
  'FRUIT': proto.structs.labtesting.Subjective.TasteNote.FRUIT,
  'TROPICS': proto.structs.labtesting.Subjective.TasteNote.TROPICS,
  'FLORAL': proto.structs.labtesting.Subjective.TasteNote.FLORAL,
  'HERB': proto.structs.labtesting.Subjective.TasteNote.HERB,
  'EARTH': proto.structs.labtesting.Subjective.TasteNote.EARTH
};
