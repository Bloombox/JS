workspace(name = "io_bloombox_sdk_js")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

local = True


#
# REPOSITORIES
#

## Closure Rules
http_archive(
    name = "io_bazel_rules_closure",
    url = "https://github.com/bloombox/rules_closure/archive/503bd4fa6b0493babb60921ace70150863555647.zip",
    strip_prefix = "rules_closure-503bd4fa6b0493babb60921ace70150863555647",
    sha256 = "e4b07331284e2b5bdcf3542a81b9f7e123d998cccf141095bd7deb201bcc268a")

http_archive(
    name = "build_bazel_rules_proto",
    sha256 = "26ef80422c978cd0590734c103bc66dae6932989542845efb365fcc48b6d810f",
    strip_prefix = "rules_proto-6b247dbf28aa3b6f485047c938731ec8c2453a83",
    urls = ["https://github.com/Yannic/rules_proto/archive/6b247dbf28aa3b6f485047c938731ec8c2453a83.tar.gz"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_repositories")
closure_repositories()

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_register_toolchains")
closure_register_toolchains()

## Schema
local_repository(
    name = "io_bloombox_schema",
    path = "/workspace/Bloombox/schema")

## Protobuf
http_archive(
    name = "com_google_protobuf",
    sha256 = "9510dd2afc29e7245e9e884336f848c8a6600a14ae726adb6befdb4f786f0be2",
    strip_prefix = "protobuf-3.6.1.3",
    urls = ["https://github.com/google/protobuf/archive/v3.6.1.3.zip"])

## Skylib
git_repository(
    name = "bazel_skylib",
    remote = "https://github.com/bazelbuild/bazel-skylib",
    tag = "0.7.0")

## Google APIs: Codegen
http_archive(
    name = "com_google_api_codegen",
    urls = ["https://github.com/googleapis/gapic-generator/archive/8e930b79e846b9d4876462be9dc4c1dbc04e2903.zip"],
    strip_prefix = "gapic-generator-8e930b79e846b9d4876462be9dc4c1dbc04e2903")

## Google APIs
http_archive(
    name = "com_google_api",
    strip_prefix = "googleapis-c39b7e880e6db2ce61704da2a55083ea17fdb14b",
    urls = ["https://github.com/googleapis/googleapis/archive/c39b7e880e6db2ce61704da2a55083ea17fdb14b.zip"])

## Bazel: Go
http_archive(
    name = "io_bazel_rules_go",
    strip_prefix = "rules_go-7d17d496a6b32f6a573c6c22e29c58204eddf3d4",
    urls = ["https://github.com/bazelbuild/rules_go/archive/7d17d496a6b32f6a573c6c22e29c58204eddf3d4.zip"])

## gRPC Web
git_repository(
    name = "com_google_grpc_web",
    remote = "https://github.com/grpc/grpc-web.git",
    branch = "master")


load("@com_google_api_codegen//rules_gapic/java:java_gapic_repositories.bzl", "java_gapic_repositories")
java_gapic_repositories()

load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")

go_rules_dependencies()
go_register_toolchains()

load("@com_google_api//:repository_rules.bzl", "switched_rules_by_language")

switched_rules_by_language(
    name = "com_google_googleapis_imports",
    cc = False,
    gapic = False,
    go = False,
    grpc = False,
    java = False,
    php = False,
)
