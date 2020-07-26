/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';

import {
  GetTimelineRequest,
  GetUserRequest,
  NewUserRequest,
  TimelineResponse,
  UpdateUserRequest,
  UserResponse,
  UsersResponse} from './synchronicity_pb';

export class SynchronicityServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: string; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoCreateUser = new grpcWeb.AbstractClientBase.MethodInfo(
    UserResponse,
    (request: NewUserRequest) => {
      return request.serializeBinary();
    },
    UserResponse.deserializeBinary
  );

  createUser(
    request: NewUserRequest,
    metadata: grpcWeb.Metadata | null): Promise<UserResponse>;

  createUser(
    request: NewUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: UserResponse) => void): grpcWeb.ClientReadableStream<UserResponse>;

  createUser(
    request: NewUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: UserResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/SynchronicityService/CreateUser',
        request,
        metadata || {},
        this.methodInfoCreateUser,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/SynchronicityService/CreateUser',
    request,
    metadata || {},
    this.methodInfoCreateUser);
  }

  methodInfoGetUser = new grpcWeb.AbstractClientBase.MethodInfo(
    UserResponse,
    (request: GetUserRequest) => {
      return request.serializeBinary();
    },
    UserResponse.deserializeBinary
  );

  getUser(
    request: GetUserRequest,
    metadata: grpcWeb.Metadata | null): Promise<UserResponse>;

  getUser(
    request: GetUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: UserResponse) => void): grpcWeb.ClientReadableStream<UserResponse>;

  getUser(
    request: GetUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: UserResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/SynchronicityService/GetUser',
        request,
        metadata || {},
        this.methodInfoGetUser,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/SynchronicityService/GetUser',
    request,
    metadata || {},
    this.methodInfoGetUser);
  }

  methodInfoGetUsers = new grpcWeb.AbstractClientBase.MethodInfo(
    UsersResponse,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    UsersResponse.deserializeBinary
  );

  getUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<UsersResponse>;

  getUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: UsersResponse) => void): grpcWeb.ClientReadableStream<UsersResponse>;

  getUsers(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: UsersResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/SynchronicityService/GetUsers',
        request,
        metadata || {},
        this.methodInfoGetUsers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/SynchronicityService/GetUsers',
    request,
    metadata || {},
    this.methodInfoGetUsers);
  }

  methodInfoUpdateUser = new grpcWeb.AbstractClientBase.MethodInfo(
    UserResponse,
    (request: UpdateUserRequest) => {
      return request.serializeBinary();
    },
    UserResponse.deserializeBinary
  );

  updateUser(
    request: UpdateUserRequest,
    metadata: grpcWeb.Metadata | null): Promise<UserResponse>;

  updateUser(
    request: UpdateUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: UserResponse) => void): grpcWeb.ClientReadableStream<UserResponse>;

  updateUser(
    request: UpdateUserRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: UserResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/SynchronicityService/UpdateUser',
        request,
        metadata || {},
        this.methodInfoUpdateUser,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/SynchronicityService/UpdateUser',
    request,
    metadata || {},
    this.methodInfoUpdateUser);
  }

  methodInfoGetTimeline = new grpcWeb.AbstractClientBase.MethodInfo(
    TimelineResponse,
    (request: GetTimelineRequest) => {
      return request.serializeBinary();
    },
    TimelineResponse.deserializeBinary
  );

  getTimeline(
    request: GetTimelineRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/SynchronicityService/GetTimeline',
      request,
      metadata || {},
      this.methodInfoGetTimeline);
  }

}

