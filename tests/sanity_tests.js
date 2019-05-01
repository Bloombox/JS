/* eslint-env mocha */
'use strict';

describe('sanity tests', function() {
  it('should pass a sensible math test', function() {
    if (1 + 1 !== 2)
      throw new Error('math doesn\'t seem to add up');
    expect(1 + 1).toBe(2);
  });

  it('should be able to access the window', function() {
    if (!window)
      throw new Error('no window variable');
    expect(window).not.toBeNull();
  });
});
