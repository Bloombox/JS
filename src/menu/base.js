/*
 * Copyright 2019, Momentum Ideas, Co. All rights reserved.
 *
 * Source and object computer code contained herein is the private intellectual
 * property of Bloombox, a California Limited Liability Corporation. Use of this
 * code in source form requires permission in writing before use or the
 * assembly, distribution, or publishing of derivative works, for commercial
 * purposes or any other purpose, from a duly authorized officer of Momentum
 * Ideas Co.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox: Menu Client
 *
 * @fileoverview Provides the Bloombox menu client.
 */

/*global goog */

goog.provide('bloombox.menu.DEBUG');
goog.provide('bloombox.menu.MENU_API_ENDPOINT');
goog.provide('bloombox.menu.MENU_API_VERSION');
goog.provide('bloombox.menu.VERSION');

goog.provide('bloombox.menu.v1beta1.DEBUG');
goog.provide('bloombox.menu.v1beta1.VERSION');

goog.require('bloombox.API_ENDPOINT');
goog.require('bloombox.DEBUG');
goog.require('bloombox.VERSION');



/**
 * Menu client debug flag.
 *
 * @const {boolean} bloombox.menu.DEBUG Global switch for logging and other
 *        debug features.
 * @public
 */
bloombox.menu.DEBUG = true;


/**
 * Menu client library version.
 *
 * @const {string} bloombox.menu.VERSION Menu client version string.
 * @export
 */
bloombox.menu.VERSION = 'v1beta1';


/**
 * Menu API endpoint prefix.
 *
 * @define {string} bloombox.menu.MENU_API_ENDPOINT Prefix for API interactions.
 * @public
 */
bloombox.menu.MENU_API_ENDPOINT = bloombox.API_ENDPOINT;


/**
 * Menu API version.
 *
 * @define {string} bloombox.menu.MENU_API_VERSION Version of the API to use.
 * @public
 */
bloombox.menu.MENU_API_VERSION = 'v1beta1';
