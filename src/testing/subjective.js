
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
 * Bloombox Testing: Subjective
 *
 * @fileoverview User-subjective testing.
 */

goog.require('proto.opencannabis.structs.labtesting.Feeling');
goog.require('proto.opencannabis.structs.labtesting.PotencyEstimate');
goog.require('proto.opencannabis.structs.labtesting.TasteNote');

goog.provide('bloombox.testing.subjective.Feeling');
goog.provide('bloombox.testing.subjective.PotencyEstimate');
goog.provide('bloombox.testing.subjective.TasteNote');


// -- Feelings -- //
/**
 * Subjective feelings experienced during testing.
 *
 * @export
 * @enum {proto.opencannabis.structs.labtesting.Feeling}
 */
bloombox.testing.subjective.Feeling = {
  'NO_FEELING_PREFERENCE': (
    proto.opencannabis.structs.labtesting.Feeling.NO_FEELING_PREFERENCE),
  'GROUNDING': proto.opencannabis.structs.labtesting.Feeling.GROUNDING,
  'SLEEP': proto.opencannabis.structs.labtesting.Feeling.SLEEP,
  'CALMING': proto.opencannabis.structs.labtesting.Feeling.CALMING,
  'STIMULATING': proto.opencannabis.structs.labtesting.Feeling.STIMULATING,
  'FUNNY': proto.opencannabis.structs.labtesting.Feeling.FUNNY,
  'FOCUS': proto.opencannabis.structs.labtesting.Feeling.FOCUS,
  'PASSION': proto.opencannabis.structs.labtesting.Feeling.PASSION
};


// -- Potency Estimate -- //
/**
 * General potency level estimate.
 *
 * @export
 * @enum {proto.opencannabis.structs.labtesting.PotencyEstimate}
 */
bloombox.testing.subjective.PotencyEstimate = {
  'LIGHT': proto.opencannabis.structs.labtesting.PotencyEstimate.LIGHT,
  'MEDIUM': proto.opencannabis.structs.labtesting.PotencyEstimate.MEDIUM,
  'HEAVY': proto.opencannabis.structs.labtesting.PotencyEstimate.HEAVY,
  'SUPER': proto.opencannabis.structs.labtesting.PotencyEstimate.SUPER
};


// -- Taste Notes -- //
/**
 * Aroma and flavor notes.
 *
 * @export
 * @enum {proto.opencannabis.structs.labtesting.TasteNote}
 */
bloombox.testing.subjective.TasteNote = {
  'NO_TASTE_PREFERENCE': (
    proto.opencannabis.structs.labtesting.TasteNote.NO_TASTE_PREFERENCE),
  'SWEET': proto.opencannabis.structs.labtesting.TasteNote.SWEET,
  'SOUR': proto.opencannabis.structs.labtesting.TasteNote.SOUR,
  'SPICE': proto.opencannabis.structs.labtesting.TasteNote.SPICE,
  'SMOOTH': proto.opencannabis.structs.labtesting.TasteNote.SMOOTH,
  'CITRUS': proto.opencannabis.structs.labtesting.TasteNote.CITRUS,
  'PINE': proto.opencannabis.structs.labtesting.TasteNote.PINE,
  'FRUIT': proto.opencannabis.structs.labtesting.TasteNote.FRUIT,
  'TROPICS': proto.opencannabis.structs.labtesting.TasteNote.TROPICS,
  'FLORAL': proto.opencannabis.structs.labtesting.TasteNote.FLORAL,
  'HERB': proto.opencannabis.structs.labtesting.TasteNote.HERB,
  'EARTH': proto.opencannabis.structs.labtesting.TasteNote.EARTH
};
