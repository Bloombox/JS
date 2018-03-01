/* eslint-env mocha */
'use strict'

let partnerCode = 'caliva';
let locationCode = 'sjc';
let apiKey = 'AIzaSyAEOsmEqQP5vX8aPvrlZH0f3AN7eGubL60';


describe('sanity tests', function() {
  it('should pass a sensible math test', function() {
    let result = 1 + 1;
    if (result !== 2)
      throw new Error('math doesn\'t seem to add up');
  });

  it('should be able to access the window', function() {
    if (!window)
      throw new Error('no window variable');
  });
});


function basicTestsuite() {
  bloombox.setup(partnerCode, locationCode, apiKey, function() {
    describe('basics', function() {
      it('should be able to find the Bloombox SDK for JavaScript', function() {
        if (!bloombox) {
          throw new Error('failed to find the SDK');
        }
      });

      it('should be able to find the SDK setup function', function() {
        if (!bloombox.setup)
          throw new Error('failed to find the SDK setup function');
      });
    });

    describe('shop services: digital storefront', function() {
      describe('shop info', function() {
        it('should support retrieving shop info', function() {
          bloombox.shop.info(function(pickup, delivery, err) {
            if (err) {
              console.log(
                '%cThere was an error retrieving shop status: ',
                'color: red',
                err);
              throw new Error('failed to retrieve shop status');
            }

            // is the shop open at all?
            if (!(pickup || delivery)) {
              // the shop is not open
              console.log(
                '%cThe shop is not currently open for orders.',
                'color: red');
              return;
            }

            let label;
            if (pickup && delivery) {
              label = 'PICKUP and DELIVERY';
            } else if (pickup) {
              label = 'PICKUP ONLY';
            } else {
              label = 'DELIVERY ONLY';
            }

            // report the shop status
            console.log(
              '%cThe shop is currently open for: ' + label + '.',
              'color: green');
          });
        });

        it('should support verifying a known-good zipcode', function() {
          bloombox.shop.zipcheck('95126', function(
            zipcodeEligible, minimumDeliverySubtotal) {
            if (zipcodeEligible !== true) {
              console.log(
                '%cThe zipcode \'' +
                zipToCheck + '\' was found to be ineligible. Cannot proceed.',
                'color: red');
              throw new Error('failed to properly validate known-good zipcode.');
            } else {
              if (
                minimumDeliverySubtotal !== null && minimumDeliverySubtotal > 0.0) {
                console.log(
                  '%cThe zipcode \'' +
                  zipToCheck +
                  '\' is eligible for delivery orders, with a delivery minimum of' +
                  ' $' + minimumDeliverySubtotal.toString() + '.',
                  'color: green');
              } else {
                console.log(
                  '%cThe zipcode \'' +
                  zipToCheck +
                  '\' is eligible for delivery orders.',
                  'color: green');
              }
            }
          });
        });

        it('should reject verifying a known-bad zipcode', function() {
          bloombox.shop.zipcheck('12345', function(zipcodeEligible) {
            if (zipcodeEligible !== true) {
              console.log(
                '%cThe known-bad zipcode \'' +
                zipToCheck + '\' was found to be ineligible.',
                'color: green');
            } else {
              throw new Error('known-bad zipcode somehow worked.');
            }
          });
        });
      });

      describe('shop members', function() {
        it('should support verifying a known-good account', function() {
          bloombox.shop.verify('sam@bloombox.io', function(
            verified, err, customer) {
            if (verified === true) {
              // ok the user is verified
              console.log(
                'The user \'' +
                failureAccount +
                '\' is valid and eligible to submit orders.', 'color: green',
                customer);
            } else {
              // an error occurred
              console.log(
                '%cThe user \'' +
                failureAccount +
                '\' could not be verified.', 'color: red', err);
              throw new Error('unable to verify known-good account');
            }
          });
        });

        it('should reject verifying a known-bad account', function() {
          bloombox.shop.verify('does-not-exist@blabla.com', function(
            verified, err, customer) {
            if (verified === true) {
              // ok the user is verified
              console.log(
                'The known-bad user \'' +
                failureAccount +
                '\' is somehow valid and eligible to submit orders.',
                'color: red',
                customer);
              throw new Error('somehow able to verify known-bad account');
            } else {
              // an error occurred
              console.log(
                '%cThe user \'' +
                failureAccount +
                '\' could not be verified.', 'color: red', err);
            }
          });
        });
      });

      describe('shop orders', function() {
        it('should support retrieving an order by ID', function() {
          let done = false;
          bloombox.shop.order.Order.retrieve("abc123", function(error, order) {
            if (done) return;
            done = true;

            if (error) {
              console.log(
                '%cThere was an error retrieving order at ID ' + orderId + '.',
                'color: red',
                error);
              throw new Error('unable to retrieve order');
            }

            if (order) {
              // we have an order
              console.log(
                '%cOrder retrieval worked for ID \'' + orderId + '\'.',
                'color: green',
                {'order': order});
            } else {
              console.log(
                '%cError inflating or retrieving order at ID ' + orderId + '.',
                'color: red');
              throw new Error('order came through as null');
            }
          });
        });

        it('should reject retrieving an order that does not exist', function() {
          let done = false;
          bloombox.shop.order.Order.retrieve("blablabla", function(error, order) {
            if (done) return;
            done = true;

            if (error) {
              console.log(
                '%Failed to retrieve known-bad order at ID ' + orderId + '.',
                'color: green',
                error);
            } else {
              console.log(
                '%cOrder retrieval got no error for ID \'' + orderId +
                '\' when it ' +
                'should have.',
                'color: red',
                {'order': order});
              throw new Error('got no error for known-missing order ID');
            }

            if (order) {
              // we have an order
              console.log(
                '%cOrder retrieval worked for ID \'' + orderId + '\' when it' +
                ' should not have.',
                'color: red',
                {'order': order});
              throw new Error('order came through when it should not have');
            } else {
              console.log(
                '%cExpected error inflating or retrieving order at ID ' +
                orderId + '.',
                'color: green');
            }
          });
        });
      });
    });
  });
}

describe('compiled library: debug build', function() {
  basicTestsuite();
});
