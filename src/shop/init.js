
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
 * Bloombox Shop: Setup
 *
 * @fileoverview Provides routines called during page setup for use of the
 * Bloombox Shop API.
 */

/*global goog */

goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

goog.require('bloombox.shop.DEBUG');
goog.require('bloombox.shop.VERSION');

goog.require('bloombox.shop.v1.Service');

goog.provide('bloombox.shop.api');


/**
 * Cached copy of the current Menu API implementation object.
 *
 * @package
 * @nocollapse
 * @type {?bloombox.shop.ShopAPI}
 */
let cachedShopService = null;


/**
 * Resolve a service implementation for the Shop API, which provides information
 * about the currently-configured partnership scope's shop, including status and
 * contact info, ordering, and user verification.
 *
 * @export
 * @param {{beta: boolean, cache: boolean}=} apiConfig API options to pass.
 * @return {bloombox.shop.ShopAPI} Shop API service implementation instance.
 */
bloombox.shop.api = function(apiConfig) {
  if (!cachedShopService || (apiConfig && apiConfig['cache'] === false)) {
    let config = bloombox.config.active();
    cachedShopService = new bloombox.shop.v1.Service(config);
  }
  return /** @type {bloombox.shop.ShopAPI} */ (cachedShopService);
};
