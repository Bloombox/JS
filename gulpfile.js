
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


/**
 * Generate a new closure build routine.
 */
function closureBuilder() {
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
      "define": [
        "bloombox.DEBUG=false",
        "bloombox.VERSION='" + version + "'"
      ],
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
      "define": [
        "bloombox.DEBUG=true",
        "bloombox.VERSION='" + version + "'"
      ],
      "hide_warnings_for": [
        "goog/json/json_perf",
        "goog/storage/mechanism",
        "closure/goog",
        "goog"
      ]
    }
  };

  return new Promise((resolve, reject) => {
    closureBuild.build({
    'name': 'bloombox',
    'srcs': glob([
      'src/**/*.soy',
      'src/**/*.js'
    ]),
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
    "out": buildRootDirectory + "/bloombox-js-" + version + ".min.js",
    "license": "src/license.txt",
    "out_source_map": buildRootDirectory + "/bloombox-js-" + version + ".map"
  }, (function(errors, warnings, files, results) {
    if (errors) {
      reject();
    } else {
      resolve();
    }
  }).bind(this));
});
}


gulp.task('closure', gulp.series(() => {
  return closureBuilder();
}));

gulp.task('build', gulp.series(['closure']));
gulp.task('default', gulp.series('build'));
