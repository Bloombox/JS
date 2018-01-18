
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
 * Bloombox: Shop Client
 *
 * @fileoverview Provides the Bloombox shop client.
 */

/*global goog */

goog.provide('bloombox.shop.DEBUG');
goog.provide('bloombox.shop.SHOP_API_ENDPOINT');
goog.provide('bloombox.shop.SHOP_API_VERSION');
goog.provide('bloombox.shop.VERSION');

goog.require('bloombox.DEBUG');
goog.require('bloombox.VERSION');



/**
 * Shop client debug flag.
 *
 * @const {boolean} bloombox.shop.DEBUG Global switch for logging and other
 *        debug features.
 * @public
 */
bloombox.shop.DEBUG = bloombox.DEBUG;


/**
 * Shop client library version.
 *
 * @const {string} bloombox.shop.VERSION Shop client version string.
 * @export
 */
bloombox.shop.VERSION = 'v1r1';


/**
 * Shop API endpoint prefix.
 *
 * @define {string} bloombox.shop.SHOP_API_ENDPOINT Prefix for API interactions.
 * @public
 */
bloombox.shop.SHOP_API_ENDPOINT = 'https://shop.api.bloombox.cloud';


/**
 * Shop API version.
 *
 * @define {string} bloombox.shop.SHOP_API_VERSION Version of the API to use.
 * @public
 */
bloombox.shop.SHOP_API_VERSION = 'v1';
