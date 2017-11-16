
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
 * @typedef {proto.products.menu.section.Section}
 */
bloombox.menu.Section = {
  'FLOWERS': proto.products.menu.section.Section.FLOWERS,
  'EXTRACTS': proto.products.menu.section.Section.EXTRACTS,
  'EDIBLES': proto.products.menu.section.Section.EDIBLES,
  'CARTRIDGES': proto.products.menu.section.Section.CARTRIDGES,
  'APOTHECARY': proto.products.menu.section.Section.APOTHECARY,
  'PREROLLS': proto.products.menu.section.Section.PREROLLS,
  'PLANTS': proto.products.menu.section.Section.PLANTS,
  'MERCHANDISE': proto.products.menu.section.Section.MERCHANDISE
};

goog.exportSymbol('bloombox.menu.Section',
  proto.products.menu.section.Section);

goog.exportProperty(
  bloombox.menu.Section,
  'FLOWERS',
  proto.products.menu.section.Section.FLOWERS);

goog.exportProperty(
  bloombox.menu.Section,
  'EXTRACTS',
  proto.products.menu.section.Section.EXTRACTS);

goog.exportProperty(
  bloombox.menu.Section,
  'EDIBLES',
  proto.products.menu.section.Section.EDIBLES);

goog.exportProperty(
  bloombox.menu.Section,
  'CARTRIDGES',
  proto.products.menu.section.Section.CARTRIDGES);

goog.exportProperty(
  bloombox.menu.Section,
  'APOTHECARY',
  proto.products.menu.section.Section.APOTHECARY);

goog.exportProperty(
  bloombox.menu.Section,
  'PREROLLS',
  proto.products.menu.section.Section.PREROLLS);

goog.exportProperty(
  bloombox.menu.Section,
  'PLANTS',
  proto.products.menu.section.Section.PLANTS);

goog.exportProperty(
  bloombox.menu.Section,
  'MERCHANDISE',
  proto.products.menu.section.Section.MERCHANDISE);
