
'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const ignore = require('gulp-ignore');
const closureBuild = require('closure-builder');
const argv = require('yargs').argv;
const glob = closureBuild.globSupport();

const buildRootDirectory = 'target';

const version = argv.libversion;
if (typeof version !== "string")
  throw "Cannot resolve version.";

const permutations = ['full'];


/**
 * Generate a new closure build routine.
 */
function closureBuilder(entrypoint) {
  const isRelease = argv.buildtype === "RELEASE" || argv.release;
  const config = isRelease ? {
    /** -- Release Config -- **/
    "soy": {
      "useClosureStyle": true,
      "shouldGenerateJsdoc": true,
      "shouldProvideRequireSoyNamespaces": true,
      "shouldProvideRequireJsFunctions": true
    },
    "closure": {
      "debug": false,
      "dependency_mode": "STRICT",
      "entry_point": "goog:bloombox.setup",
      "output_manifest": "target/manifest-" + entrypoint + ".MF",
      "charset": "UTF-8",
      "use_types_for_optimization": true,
      "compilation_level": "ADVANCED",
      "env": "BROWSER",
      "language_in": "ECMASCRIPT6",
      "language_out": "ECMASCRIPT5_STRICT",
      "warning_level": "QUIET",
      "export_local_property_definitions": true,
      "generate_exports": true,
      "isolation_mode": "IIFE",
      "assume_function_wrapper": true,
      "process_closure_primitives": true,
      "rewrite_polyfills": true,
      "D": "bloombox.DEBUG=false",
      "define": "bloombox.VERSION='" + version + "'",
      "hide_warnings_for": [
        "goog/json/json_perf",
        "goog/storage/mechanism",
        "closure/goog",
        "goog"
      ]
    }
  } : {
    /** -- Debug Config -- **/
    "soy": {
      "useClosureStyle": true,
      "shouldGenerateJsdoc": true,
      "shouldProvideRequireSoyNamespaces": true,
      "shouldProvideRequireJsFunctions": true
    },
    "closure": {
      "debug": true,
      "dependency_mode": "STRICT",
      "entry_point": "goog:bloombox.setup",
      "output_manifest": "target/manifest-" + entrypoint + ".MF",
      "formatting": "PRETTY_PRINT",
      "charset": "UTF-8",
      "use_types_for_optimization": true,
      "compilation_level": "ADVANCED",
      "env": "BROWSER",
      "language_in": "ECMASCRIPT6",
      "language_out": "ECMASCRIPT5_STRICT",
      "warning_level": "DEFAULT",
      "export_local_property_definitions": true,
      "generate_exports": true,
      "isolation_mode": "IIFE",
      "assume_function_wrapper": true,
      "process_closure_primitives": true,
      "rewrite_polyfills": true,
      "D": "bloombox.DEBUG",
      "define": "bloombox.VERSION='" + version + "'",
      "hide_warnings_for": [
        "goog/json/json_perf",
        "goog/storage/mechanism",
        "closure/goog",
        "goog"
      ]
    }
  };

  const externsPath = 'third_party/closure/compiler/contrib/externs/';
  const browserExternsPath = 'third_party/closure/compiler/externs/browser/';
  const mainlineExternsPath = 'third_party/closure/compiler/externs/';

  function extern(path, isBrowser, isMainline) {
    if (isBrowser)
      return browserExternsPath + path;
    if (isMainline)
      return mainlineExternsPath + path;
    return externsPath + path;
  }

  return new Promise((resolve, reject) => {
    closureBuild.build({
    'name': 'bloombox',
    'srcs': glob([
      'src/**/*.soy',
      'src/**/*.js',
      'entrypoint/' + entrypoint + '.js'
    ]),
    'externs': [
      extern('facebook_javascript_sdk.js'),
      extern('google_loader_api.js'),
      extern('google_tag_manager_api.js'),
      extern('google_universal_analytics_api.js'),
      extern('polymer-1.0.js')
    ],
    'exclude_test': true,
    "deps": glob([
      "schema/languages/js/*.pb.js",
      "protobuf/js/debug.js",
      "protobuf/js/map.js",
      "protobuf/js/message.js",
      "protobuf/js/binary/arith.js",
      "protobuf/js/binary/constants.js",
      "protobuf/js/binary/decoder.js",
      "protobuf/js/binary/encoder.js",
      "protobuf/js/binary/reader.js",
      "protobuf/js/binary/utils.js",
      "protobuf/js/binary/writer.js",
      "protobuf/js/google/protobuf/any.js",
      "protobuf/js/google/protobuf/api.js",
      "protobuf/js/google/protobuf/descriptor.js",
      "protobuf/js/google/protobuf/empty.js",
      "protobuf/js/google/protobuf/field_mask.js",
      "protobuf/js/google/protobuf/source_context.js",
      "protobuf/js/google/protobuf/struct.js",
      "protobuf/js/google/protobuf/timestamp.js",
      "protobuf/js/google/protobuf/type.js",
      "protobuf/js/google/protobuf/wrappers.js"
    ]),
    "options": config,
    "out": buildRootDirectory + "/" + (entrypoint == "full" ? "" : (entrypoint + "-")) + version + ".min.js",
    "license": "src/license.txt",
    "out_source_map": buildRootDirectory + "/" + (entrypoint == "full" ? "" : (entrypoint + "-")) + version + ".map"
  }, (function(errors, warnings, files, results) {
    if (errors) {
      reject();
    } else {
      resolve();
    }
  }).bind(this));
});
}


let taskname;
let tasks = [];
permutations.map(function(variant) {
  taskname = ['closure', variant].join(':');

  gulp.task(taskname, gulp.series(() => {
    return closureBuilder(variant);
  }));

  tasks.push(taskname);
});

gulp.task('build', gulp.series(tasks));
gulp.task('default', gulp.series('build'));

