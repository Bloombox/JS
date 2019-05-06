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
 * Bloombox Menu: Setup
 *
 * @fileoverview Provides routines called during page setup for use of the
 * Bloombox Menu API.
 */

/*global goog */

goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

goog.require('bloombox.menu.DEBUG');
goog.require('bloombox.menu.MenuAPI');
goog.require('bloombox.menu.VERSION');

goog.require('bloombox.menu.v1beta1.LocalService');
goog.require('bloombox.menu.v1beta1.RemoteService');

// - Menu API
goog.provide('bloombox.menu.api');


/**
 * Cached copy of the current Menu API implementation object.
 *
 * @package
 * @nocollapse
 * @type {?bloombox.menu.MenuAPI}
 */
let cachedMenuService = null;


/**
 * Return an instance of the Menu API, based on current browser agent support
 * for underlying features. The resulting object, which is an instance complying
 * with the interface `bloombox.menu.MenuAPI`, can be used to fetch catalog data
 * or individual product data from Bloombox.
 *
 * @export
 * @param {{beta: boolean, cache: boolean}=} apiConfig API configuration.
 * @return {bloombox.menu.MenuAPI} Menu API service implementation instance.
 */
bloombox.menu.api = function(apiConfig) {
  // for now, create v1beta0 adapter, always
  if (!cachedMenuService || (apiConfig && apiConfig['cache'] === false)) {
    let config = bloombox.config.active();
    let remoteMenuService = new bloombox.menu.v1beta1.RemoteService(config);
    cachedMenuService = new bloombox.menu.v1beta1.LocalService(
      remoteMenuService);
  }
  return /** @type {bloombox.menu.MenuAPI} */ (cachedMenuService);
};
