
/*
 * Copyright 2018, Bloombox, LLC. All rights reserved.
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
 * Bloombox Menu: Setup
 *
 * @fileoverview Provides routines called during page setup for use of the
 * Bloombox Menu API.
 */

/*global goog */

goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

// - Base
goog.require('bloombox.menu.DEBUG');
goog.require('bloombox.menu.MENU_API_ENDPOINT');
goog.require('bloombox.menu.VERSION');

// - Menu API
goog.require('bloombox.menu.retrieve');

goog.provide('bloombox.menu.setup');


/**
 * Setup the Bloombox Menu API. Provide your API key and an endpoint if you
 * would like to override the default (most users should not need to).
 *
 * @param {string} partner Partner code to use.
 * @param {string} location Location code to use.
 * @param {string} apikey API key to use.
 * @param {function()} callback Callback dispatched when the Menu API is ready.
 * @param {string=} endpoint Override for endpoint. Uses default if unspecified.
 * @export
 */
bloombox.menu.setup = function(partner, location, apikey, callback, endpoint) {
  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  let config = bloombox.config.active();
  let merged = /** @type {bloombox.config.JSConfig} */ (
    Object.assign({}, config, {'endpoints':
        Object.assign({}, config.endpoints || {}, {
          menu: endpoint || bloombox.menu.MENU_API_ENDPOINT})}));

  bloombox.config.configure(merged);

  bloombox.logging.log('Menu is ready for use.',
    {'version': bloombox.menu.VERSION,
      'debug': bloombox.menu.DEBUG,
      'config': bloombox.config.active()});
  callback();
};
