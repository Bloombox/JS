/* eslint-env mocha */
'use strict';


function utilTestsuite() {
  describe('base64 utilities', function() {
    it('should accurately encode and decode b64', function() {
      const val = 'hello';
      const encoded = bloombox.util.b64.encode(val);
      const encoded2 = bloombox.util.b64.encode(val);
      const decoded = bloombox.util.b64.decode(encoded);
      expect(encoded).not.toBeNull();
      expect(decoded).toEqual(val);
      expect(encoded).toEqual(encoded2);
    });

    it('should accurately encode and decode in clean mode', function() {
      const val = 'hello';
      const encoded = bloombox.util.b64.encode(val, true);
      const encoded2 = bloombox.util.b64.encode(val, true);
      const decoded = bloombox.util.b64.decode(encoded, true);
      expect(encoded).not.toBeNull();
      expect(decoded).toEqual(val);
      expect(encoded).toEqual(encoded2);
    });
  });

  describe('base64 web-safe utilities', function() {
    it('should accurately encode and decode pretty b64', function() {
      const val = 'hello';
      const websafe = bloombox.util.b64.encodeWebsafe(val);
      const websafe2 = bloombox.util.b64.encodeWebsafe(val);
      const decoded = bloombox.util.b64.decodeWebsafe(websafe);
      expect(websafe).not.toBeNull();
      expect(decoded).toEqual(val);
      expect(websafe).toEqual(websafe2);
    });
  });

  describe('error reporting utilities', function() {
    it('should set itself up on the window', function() {
      expect(window['StackTrace']).not.toBeNull();
    });

    it('should be able to report an error', function() {
      const err = new Error('Testing basic error reporting.');
      const result = stackdriver.reportError(err);
      expect(result).toBe(true);
    });

    it('should be able to error-ize an exception', function() {
      try {
        // noinspection ExceptionCaughtLocallyJS
        throw new bloombox.rpc.RPCException(
          'Testing exception error reporting.');
      } catch (err) {
        const result = stackdriver.reportError(err);
        expect(result).toBe(true);
      }
    });

    it('should be able to protect a function', function() {
      let caught = false;
      try {
        caught = false;
        stackdriver.protect(function() {
          throw new bloombox.rpc.RPCException(
            'Testing protected function error reporting.');
        })();
      } catch {
        caught = true;
      }
      expect(caught).not.toBe(true);
    });
  });
}
