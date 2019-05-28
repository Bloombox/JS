/* eslint-env mocha */
'use strict';


function rpcTestsuite() {
  describe('logic: RPC', function() {
    describe('RPCException object', function() {
      it('should accept a message and return it', function() {
        let exc = new bloombox.rpc.RPCException('hello');
        assert(exc.message === 'hello',
          'exception message should match given value');
        expect(exc.message).toBe('hello');
      });

      it('should format with its message', function() {
        let exc = new bloombox.rpc.RPCException('hello');
        assert(exc.message === 'hello',
          'exception message should match given value');
        assert(exc.toString().indexOf('RPCException') !== -1,
          'exception message should specify it is an RPC error');
        assert(exc.toString().indexOf('hello') !== -1,
          'exception message should include its error');
        expect(exc.message).toBe('hello');
        expect(exc.toString().indexOf('RPCException')).not.toBe(-1);
        expect(exc.toString().indexOf('hello')).not.toBe(-1);
      });
    });
  });
}
