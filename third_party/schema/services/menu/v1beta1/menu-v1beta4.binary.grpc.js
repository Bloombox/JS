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
 * @fileoverview gRPC-Web generated client stub for bloombox.services.menu.v1beta1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


goog.provide('proto.bloombox.services.menu.v1beta1.MenuClient');
goog.provide('proto.bloombox.services.menu.v1beta1.MenuPromiseClient');

goog.require('grpc.web.GrpcWebClientBase');
goog.require('grpc.web.AbstractClientBase');
goog.require('grpc.web.ClientReadableStream');
goog.require('grpc.web.Error');
goog.require('proto.bloombox.services.menu.v1beta1.CreateProduct.Request');
goog.require('proto.bloombox.services.menu.v1beta1.CreateProduct.Response');
goog.require('proto.bloombox.services.menu.v1beta1.DeleteProduct.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetCatalog.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetFeatured.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetFeatured.Response');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.Response');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent');
goog.require('proto.bloombox.services.menu.v1beta1.GetProduct.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetProduct.Response');
goog.require('proto.bloombox.services.menu.v1beta1.ProductStock.Request');
goog.require('proto.bloombox.services.menu.v1beta1.SearchMenu.Request');
goog.require('proto.bloombox.services.menu.v1beta1.SearchMenu.Response');
goog.require('proto.bloombox.services.menu.v1beta1.UpdateProduct.Request');
goog.require('proto.google.api.HttpBody');
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
proto.bloombox.services.menu.v1beta1.MenuClient =
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
proto.bloombox.services.menu.v1beta1.MenuPromiseClient =
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
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.Request,
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.Response>}
 */
const methodInfo_Menu_Retrieve = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bloombox.services.menu.v1beta1.GetMenu.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.GetMenu.Response.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bloombox.services.menu.v1beta1.GetMenu.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.GetMenu.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.retrieve =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Retrieve',
      request,
      metadata || {},
      methodInfo_Menu_Retrieve,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bloombox.services.menu.v1beta1.GetMenu.Response>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.retrieve =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Retrieve',
      request,
      metadata || {},
      methodInfo_Menu_Retrieve);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.Request,
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent>}
 */
const methodInfo_Menu_Live = new grpc.web.AbstractClientBase.MethodInfo(
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
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.live =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Live',
      request,
      metadata || {},
      methodInfo_Menu_Live);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent>}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.live =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Live',
      request,
      metadata || {},
      methodInfo_Menu_Live);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.Request,
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.Response>}
 */
const methodInfo_Menu_Section = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bloombox.services.menu.v1beta1.GetMenu.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.GetMenu.Response.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bloombox.services.menu.v1beta1.GetMenu.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.GetMenu.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.section =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Section',
      request,
      metadata || {},
      methodInfo_Menu_Section,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bloombox.services.menu.v1beta1.GetMenu.Response>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.section =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Section',
      request,
      metadata || {},
      methodInfo_Menu_Section);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.GetFeatured.Request,
 *   !proto.bloombox.services.menu.v1beta1.GetFeatured.Response>}
 */
const methodInfo_Menu_Featured = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bloombox.services.menu.v1beta1.GetFeatured.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetFeatured.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.GetFeatured.Response.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetFeatured.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bloombox.services.menu.v1beta1.GetFeatured.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.GetFeatured.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.featured =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Featured',
      request,
      metadata || {},
      methodInfo_Menu_Featured,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetFeatured.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bloombox.services.menu.v1beta1.GetFeatured.Response>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.featured =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Featured',
      request,
      metadata || {},
      methodInfo_Menu_Featured);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.GetProduct.Request,
 *   !proto.bloombox.services.menu.v1beta1.GetProduct.Response>}
 */
const methodInfo_Menu_Products = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bloombox.services.menu.v1beta1.GetProduct.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetProduct.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.GetProduct.Response.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetProduct.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bloombox.services.menu.v1beta1.GetProduct.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.GetProduct.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.products =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Products',
      request,
      metadata || {},
      methodInfo_Menu_Products,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetProduct.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bloombox.services.menu.v1beta1.GetProduct.Response>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.products =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Products',
      request,
      metadata || {},
      methodInfo_Menu_Products);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.GetCatalog.Request,
 *   !proto.google.api.HttpBody>}
 */
const methodInfo_Menu_Catalog = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.api.HttpBody,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetCatalog.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.api.HttpBody.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetCatalog.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.api.HttpBody)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.api.HttpBody>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.catalog =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Catalog',
      request,
      metadata || {},
      methodInfo_Menu_Catalog,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.GetCatalog.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.api.HttpBody>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.catalog =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Catalog',
      request,
      metadata || {},
      methodInfo_Menu_Catalog);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.SearchMenu.Request,
 *   !proto.bloombox.services.menu.v1beta1.SearchMenu.Response>}
 */
const methodInfo_Menu_Search = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bloombox.services.menu.v1beta1.SearchMenu.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.SearchMenu.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.SearchMenu.Response.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.SearchMenu.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bloombox.services.menu.v1beta1.SearchMenu.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.SearchMenu.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.search =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Search',
      request,
      metadata || {},
      methodInfo_Menu_Search,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.SearchMenu.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bloombox.services.menu.v1beta1.SearchMenu.Response>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.search =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Search',
      request,
      metadata || {},
      methodInfo_Menu_Search);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.CreateProduct.Request,
 *   !proto.bloombox.services.menu.v1beta1.CreateProduct.Response>}
 */
const methodInfo_Menu_Create = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bloombox.services.menu.v1beta1.CreateProduct.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.CreateProduct.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.CreateProduct.Response.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.CreateProduct.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bloombox.services.menu.v1beta1.CreateProduct.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.CreateProduct.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.create =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Create',
      request,
      metadata || {},
      methodInfo_Menu_Create,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.CreateProduct.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bloombox.services.menu.v1beta1.CreateProduct.Response>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.create =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Create',
      request,
      metadata || {},
      methodInfo_Menu_Create);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.UpdateProduct.Request,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_Menu_Update = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.menu.v1beta1.UpdateProduct.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.UpdateProduct.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.update =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Update',
      request,
      metadata || {},
      methodInfo_Menu_Update,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.UpdateProduct.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.update =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Update',
      request,
      metadata || {},
      methodInfo_Menu_Update);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.DeleteProduct.Request,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_Menu_Remove = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.menu.v1beta1.DeleteProduct.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.DeleteProduct.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.remove =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Remove',
      request,
      metadata || {},
      methodInfo_Menu_Remove,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.DeleteProduct.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.remove =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/Remove',
      request,
      metadata || {},
      methodInfo_Menu_Remove);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.ProductStock.Request,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_Menu_ProductStatus = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.productStatus =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/ProductStatus',
      request,
      metadata || {},
      methodInfo_Menu_ProductStatus,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.productStatus =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/ProductStatus',
      request,
      metadata || {},
      methodInfo_Menu_ProductStatus);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.ProductStock.Request,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_Menu_InStock = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.inStock =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/InStock',
      request,
      metadata || {},
      methodInfo_Menu_InStock,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.inStock =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/InStock',
      request,
      metadata || {},
      methodInfo_Menu_InStock);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.ProductStock.Request,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_Menu_OutOfStock = new grpc.web.AbstractClientBase.MethodInfo(
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.outOfStock =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/OutOfStock',
      request,
      metadata || {},
      methodInfo_Menu_OutOfStock,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.outOfStock =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/OutOfStock',
      request,
      metadata || {},
      methodInfo_Menu_OutOfStock);
};


}); // goog.scope

