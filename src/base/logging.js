
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
 * Bloombox JS: Logging
 *
 * @fileoverview Provides logging tools.
 */

/*global goog */

goog.provide('bloombox.logging.error');
goog.provide('bloombox.logging.info');
goog.provide('bloombox.logging.log');
goog.provide('bloombox.logging.warn');

goog.require('bloombox.DEBUG');


/**
 * Send a log message to the console.
 *
 * @param {...*} var_args Arguments to log.
 * @public
 */
bloombox.logging.log = function(var_args) {
  if (bloombox.DEBUG)
    console.log.apply(console, ['[Bloombox]'].concat(Array.from(arguments)));
};


/**
 * Send an INFO-level message to the console.
 *
 * @param {...*} var_args Arguments to log.
 * @public
 */
bloombox.logging.info = function(var_args) {
  if (bloombox.DEBUG)
    console.info.apply(console, ['[Bloombox]'].concat(Array.from(arguments)));
};


/**
 * Send a WARN-level message to the console.
 *
 * @param {...*} var_args Arguments to log.
 * @public
 */
bloombox.logging.warn = function(var_args) {
  console.warn.apply(console, ['[Bloombox]'].concat(Array.from(arguments)));
};


/**
 * Send an ERROR-level message to the console.
 *
 * @param {...*} var_args Arguments to log.
 * @public
 */
bloombox.logging.error = function(var_args) {
  console.error.apply(console, ['[Bloombox]'].concat(Array.from(arguments)));
};
