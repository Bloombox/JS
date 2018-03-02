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
  chromeWindowsOldest['version'] = '31.0';
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
  firefoxWindowsOldest['version'] = '15.0';
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
  };

  config.set({
    basePath: '',
    frameworks: ['jasmine', 'mocha', 'chai'],
    files: [
      'tests/init.js',
      'target/*-debug.min.js',
      'tests/suites/**/*.js',
      'tests/basic_tests.js'
    ],
    exclude: [
    ],
    browserStack: {
      username: 'samgammon2',
      accessKey: process.env.BROWSERSTACK_KEY
    },
    client: {
      captureConsole: false
    },
    preprocessors: {
    },
    reporters: ['kjhtml', 'mocha', 'saucelabs'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    customLaunchers: Object.assign({}, browserstackProfiles, saucelabsProfiles),
    browsers: [
      // BrowserStack
      //'firefox_mac_latest', 'chrome_mac_latest', 'safari_mac_latest'
      //'firefox_mac_oldest', 'chrome_mac_oldest', 'safari_mac_oldest',
      //'firefox_windows_latest', 'chrome_windows_latest',
      //'ie_11', 'edge_16', 'firefox_windows_oldest', 'chrome_windows_oldest',
      //'ie_10', 'ie_9', 'ie_8', 'safari_windows',
      //'iphoneX_safari_11', 'pixel8'],

      ].concat(latestBrowsers.map(function(item) {
       return item.name;
      })),
    singleRun: true,
    concurrency: Infinity,
    tunnelIdentifier: process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
    startTunnel: false,
    sauceLabs: {
      username: 'bloombox',
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
