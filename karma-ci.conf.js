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
  chromeMacLatest['recordVideo'] = false;
  chromeMacLatest['recordScreenshots'] = false;
  saucelabsBrowsers.push(chromeMacLatest);
  latestBrowsers.push(chromeMacLatest);
  macBrowsers.push(chromeMacLatest);
  chromeBrowsers.push(chromeMacLatest);

  let chromeMacOldest = {browserName: 'chrome'};
  chromeMacOldest['name'] = 'chromeMacOldest';
  chromeMacOldest['base'] = 'SauceLabs';
  chromeMacOldest['platform'] = 'OS X 10.9';
  chromeMacOldest['version'] = '31.0';
  chromeMacOldest['recordVideo'] = false;
  chromeMacOldest['recordScreenshots'] = false;
  saucelabsBrowsers.push(chromeMacOldest);
  oldBrowsers.push(chromeMacOldest);
  macBrowsers.push(chromeMacOldest);
  chromeBrowsers.push(chromeMacOldest);

  let safariMacLatest = {browserName: 'safari'};
  safariMacLatest['name'] = 'safariMacLatest';
  safariMacLatest['base'] = 'SauceLabs';
  safariMacLatest['platform'] = 'macOS 10.13';
  safariMacLatest['version'] = '11.0';
  safariMacLatest['recordVideo'] = false;
  safariMacLatest['recordScreenshots'] = false;
  saucelabsBrowsers.push(safariMacLatest);
  latestBrowsers.push(safariMacLatest);
  macBrowsers.push(safariMacLatest);
  safariBrowsers.push(safariMacLatest);

  let safariMacOldest = {browserName: 'safari'};
  safariMacOldest['name'] = 'safariMacOldest';
  safariMacOldest['base'] = 'SauceLabs';
  safariMacOldest['platform'] = 'OS X 10.9';
  safariMacOldest['version'] = '7.0';
  safariMacOldest['recordVideo'] = false;
  safariMacOldest['recordScreenshots'] = false;
  saucelabsBrowsers.push(safariMacOldest);
  oldBrowsers.push(safariMacOldest);
  macBrowsers.push(safariMacOldest);
  safariBrowsers.push(safariMacOldest);

  let firefoxMacLatest = {browserName: 'firefox'};
  firefoxMacLatest['name'] = 'firefoxMacLatest';
  firefoxMacLatest['base'] = 'SauceLabs';
  firefoxMacLatest['platform'] = 'macOS 10.13';
  firefoxMacLatest['version'] = '58.0';
  firefoxMacLatest['recordVideo'] = false;
  firefoxMacLatest['recordScreenshots'] = false;
  saucelabsBrowsers.push(firefoxMacLatest);
  latestBrowsers.push(firefoxMacLatest);
  macBrowsers.push(firefoxMacLatest);
  firefoxBrowsers.push(firefoxMacLatest);

  let firefoxMacOldest = {browserName: 'firefox'};
  firefoxMacOldest['name'] = 'firefoxMacOldest';
  firefoxMacOldest['base'] = 'SauceLabs';
  firefoxMacOldest['platform'] = 'OS X 10.9';
  firefoxMacOldest['version'] = '15.0';
  firefoxMacOldest['recordVideo'] = false;
  firefoxMacOldest['recordScreenshots'] = false;
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
  edgeLatest['recordVideo'] = false;
  edgeLatest['recordScreenshots'] = false;
  saucelabsBrowsers.push(edgeLatest);
  latestBrowsers.push(edgeLatest);
  windowsBrowsers.push(edgeLatest);
  edgeBrowsers.push(edgeLatest);

  let chromeWindowsLatest = {browserName: 'chrome'};
  chromeWindowsLatest['name'] = 'chromeWindowsLatest';
  chromeWindowsLatest['base'] = 'SauceLabs';
  chromeWindowsLatest['platform'] = 'Windows 10';
  chromeWindowsLatest['version'] = '64.0';
  chromeWindowsLatest['recordVideo'] = false;
  chromeWindowsLatest['recordScreenshots'] = false;
  saucelabsBrowsers.push(chromeWindowsLatest);
  latestBrowsers.push(chromeMacLatest);
  windowsBrowsers.push(chromeWindowsLatest);
  chromeBrowsers.push(chromeWindowsLatest);

  let chromeWindowsOldest = {browserName: 'chrome'};
  chromeWindowsOldest['name'] = 'chromeWindowsOldest';
  chromeWindowsOldest['base'] = 'SauceLabs';
  chromeWindowsOldest['platform'] = 'Windows 7';
  chromeWindowsOldest['version'] = '31.0';
  chromeWindowsOldest['recordVideo'] = false;
  chromeWindowsOldest['recordScreenshots'] = false;
  saucelabsBrowsers.push(chromeWindowsOldest);
  oldBrowsers.push(chromeWindowsOldest);
  windowsBrowsers.push(chromeWindowsOldest);
  chromeBrowsers.push(chromeWindowsOldest);

  let firefoxWindowsLatest = {browserName: 'firefox'};
  firefoxWindowsLatest['name'] = 'firefoxWindowsLatest';
  firefoxWindowsLatest['base'] = 'SauceLabs';
  firefoxWindowsLatest['platform'] = 'Windows 10';
  firefoxWindowsLatest['version'] = '58.0';
  firefoxWindowsLatest['recordVideo'] = false;
  firefoxWindowsLatest['recordScreenshots'] = false;
  saucelabsBrowsers.push(firefoxWindowsLatest);
  latestBrowsers.push(chromeMacLatest);
  windowsBrowsers.push(firefoxWindowsLatest);
  firefoxBrowsers.push(firefoxWindowsLatest);

  let firefoxWindowsOldest = {browserName: 'firefox'};
  firefoxWindowsOldest['name'] = 'firefoxWindowsOldest';
  firefoxWindowsOldest['base'] = 'SauceLabs';
  firefoxWindowsOldest['platform'] = 'Windows 7';
  firefoxWindowsOldest['version'] = '15.0';
  firefoxWindowsOldest['recordVideo'] = false;
  firefoxWindowsOldest['recordScreenshots'] = false;
  saucelabsBrowsers.push(firefoxWindowsOldest);
  oldBrowsers.push(firefoxWindowsOldest);
  windowsBrowsers.push(firefoxWindowsOldest);
  firefoxBrowsers.push(firefoxWindowsOldest);

  let ie11Windows10 = {browserName: 'internet explorer'};
  ie11Windows10['name'] = 'ie11Windows10';
  ie11Windows10['base'] = 'SauceLabs';
  ie11Windows10['platform'] = 'Windows 10';
  ie11Windows10['version'] = '11.103';
  ie11Windows10['recordVideo'] = false;
  ie11Windows10['recordScreenshots'] = false;
  saucelabsBrowsers.push(ie11Windows10);
  oldBrowsers.push(ie11Windows10);
  windowsBrowsers.push(ie11Windows10);
  ieBrowsers.push(ie11Windows10);

  let ie8Windows7 = {browserName: 'internet explorer'};
  ie8Windows7['name'] = 'ie8Windows7';
  ie8Windows7['base'] = 'SauceLabs';
  ie8Windows7['platform'] = 'Windows 7';
  ie8Windows7['version'] = '8.0';
  ie8Windows7['recordVideo'] = false;
  ie8Windows7['recordScreenshots'] = false;
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
  chromeLinuxLatest['recordVideo'] = false;
  chromeLinuxLatest['recordScreenshots'] = false;
  saucelabsBrowsers.push(chromeLinuxLatest);
  latestBrowsers.push(chromeLinuxLatest);
  linuxBrowsers.push(chromeLinuxLatest);
  chromeBrowsers.push(chromeLinuxLatest);

  let chromeLinuxOldest = {browserName: 'chrome'};
  chromeLinuxOldest['name'] = 'chromeLinuxOldest';
  chromeLinuxOldest['base'] = 'SauceLabs';
  chromeLinuxOldest['platform'] = 'Linux';
  chromeLinuxOldest['version'] = '41.0';
  chromeLinuxOldest['recordVideo'] = false;
  chromeLinuxOldest['recordScreenshots'] = false;
  saucelabsBrowsers.push(chromeLinuxOldest);
  oldBrowsers.push(chromeLinuxOldest);
  linuxBrowsers.push(chromeLinuxOldest);
  chromeBrowsers.push(chromeLinuxOldest);

  let firefoxLinuxLatest = {browserName: 'firefox'};
  firefoxLinuxLatest['name'] = 'firefoxLinuxLatest';
  firefoxLinuxLatest['base'] = 'SauceLabs';
  firefoxLinuxLatest['platform'] = 'Linux';
  firefoxLinuxLatest['version'] = '45.0';
  firefoxLinuxLatest['recordVideo'] = false;
  firefoxLinuxLatest['recordScreenshots'] = false;
  saucelabsBrowsers.push(firefoxLinuxLatest);
  latestBrowsers.push(firefoxLinuxLatest);
  linuxBrowsers.push(firefoxLinuxLatest);
  firefoxBrowsers.push(firefoxLinuxLatest);

  let firefoxLinuxOldest = {browserName: 'firefox'};
  firefoxLinuxOldest['name'] = 'firefoxLinuxOldest';
  firefoxLinuxOldest['base'] = 'SauceLabs';
  firefoxLinuxOldest['platform'] = 'Linux';
  firefoxLinuxOldest['version'] = '38.0';
  firefoxLinuxOldest['recordVideo'] = false;
  firefoxLinuxOldest['recordScreenshots'] = false;
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
    frameworks: ['jasmine'],
    files: [
      'target/*-debug.min.js',
      'tests/suites/**/*.js',
      'tests/*.js'
    ],
    exclude: [
    ],
    browserStack: {
      username: 'samgammon2',
      accessKey: process.env.BROWSERSTACK_KEY
    },
    preprocessors: {
    },
    reporters: ['dots', 'saucelabs'],
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
