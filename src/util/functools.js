
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
 * Bloombox Utils: Function Tools
 *
 * @fileoverview Provides tools for working with functions.
 */

/*global goog */

goog.provide('bloombox.util.debounced');


/**
 * Debounce-protect a function according to a time interval, expressed in
 * milliseconds.
 *
 * Underscore.js defines a debouncer as:
 * "Returns a function, that, as long as it continues to be invoked, wil not be
 * triggered. The function will be called after it stops being called for N
 * milliseconds. If `opt_immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing."
 *
 * @param {number} interval Wait interval for the debouncer.
 * @param {function()} fn Function to debounce.
 * @param {boolean=} opt_immediate Dispatch on the leading edge if truthy.
 * @return {function()} Debounced function.
 */
bloombox.util.debounced = function(interval, fn, opt_immediate) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (opt_immediate) fn.apply(context, args);
    };
    let callNow = opt_immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, interval);
    if (callNow) fn.apply(context, args);
  };
};
