// Karma configuration
// Generated on Wed Feb 28 2018 15:01:42 GMT-0800 (PST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'target/*-debug.min.js',
      'tests/**/*.js'
    ],
    exclude: [
    ],
    preprocessors: {
    },
    reporters: ['dots', 'BrowserStack'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    customLaunchers: {
      firefox_mac_latest: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '58.0',
        os: 'OS X',
        os_version: 'High Sierra'
      },
      chrome_mac_latest: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '64.0',
        os: 'OS X',
        os_version: 'High Sierra'
      },
      safari_mac_latest: {
        base: 'BrowserStack',
        browser: 'Safari',
        browser_version: '11',
        os: 'OS X',
        os_version: 'High Sierra'
      },
      ie_11: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '10.0'
      },
      edge_16: {
        base: 'BrowserStack',
        browser: 'Edge',
        browser_version: '16.0',
        os: 'Windows',
        os_version: '10'
      },
      iphone5s_safari_7: {
        base: 'BrowserStack',
        device: 'iPhone 5S',
        os: 'ios',
        os_version: '7.0',
        browser_version: null,
        browser: 'Mobile Safari'
      },
      pixel8: {
        base: 'BrowserStack',
        device: 'Pixel',
        os: 'Android',
        os_version: '8.0'
      }
    },
    browsers: ['firefox_mac_latest', 'chrome_mac_latest', 'safari_mac_latest', 'ie_11', 'edge_16'],
    singleRun: true,
    concurrency: 1
  })
}
