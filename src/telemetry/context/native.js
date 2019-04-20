
/*
 * Copyright 2019, Momentum Ideas, Co. All rights reserved.
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
 * Bloombox Telemetry Context: Native Device
 *
 * @fileoverview Specifies context related to the native hardware that is
 * transmitting events.
 */

/*global goog */

goog.require('goog.labs.userAgent.device');
goog.require('goog.userAgent');
goog.require('goog.userAgent.platform');
goog.require('goog.userAgent.product');

goog.require('proto.bloombox.analytics.context.DeviceOS');
goog.require('proto.bloombox.analytics.context.DeviceRole');
goog.require('proto.bloombox.analytics.context.DeviceScreen');
goog.require('proto.bloombox.analytics.context.NativeDeviceContext');
goog.require('proto.bloombox.analytics.context.OSType');
goog.require('proto.bloombox.analytics.context.PixelSize');
goog.require('proto.bloombox.analytics.context.ScreenOrientation');

goog.require('proto.opencannabis.device.DeviceType');

goog.require('proto.opencannabis.structs.VersionSpec');

goog.provide('bloombox.telemetry.buildNativeContext');



/**
 * Build native device context from the available environment.
 *
 * @return {proto.bloombox.analytics.context.NativeDeviceContext}
 * @package
 */
bloombox.telemetry.buildNativeContext = function() {
  let native = (
    new proto.bloombox.analytics.context.NativeDeviceContext());

  // detect device type
  let deviceType = proto.opencannabis.device.DeviceType.UNKNOWN_DEVICE_TYPE;
  if (goog.labs.userAgent.device.isDesktop)
    deviceType = proto.opencannabis.device.DeviceType.DESKTOP;
  else if (goog.labs.userAgent.device.isTablet)
    deviceType = proto.opencannabis.device.DeviceType.TABLET;
  else if (goog.labs.userAgent.device.isMobile)
    deviceType = proto.opencannabis.device.DeviceType.PHONE;
  native.setType(deviceType);
  native.setRole(proto.bloombox.analytics.context.DeviceRole.CLIENT);

  // touchpoints, concurrency and color depth
  if (window.screen) {
    // build screen information
    let viewportHeight = window.screen.availHeight;
    let viewportWidth = window.screen.availWidth;
    let screenHeight = window.screen.height;
    let screenWidth = window.screen.width;
    let pixelDensity = window.devicePixelRatio;

    let pixelSizeViewport = (
      new proto.bloombox.analytics.context.PixelSize());
    pixelSizeViewport.setHeight(viewportHeight);
    pixelSizeViewport.setWidth(viewportWidth);

    let pixelSizeScreen = (
      new proto.bloombox.analytics.context.PixelSize());
    pixelSizeScreen.setHeight(screenHeight);
    pixelSizeScreen.setWidth(screenWidth);

    let deviceScreen = (
      new proto.bloombox.analytics.context.DeviceScreen());
    deviceScreen.setViewport(pixelSizeViewport);
    deviceScreen.setScreen(pixelSizeScreen);
    deviceScreen.setDensity(pixelDensity);
    deviceScreen.setOrientation((window.innerHeight > window.innerWidth) ?
      proto.bloombox.analytics.context.ScreenOrientation.LANDSCAPE :
      proto.bloombox.analytics.context.ScreenOrientation.PORTRAIT);
    native.setScreen(deviceScreen);
  }

  // detect OS type and version
  let osType = proto.bloombox.analytics.context.OSType.OS_UNKNOWN;
  let osVersion = goog.userAgent.platform.VERSION;

  if (goog.userAgent.IPAD ||
    goog.userAgent.IPHONE ||
    goog.userAgent.IPOD ||
    goog.userAgent.IOS)
    osType = proto.bloombox.analytics.context.OSType.IOS;
  else if ((goog.userAgent.WINDOWS ||
      goog.userAgent.EDGE_OR_IE) &&
    goog.userAgent.MOBILE)
    osType = proto.bloombox.analytics.context.OSType.WINDOWS_PHONE;
  else if (goog.userAgent.WINDOWS ||
    goog.userAgent.EDGE_OR_IE)
    osType = proto.bloombox.analytics.context.OSType.WINDOWS;
  else if (goog.userAgent.product.ANDROID)
    osType = proto.bloombox.analytics.context.OSType.ANDROID;
  else if (goog.userAgent.MAC)
    osType = proto.bloombox.analytics.context.OSType.MACOS;
  else if (goog.userAgent.LINUX)
    osType = proto.bloombox.analytics.context.OSType.LINUX;

  let osObj = new proto.bloombox.analytics.context.DeviceOS();
  let osVersionObj = new proto.opencannabis.structs.VersionSpec();
  osVersionObj.setName(osVersion);
  osObj.setType(osType);
  osObj.setVersion(osVersionObj);
  native.setOs(osObj);
  return native;
};
