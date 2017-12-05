const assert = require('assert');
const parse = require('../src/index');


describe('parse-argx module', () => {
    it('should export a function', () => {
        assert.ok(typeof parse === 'function');
    });
    it('should not fail without params', () => {
        assert.ok(typeof parse(), 'object');
    });
});
