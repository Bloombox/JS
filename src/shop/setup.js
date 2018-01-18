
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
 * Bloombox Shop: Setup
 *
 * @fileoverview Provides routines called during page setup for use of the
 * Bloombox Shop API.
 */

/*global goog */

goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

// - Base
goog.require('bloombox.shop.DEBUG');
goog.require('bloombox.shop.SHOP_API_ENDPOINT');
goog.require('bloombox.shop.VERSION');

// - Shop Library
goog.require('bloombox.shop.enroll.Enrollment');
goog.require('bloombox.shop.info');
goog.require('bloombox.shop.order.Order');
goog.provide('bloombox.shop.setup');
goog.require('bloombox.shop.verify');
goog.require('bloombox.shop.zipcheck');


/**
 * Setup the Bloombox Shop API. Provide your API key and an endpoint if you
 * would like to override the default (most users should not need to).
 *
 * @param {string} partner Partner code to use.
 * @param {string} location Location code to use.
 * @param {string} apikey API key to use.
 * @param {function()} callback Callback dispatched when the Shop API is ready.
 * @param {string=} endpoint Override for endpoint. Uses default if unspecified.
 * @export
 */
bloombox.shop.setup = function(partner, location, apikey, callback, endpoint) {
  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  let config = bloombox.config.active();
  let merged = /** @type {bloombox.config.JSConfig} */ (
    Object.assign({}, config, {'endpoints':
      Object.assign({}, config.endpoints || {}, {
        shop: endpoint || bloombox.shop.SHOP_API_ENDPOINT})}));

  bloombox.config.configure(merged);

  bloombox.logging.log('Shop is ready for use.',
    {'version': bloombox.shop.VERSION,
      'debug': bloombox.shop.DEBUG,
      'config': bloombox.config.active()});
  callback();
};
