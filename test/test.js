
// demo config
let partnerCode = 'mm';
let locationCode = 'san-francisco';
let apiKey = 'AIzaSyB_-R9mmvOy7HdyKEbhJOKIoDYFDOt0740';
let zipToCheck = '95126';
let enrollAccount = 'info+enrolltest@bloombox.io';
let enrollPhone = '+19163419482';
let enrollFirstName = 'Barack';
let enrollLastName = 'Obama';
let birthDate = '1961-08-04';
let failureAccount = 'failure@suckstosuck.com';

let notes = 'Another Indica is fine if you\'re out of Cookie Creek';

let addressOne = '214 Dupont Street';
let addressTwo = '2nd Floor';
let city = 'San Jose';
let state = 'CA';
let zip = zipToCheck;
let deliveryInstructions = 'Call Matt to get in';

let doctorRecID = 'recid123';
let doctorID = 'doctorid123';
let recExpiration = '2018-01-01';
let recJurisdiction = state;

let doctorFirstName = 'Francis';
let doctorLastName = 'D\'Ambrosio';
let doctorPhone = '+19165551234';
let doctorWebsite = 'https://bloombox.io';

let licenseID = 'D7566786';
let licenseExpiration = '2020-12-23';
let licenseJurisdiction = state;


// test logic
/**
 * Run a test where a user that doesn't exist tries to verify.
 */
function doFailureTest() {
  bloombox.setup(partnerCode, locationCode, apiKey, function() {
    // test a failure case
    bloombox.shop.verify(failureAccount, function(verified, err, customer) {
      if (verified === true) {
        // ok the user is verified
        console.warn(
          'The user \'' +
          failureAccount +
          '\' is valid and eligible to submit orders.', 'color: green',
          customer);
      } else {
        // an error occurred - err is an enum and it specifies what happened
        console.log(
          '%cThe user \'' +
          failureAccount +
          '\' could not be verified.', 'color: red', err);
      }
    });
  });
}

/**
 * Run a test that queries shop info, then runs a callback.
 */
function doInfoTest(callback, nextCallback) {
  bloombox.setup(partnerCode, locationCode, apiKey, function() {
    bloombox.shop.info(function(pickup, delivery, err) {
      if (err) {
        console.log(
          '%cThere was an error retrieving shop status: ',
          'color: red',
          err);
        return;
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

      // proceed w/zipcheck, verify, and order
      bloombox.shop.zipcheck(zipToCheck, function(zipcodeEligible) {
        if (zipcodeEligible !== true) {
          console.log(
            '%cThe zipcode \'' +
            zipToCheck + '\' was found to be ineligible. Cannot proceed.',
            'color: red');
        } else {
          console.log(
            '%cThe zipcode \'' +
            zipToCheck +
            '\' is eligible for delivery orders.',
            'color: green');
        }
        callback(nextCallback);
      });
    });
  });
}

/**
 * Run a test that submits an order.
 */
function doOrderTest() {
  // proceed w/zipcheck, verify, and order
  bloombox.shop.zipcheck(zipToCheck, function(zipcodeEligible) {
    if (zipcodeEligible !== true) {
      console.log("%cThe zipcode '" + zipToCheck + "' was found to be ineligible. Cannot proceed.", "color: red");
    } else {
      console.log("%cThe zipcode '" + zipToCheck + "' is eligible for delivery orders.", "color: green");
    }

    // ok the library is ready: test a success case
    bloombox.shop.verify(enrollAccount, function(verified, err, customer) {
      if (verified !== true) {
        // an error occurred - err is an enum and it specifies what happened
        console.warn("The user '" + enrollAccount + "' could not be verified.", "color: red", err);
      } else {
        // ok the user is verified
        console.log("%cThe user '" + enrollAccount + "' is valid and eligible to submit orders.", "color: green", {"customer": customer});

        let streetAddress = new bloombox.identity.StreetAddress(
          addressOne,
          addressTwo,
          city,
          state,
          zip);

        let location = new bloombox.shop.order.DeliveryLocation(
          streetAddress,
          deliveryInstructions);

        let cookieCreek = new bloombox.shop.Item(
          new bloombox.product.Key("-Ke0_QF5bpmyos_N6oK7", bloombox.product.Kind.FLOWERS), 1)
          .addWeightVariant(bloombox.product.Weight.EIGHTH);

        let classicPurps = new bloombox.shop.Item(
          new bloombox.product.Key("-Ke1AGB-CUApxLHqi-9X", bloombox.product.Kind.FLOWERS), 1)
          .addWeightVariant(bloombox.product.Weight.EIGHTH);

        let order = new bloombox.shop.order.Order(
          bloombox.shop.order.Type.DELIVERY,
          customer,
          location,
          notes)
          .setSchedulingTypeASAP()
          .addItem(cookieCreek)
          .addItem(classicPurps);

        order.send(function(orderId, order) {
          // we have received a response
          if (orderId === null) {
            // there was an error
            console.warn("%cThere was an error during order submission.", "color: red");
          } else {
            // order was submitted
            console.log("%cOrder was submitted with ID '" + orderId + "'.", "color: green", {"orderId": orderId, "order": order});
          }
        });
      }
    });
  });
}

/**
 * Run a test where a new user attempts to enroll.
 */
function doEnrollTest(callback) {
  bloombox.setup(partnerCode, locationCode, apiKey, function() {
    // test data
    let firstName = enrollFirstName;
    let lastName = enrollLastName;
    let emailAddress = enrollAccount;
    let phoneNumber = enrollPhone;

    // street address
    let streetAddress = new bloombox.identity.StreetAddress(
      addressOne,
      addressTwo,
      city,
      state,
      zip);

    // doctor's rec
    let rec = new bloombox.identity.DoctorRec(
      doctorRecID,
      doctorID,
      recExpiration,
      recJurisdiction,
      doctorFirstName,
      doctorLastName,
      doctorPhone,
      doctorWebsite);

    // driver's license
    let id = new bloombox.identity.ID(
      bloombox.identity.IDType.USDL,
      licenseID,
      licenseExpiration,
      birthDate,
      licenseJurisdiction,
      'USA');

    // contact info
    let contactInfo = new bloombox.identity.ContactInfo(
      emailAddress,
      phoneNumber,
      streetAddress);

    // person
    let enrollee = new bloombox.identity.Person(
      firstName,
      lastName,
      contactInfo,
      birthDate);

    // enrollment
    let enrollment = new bloombox.shop.enroll.Enrollment(
      bloombox.shop.enroll.EnrollmentSource.ONLINE,
      'test',
      enrollee,
      rec,
      id,
      'password123');

    console.log('%cPreparing enrollment...', 'color: blue', enrollment);

    enrollment.send(function(success, err, customer) {
      if (success === true && err === null && customer) {
        // enrollment succeeded
        console.log(
          '%cEnrollment succeeded. Proceeding with test order after brief pause...',
          'color: green', customer);

        setTimeout(function() {
          console.log('%cSubmitting test order...', 'color: blue');
          callback();
        }, 5000);
      } else {
        // there was an error
        console.error('%cEnrollment failed', 'color: red', err);
      }
    });
  });
}

function test() {
  // do an info test w/no followup
  doInfoTest(function(next){ }, function() { });
}

test();