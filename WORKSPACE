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
    url = "https://github.com/bloombox/rules_closure/archive/eb1a2be2124a6bbf03cb5cc0d235bbda1e662308.zip",
    strip_prefix = "rules_closure-eb1a2be2124a6bbf03cb5cc0d235bbda1e662308",
    sha256 = "f1d1254c537f48952d35498eeac8df1ae86e75013391e16c3edc119766c3bd92")

http_archive(
    name = "build_bazel_rules_proto",
    sha256 = "b851e971f5b8ab82e19ac0ac6a80605a50c476400253b751b7828b3b03134589",
    strip_prefix = "rules_proto-c5e0081628a2cbaf6855152ffa6a1984c2ff10a5",
    urls = ["https://github.com/bloombox/rules_proto/archive/c5e0081628a2cbaf6855152ffa6a1984c2ff10a5.tar.gz"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_repositories")
closure_repositories()

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_register_toolchains")
closure_register_toolchains()

## Schema
(local and
    local_repository(
        name = "io_bloombox_schema",
        path = "/workspace/Bloombox/schema")
or
    git_repository(
        name = "io_bloombox_schema",
        remote = "git@github.com:bloombox/schema.git",
        shallow_since = "1565293120 -0700",
        commit = "dbf60846158432cda69c38b3e11535c56fa88f24"))

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
    strip_prefix = "gapic-generator-8e930b79e846b9d4876462be9dc4c1dbc04e2903",
    sha256 = "ba19948ebc4ea39358ba07fc0253f8927d7a2c9ba3462e8f34faad7ad5ac4142")

## Google APIs
http_archive(
    name = "com_google_api",
    strip_prefix = "googleapis-c39b7e880e6db2ce61704da2a55083ea17fdb14b",
    urls = ["https://github.com/googleapis/googleapis/archive/c39b7e880e6db2ce61704da2a55083ea17fdb14b.zip"],
    sha256 = "ba00a2509e449e0a2cdc56716a01f96beb9cc81e387d84ef32f0b61436048245")

## Bazel: Go
http_archive(
    name = "io_bazel_rules_go",
    strip_prefix = "rules_go-7d17d496a6b32f6a573c6c22e29c58204eddf3d4",
    urls = ["https://github.com/bazelbuild/rules_go/archive/7d17d496a6b32f6a573c6c22e29c58204eddf3d4.zip"],
    sha256 = "bf483b3be44fbe1dc798f18470cadf67541f5d890cad691ef335546a88f5ba0f")

## gRPC Web
git_repository(
    name = "com_google_grpc_web",
    remote = "https://github.com/grpc/grpc-web.git",
    commit = "80358bbeaa61a31848f7dda04e416a72e893460e",
    shallow_since = "1572410901 -0700")


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
