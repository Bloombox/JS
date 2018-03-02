// Karma configuration
// Generated on Wed Feb 28 2018 15:01:42 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'closure', 'chai', 'mocha'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/closure-builder/third_party/closure-library/closure/goog/base.js',
      'tests/suites/**/*.js',
      'tests/init.js',
      'tests/sanity_tests.js',
      'tests/source_tests.js',
      {pattern: 'third_party/schema/*.js', included: false},
      {pattern: 'third_party/protobuf/js/map.js', included: false},
      {pattern: 'third_party/protobuf/js/message.js', included: false},
      {pattern: 'third_party/protobuf/js/google/protobuf/*.js', included: false},
      {pattern: 'third_party/protobuf/js/binary/*.js', included: false},
      {pattern: 'node_modules/closure-builder/third_party/closure-library/closure/goog/**/*.js', included: false, served: false},
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'entrypoint/full.js', included: false},
      {pattern: 'node_modules/closure-builder/third_party/closure-library/closure/goog/deps.js', included: false, served: false}
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


    // shut off browser logs
    client: {
      captureConsole: false
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests/suites/**/*.js': ['closure', 'babel', 'closure-iit'],
      'tests/*.js': ['closure', 'babel', 'closure-iit'],
      'third_party/schema/*.js': ['closure', 'babel'],
      'third_party/protobuf/js/binary/*.js': ['closure'],
      'third_party/protobuf/js/map.js': ['closure'],
      'third_party/protobuf/js/message.js': ['closure'],
      'third_party/protobuf/js/google/protobuf/*.js': ['closure'],
      'node_modules/closure-builder/third_party/closure-library/closure/goog/**/*.js': ['closure'],
      'src/**/*.js': ['closure', 'babel', 'coverage'],
      'entrypoint/full.js': ['closure', 'babel'],
      'node_modules/closure-builder/third_party/closure-library/closure/goog/deps.js': ['closure-deps']
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
     'PhantomJS',
     'Safari',
     'Firefox',
     'ChromeCanary'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 3
  });
};
