
## Bloombox Client for JavaScript

This package provides support for Bloombox APIs in browser-oriented JavaScript. It's built using the Closure stack from
Google, including Closure Compiler, Library, builder, and so on.

### Using the code

You can either embed the library directly in your project (the compiled copy, or via Closure),
or you can use the CDN, which is the simplest and usually the most performant way:
```html
<!doctype html>
<html>
  <head>

  <script type="text/javascript" src="https://app.bloomware.media/client/__VERSION__.min.js"></script>
  <script type="text/javascript">
    bloombox.setup("<partner>", "<location>", "<apikey>", function() {
      // use the library
    });
  </script>

  [...]
```

### Shop API

Bloombox Shop and the Shop API provide tools for orchestrating an online cannabis shop, complete with hours, zipcode
checking, ordering, user signup and verification, and more.


#### Checking store hours

`bloombox.shop.info` lets you query hours for your storefront. It supplies a given callback with `pickup` and `delivery`
status:

```javascript
      bloombox.shop.info(function(pickup, delivery, err) {
        if (err) {
          console.log("%cThere was an error retrieving shop status: ", "color: red", err);
          return;
        }

        // is the shop open at all?
        if (!(pickup || delivery)) {
          // the shop is not open
          console.log("%cThe shop is not currently open for orders.", "color: red");
          return;
        }

        let label;
        if (pickup && delivery) {
          label = "PICKUP and DELIVERY";
        } else if (pickup) {
          label = "PICKUP ONLY";
        } else {
          label = "DELIVERY ONLY";
        }

        // report the shop status
        console.log("The shop is currently open for: " + label);
    });
```


#### Checking zipcodes

Many US cannabis retailers are permitted for delivery by zipcode. The `zipcheck` feature lets you check a zipcode
against a predefined list, that you can manage from your Bloombox Dashboard. This way, you can update your eligible
zipcodes easily and your web store will stay in sync.

```javascript
      bloombox.shop.zipcheck("<zipcode>", function (zipcodeEligible) {
        if (zipcodeEligible !== true) {
          console.log("%cThe zipcode was found to be ineligible. Cannot proceed.", "color: red");
        } else {
          console.log("%cThe zipcode is eligible for delivery orders.", "color: green");
        }
      });
    });
```


#### Verifying a user as a member

In order to simplify verification on *your* end as a retailer, especially in medical markets that require doctor
verification, this method can be used to ensure that only pre-verified users can submit an order. Users enrolled via
this API are eligible to be verified immediately, assuming your settings allow it.

If the user verifies as a member of your collective, you get back a `bloombox.shop.Customer` object that describes who
they are. You can re-use this object to submit an order.

```javascript
    bloombox.shop.verify("<email_to_verify>", function(verified, err, customer) {
      if (verified !== true) {
        // an error occurred - err is an enum and it specifies what happened
        console.warn("The user could not be verified.", "color: red", err);
      } else {
        // ok the user is verified, you can use `customer` to submit orders now
        console.log("%cThe user is valid and eligible to submit orders.", "color: green", {"customer": customer});
      }
    });
```


#### Debug mode

If you are having trouble getting things working correctly, you can use the debug copy, by prepending `-debug` before
the `.min` in the script URL:
```html
  <script type="text/javascript" src="https://app.bloomware.media/embed/client/shop/__VERSION__-debug.min.js"></script>
```

Then, you'll see debug logs in your console that describe what's going on.


### Building the code

Required tools:
- `node`
- `yarn`
- `git`

Steps:
- `git clone [...] && cd [project root]`
- `git submodule update --init --remote`
- `make`


### Other useful tidbits

Running the dev server (serves a test page at 'http://localhost:8000'):
```
  make serve
```

Publishing the library (GCS CDN permissions required):
```
  make publish
```
