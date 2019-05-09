/*
 * Copyright 2019, Momentum Ideas, Co. All rights reserved.
 *
 * Source and object computer code contained herein is the private intellectual
 * property of Momentum Ideas Co, a Delaware Corporation. Use of this code in
 * source form requires permission in writing before use or the assembly,
 * distribution, or publishing of derivative works, for commercial purposes or
 * any other purpose, from a duly authorized officer of Momentum Ideas Co.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview gRPC-Web generated client stub for bloombox.services.menu.v1beta1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


goog.provide('proto.bloombox.services.menu.v1beta1.MenuStreamClient');
goog.provide('proto.bloombox.services.menu.v1beta1.MenuStreamPromiseClient');

goog.require('grpc.web.GrpcWebClientBase');
goog.require('grpc.web.AbstractClientBase');
goog.require('grpc.web.ClientReadableStream');
goog.require('grpc.web.Error');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent');



goog.scope(function() {

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.bloombox.services.menu.v1beta1.MenuStreamClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.bloombox.services.menu.v1beta1.MenuStreamPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.Request,
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent>}
 */
const methodInfo_MenuStream_Live = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent>}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuStreamClient.prototype.live =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/bloombox.services.menu.v1beta1.MenuStream/Live',
      request,
      metadata || {},
      methodInfo_MenuStream_Live);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent>}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuStreamPromiseClient.prototype.live =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/bloombox.services.menu.v1beta1.MenuStream/Live',
      request,
      metadata || {},
      methodInfo_MenuStream_Live);
};


}); // goog.scope

