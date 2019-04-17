
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
 * Bloombox: Services
 *
 * @fileoverview Provides base tools for service definitions.
 */

/*global goog */

goog.provide('bloombox.base.ServiceInterface');


/**
 * Defines a generic interface that service definitions must comply with, so
 * that they may be dealt with in a generic fashion (instance management and
 * so on).
 *
 * @interface
 */
bloombox.base.ServiceInterface = class ServiceInterface {
  /**
   * Defines the name of this service. A short string should be returned, which
   * is unique among the full set of services, and can be used for dispatch.
   *
   * @public
   * @returns {string} Name of this service.
   */
  name() {}

  /**
   * Defines the version of this service. Two services of the same name with
   * different versions may be incompatible.
   *
   * @public
   * @returns {string} Version for this service.
   */
  version() {}

  /**
   * Retrieve an instance of this service, pre-configured to work with remote
   * RPC services via Bloombox Cloud.
   *
   * @returns {bloombox.base.ServiceInterface} Service definition.
   */
  static instance() {}
};
