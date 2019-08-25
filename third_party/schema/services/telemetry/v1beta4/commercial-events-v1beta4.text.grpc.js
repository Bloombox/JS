/**
 * @fileoverview gRPC-Web generated client stub for bloombox.services.telemetry.v1beta4
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


goog.provide('proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryPromiseClient');

goog.require('grpc.web.GrpcWebClientBase');
goog.require('grpc.web.AbstractClientBase');
goog.require('grpc.web.ClientReadableStream');
goog.require('grpc.web.Error');
goog.require('proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Action');
goog.require('proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Impression');
goog.require('proto.bloombox.services.telemetry.v1beta4.CommercialEvent.View');
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
proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryClient =
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
proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryPromiseClient =
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
 *   !proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Impression,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_CommercialTelemetry_Impression = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Impression} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Impression} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryClient.prototype.impression =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.CommercialTelemetry/Impression',
      request,
      metadata || {},
      methodInfo_CommercialTelemetry_Impression,
      callback);
};


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Impression} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryPromiseClient.prototype.impression =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.CommercialTelemetry/Impression',
      request,
      metadata || {},
      methodInfo_CommercialTelemetry_Impression);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.telemetry.v1beta4.CommercialEvent.View,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_CommercialTelemetry_View = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.telemetry.v1beta4.CommercialEvent.View} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.CommercialEvent.View} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryClient.prototype.view =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.CommercialTelemetry/View',
      request,
      metadata || {},
      methodInfo_CommercialTelemetry_View,
      callback);
};


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.CommercialEvent.View} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryPromiseClient.prototype.view =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.CommercialTelemetry/View',
      request,
      metadata || {},
      methodInfo_CommercialTelemetry_View);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Action,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_CommercialTelemetry_Action = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Action} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Action} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryClient.prototype.action =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.CommercialTelemetry/Action',
      request,
      metadata || {},
      methodInfo_CommercialTelemetry_Action,
      callback);
};


/**
 * @param {!proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Action} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryPromiseClient.prototype.action =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.telemetry.v1beta4.CommercialTelemetry/Action',
      request,
      metadata || {},
      methodInfo_CommercialTelemetry_Action);
};


}); // goog.scope

