
/*
 * Copyright 2017, Bloombox, LLC.
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
 * Bloombox Utils: Serializable
 *
 * @fileoverview Provides a basic interface for structures that are capable of
 * exporting themselves into native JavaScript structures.
 */

/*global goog */

goog.provide('bloombox.util.Serializable');


// - Interface: Exportable - //
/**
 * Specifies an interface for an object that can be exported to a raw JavaScript
 * structure, suitable for transmission across-the-wire, and inflation by a
 * compatible JSON engine.
 *
 * @interface
 * @public
 */
bloombox.util.Serializable = function Serializable() {};

/**
 * Export the object into a native JavaScript structure that is serializable
 * into JSON.
 *
 * @return {Object}
 * @public
 */
bloombox.util.Serializable.prototype.serialize = function() {};
