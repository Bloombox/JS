
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
 * Bloombox Telemetry: RPC Pool
 *
 * @fileoverview Provides RPC tools for managing a pool of XHRs.
 */

/*global goog */

goog.require('bloombox.rpc.ACCEPT_HEADER_VALUE');

goog.require('bloombox.util.HTTPMethod');

goog.require('goog.structs.Map');

goog.provide('bloombox.telemetry.TelemetryEndpoint');
goog.provide('bloombox.telemetry.TelemetryEndpointRenderer');
goog.provide('bloombox.telemetry.TelemetryHTTPMethod');
goog.provide('bloombox.telemetry.internals.HTTP_HEADERS');


// - Headers - //
/**
 * HTTP Headers to apply to telemetry RPCs.
 *
 * @type {goog.structs.Map}
 * @package
 */
bloombox.telemetry.internals.HTTP_HEADERS = new goog.structs.Map({
  'Accept': bloombox.rpc.ACCEPT_HEADER_VALUE
});


// - Methods - //
/**
 * Map of RPC routines to their corresponding HTTP method.
 *
 * @enum {bloombox.util.HTTPMethod}
 */
bloombox.telemetry.TelemetryHTTPMethod = {
  'PING': bloombox.util.HTTPMethod.GET,
  'EVENT': bloombox.util.HTTPMethod.POST,
  'EXCEPTION': bloombox.util.HTTPMethod.POST,
  'SECTION_IMPRESSION': bloombox.util.HTTPMethod.GET,
  'SECTION_VIEW': bloombox.util.HTTPMethod.GET,
  'SECTION_ACTION': bloombox.util.HTTPMethod.GET,
  'PRODUCT_IMPRESSION': bloombox.util.HTTPMethod.GET,
  'PRODUCT_VIEW': bloombox.util.HTTPMethod.GET,
  'PRODUCT_ACTION': bloombox.util.HTTPMethod.GET,
  'USER_ACTION': bloombox.util.HTTPMethod.GET,
  'ORDER_ACTION': bloombox.util.HTTPMethod.GET
};


// - Endpoints - //
/**
 * Specifies a function that can render an endpoint.
 *
 * @typedef {function(bloombox.telemetry.Context): string}
 */
bloombox.telemetry.TelemetryEndpointRenderer;


/**
 * Map of RPC routines to their respective endpoint renderer functions.
 *
 * @enum {bloombox.telemetry.TelemetryEndpointRenderer}
 */
bloombox.telemetry.TelemetryEndpoint = {
  'PING': () => 'ping',
  'EVENT': (context) => `${context.getCollection().getName()}:event`,
  'BATCH': (context) => 'events:batch',
  'EXCEPTION': (context) => `${context.getCollection().getName()}:error`
};
