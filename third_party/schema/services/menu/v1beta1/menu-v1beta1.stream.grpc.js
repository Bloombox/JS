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
goog.require('grpc.web.MethodDescriptor');
goog.require('grpc.web.MethodType');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent');
goog.require('proto.bloombox.services.menu.v1beta1.RealtimeMenu.Request');
goog.require('proto.bloombox.services.menu.v1beta1.RealtimeMenu.StreamEvent');



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
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.Request,
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent>}
 */
const methodDescriptor_MenuStream_Live = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.MenuStream/Live',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.bloombox.services.menu.v1beta1.GetMenu.Request,
  proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent.deserializeBinary
);


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
      methodDescriptor_MenuStream_Live);
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
      methodDescriptor_MenuStream_Live);
};


}); // goog.scope

