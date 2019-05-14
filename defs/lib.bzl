
load("@io_bazel_rules_closure//closure:defs.bzl", _closure_js="closure_js_library")

DEFAULT_SUPPRESSIONS = [
    "JSC_IMPLICITLY_NULLABLE_JSDOC",
    "JSC_NULLABLE_RETURN_WITH_NAME",
    "JSC_UNKNOWN_EXPR_TYPE"]


def js_library(
        name,
        srcs = [],
        convention = "GOOGLE",
        deps = [],
        exports = [],
        suppress = []):

    """ - """

    if len(srcs):
        _closure_js(
            name=name,
            srcs=srcs,
            convention=convention,
            deps=deps,
            exports=exports,
            suppress=suppress + DEFAULT_SUPPRESSIONS)
    elif len(exports):
        _closure_js(
            name=name,
            exports=exports)
