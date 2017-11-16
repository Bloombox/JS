
/**
 * Bloombox Testing: Subjective
 *
 * @fileoverview User-subjective testing.
 */

goog.require('proto.structs.labtesting.Subjective.Feeling');
goog.require('proto.structs.labtesting.Subjective.PotencyEstimate');
goog.require('proto.structs.labtesting.Subjective.TasteNote');

goog.provide('bloombox.testing.subjective.Feeling');
goog.provide('bloombox.testing.subjective.PotencyEstimate');
goog.provide('bloombox.testing.subjective.TasteNote');


// -- Feelings -- //
goog.exportSymbol('bloombox.testing.subjective.Feeling',
  proto.structs.labtesting.Subjective.Feeling);

goog.exportSymbol('bloombox.testing.subjective.Feeling.GROUNDING',
  proto.structs.labtesting.Subjective.Feeling.GROUNDING);

goog.exportSymbol('bloombox.testing.subjective.Feeling.SLEEP',
  proto.structs.labtesting.Subjective.Feeling.SLEEP);

goog.exportSymbol('bloombox.testing.subjective.Feeling.CALMING',
  proto.structs.labtesting.Subjective.Feeling.CALMING);

goog.exportSymbol('bloombox.testing.subjective.Feeling.STIMULATING',
  proto.structs.labtesting.Subjective.Feeling.STIMULATING);

goog.exportSymbol('bloombox.testing.subjective.Feeling.FUNNY',
  proto.structs.labtesting.Subjective.Feeling.FUNNY);

goog.exportSymbol('bloombox.testing.subjective.Feeling.FOCUS',
  proto.structs.labtesting.Subjective.Feeling.FOCUS);

goog.exportSymbol('bloombox.testing.subjective.Feeling.PASSION',
  proto.structs.labtesting.Subjective.Feeling.PASSION);


// -- Potency Estimate -- //
goog.exportSymbol('bloombox.testing.subjective.PotencyEstimate',
  proto.structs.labtesting.Subjective.PotencyEstimate);

goog.exportSymbol('bloombox.testing.subjective.PotencyEstimate.LIGHT',
  proto.structs.labtesting.Subjective.PotencyEstimate.LIGHT);

goog.exportSymbol('bloombox.testing.subjective.PotencyEstimate.MEDIUM',
  proto.structs.labtesting.Subjective.PotencyEstimate.MEDIUM);

goog.exportSymbol('bloombox.testing.subjective.PotencyEstimate.HEAVY',
  proto.structs.labtesting.Subjective.PotencyEstimate.HEAVY);

goog.exportSymbol('bloombox.testing.subjective.PotencyEstimate.SUPER',
  proto.structs.labtesting.Subjective.PotencyEstimate.SUPER);


// -- Taste Notes -- //
goog.exportSymbol('bloombox.testing.subjective.TasteNote',
  proto.structs.labtesting.Subjective.TasteNote);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.SWEET',
  proto.structs.labtesting.Subjective.TasteNote.SWEET);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.SOUR',
  proto.structs.labtesting.Subjective.TasteNote.SOUR);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.SPICE',
  proto.structs.labtesting.Subjective.TasteNote.SPICE);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.SMOOTH',
  proto.structs.labtesting.Subjective.TasteNote.SMOOTH);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.CITRUS',
  proto.structs.labtesting.Subjective.TasteNote.CITRUS);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.PINE',
  proto.structs.labtesting.Subjective.TasteNote.PINE);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.FRUIT',
  proto.structs.labtesting.Subjective.TasteNote.FRUIT);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.TROPICS',
  proto.structs.labtesting.Subjective.TasteNote.TROPICS);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.FLORAL',
  proto.structs.labtesting.Subjective.TasteNote.FLORAL);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.HERB',
  proto.structs.labtesting.Subjective.TasteNote.HERB);

goog.exportSymbol('bloombox.testing.subjective.TasteNote.EARTH',
  proto.structs.labtesting.Subjective.TasteNote.EARTH);
