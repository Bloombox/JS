/*
 * Copyright 2019, Momentum Ideas, Co. All rights reserved.
 *
 * Source and object computer code contained herein is the private intellectual
 * property of Bloombox, a California Limited Liability Corporation. Use of this
 * code in source form requires permission in writing before use or the
 * assembly, distribution, or publishing of derivative works, for commercial
 * purposes or any other purpose, from a duly authorized officer of Momentum
 * Ideas Co.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview gRPC-Web generated client stub for bloombox.services.platform.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


goog.provide('proto.bloombox.services.platform.v1.PlatformClient');
goog.provide('proto.bloombox.services.platform.v1.PlatformPromiseClient');

goog.require('grpc.web.GrpcWebClientBase');
goog.require('grpc.web.AbstractClientBase');
goog.require('grpc.web.ClientReadableStream');
goog.require('grpc.web.Error');
goog.require('proto.bloombox.services.platform.v1.BrandInfo.Request');
goog.require('proto.bloombox.services.platform.v1.BrandInfo.Response');
goog.require('proto.bloombox.services.platform.v1.DomainInfo.Request');
goog.require('proto.bloombox.services.platform.v1.DomainInfo.Response');
goog.require('proto.bloombox.services.platform.v1.DomainResolve.Request');
goog.require('proto.bloombox.services.platform.v1.DomainResolve.Response');
goog.require('proto.bloombox.services.platform.v1.Ping.Request');
goog.require('proto.bloombox.services.platform.v1.Ping.Response');
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
  proto.bloombox.services.platform.v1.PlatformClient =
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
  proto.bloombox.services.platform.v1.PlatformPromiseClient =
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
   *   !proto.bloombox.services.platform.v1.Ping.Request,
   *   !proto.bloombox.services.platform.v1.Ping.Response>}
   */
  const methodInfo_Platform_Ping = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.platform.v1.Ping.Response,
    /** @param {!proto.bloombox.services.platform.v1.Ping.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.platform.v1.Ping.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.platform.v1.Ping.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.platform.v1.Ping.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.platform.v1.Ping.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.platform.v1.PlatformClient.prototype.ping =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.platform.v1.Platform/Ping',
        request,
        metadata || {},
        methodInfo_Platform_Ping,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.platform.v1.Ping.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.platform.v1.Ping.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.platform.v1.PlatformPromiseClient.prototype.ping =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.platform.v1.Platform/Ping',
        request,
        metadata || {},
        methodInfo_Platform_Ping);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.google.protobuf.Empty,
   *   !proto.google.protobuf.Empty>}
   */
  const methodInfo_Platform_Health = new grpc.web.AbstractClientBase.MethodInfo(
    proto.google.protobuf.Empty,
    /** @param {!proto.google.protobuf.Empty} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.google.protobuf.Empty.deserializeBinary
  );


  /**
   * @param {!proto.google.protobuf.Empty} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.platform.v1.PlatformClient.prototype.health =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.platform.v1.Platform/Health',
        request,
        metadata || {},
        methodInfo_Platform_Health,
        callback);
    };


  /**
   * @param {!proto.google.protobuf.Empty} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.google.protobuf.Empty>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.platform.v1.PlatformPromiseClient.prototype.health =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.platform.v1.Platform/Health',
        request,
        metadata || {},
        methodInfo_Platform_Health);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.platform.v1.DomainResolve.Request,
   *   !proto.bloombox.services.platform.v1.DomainResolve.Response>}
   */
  const methodInfo_Platform_Resolve = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.platform.v1.DomainResolve.Response,
    /** @param {!proto.bloombox.services.platform.v1.DomainResolve.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.platform.v1.DomainResolve.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.platform.v1.DomainResolve.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.platform.v1.DomainResolve.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.platform.v1.DomainResolve.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.platform.v1.PlatformClient.prototype.resolve =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.platform.v1.Platform/Resolve',
        request,
        metadata || {},
        methodInfo_Platform_Resolve,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.platform.v1.DomainResolve.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.platform.v1.DomainResolve.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.platform.v1.PlatformPromiseClient.prototype.resolve =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.platform.v1.Platform/Resolve',
        request,
        metadata || {},
        methodInfo_Platform_Resolve);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.platform.v1.DomainInfo.Request,
   *   !proto.bloombox.services.platform.v1.DomainInfo.Response>}
   */
  const methodInfo_Platform_Domains = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.platform.v1.DomainInfo.Response,
    /** @param {!proto.bloombox.services.platform.v1.DomainInfo.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.platform.v1.DomainInfo.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.platform.v1.DomainInfo.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.platform.v1.DomainInfo.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.platform.v1.DomainInfo.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.platform.v1.PlatformClient.prototype.domains =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.platform.v1.Platform/Domains',
        request,
        metadata || {},
        methodInfo_Platform_Domains,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.platform.v1.DomainInfo.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.platform.v1.DomainInfo.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.platform.v1.PlatformPromiseClient.prototype.domains =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.platform.v1.Platform/Domains',
        request,
        metadata || {},
        methodInfo_Platform_Domains);
    };


  /**
   * @const
   * @type {!grpc.web.AbstractClientBase.MethodInfo<
   *   !proto.bloombox.services.platform.v1.BrandInfo.Request,
   *   !proto.bloombox.services.platform.v1.BrandInfo.Response>}
   */
  const methodInfo_Platform_Brand = new grpc.web.AbstractClientBase.MethodInfo(
    proto.bloombox.services.platform.v1.BrandInfo.Response,
    /** @param {!proto.bloombox.services.platform.v1.BrandInfo.Request} request */
    function(request) {
      return request.serializeBinary();
    },
    proto.bloombox.services.platform.v1.BrandInfo.Response.deserializeBinary
  );


  /**
   * @param {!proto.bloombox.services.platform.v1.BrandInfo.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @param {function(?grpc.web.Error, ?proto.bloombox.services.platform.v1.BrandInfo.Response)}
   *     callback The callback function(error, response)
   * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.platform.v1.BrandInfo.Response>|undefined}
   *     The XHR Node Readable Stream
   */
  proto.bloombox.services.platform.v1.PlatformClient.prototype.brand =
    function(request, metadata, callback) {
      return this.client_.rpcCall(this.hostname_ +
        '/bloombox.services.platform.v1.Platform/Brand',
        request,
        metadata || {},
        methodInfo_Platform_Brand,
        callback);
    };


  /**
   * @param {!proto.bloombox.services.platform.v1.BrandInfo.Request} request The
   *     request proto
   * @param {?Object<string, string>} metadata User defined
   *     call metadata
   * @return {!Promise<!proto.bloombox.services.platform.v1.BrandInfo.Response>}
   *     A native promise that resolves to the response
   */
  proto.bloombox.services.platform.v1.PlatformPromiseClient.prototype.brand =
    function(request, metadata) {
      return this.client_.unaryCall(this.hostname_ +
        '/bloombox.services.platform.v1.Platform/Brand',
        request,
        metadata || {},
        methodInfo_Platform_Brand);
    };


}); // goog.scope

