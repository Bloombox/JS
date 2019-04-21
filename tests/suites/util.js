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
}
