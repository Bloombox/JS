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
 * Bloombox JS: DB Init
 *
 * @fileoverview Initialization code for the JS storage layer.
 */

/*global goog */

goog.require('goog.storage.mechanism.IterableMechanism');
goog.require('goog.storage.mechanism.mechanismfactory');

goog.provide('bloombox.storage.resolve');
goog.provide('bloombox.storage.session');


/**
 * Resolve session-style ephemeral storage, if possible, in the local browser
 * environment. Optionally apply a string namespace before any keys we interact
 * with to prevent collisions.
 *
 * @param {string=} opt_namespace Namespace to apply to keys. Optional.
 * @return {?goog.storage.mechanism.IterableMechanism} Storage mechanism object.
 */
bloombox.storage.session = function(opt_namespace) {
  return goog.storage.mechanism.mechanismfactory.createHTML5SessionStorage(
    opt_namespace);
};


/**
 * Resolve a storage stub, implemented with whatever logic is appropriate for
 * the current browser. This kind of storage is simple `K=>V`-style and should
 * not be used for large amounts of data.
 *
 * @param {string=} opt_namespace Namespace to prefix keys with. Prevents key
 *        collisions in storage. Optional.
 * @param {?boolean=} opt_ephemeral If passed as true, attempts to return a
 *        storage mechanism for ephemeral data (for instance, session storage).
 * @return {goog.storage.mechanism.IterableMechanism} Storage mechanism object.
 */
bloombox.storage.resolve = function(opt_namespace, opt_ephemeral) {
  if (opt_ephemeral) {
    const ephemeral = bloombox.storage.session(opt_namespace);
    if (ephemeral)
      return ephemeral;
  }
  return goog.storage.mechanism.mechanismfactory.create(opt_namespace);
};
