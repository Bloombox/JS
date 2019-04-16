
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
 * Bloombox: Menu Client v2
 *
 * @fileoverview Provides an implementation of the Menu API.
 */

goog.provide('bloombox.menu.v1beta1.DEBUG');
goog.provide('bloombox.menu.v1beta1.VERSION');

goog.require('proto.bloombox.services.menu.v1beta1.MenuClient');



/**
 * Menu client debug flag.
 *
 * @const {boolean} bloombox.menu.DEBUG Global switch for logging and other
 *        debug features.
 * @public
 */
bloombox.menu.v1beta1.DEBUG = true;


/**
 * Menu client library version.
 *
 * @const {string} bloombox.menu.VERSION Menu client version string.
 * @export
 */
bloombox.menu.v1beta1.VERSION = 'v1beta1r2';
