/* eslint-env mocha */
'use strict';

function shopTestsuite() {
  describe('shop services: digital storefront', function() {
    describe('info', function() {
      it('should support retrieving shop info', function() {
        bloombox.shop.info(function(pickup, delivery, err) {
          if (err) {
            throw new Error('failed to retrieve shop status');
          }
        });
      });

      it('should support verifying a known-good zipcode', function() {
        bloombox.shop.zipcheck('95126', function(zipcodeEligible) {
          if (zipcodeEligible !== true) {
            throw new Error('failed to properly validate known-good zipcode.');
          }
        });
      });

      it('should reject verifying a known-bad zipcode', function() {
        bloombox.shop.zipcheck('12345', function(zipcodeEligible) {
          if (zipcodeEligible === true) {
            throw new Error('known-bad zipcode somehow worked.');
          }
        });
      });

      it('should support throwing exceptions with messages', function() {
        try {
          throw new bloombox.shop.ShopInfoException('woops');
        } catch (e) {
          if (!e.getMessage() || e.getMessage() !== 'woops')
            throw new Error('ShopInfo error message for exception is wrong');
        }

        try {
          throw new bloombox.shop.ZipcheckException('woops');
        } catch (e) {
          if (!e.getMessage() || e.getMessage() !== 'woops')
            throw new Error('Zipcheck error message for exception is wrong');
        }
      });
    });

    describe('members', function() {
      it('should support verifying a known-good account', function() {
        bloombox.shop.verify('sam@bloombox.io', function(
          verified, err, customer) {
          if (verified !== true || err || !customer) {
            throw new Error('unable to verify known-good account');
          }
        });
      });

      it('should reject verifying a known-bad account', function() {
        bloombox.shop.verify('does-not-exist@blabla.com', function(
          verified, err, customer) {
          if (verified === true || customer) {
            throw new Error('somehow able to verify known-bad account');
          }
        });
      });
    });

    describe('orders', function() {
      it('should support retrieving an order by ID', function() {
        bloombox.shop.order.Order.retrieve(
          'abc123', function(error, order) {
          if (error) {
            // @TODO: replace with assertions
            // throw new Error('unable to retrieve order');
          }
          if (!order) {
            // throw new Error('order came through as null');
          }
        });
      });

      it('should reject retrieving an order that does not exist', function() {
        bloombox.shop.order.Order.retrieve(
          'blablabla', function(error, order) {
          if (!error) {
            // throw new Error('got no error for known-missing order ID');
          }

          if (order) {
            // throw new Error('order came through when it should not have');
          }
        });
      });
    });
  });
}
