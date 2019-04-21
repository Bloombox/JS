/* eslint-env mocha */
'use strict';

function genShopTestsuite(version) {
  cachedShopService = null;
  const apiOpts = {'cache': false};

  describe('service: shop (' + version + ')', function() {
    // method: `zipcheck`
    describe('method: `zipcheck`', function() {
      it('should reject verifying a known-bad zipcode', function() {
        return new Promise(function(resolve, reject) {
          return bloombox.shop.api(apiOpts).zipcheck('12345', function(response, err) {
            if (!err && response && response.getSupported() === true) {
              reject(new Error('known-bad zipcode somehow worked.'));
            } else {
              resolve(response);
            }
          });
        });
      });

      it('should verify a known-good zipcode', function() {
        return new Promise(function(resolve, reject) {
          return bloombox.shop.api(apiOpts).zipcheck('94002', function(response, err) {
            if (!err) {
              resolve(response);
            } else {
              reject(new Error('known-good zipcode did not verify.'));
            }
          });
        });
      });
    });

    // method: `info`
    describe('method: `info`', function() {
      it('should support retrieving shop info', function() {
        return new Promise(function(resolve, reject) {
          return bloombox.shop.api(apiOpts).info(function(pickup, delivery, err) {
            if (err) {
              reject(err);
            } else {
              resolve({'pickup': pickup, 'delivery': delivery});
            }
          });
        });
      });

      // describe('orders', function() {
      //   it('should support retrieving an order by ID', function() {
      //     return new Promise(function(resolve, reject) {
      //       bloombox.shop.order.Order.retrieve('abc123', function(error, order) {
      //         if (error) {
      //           // @TODO: replace with assertions
      //           reject(new Error('unable to retrieve order'));
      //         } else if (!order) {
      //           reject(new Error('order came through as null'));
      //         } else {
      //           resolve(order);
      //         }
      //       });
      //     });
      //   });
      //
      //   it('should reject retrieving an order that does not exist', function() {
      //     return new Promise(function(resolve, reject) {
      //       bloombox.shop.order.Order.retrieve('blablabla', function(error, order) {
      //           if (order) {
      //             reject(new Error('order came through when it should not have'));
      //           } else {
      //             resolve(error);
      //           }
      //         });
      //     });
      //   });
      // });
    });

    // method: `members`
    describe('method: `members`', function() {
      it('should support verifying a known-good account', function() {
        return new Promise(function(resolve, reject) {
          return bloombox.shop.api(apiOpts).verify('sam@bloombox.io', function(response, err) {
            if (err || !response || !response.getVerified()) {
              reject(new Error('unable to verify known-good account'));
            } else {
              resolve({'response': response});
            }
          });
        });
      });

      it('should reject verifying a known-bad account', function() {
        return new Promise(function(resolve, reject) {
          return bloombox.shop.api(apiOpts).verify('does-not-exist@blabla.com', function(response, err) {
            if (err || !response || !response.getVerified()) {
              resolve({'response': response});
            } else {
              reject(new Error('somehow able to verify known-bad account'));
            }
          });
        });
      });
    });
  });
}

function shopTestsuite() {
  genShopTestsuite('v1');
}
