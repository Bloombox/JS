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


goog.provide('proto.bloombox.services.menu.v1beta1.MenuClient');
goog.provide('proto.bloombox.services.menu.v1beta1.MenuPromiseClient');

goog.require('grpc.web.GrpcWebClientBase');
goog.require('grpc.web.AbstractClientBase');
goog.require('grpc.web.ClientReadableStream');
goog.require('grpc.web.Error');
goog.require('grpc.web.MethodDescriptor');
goog.require('grpc.web.MethodType');
goog.require('proto.bloombox.services.menu.v1beta1.CreateProduct.Request');
goog.require('proto.bloombox.services.menu.v1beta1.CreateProduct.Response');
goog.require('proto.bloombox.services.menu.v1beta1.DeleteProduct.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetFeatured.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetFeatured.Response');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.Response');
goog.require('proto.bloombox.services.menu.v1beta1.GetProduct.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetProduct.Response');
goog.require('proto.bloombox.services.menu.v1beta1.ProductStock.Request');
goog.require('proto.bloombox.services.menu.v1beta1.ProductStock.Response');
goog.require('proto.bloombox.services.menu.v1beta1.SearchMenu.Request');
goog.require('proto.bloombox.services.menu.v1beta1.SearchMenu.Response');
goog.require('proto.bloombox.services.menu.v1beta1.UpdateProduct.Request');
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
proto.bloombox.services.menu.v1beta1.MenuPromiseClient =
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
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.Response>}
 */
const methodDescriptor_Menu_Retrieve = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/Retrieve',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.GetMenu.Request,
  proto.bloombox.services.menu.v1beta1.GetMenu.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.GetMenu.Response.deserializeBinary
);


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
      methodDescriptor_Menu_Retrieve,
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
      methodDescriptor_Menu_Retrieve);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.Request,
 *   !proto.bloombox.services.menu.v1beta1.GetMenu.Response>}
 */
const methodDescriptor_Menu_Section = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/Section',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.GetMenu.Request,
  proto.bloombox.services.menu.v1beta1.GetMenu.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.GetMenu.Response.deserializeBinary
);


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
      methodDescriptor_Menu_Section,
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
      methodDescriptor_Menu_Section);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.GetFeatured.Request,
 *   !proto.bloombox.services.menu.v1beta1.GetFeatured.Response>}
 */
const methodDescriptor_Menu_Featured = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/Featured',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.GetFeatured.Request,
  proto.bloombox.services.menu.v1beta1.GetFeatured.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetFeatured.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.GetFeatured.Response.deserializeBinary
);


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
      methodDescriptor_Menu_Featured,
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
      methodDescriptor_Menu_Featured);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.GetProduct.Request,
 *   !proto.bloombox.services.menu.v1beta1.GetProduct.Response>}
 */
const methodDescriptor_Menu_Products = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/Products',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.GetProduct.Request,
  proto.bloombox.services.menu.v1beta1.GetProduct.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.GetProduct.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.GetProduct.Response.deserializeBinary
);


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
      methodDescriptor_Menu_Products,
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
      methodDescriptor_Menu_Products);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.SearchMenu.Request,
 *   !proto.bloombox.services.menu.v1beta1.SearchMenu.Response>}
 */
const methodDescriptor_Menu_Search = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/Search',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.SearchMenu.Request,
  proto.bloombox.services.menu.v1beta1.SearchMenu.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.SearchMenu.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.SearchMenu.Response.deserializeBinary
);


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
      methodDescriptor_Menu_Search,
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
      methodDescriptor_Menu_Search);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.CreateProduct.Request,
 *   !proto.bloombox.services.menu.v1beta1.CreateProduct.Response>}
 */
const methodDescriptor_Menu_Create = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/Create',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.CreateProduct.Request,
  proto.bloombox.services.menu.v1beta1.CreateProduct.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.CreateProduct.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.CreateProduct.Response.deserializeBinary
);


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
      methodDescriptor_Menu_Create,
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
      methodDescriptor_Menu_Create);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.UpdateProduct.Request,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_Menu_Update = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/Update',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.UpdateProduct.Request,
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.menu.v1beta1.UpdateProduct.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


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
      methodDescriptor_Menu_Update,
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
      methodDescriptor_Menu_Update);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.DeleteProduct.Request,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_Menu_Remove = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/Remove',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.DeleteProduct.Request,
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.menu.v1beta1.DeleteProduct.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


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
      methodDescriptor_Menu_Remove,
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
      methodDescriptor_Menu_Remove);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.ProductStock.Request,
 *   !proto.bloombox.services.menu.v1beta1.ProductStock.Response>}
 */
const methodDescriptor_Menu_ProductStatus = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/ProductStatus',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.ProductStock.Request,
  proto.bloombox.services.menu.v1beta1.ProductStock.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.ProductStock.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.bloombox.services.menu.v1beta1.ProductStock.Request,
 *   !proto.bloombox.services.menu.v1beta1.ProductStock.Response>}
 */
const methodInfo_Menu_ProductStatus = new grpc.web.AbstractClientBase.MethodInfo(
  proto.bloombox.services.menu.v1beta1.ProductStock.Response,
  /** @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.bloombox.services.menu.v1beta1.ProductStock.Response.deserializeBinary
);


/**
 * @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.bloombox.services.menu.v1beta1.ProductStock.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.bloombox.services.menu.v1beta1.ProductStock.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.bloombox.services.menu.v1beta1.MenuClient.prototype.productStatus =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/ProductStatus',
      request,
      metadata || {},
      methodDescriptor_Menu_ProductStatus,
      callback);
};


/**
 * @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.bloombox.services.menu.v1beta1.ProductStock.Response>}
 *     A native promise that resolves to the response
 */
proto.bloombox.services.menu.v1beta1.MenuPromiseClient.prototype.productStatus =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/bloombox.services.menu.v1beta1.Menu/ProductStatus',
      request,
      metadata || {},
      methodDescriptor_Menu_ProductStatus);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.ProductStock.Request,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_Menu_InStock = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/InStock',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.ProductStock.Request,
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


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
      methodDescriptor_Menu_InStock,
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
      methodDescriptor_Menu_InStock);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.bloombox.services.menu.v1beta1.ProductStock.Request,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_Menu_OutOfStock = new grpc.web.MethodDescriptor(
  '/bloombox.services.menu.v1beta1.Menu/OutOfStock',
  grpc.web.MethodType.UNARY,
  proto.bloombox.services.menu.v1beta1.ProductStock.Request,
  proto.google.protobuf.Empty,
  /** @param {!proto.bloombox.services.menu.v1beta1.ProductStock.Request} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.google.protobuf.Empty.deserializeBinary
);


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
      methodDescriptor_Menu_OutOfStock,
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
      methodDescriptor_Menu_OutOfStock);
};


}); // goog.scope

