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
 * @fileoverview gRPC-Web generated client stub for bloombox.services.telemetry.v1beta4
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


goog.provide('proto.bloombox.services.telemetry.v1beta4.EventTelemetryClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.EventTelemetryPromiseClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.IdentityTelemetryClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.IdentityTelemetryPromiseClient');

goog.require('grpc.web.GrpcWebClientBase');
goog.require('grpc.web.AbstractClientBase');
goog.require('grpc.web.ClientReadableStream');
goog.require('grpc.web.Error');
goog.require('proto.bloombox.services.telemetry.v1beta4.Event.BatchRequest');
goog.require('proto.bloombox.services.telemetry.v1beta4.Event.Request');
goog.require('proto.bloombox.services.telemetry.v1beta4.Exception');
goog.require('proto.bloombox.services.telemetry.v1beta4.IdentityEvent.Action');
goog.require('proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Request');
goog.require('proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Response');
goog.require('proto.bloombox.services.telemetry.v1beta4.TelemetryResponse');
goog.require('proto.google.protobuf.Empty');



goog.scope(function() {

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.bloombox.services.telemetry.v1beta4.EventTelemetryClient =
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
proto.bloombox.services.telemetry.v1beta4.EventTelemetryPromiseClient =
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
 *   !proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Request,
 *   !proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Response>}
 */
const methodInfo_EventTelemetry_Ping = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Response,
  /** @param {!proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Response.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.telemetry.v1beta4.EventTelemetryClient.prototype.ping =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.EventTelemetry/Ping',
      request,
      metadata || {},
      methodInfo_EventTelemetry_Ping,
      callback);
};


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Response>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.telemetry.v1beta4.EventTelemetryPromiseClient.prototype.ping =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.EventTelemetry/Ping',
      request,
      metadata || {},
      methodInfo_EventTelemetry_Ping);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.telemetry.v1beta4.Event.Request,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_EventTelemetry_Event = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.telemetry.v1beta4.Event.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.Event.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.telemetry.v1beta4.EventTelemetryClient.prototype.event =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.EventTelemetry/Event',
      request,
      metadata || {},
      methodInfo_EventTelemetry_Event,
      callback);
};


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.Event.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.telemetry.v1beta4.EventTelemetryPromiseClient.prototype.event =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.EventTelemetry/Event',
      request,
      metadata || {},
      methodInfo_EventTelemetry_Event);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.telemetry.v1beta4.Event.BatchRequest,
 *   !proto.bloombox.services.telemetry.v1beta4.TelemetryResponse>}
 */
const methodInfo_EventTelemetry_Batch = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bloombox.services.telemetry.v1beta4.TelemetryResponse,
  /** @param {!proto.bloombox.services.telemetry.v1beta4.Event.BatchRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.telemetry.v1beta4.TelemetryResponse.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.Event.BatchRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bloombox.services.telemetry.v1beta4.TelemetryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.telemetry.v1beta4.TelemetryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.telemetry.v1beta4.EventTelemetryClient.prototype.batch =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.EventTelemetry/Batch',
      request,
      metadata || {},
      methodInfo_EventTelemetry_Batch,
      callback);
};


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.Event.BatchRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bloombox.services.telemetry.v1beta4.TelemetryResponse>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.telemetry.v1beta4.EventTelemetryPromiseClient.prototype.batch =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.EventTelemetry/Batch',
      request,
      metadata || {},
      methodInfo_EventTelemetry_Batch);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.telemetry.v1beta4.Exception,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_EventTelemetry_Error = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.telemetry.v1beta4.Exception} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.Exception} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.telemetry.v1beta4.EventTelemetryClient.prototype.error =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.EventTelemetry/Error',
      request,
      metadata || {},
      methodInfo_EventTelemetry_Error,
      callback);
};


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.Exception} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.telemetry.v1beta4.EventTelemetryPromiseClient.prototype.error =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.EventTelemetry/Error',
      request,
      metadata || {},
      methodInfo_EventTelemetry_Error);
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.bloombox.services.telemetry.v1beta4.IdentityTelemetryClient =
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
proto.bloombox.services.telemetry.v1beta4.IdentityTelemetryPromiseClient =
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
 *   !proto.bloombox.services.telemetry.v1beta4.IdentityEvent.Action,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_IdentityTelemetry_Action = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.telemetry.v1beta4.IdentityEvent.Action} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.IdentityEvent.Action} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.telemetry.v1beta4.IdentityTelemetryClient.prototype.action =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.IdentityTelemetry/Action',
      request,
      metadata || {},
      methodInfo_IdentityTelemetry_Action,
      callback);
};


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.IdentityEvent.Action} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.telemetry.v1beta4.IdentityTelemetryPromiseClient.prototype.action =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.IdentityTelemetry/Action',
      request,
      metadata || {},
      methodInfo_IdentityTelemetry_Action);
};


}); // goog.scope

