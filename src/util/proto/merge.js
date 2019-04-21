
/*
 * Copyright 2019, Momentum Ideas, Co.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox Utils: Protobuf
 *
 * @fileoverview Provides tools and utilities related to protobuf messages.
 */

/*global goog */

goog.require('goog.asserts');
goog.require('jspb.Message');

goog.provide('bloombox.util.proto.merge');


// - Interface: Exportable - //
/**
 * Merge to protobuf message objects of the same type, by copying the `to`
 * message, and then:
 * - Copying all set properties from `to` into the copy
 * - Copying all set properties from `from` into the copy
 *
 * Both types must extend `jspb.Message`. A message of the same type will be
 * returned.
 *
 * This function partially follows protobuf merge semantics,
 * which are defined as follows:
 * "Singular fields that are set in the specified message overwrite the
 *  corresponding fields in the current message. Repeated fields are appended.
 *  Singular sub-messages and groups are recursively merged."
 *  - Protocol Buffer docs for Python
 *    https://developers.google.com/protocol-buffers/docs/reference/python/google.protobuf.message.Message-class#MergeFrom
 *
 * The only difference being, repeated fields overwrite instead of being
 * appended-to, to avoid needing reflection at runtime.
 *
 * @template T
 * @param {T} fromMessage Message that should win when fields collide.
 * @param {T} toMessage Message that should lose when fields collide.
 * @return {T} Merged message, described as above.
 */
bloombox.util.proto.merge = function(fromMessage, toMessage) {
  // Type checks
  goog.asserts.assertInstanceof(fromMessage, jspb.Message);
  goog.asserts.assertInstanceof(toMessage, jspb.Message);
  goog.asserts.assert(fromMessage.constructor === toMessage.constructor,
    'Merge source and target should have the same type.');

  // Serialize the source message into an array.
  let from = fromMessage.toArray();

  if (from.length === 0)
    // We can just return the `to`, there is nothing to merge.
    return toMessage;

  let toClone = jspb.Message.clone(toMessage);
  let to = toClone.toArray();

  let i;
  let fromValue;

  // Copy each item from the `from` to the `to`. Protobuf preserves order in
  // `toArray`, enabling this behavior. We're intentionally not truncating the
  // target message, because we're merging, not making a clone.
  for (i = 0; i < from.length; i++) {
    fromValue = from[i];

    if (fromValue !== undefined) {
      // we have a value to merge in
      to[i] = fromValue;
    } else {
      // the field is undefined in the merge-from, so skip it
    }
  }
  return toClone;
};
