// Karma configuration
// Generated on Wed Feb 28 2018 15:01:42 GMT-0800 (PST)

function closureLibrary(path) {
  return 'node_modules/closure-builder/third_party/closure-library/closure/' + path;
}

const closureBase = closureLibrary('goog/base.js');
const closureDeps = closureLibrary('goog/deps.js');
const closureLib = 'node_modules/closure-builder/third_party/closure-library/closure/goog/**/*.js';
const closure3rd = 'node_modules/closure-builder/third_party/closure-library/third_party/closure/**/*.js';

let basePreprocessors = {};
basePreprocessors[closureBase] = ['closure'];
basePreprocessors[closureDeps] = ['closure-deps'];

const serviceMode = 'binary';  // 'text' or 'binary'


module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'closure', 'chai', 'mocha'],

    files: [
      // 1: closure base
      closureBase,
      {pattern: closureDeps, included: false, served: false},
      {pattern: closureLib, included: false, served: true},
      {pattern: closure3rd, included: false, served: true},

      // 2: protobuf JS, grpc web
      {pattern: 'third_party/protobuf/js/map.js', included: false},
      {pattern: 'third_party/protobuf/js/message.js', included: false},
      {pattern: 'third_party/protobuf/js/google/protobuf/*.js', included: false},
      {pattern: 'third_party/protobuf/js/binary/*.js', included: false},
      {pattern: 'third_party/grpc-web/javascript/net/grpc/web/util/*.js', included: false},
      {pattern: 'third_party/grpc-web/javascript/net/grpc/web/*.js', included: false},
      {pattern: `third_party/schema/services/**/*.${serviceMode}.grpc.js`, included: false},
      {pattern: `third_party/schema/services/**/*.stream.grpc.js`, included: false},

      // 3: schema, services
      {pattern: 'third_party/schema/*.js', included: false},

      // 4: source files (watched and served)
      'third_party/stackdriver/error-reporting.js',
      {pattern: 'src/**/*.js', included: false},
      'entrypoint/full.js',

      // 5: test files
      'tests/suites/*.js',
      'tests/init.js',
      'tests/sanity_tests.js',
      'tests/init_sources.js',
      'tests/source_tests.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    babelPreprocessor: {
      options: {
        presets: ['@babel/env'],
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },

    client: {
      captureConsole: false
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'node_modules/closure-builder/third_party/closure-library/closure/goog/deps.js': ['closure-deps'],
      'node_modules/closure-builder/third_party/closure-library/closure/goog/**/*.js': ['closure'],
      'node_modules/closure-builder/third_party/closure-library/closure/third_party/goog/**/*.js': ['closure'],
      'tests/suites/**/*.js': ['closure', 'closure-iit'],
      'tests/*.js': ['closure', 'closure-iit'],
      'third_party/schema/*.js': ['closure'],
      'third_party/protobuf/js/binary/*.js': ['closure'],
      'third_party/protobuf/js/map.js': ['closure'],
      'third_party/protobuf/js/message.js': ['closure'],
      'third_party/protobuf/js/google/protobuf/*.js': ['closure'],
      'third_party/schema/services/**/*.js': ['closure'],
      'third_party/grpc-web/javascript/net/grpc/web/util/*.js': ['closure'],
      'third_party/grpc-web/javascript/net/grpc/web/*.js': ['closure'],
      'src/**/*.js': ['closure', 'coverage'],
      'entrypoint/full.js': ['closure']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'kjhtml',
      'mocha',
      'coverage'
    ],

    coverageReporter: {
      dir: 'target/coverage/',
      watermarks: {
        statements: [ 50, 75 ],
        functions: [ 50, 75 ],
        branches: [ 50, 75 ],
        lines: [ 50, 75 ]
      },
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.xml' },
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
      ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
     'ChromeHeadless'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 3
  });
};
