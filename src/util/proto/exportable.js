
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
 * Bloombox Utils: Exportable
 *
 * @fileoverview Provides a basic interface for structures that are capable of
 * exporting themselves into corresponding Protobuf message structures.
 */

/*global goog */

goog.provide('bloombox.util.Exportable');


// - Interface: Exportable - //
/**
 * Specifies an interface for an object that can be exported to some protobuf
 * message structure that corresponds with its own type. Implementors specify
 * a method, `export`, that can output a prepared, corresponding PB.
 *
 * @template T
 * @interface
 * @public
 */
bloombox.util.Exportable = function Exportable() {};

/**
 * Export the subject exportable object into a protobuf message structure,
 * prepared and initialized with values from the higher-order object.
 *
 * @return {T}
 * @public
 */
bloombox.util.Exportable.prototype.export = function() {};
