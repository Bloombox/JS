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
 * Bloombox Telemetry Context: Collections
 *
 * @fileoverview Provides structures for modeling event collections.
 */

/*global goog */

goog.provide('bloombox.telemetry.Collection');

goog.require('bloombox.util.Exportable');
goog.require('bloombox.util.Serializable');
goog.require('bloombox.util.b64');

goog.require('proto.bloombox.analytics.context.Collection');


// - Event Collections - //
/**
 * Named event collection.
 *
 * @param {string} name Name for this collection.
 * @param {boolean=} opt_skipb64encode Whether to skip base64 encoding. Pass as
 *        truthy when the collection name is already base64 encoded.
 * @constructor
 * @implements {bloombox.util.Exportable<proto.bloombox.analytics.context.Collection>}
 * @implements {bloombox.util.Serializable}
 * @export
 */
bloombox.telemetry.Collection = function Collection(name, opt_skipb64encode) {
  /**
   * Name for this collection.
   *
   * @type {string}
   * @public
   * @const
   */
  this.name = opt_skipb64encode ? name : bloombox.util.b64.encode(name);
};


/**
 * Static method to construct a `Collection` with an arbitrary string name.
 *
 * @param {string} name Name for this collection.
 * @return {bloombox.telemetry.Collection} Constructed collection.
 * @export
 */
bloombox.telemetry.Collection.named = function(name) {
  return new bloombox.telemetry.Collection(name);
};


/**
 * Export this `Collection` as an `analytics.Collection` message.
 *
 * @override
 * @return {proto.bloombox.analytics.context.Collection} JS PB message.
 */
bloombox.telemetry.Collection.prototype.export = function() {
  let collection = new proto.bloombox.analytics.context.Collection();
  collection.setName(this.name);
  return collection;
};


/**
 * Render this collection object into a JSON-serializable structure suitable for
 * use over-the-wire.
 *
 * @override
 * @return {Object}
 * @public
 */
bloombox.telemetry.Collection.prototype.serialize = function() {
  return {
    'name': this.name
  };
};
