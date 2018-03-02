// Karma configuration
// Generated on Wed Feb 28 2018 15:01:42 GMT-0800 (PST)

module.exports = function(config) {
  let saucelabsBrowsers = [];
  let latestBrowsers = [];
  let oldBrowsers = [];
  let macBrowsers = [];
  let windowsBrowsers = [];
  let linuxBrowsers = [];
  let chromeBrowsers = [];
  let firefoxBrowsers = [];
  let safariBrowsers = [];
  let edgeBrowsers = [];
  let ieBrowsers = [];
  let mobileBrowsers = [];
  let iosBrowsers = [];
  let androidBrowsers = [];

  // sauce labs browsers: mac
  let chromeMacLatest = {browserName: 'chrome'};
  chromeMacLatest['name'] = 'chromeMacLatest';
  chromeMacLatest['base'] = 'SauceLabs';
  chromeMacLatest['platform'] = 'macOS 10.13';
  chromeMacLatest['version'] = '64.0';
  chromeMacLatest['recordVideo'] = true;
  chromeMacLatest['recordScreenshots'] = true;
  saucelabsBrowsers.push(chromeMacLatest);
  latestBrowsers.push(chromeMacLatest);
  macBrowsers.push(chromeMacLatest);
  chromeBrowsers.push(chromeMacLatest);

  let chromeMacOldest = {browserName: 'chrome'};
  chromeMacOldest['name'] = 'chromeMacOldest';
  chromeMacOldest['base'] = 'SauceLabs';
  chromeMacOldest['platform'] = 'OS X 10.9';
  chromeMacOldest['version'] = '31.0';
  chromeMacOldest['recordVideo'] = true;
  chromeMacOldest['recordScreenshots'] = true;
  saucelabsBrowsers.push(chromeMacOldest);
  oldBrowsers.push(chromeMacOldest);
  macBrowsers.push(chromeMacOldest);
  chromeBrowsers.push(chromeMacOldest);

  let safariMacLatest = {browserName: 'safari'};
  safariMacLatest['name'] = 'safariMacLatest';
  safariMacLatest['base'] = 'SauceLabs';
  safariMacLatest['platform'] = 'macOS 10.13';
  safariMacLatest['version'] = '11.0';
  safariMacLatest['recordVideo'] = true;
  safariMacLatest['recordScreenshots'] = true;
  saucelabsBrowsers.push(safariMacLatest);
  latestBrowsers.push(safariMacLatest);
  macBrowsers.push(safariMacLatest);
  safariBrowsers.push(safariMacLatest);

  let safariMacOldest = {browserName: 'safari'};
  safariMacOldest['name'] = 'safariMacOldest';
  safariMacOldest['base'] = 'SauceLabs';
  safariMacOldest['platform'] = 'OS X 10.9';
  safariMacOldest['version'] = '7.0';
  safariMacOldest['recordVideo'] = true;
  safariMacOldest['recordScreenshots'] = true;
  saucelabsBrowsers.push(safariMacOldest);
  oldBrowsers.push(safariMacOldest);
  macBrowsers.push(safariMacOldest);
  safariBrowsers.push(safariMacOldest);

  let firefoxMacLatest = {browserName: 'firefox'};
  firefoxMacLatest['name'] = 'firefoxMacLatest';
  firefoxMacLatest['base'] = 'SauceLabs';
  firefoxMacLatest['platform'] = 'macOS 10.13';
  firefoxMacLatest['version'] = '58.0';
  firefoxMacLatest['recordVideo'] = true;
  firefoxMacLatest['recordScreenshots'] = true;
  saucelabsBrowsers.push(firefoxMacLatest);
  latestBrowsers.push(firefoxMacLatest);
  macBrowsers.push(firefoxMacLatest);
  firefoxBrowsers.push(firefoxMacLatest);

  let firefoxMacOldest = {browserName: 'firefox'};
  firefoxMacOldest['name'] = 'firefoxMacOldest';
  firefoxMacOldest['base'] = 'SauceLabs';
  firefoxMacOldest['platform'] = 'OS X 10.9';
  firefoxMacOldest['version'] = '15.0';
  firefoxMacOldest['recordVideo'] = true;
  firefoxMacOldest['recordScreenshots'] = true;
  saucelabsBrowsers.push(firefoxMacOldest);
  oldBrowsers.push(firefoxMacOldest);
  macBrowsers.push(firefoxMacOldest);
  firefoxBrowsers.push(firefoxMacOldest);

  // sauce labs browsers: windows
  let edgeLatest = {browserName: 'MicrosoftEdge'};
  edgeLatest['name'] = 'edgeLatest';
  edgeLatest['base'] = 'SauceLabs';
  edgeLatest['platform'] = 'Windows 10';
  edgeLatest['version'] = '16.16299';
  edgeLatest['recordVideo'] = true;
  edgeLatest['recordScreenshots'] = true;
  saucelabsBrowsers.push(edgeLatest);
  latestBrowsers.push(edgeLatest);
  windowsBrowsers.push(edgeLatest);
  edgeBrowsers.push(edgeLatest);

  let chromeWindowsLatest = {browserName: 'chrome'};
  chromeWindowsLatest['name'] = 'chromeWindowsLatest';
  chromeWindowsLatest['base'] = 'SauceLabs';
  chromeWindowsLatest['platform'] = 'Windows 10';
  chromeWindowsLatest['version'] = '64.0';
  chromeWindowsLatest['recordVideo'] = true;
  chromeWindowsLatest['recordScreenshots'] = true;
  saucelabsBrowsers.push(chromeWindowsLatest);
  latestBrowsers.push(chromeWindowsLatest);
  windowsBrowsers.push(chromeWindowsLatest);
  chromeBrowsers.push(chromeWindowsLatest);

  let chromeWindowsOldest = {browserName: 'chrome'};
  chromeWindowsOldest['name'] = 'chromeWindowsOldest';
  chromeWindowsOldest['base'] = 'SauceLabs';
  chromeWindowsOldest['platform'] = 'Windows 7';
  chromeWindowsOldest['version'] = '26.0';
  chromeWindowsOldest['recordVideo'] = true;
  chromeWindowsOldest['recordScreenshots'] = true;
  saucelabsBrowsers.push(chromeWindowsOldest);
  oldBrowsers.push(chromeWindowsOldest);
  windowsBrowsers.push(chromeWindowsOldest);
  chromeBrowsers.push(chromeWindowsOldest);

  let firefoxWindowsLatest = {browserName: 'firefox'};
  firefoxWindowsLatest['name'] = 'firefoxWindowsLatest';
  firefoxWindowsLatest['base'] = 'SauceLabs';
  firefoxWindowsLatest['platform'] = 'Windows 10';
  firefoxWindowsLatest['version'] = '58.0';
  firefoxWindowsLatest['recordVideo'] = true;
  firefoxWindowsLatest['recordScreenshots'] = true;
  saucelabsBrowsers.push(firefoxWindowsLatest);
  latestBrowsers.push(firefoxWindowsLatest);
  windowsBrowsers.push(firefoxWindowsLatest);
  firefoxBrowsers.push(firefoxWindowsLatest);

  let firefoxWindowsOldest = {browserName: 'firefox'};
  firefoxWindowsOldest['name'] = 'firefoxWindowsOldest';
  firefoxWindowsOldest['base'] = 'SauceLabs';
  firefoxWindowsOldest['platform'] = 'Windows 7';
  firefoxWindowsOldest['version'] = '4.0';
  firefoxWindowsOldest['recordVideo'] = true;
  firefoxWindowsOldest['recordScreenshots'] = true;
  saucelabsBrowsers.push(firefoxWindowsOldest);
  oldBrowsers.push(firefoxWindowsOldest);
  windowsBrowsers.push(firefoxWindowsOldest);
  firefoxBrowsers.push(firefoxWindowsOldest);

  let ie11Windows10 = {browserName: 'internet explorer'};
  ie11Windows10['name'] = 'ie11Windows10';
  ie11Windows10['base'] = 'SauceLabs';
  ie11Windows10['platform'] = 'Windows 10';
  ie11Windows10['version'] = '11.103';
  ie11Windows10['recordVideo'] = true;
  ie11Windows10['recordScreenshots'] = true;
  saucelabsBrowsers.push(ie11Windows10);
  oldBrowsers.push(ie11Windows10);
  windowsBrowsers.push(ie11Windows10);
  ieBrowsers.push(ie11Windows10);

  let ie10Windows7 = {browserName: 'internet explorer'};
  ie10Windows7['name'] = 'ie10Windows7';
  ie10Windows7['base'] = 'SauceLabs';
  ie10Windows7['platform'] = 'Windows 7';
  ie10Windows7['version'] = '10.0';
  ie10Windows7['recordVideo'] = true;
  ie10Windows7['recordScreenshots'] = true;
  saucelabsBrowsers.push(ie10Windows7);
  oldBrowsers.push(ie10Windows7);
  windowsBrowsers.push(ie10Windows7);
  ieBrowsers.push(ie10Windows7);

  let ie9Windows7 = {browserName: 'internet explorer'};
  ie9Windows7['name'] = 'ie9Windows7';
  ie9Windows7['base'] = 'SauceLabs';
  ie9Windows7['platform'] = 'Windows 7';
  ie9Windows7['version'] = '9.0';
  ie9Windows7['recordVideo'] = true;
  ie9Windows7['recordScreenshots'] = true;
  saucelabsBrowsers.push(ie9Windows7);
  oldBrowsers.push(ie9Windows7);
  windowsBrowsers.push(ie9Windows7);
  ieBrowsers.push(ie9Windows7);

  let ie8Windows7 = {browserName: 'internet explorer'};
  ie8Windows7['name'] = 'ie8Windows7';
  ie8Windows7['base'] = 'SauceLabs';
  ie8Windows7['platform'] = 'Windows 7';
  ie8Windows7['version'] = '8.0';
  ie8Windows7['recordVideo'] = true;
  ie8Windows7['recordScreenshots'] = true;
  saucelabsBrowsers.push(ie8Windows7);
  oldBrowsers.push(ie8Windows7);
  windowsBrowsers.push(ie8Windows7);
  ieBrowsers.push(ie8Windows7);

  // sauce labs browsers: linux
  let chromeLinuxLatest = {browserName: 'chrome'};
  chromeLinuxLatest['name'] = 'chromeLinuxLatest';
  chromeLinuxLatest['base'] = 'SauceLabs';
  chromeLinuxLatest['platform'] = 'Linux';
  chromeLinuxLatest['version'] = '48.0';
  chromeLinuxLatest['recordVideo'] = true;
  chromeLinuxLatest['recordScreenshots'] = true;
  saucelabsBrowsers.push(chromeLinuxLatest);
  latestBrowsers.push(chromeLinuxLatest);
  linuxBrowsers.push(chromeLinuxLatest);
  chromeBrowsers.push(chromeLinuxLatest);

  let chromeLinuxOldest = {browserName: 'chrome'};
  chromeLinuxOldest['name'] = 'chromeLinuxOldest';
  chromeLinuxOldest['base'] = 'SauceLabs';
  chromeLinuxOldest['platform'] = 'Linux';
  chromeLinuxOldest['version'] = '41.0';
  chromeLinuxOldest['recordVideo'] = true;
  chromeLinuxOldest['recordScreenshots'] = true;
  saucelabsBrowsers.push(chromeLinuxOldest);
  oldBrowsers.push(chromeLinuxOldest);
  linuxBrowsers.push(chromeLinuxOldest);
  chromeBrowsers.push(chromeLinuxOldest);

  let firefoxLinuxLatest = {browserName: 'firefox'};
  firefoxLinuxLatest['name'] = 'firefoxLinuxLatest';
  firefoxLinuxLatest['base'] = 'SauceLabs';
  firefoxLinuxLatest['platform'] = 'Linux';
  firefoxLinuxLatest['version'] = '45.0';
  firefoxLinuxLatest['recordVideo'] = true;
  firefoxLinuxLatest['recordScreenshots'] = true;
  saucelabsBrowsers.push(firefoxLinuxLatest);
  latestBrowsers.push(firefoxLinuxLatest);
  linuxBrowsers.push(firefoxLinuxLatest);
  firefoxBrowsers.push(firefoxLinuxLatest);

  let firefoxLinuxOldest = {browserName: 'firefox'};
  firefoxLinuxOldest['name'] = 'firefoxLinuxOldest';
  firefoxLinuxOldest['base'] = 'SauceLabs';
  firefoxLinuxOldest['platform'] = 'Linux';
  firefoxLinuxOldest['version'] = '38.0';
  firefoxLinuxOldest['recordVideo'] = true;
  firefoxLinuxOldest['recordScreenshots'] = true;
  saucelabsBrowsers.push(firefoxLinuxOldest);
  oldBrowsers.push(firefoxLinuxOldest);
  linuxBrowsers.push(firefoxLinuxOldest);
  firefoxBrowsers.push(firefoxLinuxOldest);

  // iOS
  let iosSafariLatest = {browserName: 'Safari'};
  iosSafariLatest['name'] = 'iosSafariLatest';
  iosSafariLatest['base'] = 'SauceLabs';
  iosSafariLatest['appiumVersion'] = '1.7.2';
  iosSafariLatest['deviceName'] = 'iPhone X Simulator';
  iosSafariLatest['deviceOrientation'] = 'portrait';
  iosSafariLatest['platformVersion'] = '11.2';
  iosSafariLatest['platformName'] = 'iOS';
  iosSafariLatest['recordVideo'] = true;
  iosSafariLatest['recordScreenshots'] = true;
  saucelabsBrowsers.push(iosSafariLatest);
  latestBrowsers.push(iosSafariLatest);
  mobileBrowsers.push(iosSafariLatest);
  iosBrowsers.push(iosSafariLatest);

  let iosSafariOldest = {browserName: 'Safari'};
  iosSafariOldest['name'] = 'iosSafariOldest';
  iosSafariOldest['base'] = 'SauceLabs';
  iosSafariOldest['appiumVersion'] = '1.6.5';
  iosSafariOldest['deviceName'] = 'iPhone 4s Simulator';
  iosSafariOldest['deviceOrientation'] = 'portrait';
  iosSafariOldest['platformVersion'] = '8.1';
  iosSafariOldest['platformName'] = 'iOS';
  iosSafariOldest['recordVideo'] = true;
  iosSafariOldest['recordScreenshots'] = true;
  saucelabsBrowsers.push(iosSafariOldest);
  oldBrowsers.push(iosSafariOldest);
  mobileBrowsers.push(iosSafariOldest);
  iosBrowsers.push(iosSafariOldest);

  // Android
  let androidLatest = {browserName: 'Android'};
  androidLatest['name'] = 'androidLatest';
  androidLatest['base'] = 'SauceLabs';
  androidLatest['appiumVersion'] = '1.7.2';
  androidLatest['deviceName'] = 'Google Pixel GoogleAPI Emulator';
  androidLatest['deviceOrientation'] = 'portrait';
  androidLatest['browserName'] = 'Chrome';
  androidLatest['platformVersion'] = '7.1';
  androidLatest['platformName'] = 'Android';
  androidLatest['recordVideo'] = true;
  androidLatest['recordScreenshots'] = true;
  saucelabsBrowsers.push(androidLatest);
  latestBrowsers.push(androidLatest);
  mobileBrowsers.push(androidLatest);
  androidBrowsers.push(androidLatest);

  let androidOldest = {browserName: 'Browser'};
  androidOldest['name'] = 'androidOldest';
  androidOldest['base'] = 'SauceLabs';
  androidOldest['appiumVersion'] = '1.7.2';
  androidOldest['deviceName'] = 'Samsung Galaxy S3 Emulator';
  androidOldest['deviceOrientation'] = 'portrait';
  androidOldest['platformVersion'] = '4.4';
  androidOldest['platformName'] = 'Android';
  androidOldest['recordVideo'] = true;
  androidOldest['recordScreenshots'] = true;
  saucelabsBrowsers.push(androidOldest);
  oldBrowsers.push(androidOldest);
  mobileBrowsers.push(androidOldest);
  androidBrowsers.push(androidOldest);

  let saucelabsProfiles = {};
  saucelabsBrowsers.forEach(function(item) {
    let profile = Object.assign({}, item);
    delete profile.name;
    saucelabsProfiles[item.name] = profile;
  });

  let browserstackProfiles = {
    firefox_mac_latest: {
      base: 'BrowserStack',
      browser: 'firefox',
      browser_version: '58.0',
      os: 'OS X',
      os_version: 'High Sierra'
    },
    firefox_mac_oldest: {
      base: 'BrowserStack',
      browser: 'firefox',
      browser_version: '4.0',
      os: 'OS X',
      os_version: 'Snow Leopard'
    },
    firefox_windows_latest: {
      base: 'BrowserStack',
      browser: 'firefox',
      browser_version: '58.0',
      os: 'Windows',
      os_version: '10'
    },
    firefox_windows_oldest: {
      base: 'BrowserStack',
      browser: 'firefox',
      browser_version: '3.0',
      os: 'Windows',
      os_version: '7'
    },
    chrome_mac_latest: {
      base: 'BrowserStack',
      browser: 'chrome',
      browser_version: '64.0',
      os: 'OS X',
      os_version: 'High Sierra'
    },
    chrome_mac_oldest: {
      base: 'BrowserStack',
      browser: 'chrome',
      browser_version: '16.0',
      os: 'OS X',
      os_version: 'Snow Leopard'
    },
    chrome_windows_latest: {
      base: 'BrowserStack',
      browser: 'chrome',
      browser_version: '64.0',
      os: 'Windows',
      os_version: '10'
    },
    chrome_windows_oldest: {
      base: 'BrowserStack',
      browser: 'chrome',
      browser_version: '15.0',
      os: 'Windows',
      os_version: '7'
    },
    safari_mac_latest: {
      base: 'BrowserStack',
      browser: 'Safari',
      browser_version: '11',
      os: 'OS X',
      os_version: 'High Sierra'
    },
    safari_windows: {
      base: 'BrowserStack',
      browser: 'Safari',
      browser_version: '5.1',
      os: 'Windows',
      os_version: '7'
    },
    safari_mac_oldest: {
      base: 'BrowserStack',
      browser: 'Safari',
      browser_version: '4.0',
      os: 'OS X',
      os_version: 'Snow Leopard'
    },
    ie_11: {
      base: 'BrowserStack',
      browser: 'IE',
      browser_version: '11.0',
      os: 'Windows',
      os_version: '10'
    },
    ie_10: {
      base: 'BrowserStack',
      browser: 'IE',
      browser_version: '10.0',
      os: 'Windows',
      os_version: '7'
    },
    ie_9: {
      base: 'BrowserStack',
      browser: 'IE',
      browser_version: '9.0',
      os: 'Windows',
      os_version: '7'
    },
    ie_8: {
      base: 'BrowserStack',
      browser: 'IE',
      browser_version: '8.0',
      os: 'Windows',
      os_version: '7'
    },
    edge_16: {
      base: 'BrowserStack',
      browser: 'Edge',
      browser_version: '16.0',
      os: 'Windows',
      os_version: '10'
    },
    iphoneX_safari_11: {
      base: 'BrowserStack',
      device: 'iPhone X',
      os: 'ios',
      os_version: '11.0',
      browser_version: null,
      browser: 'Mobile Safari'
    },
    pixel8: {
      base: 'BrowserStack',
      browserName: 'android',
      device: 'Google Pixel',
      realMobile: 'true',
      os: 'android',
      os_version: '8.0'
    }
  };

  config.set({
    basePath: '',
    frameworks: ['jasmine', 'closure', 'chai', 'mocha'],
    files: [
      'node_modules/closure-builder/third_party/closure-library/closure/goog/base.js',
      'tests/suites/**/*.js',
      'tests/init.js',
      'tests/sanity_tests.js',

      // Target: Debug
      'target/debug.min.js',
      'tests/debug_tests.js',
      'tests/wasabi.js',

      // Target: Release
      'public/client.min.js',
      'tests/release_tests.js',
      'tests/wasabi.js',

      // Target: Sources
      'tests/init.js',
      'tests/source_tests.js',
      {pattern: 'third_party/schema/*.js', included: false},
      {pattern: 'third_party/protobuf/js/map.js', included: false},
      {pattern: 'third_party/protobuf/js/message.js', included: false},
      {pattern: 'third_party/protobuf/js/google/protobuf/*.js', included: false},
      {pattern: 'third_party/protobuf/js/binary/*.js', included: false},
      {pattern: 'node_modules/closure-builder/third_party/closure-library/closure/goog/**/*.js', included: false, served: false},
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'entrypoint/full.js', included: false},
      {pattern: 'node_modules/closure-builder/third_party/closure-library/closure/goog/deps.js', included: true, served: false}
    ],
    exclude: [
    ],
    browserStack: {
      username: 'samgammon2',
      accessKey: process.env.BROWSERSTACK_KEY,
      tunnelIdentifier: process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
      startTunnel: false
    },
    client: {
      captureConsole: false
    },
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
    reporters: [
      'kjhtml',
      'mocha',
      'coverage',
      'saucelabs'
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
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    customLaunchers: Object.assign({}, browserstackProfiles, saucelabsProfiles),
    browsers: Array.from(new Set([
      // BrowserStack
      'firefox_mac_latest', 'chrome_mac_latest', 'safari_mac_latest',
      //'firefox_mac_oldest', 'chrome_mac_oldest', 'safari_mac_oldest',
      'firefox_windows_latest', 'chrome_windows_latest',
      //'ie_11', 'edge_16', 'firefox_windows_oldest', 'chrome_windows_oldest',
      //'ie_10', 'ie_9', 'ie_8', 'safari_windows',
      'iphoneX_safari_11' //, 'pixel8'
      ])),
      //.concat(latestBrowsers.map(function(item) {
      //  return item.name;
      //})))),
    singleRun: true,
    concurrency: 2,
    tunnelIdentifier: process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
    startTunnel: false,
    sauceLabs: {
      username: 'bloomlabs',
      accessKey: process.env.SAUCE_ACCESS_KEY,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: false,
      connectOptions: {
        username: 'bloombox',
        accessKey: process.env.SAUCE_ACCESS_KEY,
        tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
        testName: 'Bloombox SDK for JavaScript'
      }
    }
  });
};
