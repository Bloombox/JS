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
 * Bloombox: Commercial Telemetry API
 *
 * @fileoverview Provides interface definitions for commercial events, such as
 *               impressions, views, and actions, as part of the Telemetry API.
 */

/*global goog */

goog.require('bloombox.base.ServiceInterface');
goog.require('bloombox.rpc.ScopedOptions');
goog.require('bloombox.telemetry.TelemetryConfig');
goog.require('bloombox.telemetry.TelemetryOptions');



// -- API Surface -- //
/**
 * Defines the surface of the Commercial Telemetry API, which is responsible for
 * relaying events with commercial/retail significance, including product events
 * like impressions, views, and actions made by the user. For example, a web
 * order with 2 items might account for hundreds of events of different types
 * from this API:
 *
 * - All the products and sections the user saw but didn't select (impressions)
 * - The products viewed by the user while they decided what to buy (views)
 * - Adding products to the card, adjusting them, removing them (actions)
 * - Signing up and verifying their membership (actions)
 * - Submitting the order and completing purchase (actions)
 *
 * The above events are distinguished by their "commercial scope," which is a
 * value that defines the section, product, or order upon which the action is
 * taking place. The commercial and partnership scopes, subject event (can be
 * an impression, view, or action), and general event context are all defined
 * by the invoking code. Contextual payloads are included with every event.
 *
 * @interface
 * @extends bloombox.base.ServiceInterface
 */
bloombox.telemetry.CommercialTelemetryAPI = (class CommercialTelemetry {
});
