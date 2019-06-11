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
 * Bloombox JS: Init
 *
 * @fileoverview Initial boot code for Bloombox JS.
 */

/*global goog */

goog.provide('bloombox.DEBUG');
goog.provide('bloombox.DEBUG_PROPERTY');
goog.provide('bloombox.INTERNAL');
goog.provide('bloombox.SERVICE_MODE');
goog.provide('bloombox.VARIANT');
goog.provide('bloombox.VERSION');


/**
 * Global debug flag.
 *
 * @define {boolean} bloombox.DEBUG Debug flag for global debugging.
 *         features.
 * @export
 */
bloombox.DEBUG = goog.define('bloombox.DEBUG', goog.DEBUG);


/**
 * Service mode. One of 'binary' or 'text'.
 *
 * @define {string} bloombox.SERVICE_MODE Mode for services: text or binary.
 */
bloombox.SERVICE_MODE = goog.define('bloombox.SERVICE_MODE', 'binary');


/**
 * Property to look for global debug status on the window.
 *
 * @define {string} bloombox.DEBUG_PROPERTY Property to examine on the window
 *         for global debug status opt-in.
 * @public
 */
bloombox.DEBUG_PROPERTY = goog.define('bloombox.DEBUG_PROPERTY', '__debug__');


/**
 * Global library version.
 *
 * @define {string} bloombox.VERSION Version for library.
 * @export
 */
bloombox.VERSION = goog.define('bloombox.VERSION', 'v2.1.1-rc1');


/**
 * Global library variant.
 *
 * @define {string} bloombox.VARIANT Global variant string.
 * @export
 */
bloombox.VARIANT = goog.define('bloombox.VARIANT', 'full');


/**
 * Internal build status. Set to true when building within the Bloombox Platform
 * codebase tree.
 *
 * @define {boolean} bloombox.INTERNAL Internal flag.
 * @export
 */
bloombox.INTERNAL = goog.define('bloombox.INTERNAL', false);
