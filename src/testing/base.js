
/**
 * Bloombox Testing: Base
 *
 * @fileoverview Product lab testing tools and structures.
 */

goog.require('proto.structs.labtesting.CannabinoidRatio');

goog.provide('bloombox.testing.CannabinoidRatio');


// -- Cannabinoid Ratio -- //
/**
 * THC to CBD cannabinoid ratio.
 *
 * @export
 * @enum {proto.structs.labtesting.CannabinoidRatio}
 */
bloombox.testing.CannabinoidRatio = {
  'NO_CANNABINOID_PREFERENCE': (
    proto.structs.labtesting.CannabinoidRatio.NO_CANNABINOID_PREFERENCE),
  'THC_ONLY': (
    proto.structs.labtesting.CannabinoidRatio.THC_ONLY),
  'THC_OVER_CBD': (
    proto.structs.labtesting.CannabinoidRatio.THC_OVER_CBD),
  'EQUAL': (
    proto.structs.labtesting.CannabinoidRatio.EQUAL),
  'CBD_OVER_THC': (
    proto.structs.labtesting.CannabinoidRatio.THC_ONLY),
  'CBD_ONLY': (
    proto.structs.labtesting.CannabinoidRatio.CBD_ONLY)
};
