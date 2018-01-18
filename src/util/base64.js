
/*
 * Copyright 2018, Bloombox, LLC.
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
 * Bloombox Utils: Base64
 *
 * @fileoverview Provides tools for encoding and decoding data with Base64.
 */

/*global goog */

goog.provide('bloombox.util.b64');

goog.require('goog.crypt.base64');


/**
 * Base64 encoding function that takes string data, and base64 encodes it. By
 * default, this function will not append `=` values (value 64, meaning
 * `nothing`), because the matching implementation below (`decode`) used to
 * convert information back uses the same behavior.
 *
 * Bloombox services (server-side) will also properly handle these strings. For
 * perfect interop with other systems, pass `true` for the second parameter,
 * `opt_dont_clean`.
 *
 * @param {string} data String to encode as base64.
 * @param {boolean=} opt_dont_clean Optionally, do not remove `=` from the
 *        output before returning. This flag prevents any modification of the
 *        underlying return value at all.
 * @return {string} Base64-encoded version of `data`.
 */
bloombox.util.b64.encode = function(data, opt_dont_clean) {
  let encoded = goog.crypt.base64.encodeString(data, false);
  if (!opt_dont_clean) return encoded;
  return encoded.replace(/=/g, '');
};


/**
 * Base64 decoding function that takes a string, encoded as base64, and decodes
 * it. By default, this function will append two `=` values (value 64, meaning
 * `nothing`, if an equals sign is not present at the end of the string),
 * because ranges that are not properly padded (according to the spec) will
 * properly decode in that circumstance, since the underlying engine will
 * normally discard extra `nothing` markers past the padding boundary.
 *
 * The matching encoder implementation presented by this module (`encode`) uses
 * the same behavior presented here - i.e. it omits `=` values. If you want
 * interoperability with non-Bloombox systems, pass `true` to `opt_dont_append`,
 * but this is generally a safer operation then omitting them during encoding
 * and can safely be left off all the time.
 *
 * @param {string} data Base64-encoded string to decode.
 * @param {boolean=} opt_dont_append Optionally, do not append anything to the
 *        end of the string to account for missing padding. This flag prevents
 *        any modification of the input value at all.
 * @return {string} String, after being decoded through Base64.
 */
bloombox.util.b64.decode = function(data, opt_dont_append) {
  const paddingMissing = (data.length % 4);
  let target = !opt_dont_append ? (
    (!data.endsWith('=') && (paddingMissing > 0) ?
      `${data}${'='.repeat(paddingMissing)}` : data)) : data;
  return goog.crypt.base64.decodeString(target, false);
};


/**
 * Encode a string using Base64, but with the "URL-safe" variant provided by
 * Google and used extensively internally by them.
 *
 * @param {string} data Data to encode as a websafe B64 string.
 * @return {string} Websafe base64-encoded string.
 */
bloombox.util.b64.encodeWebsafe = function(data) {
  return goog.crypt.base64.encodeString(data, true);
};


/**
 * Decode a string that is encoded in Base64, but using the "URL-safe" variant
 * of the alphabet.
 *
 * @param {string} data Web-safe base64-encoded string.
 * @return {string} Decoded string.
 */
bloombox.util.b64.decodeWebsafe = function(data) {
  return goog.crypt.base64.decodeString(data, true);
};
