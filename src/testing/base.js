
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
 * Bloombox Testing: Base
 *
 * @fileoverview Product lab testing tools and structures.
 */

goog.require('proto.opencannabis.structs.labtesting.CannabinoidRatio');

goog.provide('bloombox.testing.CannabinoidRatio');


// -- Cannabinoid Ratio -- //
/**
 * THC to CBD cannabinoid ratio.
 *
 * @export
 * @enum {proto.opencannabis.structs.labtesting.CannabinoidRatio}
 */
bloombox.testing.CannabinoidRatio = {
  'NO_CANNABINOID_PREFERENCE': (
    proto.opencannabis.structs.labtesting.CannabinoidRatio
      .NO_CANNABINOID_PREFERENCE),
  'THC_ONLY': (
    proto.opencannabis.structs.labtesting.CannabinoidRatio.THC_ONLY),
  'THC_OVER_CBD': (
    proto.opencannabis.structs.labtesting.CannabinoidRatio.THC_OVER_CBD),
  'EQUAL': (
    proto.opencannabis.structs.labtesting.CannabinoidRatio.EQUAL),
  'CBD_OVER_THC': (
    proto.opencannabis.structs.labtesting.CannabinoidRatio.CBD_OVER_THC),
  'CBD_ONLY': (
    proto.opencannabis.structs.labtesting.CannabinoidRatio.CBD_ONLY)
};
