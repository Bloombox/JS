/* eslint-env mocha */
'use strict';

function genTelemetryTestsuite(version) {
  cachedEventsService = null;
  const apiOpts = {'cache': false};

  function genNative() {
    let device = new proto.bloombox.analytics.context.NativeDeviceContext();
    let screen = new proto.bloombox.analytics.context.DeviceScreen();
    let os = new proto.bloombox.analytics.context.DeviceOS();
    let osVersion = new proto.opencannabis.structs.VersionSpec();
    osVersion.setName('1.1.1');

    os.setType(proto.bloombox.analytics.context.OSType.MACOS);
    os.setVersion(osVersion);

    let display = new proto.bloombox.analytics.context.PixelSize();
    display.setHeight(768);
    display.setWidth(1024);

    let viewport = new proto.bloombox.analytics.context.PixelSize();
    viewport.setHeight(768);
    viewport.setWidth(1024);

    device.setType(proto.opencannabis.device.DeviceType.DESKTOP);
    device.setRole(proto.bloombox.analytics.context.DeviceRole.CLIENT);
    screen.setOrientation(proto.bloombox.analytics.context.ScreenOrientation.LANDSCAPE);
    screen.setScreen(display);
    screen.setViewport(viewport);
    device.setScreen(screen);
    device.setOs(os);
    return device;
  }

  function genBrowser() {
    let browser = new proto.bloombox.analytics.context.BrowserDeviceContext();
    browser.setBrowserType(proto.bloombox.analytics.context.BrowserType.CHROME);
    browser.setColorDepth(10.0);
    browser.setHardwareConcurrency(true);
    browser.setLanguage('en-us');
    return browser;
  }

  function genContext() {
    let key = new proto.opencannabis.base.ProductKey();
    key.setType(proto.opencannabis.base.ProductKind.EDIBLES);
    key.setId('abc-edible-id');

    let app = new proto.bloombox.analytics.context.DeviceApplication();
    let browser = genBrowser();

    let web = new proto.bloombox.analytics.context.WebApplication();
    web.setLocation('https://localhost/sample.html');
    web.setAnchor('#anchor');
    web.setProtocol('https');
    web.setReferrer('https://localhost/referrer.html');
    web.setTitle('Page Title');
    app.setWeb(web);

    let device = genNative();

    return new bloombox.telemetry.Context(
      bloombox.telemetry.Collection.named('sample'),
      'partner-sample',
      'location-sample',
      'abc123fingerprint',
      'abc124session',
      'abc125userid',
      'abc126deviceid',
      proto.opencannabis.products.menu.section.Section.EDIBLES,
      key,
      'abc127orderid',
      app,
      browser,
      device);
  }

  describe('service: telemetry (' + version + ')', function() {
    describe('telemetry context', function() {
      describe('context: base', function() {
        it('should support device-bound context', function() {
          let ctx = genContext();
          expect(ctx).not.toBeNull();
          expect(ctx.device).not.toBeNull();
          expect(ctx.device.getUuid()).toBe('abc126deviceid');
        });

        it('should support user-bound context', function() {
          let ctx = genContext();
          expect(ctx).not.toBeNull();
          expect(ctx.user).not.toBeNull();
          expect(ctx.user.getUid()).not.toBeNull();
          expect(ctx.user.getUid()).toBe('abc125userid');
        });

        it('should be able to serialize a simple version payload', function() {
          let version = new proto.opencannabis.structs.VersionSpec();
          version.setName('abc123version');
          const obj = bloombox.telemetry.Context.resolveVersion(version);
          expect(obj).not.toBeNull();
          expect(obj['name']).not.toBeNull();
          expect(obj['name']).toBe('abc123version');
        });

        it('should gracefully fallback when no version payload is available', function() {
          let version = new proto.opencannabis.structs.VersionSpec();
          let obj = bloombox.telemetry.Context.resolveVersion(version);
          expect(obj).not.toBeNull();
        });

        it('should be able to serialize native device context', function() {
          let ctx = genNative();
          expect(ctx).not.toBeNull();
          const obj = bloombox.telemetry.Context.serializeNativeContext(ctx);
          expect(obj).not.toBeNull();
        });

        it('should be able to serialize browser context', function() {
          let browser = genBrowser();
          expect(browser).not.toBeNull();
          const obj = bloombox.telemetry.Context.serializeBrowserContext(browser);
          expect(obj).not.toBeNull();
        });

        it('should be exportable as a whole', function() {
          let ctx = genContext();
          const obj = ctx.export();
          expect(obj).not.toBeNull();
        });

        it('should be serializable as a whole', function() {
          let ctx = genContext();
          const obj = ctx.serialize();
          expect(obj).not.toBeNull();
        });

        it('should be exportable and then serializable as a whole', function() {
          let ctx = genContext();
          const obj = ctx.export();
          assert(obj, 'should get a valid object after exporting');
          expect(obj).not.toBeNull();
          const obj2 = bloombox.telemetry.Context.serializeProto(obj);
          expect(obj2).not.toBeNull();
        });

        it('should support context exception messages', function() {
          const exc = new bloombox.telemetry.ContextException('something');
          expect(exc.message).not.toBeNull();
          expect(exc.message).toBe('something');
        });

        it('should be able to resolve a section name for any section', function() {
          let sections = [
            proto.opencannabis.products.menu.section.Section.FLOWERS,
            proto.opencannabis.products.menu.section.Section.EXTRACTS,
            proto.opencannabis.products.menu.section.Section.EDIBLES,
            proto.opencannabis.products.menu.section.Section.CARTRIDGES,
            proto.opencannabis.products.menu.section.Section.APOTHECARY,
            proto.opencannabis.products.menu.section.Section.PREROLLS,
            proto.opencannabis.products.menu.section.Section.PLANTS,
            proto.opencannabis.products.menu.section.Section.MERCHANDISE
          ];

          for (let si in sections) {
            let section = sections[si];
            const resolved = bloombox.telemetry._resolveSectionName(section);
            expect(resolved).not.toBeNull();
          }
          const nothing = bloombox.telemetry._resolveSectionName();
          expect(nothing).toBeNull();
        });
      });
    });

    describe('method: `ping`', function() {
      it('should be able to complete a ping', function() {
        return new Promise((resolve, reject) => {
          return bloombox.telemetry.events(apiOpts).ping((latency) => {
            expect(latency).toBeGreaterThan(-1);
              if (latency > -1) {
                resolve(latency);
              } else {
                reject(latency);
              }
            });
        });
      });
    });

    describe('method: `event`', function() {
      it('should be able to send a basic test event', function() {
        const collection = bloombox.telemetry.Collection
          .named('testsuite');

        const promise = bloombox.telemetry.events(apiOpts)
          .event(collection, {'test': 'data', 'goes': 'here'});
        expect(promise).not.toBeNull();
        return promise;
      });
    });
  });
}

function telemetryTestsuite() {
  genTelemetryTestsuite('v1beta4');
}
