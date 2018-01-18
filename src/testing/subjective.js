
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
 * Bloombox Testing: Subjective
 *
 * @fileoverview User-subjective testing.
 */

goog.require('proto.structs.labtesting.Feeling');
goog.require('proto.structs.labtesting.PotencyEstimate');
goog.require('proto.structs.labtesting.TasteNote');

goog.provide('bloombox.testing.subjective.Feeling');
goog.provide('bloombox.testing.subjective.PotencyEstimate');
goog.provide('bloombox.testing.subjective.TasteNote');


// -- Feelings -- //
/**
 * Subjective feelings experienced during testing.
 *
 * @export
 * @enum {proto.structs.labtesting.Feeling}
 */
bloombox.testing.subjective.Feeling = {
  'NO_FEELING_PREFERENCE': (
    proto.structs.labtesting.Feeling.NO_FEELING_PREFERENCE),
  'GROUNDING': proto.structs.labtesting.Feeling.GROUNDING,
  'SLEEP': proto.structs.labtesting.Feeling.SLEEP,
  'CALMING': proto.structs.labtesting.Feeling.CALMING,
  'STIMULATING': proto.structs.labtesting.Feeling.STIMULATING,
  'FUNNY': proto.structs.labtesting.Feeling.FUNNY,
  'FOCUS': proto.structs.labtesting.Feeling.FOCUS,
  'PASSION': proto.structs.labtesting.Feeling.PASSION
};


// -- Potency Estimate -- //
/**
 * General potency level estimate.
 *
 * @export
 * @enum {proto.structs.labtesting.PotencyEstimate}
 */
bloombox.testing.subjective.PotencyEstimate = {
  'LIGHT': proto.structs.labtesting.PotencyEstimate.LIGHT,
  'MEDIUM': proto.structs.labtesting.PotencyEstimate.MEDIUM,
  'HEAVY': proto.structs.labtesting.PotencyEstimate.HEAVY,
  'SUPER': proto.structs.labtesting.PotencyEstimate.SUPER
};


// -- Taste Notes -- //
/**
 * Aroma and flavor notes.
 *
 * @export
 * @enum {proto.structs.labtesting.TasteNote}
 */
bloombox.testing.subjective.TasteNote = {
  'NO_TASTE_PREFERENCE': (
    proto.structs.labtesting.TasteNote.NO_TASTE_PREFERENCE),
  'SWEET': proto.structs.labtesting.TasteNote.SWEET,
  'SOUR': proto.structs.labtesting.TasteNote.SOUR,
  'SPICE': proto.structs.labtesting.TasteNote.SPICE,
  'SMOOTH': proto.structs.labtesting.TasteNote.SMOOTH,
  'CITRUS': proto.structs.labtesting.TasteNote.CITRUS,
  'PINE': proto.structs.labtesting.TasteNote.PINE,
  'FRUIT': proto.structs.labtesting.TasteNote.FRUIT,
  'TROPICS': proto.structs.labtesting.TasteNote.TROPICS,
  'FLORAL': proto.structs.labtesting.TasteNote.FLORAL,
  'HERB': proto.structs.labtesting.TasteNote.HERB,
  'EARTH': proto.structs.labtesting.TasteNote.EARTH
};
