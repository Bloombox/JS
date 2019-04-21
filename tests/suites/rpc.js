/* eslint-env mocha */
'use strict';


function rpcTestsuite() {
  describe('logic: RPC', function() {
    describe('RPCException object', function() {
      it('should accept a message and return it', function() {
        let exc = new bloombox.rpc.RPCException('hello');
        assert(exc.message === 'hello',
          'exception message should match given value');
      });

      it('should format with its message', function() {
        let exc = new bloombox.rpc.RPCException('hello');
        assert(exc.message === 'hello',
          'exception message should match given value');
        assert(exc.toString().indexOf('RPCException') !== -1,
          'exception message should specify it is an RPC error');
        assert(exc.toString().indexOf('hello') !== -1,
          'exception message should include its error');
      });
    });

    describe('RPC object', function() {
      it('should only accept objects as payloads', function() {
        try {
          new bloombox.rpc.RPC('GET', '/hello', 5, true, true);
        } catch (err) {
          // we good
          assert(err.message.indexOf('Invalid payload') !== -1,
            'should emit error describing invalid payload');
        }
      });
    });
  });
}
