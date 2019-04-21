
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
 * Bloombox Telemetry: Opt-Out
 *
 * @fileoverview Provides an API to opt-out of telemetry data transmission.
 */

/*global goog */

goog.require('bloombox.logging.warn');

goog.provide('bloombox.telemetry.SESSION_STORAGE_OPTOUT_KEY');
goog.provide('bloombox.telemetry.didOptOut');
goog.provide('bloombox.telemetry.optout');


/**
 * Session-storage key to look for to indicate whether a user has already opted-
 * out of telemetry data transmission.
 *
 * @const {string}
 * @package
 */
bloombox.telemetry.SESSION_STORAGE_OPTOUT_KEY = 'bb:1:t:opt_out';


/**
 * Package-exposed function to check the local opt-out state.
 *
 * @package
 * @return {boolean} Opt-out status. True if the user has opted out.
 */
bloombox.telemetry.didOptOut = function() {
  let value = (
    window.sessionStorage
      .getItem(bloombox.telemetry.SESSION_STORAGE_OPTOUT_KEY));
  return value === 'true';
};


/**
 * Publicly-exposed function to opt-out of telemetry data transmission.
 *
 * @export
 */
bloombox.telemetry.optout = function() {
  bloombox.logging.warn('Opted-out of telemetry transmission.');
  window.sessionStorage
      .setItem(bloombox.telemetry.SESSION_STORAGE_OPTOUT_KEY, 'false');
};
