/**
 * @fileoverview gRPC-Web generated client stub for bloombox.services.shop.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


goog.provide('proto.bloombox.services.shop.v1.ShopClient');
goog.provide('proto.bloombox.services.shop.v1.ShopPromiseClient');

goog.require('grpc.web.GrpcWebClientBase');
goog.require('grpc.web.AbstractClientBase');
goog.require('grpc.web.ClientReadableStream');
goog.require('grpc.web.Error');
goog.require('proto.bloombox.services.shop.v1.CheckZipcode.Request');
goog.require('proto.bloombox.services.shop.v1.CheckZipcode.Response');
goog.require('proto.bloombox.services.shop.v1.EnrollMember.Request');
goog.require('proto.bloombox.services.shop.v1.EnrollMember.Response');
goog.require('proto.bloombox.services.shop.v1.GetOrder.Request');
goog.require('proto.bloombox.services.shop.v1.GetOrder.Response');
goog.require('proto.bloombox.services.shop.v1.Ping.Request');
goog.require('proto.bloombox.services.shop.v1.Ping.Response');
goog.require('proto.bloombox.services.shop.v1.ShopInfo.Request');
goog.require('proto.bloombox.services.shop.v1.ShopInfo.Response');
goog.require('proto.bloombox.services.shop.v1.SubmitOrder.Request');
goog.require('proto.bloombox.services.shop.v1.SubmitOrder.Response');
goog.require('proto.bloombox.services.shop.v1.VerifyMember.Request');
goog.require('proto.bloombox.services.shop.v1.VerifyMember.Response');



goog.scope(function() {

  /**
   * @param {string} hostname
   * @param {?Object} credentials
   * @param {?Object} options
   * @constructor
   * @struct
   * @final
   */
  proto.bloombox.services.shop.v1.ShopClient =
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
  proto.bloombox.services.shop.v1.ShopPromiseClient =
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
   *   !proto.bloombox.services.shop.v1.Ping.Request,
   *   !proto.bloombox.services.shop.v1.Ping.Response>}
   */
  const methodInfo_Shop_Ping = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.shop.v1.Ping.Response,
    /** @param {!proto.bloombox.services.shop.v1.Ping.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.shop.v1.Ping.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.shop.v1.Ping.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.shop.v1.Ping.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.shop.v1.Ping.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.shop.v1.ShopClient.prototype.ping =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/Ping',
        request,
        metadata || {},
        methodInfo_Shop_Ping,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.shop.v1.Ping.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.shop.v1.Ping.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.shop.v1.ShopPromiseClient.prototype.ping =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/Ping',
        request,
        metadata || {},
        methodInfo_Shop_Ping);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.shop.v1.ShopInfo.Request,
   *   !proto.bloombox.services.shop.v1.ShopInfo.Response>}
   */
  const methodInfo_Shop_ShopInfo = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.shop.v1.ShopInfo.Response,
    /** @param {!proto.bloombox.services.shop.v1.ShopInfo.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.shop.v1.ShopInfo.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.shop.v1.ShopInfo.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.shop.v1.ShopInfo.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.shop.v1.ShopInfo.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.shop.v1.ShopClient.prototype.shopInfo =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/ShopInfo',
        request,
        metadata || {},
        methodInfo_Shop_ShopInfo,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.shop.v1.ShopInfo.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.shop.v1.ShopInfo.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.shop.v1.ShopPromiseClient.prototype.shopInfo =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/ShopInfo',
        request,
        metadata || {},
        methodInfo_Shop_ShopInfo);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.shop.v1.EnrollMember.Request,
   *   !proto.bloombox.services.shop.v1.EnrollMember.Response>}
   */
  const methodInfo_Shop_EnrollMember = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.shop.v1.EnrollMember.Response,
    /** @param {!proto.bloombox.services.shop.v1.EnrollMember.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.shop.v1.EnrollMember.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.shop.v1.EnrollMember.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.shop.v1.EnrollMember.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.shop.v1.EnrollMember.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.shop.v1.ShopClient.prototype.enrollMember =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/EnrollMember',
        request,
        metadata || {},
        methodInfo_Shop_EnrollMember,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.shop.v1.EnrollMember.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.shop.v1.EnrollMember.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.shop.v1.ShopPromiseClient.prototype.enrollMember =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/EnrollMember',
        request,
        metadata || {},
        methodInfo_Shop_EnrollMember);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.shop.v1.CheckZipcode.Request,
   *   !proto.bloombox.services.shop.v1.CheckZipcode.Response>}
   */
  const methodInfo_Shop_CheckZipcode = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.shop.v1.CheckZipcode.Response,
    /** @param {!proto.bloombox.services.shop.v1.CheckZipcode.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.shop.v1.CheckZipcode.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.shop.v1.CheckZipcode.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.shop.v1.CheckZipcode.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.shop.v1.CheckZipcode.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.shop.v1.ShopClient.prototype.checkZipcode =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/CheckZipcode',
        request,
        metadata || {},
        methodInfo_Shop_CheckZipcode,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.shop.v1.CheckZipcode.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.shop.v1.CheckZipcode.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.shop.v1.ShopPromiseClient.prototype.checkZipcode =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/CheckZipcode',
        request,
        metadata || {},
        methodInfo_Shop_CheckZipcode);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.shop.v1.VerifyMember.Request,
   *   !proto.bloombox.services.shop.v1.VerifyMember.Response>}
   */
  const methodInfo_Shop_VerifyMember = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.shop.v1.VerifyMember.Response,
    /** @param {!proto.bloombox.services.shop.v1.VerifyMember.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.shop.v1.VerifyMember.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.shop.v1.VerifyMember.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.shop.v1.VerifyMember.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.shop.v1.VerifyMember.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.shop.v1.ShopClient.prototype.verifyMember =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/VerifyMember',
        request,
        metadata || {},
        methodInfo_Shop_VerifyMember,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.shop.v1.VerifyMember.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.shop.v1.VerifyMember.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.shop.v1.ShopPromiseClient.prototype.verifyMember =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/VerifyMember',
        request,
        metadata || {},
        methodInfo_Shop_VerifyMember);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.shop.v1.SubmitOrder.Request,
   *   !proto.bloombox.services.shop.v1.SubmitOrder.Response>}
   */
  const methodInfo_Shop_SubmitOrder = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.shop.v1.SubmitOrder.Response,
    /** @param {!proto.bloombox.services.shop.v1.SubmitOrder.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.shop.v1.SubmitOrder.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.shop.v1.SubmitOrder.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.shop.v1.SubmitOrder.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.shop.v1.SubmitOrder.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.shop.v1.ShopClient.prototype.submitOrder =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/SubmitOrder',
        request,
        metadata || {},
        methodInfo_Shop_SubmitOrder,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.shop.v1.SubmitOrder.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.shop.v1.SubmitOrder.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.shop.v1.ShopPromiseClient.prototype.submitOrder =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/SubmitOrder',
        request,
        metadata || {},
        methodInfo_Shop_SubmitOrder);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.shop.v1.GetOrder.Request,
   *   !proto.bloombox.services.shop.v1.GetOrder.Response>}
   */
  const methodInfo_Shop_GetOrder = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.shop.v1.GetOrder.Response,
    /** @param {!proto.bloombox.services.shop.v1.GetOrder.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.shop.v1.GetOrder.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.shop.v1.GetOrder.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.shop.v1.GetOrder.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.shop.v1.GetOrder.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.shop.v1.ShopClient.prototype.getOrder =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/GetOrder',
        request,
        metadata || {},
        methodInfo_Shop_GetOrder,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.shop.v1.GetOrder.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.shop.v1.GetOrder.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.shop.v1.ShopPromiseClient.prototype.getOrder =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.shop.v1.Shop/GetOrder',
        request,
        metadata || {},
        methodInfo_Shop_GetOrder);
    };


}); // goog.scope

