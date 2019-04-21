
'use strict';

const gulp = require('gulp');
const ignore = require('gulp-ignore');
const closureBuild = require('closure-builder');
const argv = require('yargs').argv;
const glob = closureBuild.globSupport();

const buildRootDirectory = 'target';

const version = argv.libversion;
if (typeof version !== 'string')
  throw 'Cannot resolve version.';

const permutations = ['full'];


/**
 * Generate a new closure build routine.
 */
function closureBuilder(entrypoint) {
  const isRelease = argv.buildtype === 'RELEASE' || argv.release;
  const isBeta = argv.buildtype === 'BETA' || argv.beta;
  const config = isRelease ? {
    /** -- Release Config -- **/
    'soy': {
      'useClosureStyle': true,
      'shouldGenerateJsdoc': true,
      'shouldProvideRequireSoyNamespaces': true,
      'shouldProvideRequireJsFunctions': true
    },
    'closure': {
      'warning_level': 'QUIET',
      'dependency_mode': 'STRICT',
      'entry_point': 'goog:bloombox.setup',
      'output_manifest': 'target/manifest-' + entrypoint + '.MF',
      'charset': 'UTF-8',
      'use_types_for_optimization': true,
      'compilation_level': 'ADVANCED',
      'env': 'BROWSER',
      'language_in': 'ECMASCRIPT6',
      'language_out': 'ECMASCRIPT6',
      'export_local_property_definitions': true,
      'generate_exports': true,
      'isolation_mode': 'IIFE',
      'assume_function_wrapper': true,
      'process_closure_primitives': true,
      'rewrite_polyfills': true,
      'D': ['bloombox.DEBUG=false'],
      'define': 'bloombox.VERSION=\'' + version + '\'',
      'create_source_map': 'target/js-' + entrypoint + '.map',
      'output_module_dependencies': 'target/deps-' + entrypoint + '.json',
      'source_map_include_content': true,
      'hide_warnings_for': [
        'goog/json/json_perf',
        'goog/storage/mechanism',
        'closure/goog',
        'goog'
      ]
    }
  } : (isBeta ? {
    /** -- Beta Config -- **/
    'soy': {
      'useClosureStyle': true,
      'shouldGenerateJsdoc': true,
      'shouldProvideRequireSoyNamespaces': true,
      'shouldProvideRequireJsFunctions': true
    },
    'closure': {
      'warning_level': 'QUIET',
      'dependency_mode': 'STRICT',
      'entry_point': 'goog:bloombox.setup',
      'output_manifest': 'target/manifest-' + entrypoint + '.MF',
      'charset': 'UTF-8',
      'use_types_for_optimization': true,
      'compilation_level': 'ADVANCED',
      'env': 'BROWSER',
      'language_in': 'ECMASCRIPT6',
      'language_out': 'ECMASCRIPT6',
      'export_local_property_definitions': true,
      'generate_exports': true,
      'isolation_mode': 'IIFE',
      'assume_function_wrapper': true,
      'process_closure_primitives': true,
      'rewrite_polyfills': true,
      'D': ['bloombox.DEBUG=false'],
      'define': 'bloombox.VERSION=\'' + version + '\'',
      'create_source_map': 'target/js-' + entrypoint + '.map',
      'output_module_dependencies': 'target/deps-' + entrypoint + '.json',
      'source_map_include_content': true,
      'hide_warnings_for': [
        'goog/json/json_perf',
        'goog/storage/mechanism',
        'closure/goog',
        'goog'
      ]
    }
  } : {
    /** -- Debug Config -- **/
    'soy': {
      'useClosureStyle': true,
      'shouldGenerateJsdoc': true,
      'shouldProvideRequireSoyNamespaces': true,
      'shouldProvideRequireJsFunctions': true
    },
    'closure': {
      'warning_level': 'DEFAULT',
      'dependency_mode': 'STRICT',
      'entry_point': 'goog:bloombox.setup',
      'output_manifest': 'target/manifest-' + entrypoint + '.MF',
      'formatting': 'PRETTY_PRINT',
      'charset': 'UTF-8',
      'use_types_for_optimization': true,
      'compilation_level': 'ADVANCED',
      'env': 'BROWSER',
      'language_in': 'ECMASCRIPT6',
      'language_out': 'ECMASCRIPT6',
      'export_local_property_definitions': true,
      'generate_exports': true,
      'isolation_mode': 'IIFE',
      'assume_function_wrapper': true,
      'process_closure_primitives': true,
      'rewrite_polyfills': true,
      'D': ['bloombox.DEBUG'],
      'define': 'bloombox.VERSION=\'' + version + '\'',
      'create_source_map': 'target/js-' + entrypoint + '.map',
      'output_module_dependencies': 'target/deps-' + entrypoint + '.json',
      'source_map_include_content': true,
      'hide_warnings_for': [
        'goog/json/json_perf',
        'goog/storage/mechanism',
        'closure/goog',
        'goog'
      ]
    }
  });

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
      extern('google_universal_analytics_api.js')
    ],
    'exclude_test': true,
    'deps': glob([
      'third_party/schema/*.js',
      'third_party/schema/services/**/*.js',
      'third_party/protobuf/js/**/*.js',
      'third_party/grpc-web/javascript/**/*.js'
    ]),
    'options': config,
    'out': buildRootDirectory + '/' + (entrypoint === 'full' ? '' : (entrypoint + '-')) + version + '.min.js',
    'license': 'src/license.txt',
    'out_source_map': buildRootDirectory + '/' + (entrypoint === 'full' ? '' : (entrypoint + '-')) + version + '.map'
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
