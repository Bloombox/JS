
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
 * Bloombox Menu: Sections
 *
 * @fileoverview Enumerates menu sections.
 */

goog.require('proto.products.menu.section.Section');

goog.provide('bloombox.menu.Section');


// -- Menu Sections -- //
/**
 * Menu sections.
 *
 * @export
 * @enum {proto.products.menu.section.Section}
 */
bloombox.menu.Section = {
  /**
   * Unspecified menu section, used when a code is not recognized, and as the
   * designated default value.
   */
  'UNSPECIFIED': proto.products.menu.section.Section.UNSPECIFIED,

  /**
   * Flowers, or traditional cannabis buds.
   */
  'FLOWERS': proto.products.menu.section.Section.FLOWERS,

  /**
   * Extracted cannabis products, like oils, waxes, kief, live rosin, and so on.
   */
  'EXTRACTS': proto.products.menu.section.Section.EXTRACTS,

  /**
   * Food products with cannabis, including beverages, candy, baked goods, and
   * chocolates.
   */
  'EDIBLES': proto.products.menu.section.Section.EDIBLES,

  /**
   * Cannabis cartridge and pen products.
   */
  'CARTRIDGES': proto.products.menu.section.Section.CARTRIDGES,

  /**
   * Tinctures, capsules, and other drugstore-style products.
   */
  'APOTHECARY': proto.products.menu.section.Section.APOTHECARY,

  /**
   * Pre-rolled or pre-made joints, blunts, and so on.
   */
  'PREROLLS': proto.products.menu.section.Section.PREROLLS,

  /**
   * Live plants, clones, and seeds.
   */
  'PLANTS': proto.products.menu.section.Section.PLANTS,

  /**
   * General merchandise category, for products that do not contain cannabis.
   * This would include consumption implements, apparel, and general branded
   * retail merchandise.
   */
  'MERCHANDISE': proto.products.menu.section.Section.MERCHANDISE
};
