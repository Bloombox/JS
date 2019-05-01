
/*
 * Copyright 2019, Momentum Ideas, Co.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Stackdriver: Error Reporting
 *
 * @fileoverview Provides error reporting functionality with Stackdriver.
 */

/*global goog */

goog.require('bloombox.DEBUG');
goog.require('bloombox.logging.error');
goog.require('bloombox.logging.info');
goog.require('bloombox.logging.log');

goog.provide('stackdriver.ErrorReporter');
goog.provide('stackdriver.StackdriverConfig');

goog.provide('stackdriver.notifyFingerprint');
goog.provide('stackdriver.protect');
goog.provide('stackdriver.reportError');
goog.provide('stackdriver.setup');


/**
 * URL endpoint of the Stackdriver Error Reporting report API.
 * @type {string}
 */
let baseAPIUrl = 'https://clouderrorreporting.googleapis.com/v1beta1/projects/';


/**
 * Stackdriver config payload.
 *
 * @public
 * @typedef {{context: {user: ?string}, targetUrl: ?string, key: string, projectId: string, service: string, version: string, reportUncaughtExceptions: boolean, disabled: boolean}}
 */
stackdriver.StackdriverConfig;


/**
 * An Error handler that sends errors to the Stackdriver Error Reporting API.
 *
 * @param {stackdriver.StackdriverConfig} config - the init config.
 * @public
 * @constructor
 */
stackdriver.ErrorReporter = function ErrorReporter(config) {
  /**
   * API key to use.
   *
   * @type {string}
   * @public
   */
  this.apiKey = config.key;

  /**
   * Project ID to use.
   *
   * @type {string}
   * @public
   */
  this.projectId = config.projectId;

  /**
   * Target URL to use, if any. Overrides other config.
   *
   * @type {?string}
   */
  this.targetUrl = config.targetUrl || null;

  /**
   * Global context to include with errors.
   *
   * @type {Object}
   */
  this.context = config.context || {};

  /**
   * Service information.
   *
   * @type {{service: string, version: string}}
   */
  this.serviceContext = {
    'service': config.service || 'web',
    'version': config.version || '_unknown_'
  };

  /**
   * Whether to report uncaught exceptions, or not.
   * @type {boolean}
   */
  this.reportUncaughtExceptions = config.reportUncaughtExceptions !== false;

  /**
   * Killswitch for error reporting.
   *
   * @type {boolean}
   */
  this.disabled = config.disabled || false;

  // Register as global error handler if requested
  let that = this;
  if (this.reportUncaughtExceptions) {
    let oldErrorHandler = window.onerror || (function() {});

    window['onerror'] = function(msg, source, lineNumber, columnNumber, error) {
      if (error) {
        that.report(error);
      }
      oldErrorHandler(msg, source, lineNumber, columnNumber, error);
      return true;
    };
  }
};


/**
 * Report an error to the Stackdriver Error Reporting API
 *
 * @param {Error|String} errObj Error object or message string to report.
 */
stackdriver.ErrorReporter.prototype.report = function(errObj) {
  if (this.disabled || !errObj) {
    return;
  }

  let payload = {};
  payload['serviceContext'] = this.serviceContext;
  payload['context'] = this.context;
  payload['context']['httpRequest'] = {
    'userAgent': window.navigator.userAgent,
    'url': window.location.href
  };

  let firstFrameIndex = 0;

  let err = errObj;
  if ((!(err instanceof Error)) && (
    !(typeof err === 'string')) || err instanceof String) {
    let errorType = errObj.constructor.name;
    let errorMessage = err['message'];
    let errorMessageInfo = null;
    let errorName = null;
    if (errorMessage) {
      if (errorType) {
        errorMessageInfo = errorMessage;
        errorName = errorType.replace(/\$\$/g, '').replace(/\$/g, '.');
        if (errorName[0] === '.') {
          errorName = errorName.slice(1);
        }
      } else {
        errorMessageInfo = errorMessage;
        errorName = 'InternalError';
      }
    }

    if (errorMessageInfo !== null) {
      err = new Error(errorMessageInfo);
      err.errorName = errorName;
      let originalMessage = err.toString().replace('Error: ', '');
      let newMessage = errorName + ': ' + originalMessage;
      err.toString = function() {
        return newMessage;
      };
      firstFrameIndex = 2;
    }
  }

  if (typeof err === 'string' || err instanceof String) {
    // Transform the message in an error, use try/catch to make sure the
    // stacktrace is populated.
    try {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error(err);
    } catch (e) {
      err = e;
    }
    // the first frame when using report() is always this library
    firstFrameIndex = 2;
  }
  let that = this;
  // This will use source maps and normalize the stack frames
  window['StackTrace']['fromError'](err).then(function(stack) {
    payload['message'] = err.toString();
    for (let s = firstFrameIndex; s < stack.length; s++) {
      payload['message'] += '\n';
      // Reconstruct the stack frame to a JS stack frame as expected by Error
      // Reporting parsers. stack[s].source should not be used because not
      // populated when created from source map.
      //
      // If functionName or methodName isn't available <anonymous> will be used
      // as the name.
      payload['message'] += [
        '    at ', stack[s].getFunctionName() || '<anonymous>',
        ' (', stack[s].getFileName(), ':', stack[s].getLineNumber(),
        ':', stack[s].getColumnNumber() , ')'].join('');
    }
    bloombox.logging.error(payload['message']);
    that.sendErrorPayload(payload);
  }, function(reason) {
    // Failure to extract stacktrace
    payload['message'] = [
      'Error extracting stack trace: ', reason, '\n',
      err.toString(), '\n',
      '    (', err['file'], ':', err['line'], ':', err['column'], ')'
    ].join('');
    bloombox.logging.error(payload['message']);
    that.sendErrorPayload(payload);
  });
};


