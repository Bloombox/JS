// Karma configuration
// Generated on Wed Feb 28 2018 15:01:42 GMT-0800 (PST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'target/*-debug.min.js',
      'tests/**/*.js'
    ],
    exclude: [
    ],
    browserStack: {
      username: 'samgammon2',
      accessKey: process.env.BROWSERSTACK_KEY
    },
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
        os_version: '11'
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
        device: 'Pixel',
        os: 'Android',
        os_version: '8.0'
      }
    },
    browsers: [
      'firefox_mac_latest', 'chrome_mac_latest', 'safari_mac_latest',
      'firefox_mac_oldest', 'chrome_mac_oldest', 'safari_mac_oldest',
      'firefox_windows_latest', 'chrome_windows_latest',
      'ie_11', 'edge_16', 'firefox_windows_oldest', 'chrome_windows_oldest',
      'ie_10', 'ie_9', 'ie_8', 'safari_windows',
      'iphoneX_safari_11', 'pixel8'],
    singleRun: true,
    concurrency: Infinity,
    tunnelIdentifier: process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
    startTunnel: false
  })
}
