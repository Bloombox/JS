/**
 * @fileoverview gRPC-Web generated client stub for bloombox.services.telemetry.v1beta4
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


goog.provide('proto.bloombox.services.telemetry.v1beta4.EventTelemetryClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.EventTelemetryPromiseClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryPromiseClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.IdentityTelemetryClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.IdentityTelemetryPromiseClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.SearchTelemetryClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.SearchTelemetryPromiseClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryClient');
goog.provide('proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryPromiseClient');

goog.require('grpc.web.GrpcWebClientBase');
goog.require('grpc.web.AbstractClientBase');
goog.require('grpc.web.ClientReadableStream');
goog.require('grpc.web.Error');
goog.require('proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Action');
goog.require('proto.bloombox.services.telemetry.v1beta4.CommercialEvent.Impression');
goog.require('proto.bloombox.services.telemetry.v1beta4.CommercialEvent.View');
goog.require('proto.bloombox.services.telemetry.v1beta4.Event.BatchRequest');
goog.require('proto.bloombox.services.telemetry.v1beta4.Event.Request');
goog.require('proto.bloombox.services.telemetry.v1beta4.Exception');
goog.require('proto.bloombox.services.telemetry.v1beta4.IdentityEvent.Action');
goog.require('proto.bloombox.services.telemetry.v1beta4.InventoryEvent');
goog.require('proto.bloombox.services.telemetry.v1beta4.InventoryEvent.Encounter');
goog.require('proto.bloombox.services.telemetry.v1beta4.InventoryEvent.ReservationCancel');
goog.require('proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockConsume');
goog.require('proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockIntake');
goog.require('proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockReserve');
goog.require('proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockTransfer');
goog.require('proto.bloombox.services.telemetry.v1beta4.SearchEvent.Query');
goog.require('proto.bloombox.services.telemetry.v1beta4.SearchEvent.Result');
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
      options['format'] = 'binary';

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
      options['format'] = 'binary';

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
  proto.bloombox.services.telemetry.v1beta4.CommercialTelemetryClient =
    function(hostname, credentials, options) {
      if (!options) options = {};
      options['format'] = 'binary';

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
      options['format'] = 'binary';

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
      options['format'] = 'binary';

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
      options['format'] = 'binary';

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


  /**
   * @param {string} hostname
   * @param {?Object} credentials
   * @param {?Object} options
   * @constructor
   * @struct
   * @final
   */
  proto.bloombox.services.telemetry.v1beta4.SearchTelemetryClient =
    function(hostname, credentials, options) {
      if (!options) options = {};
      options['format'] = 'binary';

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
  proto.bloombox.services.telemetry.v1beta4.SearchTelemetryPromiseClient =
    function(hostname, credentials, options) {
      if (!options) options = {};
      options['format'] = 'binary';

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
   *   !proto.bloombox.services.telemetry.v1beta4.SearchEvent.Query,
   *   !proto.google.protobuf.Empty>}
   */
  const methodInfo_SearchTelemetry_Query = new grpc.web.AbstractClientBase.MethodInfo(
    proto.google.protobuf.Empty,
    /** @param {!proto.bloombox.services.telemetry.v1beta4.SearchEvent.Query} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.google.protobuf.Empty.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.SearchEvent.Query} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.telemetry.v1beta4.SearchTelemetryClient.prototype.query =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.SearchTelemetry/Query',
        request,
        metadata || {},
        methodInfo_SearchTelemetry_Query,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.SearchEvent.Query} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.google.protobuf.Empty>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.telemetry.v1beta4.SearchTelemetryPromiseClient.prototype.query =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.SearchTelemetry/Query',
        request,
        metadata || {},
        methodInfo_SearchTelemetry_Query);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.telemetry.v1beta4.SearchEvent.Result,
   *   !proto.google.protobuf.Empty>}
   */
  const methodInfo_SearchTelemetry_Result = new grpc.web.AbstractClientBase.MethodInfo(
    proto.google.protobuf.Empty,
    /** @param {!proto.bloombox.services.telemetry.v1beta4.SearchEvent.Result} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.google.protobuf.Empty.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.SearchEvent.Result} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.telemetry.v1beta4.SearchTelemetryClient.prototype.result =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.SearchTelemetry/Result',
        request,
        metadata || {},
        methodInfo_SearchTelemetry_Result,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.SearchEvent.Result} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.google.protobuf.Empty>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.telemetry.v1beta4.SearchTelemetryPromiseClient.prototype.result =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.SearchTelemetry/Result',
        request,
        metadata || {},
        methodInfo_SearchTelemetry_Result);
    };


  /**
   * @param {string} hostname
   * @param {?Object} credentials
   * @param {?Object} options
   * @constructor
   * @struct
   * @final
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryClient =
    function(hostname, credentials, options) {
      if (!options) options = {};
      options['format'] = 'binary';

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
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryPromiseClient =
    function(hostname, credentials, options) {
      if (!options) options = {};
      options['format'] = 'binary';

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
   *   !proto.bloombox.services.telemetry.v1beta4.InventoryEvent.Encounter,
   *   !proto.google.protobuf.Empty>}
   */
  const methodInfo_InventoryTelemetry_Encounter = new grpc.web.AbstractClientBase.MethodInfo(
    proto.google.protobuf.Empty,
    /** @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.Encounter} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.google.protobuf.Empty.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.Encounter} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryClient.prototype.encounter =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Encounter',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Encounter,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.Encounter} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.google.protobuf.Empty>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryPromiseClient.prototype.encounter =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Encounter',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Encounter);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockIntake,
   *   !proto.google.protobuf.Empty>}
   */
  const methodInfo_InventoryTelemetry_Intake = new grpc.web.AbstractClientBase.MethodInfo(
    proto.google.protobuf.Empty,
    /** @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockIntake} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.google.protobuf.Empty.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockIntake} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryClient.prototype.intake =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Intake',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Intake,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockIntake} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.google.protobuf.Empty>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryPromiseClient.prototype.intake =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Intake',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Intake);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockIntake,
   *   !proto.google.protobuf.Empty>}
   */
  const methodInfo_InventoryTelemetry_Update = new grpc.web.AbstractClientBase.MethodInfo(
    proto.google.protobuf.Empty,
    /** @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockIntake} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.google.protobuf.Empty.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockIntake} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryClient.prototype.update =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Update',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Update,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockIntake} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.google.protobuf.Empty>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryPromiseClient.prototype.update =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Update',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Update);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockTransfer,
   *   !proto.google.protobuf.Empty>}
   */
  const methodInfo_InventoryTelemetry_Transfer = new grpc.web.AbstractClientBase.MethodInfo(
    proto.google.protobuf.Empty,
    /** @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockTransfer} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.google.protobuf.Empty.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockTransfer} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryClient.prototype.transfer =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Transfer',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Transfer,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockTransfer} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.google.protobuf.Empty>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryPromiseClient.prototype.transfer =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Transfer',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Transfer);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockReserve,
   *   !proto.google.protobuf.Empty>}
   */
  const methodInfo_InventoryTelemetry_Reserve = new grpc.web.AbstractClientBase.MethodInfo(
    proto.google.protobuf.Empty,
    /** @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockReserve} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.google.protobuf.Empty.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockReserve} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryClient.prototype.reserve =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Reserve',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Reserve,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockReserve} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.google.protobuf.Empty>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryPromiseClient.prototype.reserve =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Reserve',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Reserve);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.telemetry.v1beta4.InventoryEvent.ReservationCancel,
   *   !proto.google.protobuf.Empty>}
   */
  const methodInfo_InventoryTelemetry_Cancel = new grpc.web.AbstractClientBase.MethodInfo(
    proto.google.protobuf.Empty,
    /** @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.ReservationCancel} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.google.protobuf.Empty.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.ReservationCancel} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryClient.prototype.cancel =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Cancel',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Cancel,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.ReservationCancel} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.google.protobuf.Empty>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryPromiseClient.prototype.cancel =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Cancel',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Cancel);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockConsume,
   *   !proto.google.protobuf.Empty>}
   */
  const methodInfo_InventoryTelemetry_Consume = new grpc.web.AbstractClientBase.MethodInfo(
    proto.google.protobuf.Empty,
    /** @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockConsume} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.google.protobuf.Empty.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockConsume} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryClient.prototype.consume =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Consume',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Consume,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.telemetry.v1beta4.InventoryEvent.StockConsume} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.google.protobuf.Empty>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.telemetry.v1beta4.InventoryTelemetryPromiseClient.prototype.consume =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.telemetry.v1beta4.InventoryTelemetry/Consume',
        request,
        metadata || {},
        methodInfo_InventoryTelemetry_Consume);
    };


}); // goog.scope