/**
 * Send an error payload to the API.
 *
 * @param {?Object} payload Payload to send.
 */
stackdriver.ErrorReporter.prototype.sendErrorPayload = function(payload) {
  let defaultUrl = baseAPIUrl +
    this.projectId + '/events:report?key=' + this.apiKey;
  let url = this.targetUrl || defaultUrl;

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.onloadend = function() {
    bloombox.logging.info('Sent error report.',
      payload);
  };
  xhr.onerror = function(e) {
    bloombox.logging.info('Failed to send error report.',
      payload);
    return e;
  };
  xhr.send(JSON.stringify(payload));
};


/**
 * Set the user for the current context.
 *
 * @param {string} user Unique identifier of the user (can be ID, email or
 *                 custom token) or `undefined` if not logged in.
 */
stackdriver.ErrorReporter.prototype.setUser = function(user) {
  this.context['user'] = user;
};


/**
 * Global error reporter.
 *
 * @type {?stackdriver.ErrorReporter}
 * @nocollapse
 * @protected
 */
let _REPORTER = null;


/**
 * Setup Stackdriver with an active reporter so it can be used later.
 *
 * @param {stackdriver.ErrorReporter} reporter Reporter object.
 * @return {stackdriver.ErrorReporter} The reporter it was handed.
 * @public
 */
stackdriver.setup = function(reporter) {
  _REPORTER = reporter;
  return _REPORTER;
};


/**
 * Report an error to the library-global error reporter.
 *
 * @param {Error|String} err Error to report.
 * @param {function(?)=} opt_op Operation the error happened in.
 * @return {boolean} Whether the error was reported.
 * @public
 */
stackdriver.reportError = function(err, opt_op) {
  let op = opt_op ? opt_op.name : null;
  if (_REPORTER === null) {
    // uh oh
    bloombox.logging.error('Unable to report error: not ' +
      'initialized.', err);
    return false;
  } else {
    // report the error
    bloombox.logging.error('Reporting error encountered in' +
      (op ? ' protected function \'' + op + '\'.' :
            ' anonymous function.'), err);
    _REPORTER.report(err);
  }
  return true;
};


/**
 * Set the unique device fingerprint for error reporting.
 *
 * @param {string} fingerprint Fingerprint.
 */
stackdriver.notifyFingerprint = function(fingerprint) {
  if (_REPORTER !== null)
    _REPORTER.setUser(fingerprint);
};


/**
 * Wrap a function so it is protected by Stackdriver Error Reporting.
 *
 * @param {T} operation Function to protect.
 * @return {T} The operation, but wrapped for failure.
 * @template T
 * @export
 */
stackdriver.protect = function(operation) {
  let op = /** @type {function(*)} */ (operation);
  return (function() {
    try {
      // execute with given args
      return op.bind(arguments[0]).apply(Array.from(arguments).slice(1));
    } catch (err) {
      // handle with error reporting, then rethrow
      stackdriver.reportError(err, op);
      bloombox.logging.error(err);
    }
  });
};
