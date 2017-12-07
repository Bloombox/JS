
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
 * Bloombox JS Config: Segment IO
 *
 * @fileoverview Provides configuration structure for the Segment IO integration
 * layer with Bloombox JS.
 */

/*global goog */

goog.provide('bloombox.config.integration.SegmentConfig');


/**
 * Specifies configuration structure for Segment IO integration features.
 *
 * @public
 * @nocollapse
 * @typedef {{enabled: boolean,
 *            writeKey: string}}
 */
bloombox.config.integration.SegmentConfig;
