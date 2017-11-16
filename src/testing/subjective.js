
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
 * @typedef {proto.structs.labtesting.Subjective.Feeling}
 */
bloombox.testing.subjective.Feeling = {
  'GROUNDING': proto.structs.labtesting.Subjective.Feeling.GROUNDING,
  'SLEEP': proto.structs.labtesting.Subjective.Feeling.SLEEP,
  'CALMING': proto.structs.labtesting.Subjective.Feeling.CALMING,
  'STIMULATING': proto.structs.labtesting.Subjective.Feeling.STIMULATING,
  'FUNNY': proto.structs.labtesting.Subjective.Feeling.FUNNY,
  'FOCUS': proto.structs.labtesting.Subjective.Feeling.FOCUS,
  'PASSION': proto.structs.labtesting.Subjective.Feeling.PASSION
};

goog.exportSymbol('bloombox.testing.subjective.Feeling',
  proto.structs.labtesting.Subjective.Feeling);

goog.exportProperty(
  bloombox.testing.subjective.Feeling,
  'GROUNDING',
  proto.structs.labtesting.Subjective.Feeling.GROUNDING);

goog.exportProperty(
  bloombox.testing.subjective.Feeling,
  'SLEEP',
  proto.structs.labtesting.Subjective.Feeling.SLEEP);

goog.exportProperty(
  bloombox.testing.subjective.Feeling,
  'CALMING',
  proto.structs.labtesting.Subjective.Feeling.CALMING);

goog.exportProperty(
  bloombox.testing.subjective.Feeling,
  'STIMULATING',
  proto.structs.labtesting.Subjective.Feeling.STIMULATING);

goog.exportProperty(
  bloombox.testing.subjective.Feeling,
  'FUNNY',
  proto.structs.labtesting.Subjective.Feeling.FUNNY);

goog.exportProperty(
  bloombox.testing.subjective.Feeling,
  'FOCUS',
  proto.structs.labtesting.Subjective.Feeling.FOCUS);

goog.exportProperty(
  bloombox.testing.subjective.Feeling,
  'PASSION',
  proto.structs.labtesting.Subjective.Feeling.PASSION);


// -- Potency Estimate -- //
/**
 * General potency level estimate.
 *
 * @export
 * @typedef {proto.structs.labtesting.Subjective.PotencyEstimate}
 */
bloombox.testing.subjective.PotencyEstimate = {
  'LIGHT': proto.structs.labtesting.Subjective.PotencyEstimate.LIGHT,
  'MEDIUM': proto.structs.labtesting.Subjective.PotencyEstimate.MEDIUM,
  'HEAVY': proto.structs.labtesting.Subjective.PotencyEstimate.HEAVY,
  'SUPER': proto.structs.labtesting.Subjective.PotencyEstimate.SUPER
};

goog.exportSymbol('bloombox.testing.subjective.PotencyEstimate',
  proto.structs.labtesting.Subjective.PotencyEstimate);

goog.exportProperty(
  bloombox.testing.subjective.PotencyEstimate,
  'LIGHT',
  proto.structs.labtesting.Subjective.PotencyEstimate.LIGHT);

goog.exportProperty(
  bloombox.testing.subjective.PotencyEstimate,
  'MEDIUM',
  proto.structs.labtesting.Subjective.PotencyEstimate.MEDIUM);

goog.exportProperty(
  bloombox.testing.subjective.PotencyEstimate,
  'HEAVY',
  proto.structs.labtesting.Subjective.PotencyEstimate.HEAVY);

goog.exportProperty(
  bloombox.testing.subjective.PotencyEstimate,
  'SUPER',
  proto.structs.labtesting.Subjective.PotencyEstimate.SUPER);


// -- Taste Notes -- //
/**
 * Aroma and flavor notes.
 *
 * @export
 * @typedef {proto.structs.labtesting.Subjective.TasteNote}
 */
bloombox.testing.subjective.TasteNote = {
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

goog.exportSymbol('bloombox.testing.subjective.TasteNote',
  proto.structs.labtesting.Subjective.TasteNote);

goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'SWEET',
  proto.structs.labtesting.Subjective.TasteNote.SWEET);

goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'SOUR',
  proto.structs.labtesting.Subjective.TasteNote.SOUR);

goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'SPICE',
  proto.structs.labtesting.Subjective.TasteNote.SPICE);

goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'SMOOTH',
  proto.structs.labtesting.Subjective.TasteNote.SMOOTH);

goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'CITRUS',
  proto.structs.labtesting.Subjective.TasteNote.CITRUS);

goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'PINE',
  proto.structs.labtesting.Subjective.TasteNote.PINE);

goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'FRUIT',
  proto.structs.labtesting.Subjective.TasteNote.FRUIT);

goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'TROPICS',
  proto.structs.labtesting.Subjective.TasteNote.TROPICS);
goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'FLORAL',
  proto.structs.labtesting.Subjective.TasteNote.FLORAL);

goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'HERB',
  proto.structs.labtesting.Subjective.TasteNote.HERB);

goog.exportProperty(
  bloombox.testing.subjective.TasteNote,
  'EARTH',
  proto.structs.labtesting.Subjective.TasteNote.EARTH);
