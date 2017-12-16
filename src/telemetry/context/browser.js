
/*
 * Copyright 2017, Bloombox, LLC. All rights reserved.
 *
 * Source and object computer code contained herein is the private intellectual
 * property of Bloombox, a California Limited Liability Corporation. Use of this
 * code in source form requires permission in writing before use or the
 * assembly, distribution, or publishing of derivative works, for commercial
 * purposes or any other purpose, from a duly authorized officer of Momentum
 * Ideas Co.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox Telemetry Context: Browser
 *
 * @fileoverview Specifies event context related to the browser.
 */

/*global goog */

goog.provide('bloombox.telemetry.buildBrowserContext');

goog.require('goog.userAgent');

goog.require('proto.analytics.context.BrowserDeviceContext');
goog.require('proto.structs.VersionSpec');


/**
 * Build local browser context from the available environment.
 *
 * @return {proto.analytics.context.BrowserDeviceContext}
 * @package
 */
bloombox.telemetry.buildBrowserContext = function() {
  let context = new proto.analytics.context.BrowserDeviceContext();
  let language = navigator.language;
  let ua = navigator.userAgent;
  context.setLanguage(language);
  context.setUserAgent(ua);

  if (typeof navigator.maxTouchPoints === 'number')
    context.setTouchpoints(navigator.maxTouchPoints);
  if (typeof navigator.hardwareConcurrency === 'number')
    context.setHardwareConcurrency(navigator.hardwareConcurrency);
  if (window.screen && typeof window.screen.colorDepth === 'number')
  // set color depth
    context.setColorDepth(window.screen.colorDepth);

  // detect browser type and version
  let browserVersion = goog.userAgent.VERSION;
  let browserType = (
    proto.analytics.context.BrowserType.BROWSER_UNKNOWN);
  if (goog.userAgent.product.CHROME)
    browserType = (
      proto.analytics.context.BrowserType.CHROME);
  else if (goog.userAgent.product.SAFARI)
    browserType = (
      proto.analytics.context.BrowserType.SAFARI);
  else if (goog.userAgent.product.FIREFOX)
    browserType = (
      proto.analytics.context.BrowserType.FIREFOX);
  else if (goog.userAgent.product.OPERA)
    browserType = (
      proto.analytics.context.BrowserType.OPERA);
  else if (goog.userAgent.EDGE_OR_IE)
    browserType = (
      proto.analytics.context.BrowserType.IE_OR_EDGE);
  context.setBrowserType(browserType);

  // browser version mount
  let browserVersionObj = new proto.structs.VersionSpec();
  browserVersionObj.setName(browserVersion);
  context.setVersion(browserVersionObj);
  return context;
};
