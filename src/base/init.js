
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
 * Bloombox JS: Init
 *
 * @fileoverview Initial boot code for Bloombox JS.
 */

/*global goog */

goog.provide('bloombox.API_ENDPOINT');
goog.provide('bloombox.DEBUG');
goog.provide('bloombox.DEBUG_PROPERTY');
goog.provide('bloombox.INTERNAL');
goog.provide('bloombox.VERSION');


/**
 * Global debug flag.
 *
 * @define {boolean} DEBUG Debug flag for global debugging.
 *         features.
 * @export
 */
bloombox.DEBUG = true;


/**
 * Property to look for global debug status on the window.
 *
 * @define {string} DEBUG_PROPERTY Property to examine on the window for global
 *         debug status opt-in.
 * @public
 */
bloombox.DEBUG_PROPERTY = '__debug__';


/**
 * Global library version.
 *
 * @define {string} VERSION Version for library.
 * @export
 */
bloombox.VERSION = 'v1.0.0';


/**
 * Internal build status. Set to true when building within the Bloombox Platform
 * codebase tree.
 *
 * @define {boolean} INTERNAL Internal flag.
 * @export
 */
bloombox.INTERNAL = false;


/**
 * Global API endpoint.
 *
 * @define {string} API_ENDPOINT Global API endpoint.
 * @export
 */
bloombox.API_ENDPOINT = 'https://api.bloombox.cloud';
