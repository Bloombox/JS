
/*
 * Copyright 2017, Bloombox, LLC.
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
 * Bloombox Products: Species
 *
 * @fileoverview Enumerates product species types.
 */

goog.require('proto.structs.Species');

goog.provide('bloombox.product.Species');


// -- Species -- //
/**
 * Product species types.
 *
 * @export
 * @enum {proto.structs.Species}
 */
bloombox.product.Species = {
  'UNSPECIFIED': proto.structs.Species.UNSPECIFIED,
  'SATIVA': proto.structs.Species.SATIVA,
  'HYBRID_SATIVA': proto.structs.Species.HYBRID_SATIVA,
  'HYBRID': proto.structs.Species.HYBRID,
  'HYBRID_INDICA': proto.structs.Species.HYBRID_INDICA,
  'INDICA': proto.structs.Species.INDICA
};
