# Bloombox for JavaScript

[![Build Status](https://travis-ci.org/Bloombox/JS.svg?branch=master)](https://travis-ci.org/Bloombox/JS) [![npm](https://img.shields.io/npm/v/bloombox.svg)]() [![npm](https://img.shields.io/npm/dw/bloombox.svg)](https://github.com/bloombox/JS) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/f3dd1253ff8140fd96ff1b4dad0afd2d)](https://www.codacy.com/app/bloombox/JS?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Bloombox/JS&amp;utm_campaign=Badge_Grade) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Maintainability](https://api.codeclimate.com/v1/badges/b02d3e57e60d030bc818/maintainability)](https://codeclimate.com/github/Bloombox/JS/maintainability) [![codecov](https://codecov.io/gh/Bloombox/JS/branch/master/graph/badge.svg)](https://codecov.io/gh/Bloombox/JS)

Latest Version: `v2.1.0-rc3`

This package provides support for Bloombox APIs in browser-oriented JavaScript. It's built using the Closure stack from
Google, including Closure Compiler, Library, builder, and so on. Made with love by [Bloombox](https://bloombox.cloud) in Sacramento, CA.

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

If you are having trouble getting things working correctly, you can use the debug copy, by affixing `-debug` before
the `.min` in the script URL:
```html
  <script type="text/javascript" src="https://js.bloombox.cloud/latest-debug.min.js"></script>
```

Then, you'll see debug logs in your console that describe what's going on.


#### Beta mode

If you want to test against the latest library features while they are still in staging, you can also try the `-beta`
variant of the library, placed just before the `.min` in the script URL, like `-debug`:
```html
<script type="text/javascript" src="https://js.bloombox.cloud/latest-beta.min.js"></script>
```


#### Version-pinned URL

If you would like to pin your application to a specific version of the library, you can do that:

```html
  <script type="text/javascript" src="https://js.bloombox.cloud/client/v2.1.0-rc3.min.js"></script>
```

and...

```html
  <script type="text/javascript" src="https://js.bloombox.cloud/client/v2.1.0-rc3-debug.min.js"></script>
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

This library was made and is managed with <3 by [Bloombox](https://bloombox.cloud), a subsidiary of Momentum Ideas, Co., from Sacramento,
California. Bloombox JS is distributed under the Apache License v2, which is enclosed herein as `LICENSE.txt`. Third
party license notices, including ones from MochiKit and Google, via the Closure Authors.

