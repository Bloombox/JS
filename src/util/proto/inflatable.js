
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
 * Bloombox Utils: Inflatable
 *
 * @fileoverview Provides a basic interface for structures that are capable of
 * creating themselves from a protobuf message corresponding to their structure.
 */

/*global goog */

goog.provide('bloombox.util.Inflatable');


// - Interface: Inflatable - //
/**
 * Specifies an interface for an object that can be inflated from a low-level
 * protobuf message corresponding to its own type.
 *
 * @template M, T
 * @interface
 * @public
 */
bloombox.util.Inflatable = function Inflatable() {};


/**
 * Import a protobuf object.
 *
 * @param {M} protob Protobuf message to inflate.
 * @return {T} Inflated object from the protobuf message.
 * @public
 */
bloombox.util.Inflatable.prototype.setFromProto = function(protob) {};
