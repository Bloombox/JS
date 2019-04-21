/* eslint-env mocha */
'use strict';

function genMenuTestsuite(version) {
  const apiOpts = version === 'v0' ?
    {'cache': false} :
    {'beta': true, 'cache': false};

  describe('menu (' + version + ')', function() {
    describe('method: `retrieve`', function() {
      it('should be able to retrieve a menu', function() {
        return new Promise(function(resolve, reject) {
          let promise = bloombox.menu.api(apiOpts).retrieve(function(menu, err) {
            if (err)
              reject(new Error('unable to retrieve menu: ' + err.toString()));
            else if (menu)
              resolve(menu);
          }, bloombox.menu.RetrieveOptions.defaults());
          assert(promise, 'should get valid promise from menu fetch');
        });
      });

      it('should throw exceptions with accessible messages', function() {
        try {
          // noinspection ExceptionCaughtLocallyJS
          throw new bloombox.menu.RetrieveException('hello');
        } catch (e) {
          assert(e, 'should get exception after RetrieveException');
          assert(e.message === 'hello',
            'should get correct message from RetrieveException');
        }
      });

      it('should not provide a menu for an non-existent scope', function() {
        return new Promise(function(resolve, reject) {
          let promise = bloombox.menu.api(apiOpts).retrieve(function(menu, err) {
            if (err)
              resolve();
            else
              reject('no error');
          }, bloombox.menu.RetrieveOptions.fromObject(
            {'scope': 'partner/sample/location/sample'}));
          assert(promise, 'should get valid promise from menu fetch');
        });
      });
    });

    if (version !== 'v0') {
      describe('method: `product`', function() {
        it('should be able to grab a product by its key', function() {
          const key = new proto.opencannabis.base.ProductKey();
          key.setType(proto.opencannabis.base.ProductKind.FLOWERS);
          key.setId('-LZk0OW6WEP9u6GSBIo2');

          return bloombox.menu.api(apiOpts).product(key, (response, err) => {
            expect(response).not.toBeNull();
            expect(err).toBeNull();
          });
        });

        it('should fail when given a key that does not exist', function() {
          const key = new proto.opencannabis.base.ProductKey();
          key.setType(proto.opencannabis.base.ProductKind.FLOWERS);
          key.setId('i-do-not-exist');

          return new Promise((resolve, reject) => {
            bloombox.menu.api(apiOpts).product(key, (response, err) => {
              expect(response).toBeNull();
              expect(err).not.toBeNull();
              if (!err || response) reject();
              else resolve();
            });
          });
        });
      });

      describe('method: `featured`', function() {
        it('should be able to fetch featured products for a given section', function() {
          const section = proto.opencannabis.products.menu.section.Section.FLOWERS;
          return bloombox.menu.api(apiOpts).featured(section);
        });

        it('should be able to fetch featured products across sections', function() {
          return bloombox.menu.api(apiOpts).featured();
        });

        it('should be able to fetch featured products in keys-only mode', function() {
          return new Promise((resolve, reject) => {
            const options = bloombox.menu.RetrieveOptions.fromObject({
              'keysOnly': true});
            return bloombox.menu.api(apiOpts).featured(null, (response, err) => {
              if (response && !err) resolve(response);
              else reject(err);
            }, options);
          });
        });
      });
    }
  });
}

function menuTestsuite() {
  describe('service: menu', function() {
    describe('options: retrieve', function() {
      it('should set sensible defaults', function() {
        const defaults = bloombox.menu.RetrieveOptions.defaults();
        assert(defaults.full === false,
          'default value for menu retrieve `full` should be false');
        assert(defaults.keysOnly === false,
          'default value for menu retrieve `keysOnly` should be false');
        assert(defaults.fresh === false,
          'default value for menu retrieve `fresh` should be false');
      });

      it('should be able to inflate from an object', function() {
        const config = {
          'full': true,
          'beta': true,
          'keysOnly': true,
          'snapshot': 'abc123',
          'fingerprint': 'abc124',
          'section': proto.opencannabis.products.menu.section.Section.FLOWERS,
          'fresh': true,
          'scope': 'partner/sample/location/sample'};

        const defaults = bloombox.menu.RetrieveOptions.defaults();
        const options = bloombox.menu.RetrieveOptions.fromObject(config);

        assert(defaults.full === false,
          'default value for menu retrieve `full` should be false');
        assert(options.full === true,
          'options should allow override of `full` flag');
        assert(defaults.keysOnly === false,
          'default value for menu retrieve `keysOnly` should be false');
        assert(options.keysOnly === true,
          'options should allow override of `keysOnly` flag');
        assert(defaults.fresh === false,
          'default value for menu retrieve `fresh` should be false');
        assert(options.fresh === true,
          'options should allow override of `fresh` flag');
        assert(!defaults.snapshot,
          'default value for menu retrieve `snapshot` should be null');
        assert(options.snapshot === 'abc123',
          'options should allow override of `snapshot` value');
        assert(!defaults.fingerprint,
          'default value for menu retrieve `fingerprint` should be null');
        assert(options.fingerprint === 'abc124',
          'options should allow override of `fingerprint` value');
        assert((defaults.section ===
          proto.opencannabis.products.menu.section.Section.UNSPECIFIED),
          'default value for menu retrieve `section` should be UNSPECIFIED');
        assert((options.section ===
          proto.opencannabis.products.menu.section.Section.FLOWERS),
          'options should allow override of `section` value');
        assert(!defaults.scope,
          'default value for menu retrieve `scope` should be null');
        assert(options.scope === 'partner/sample/location/sample',
          'options should allow override of `scope` value');
      });

      it('should be able to convert into an object', function() {
        const config = {
          'full': true,
          'keysOnly': true
        };
        const options = bloombox.menu.RetrieveOptions.fromObject(config);
        assert(options.full === true,
          'options should allow override of `full` flag');
        assert(options.keysOnly === true,
          'options should allow override of `keysOnly` flag');

        const serialized = options.toObject();
        assert(serialized.full === true,
          'serialized options should allow override of `full` flag');
        assert(serialized.keysOnly === true,
          'serialized options should allow override of `keysOnly` flag');
      });
    });

    genMenuTestsuite('v0');
    genMenuTestsuite('v1beta1');
  });
}
