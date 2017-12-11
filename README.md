
# Bloombox for JavaScript

Latest version: `v1.0.0-beta9`

This package provides support for Bloombox APIs in browser-oriented JavaScript. It's built using the Closure stack from
Google, including Closure Compiler, Library, builder, and so on.

### Using the code

You can either embed the library directly in your project (the compiled copy, or via Closure),
or you can use the CDN, which is the simplest and usually the most performant way:
```html
<!doctype html>
<html>
  <head>

  <script type="text/javascript" src="https://js.bloombox.cloud/latest.min.js"></script>
  <script type="text/javascript">
    bloombox.setup("<partner>", "<location>", "<apikey>", function() {
      // use the library
    });
  </script>

  [...]
```


#### Debug mode

If you are having trouble getting things working correctly, you can use the debug copy, by prepending `-debug` before
the `.min` in the script URL:
```html
  <script type="text/javascript" src="https://js.bloombox.cloud/latest-debug.min.js"></script>
```

Then, you'll see debug logs in your console that describe what's going on.


#### Version-pinned URL

If you would like to pin your application to a specific version of the library, you can do that:

```html
  <script type="text/javascript" src="https://js.bloombox.cloud/client/v1.0.0-beta9.min.js"></script>
```

and...

```html
  <script type="text/javascript" src="https://js.bloombox.cloud/client/v1.0.0-beta9-debug.min.js"></script>
```


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

##### Licensing

This library was made and is managed with <3 by Bloombox, a subsidiary of Momentum Ideas, Co., from Sacramento,
California. Bloombox JS is distributed under the Apache License v2, which is enclosed herein as `LICENSE.txt`. Third
party license notices, including ones from MochiKit and Google, via the Closure Authors.
