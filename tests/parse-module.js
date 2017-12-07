const assert = require('assert');
const { parse, buildTree } = require('../src/parse');


describe('ast-parse module', () => {
    it('should export parse(){}', () => {
        assert.ok(typeof parse === 'function');
    });

    it('should export buildTree(){}', () => {
        assert.ok(typeof buildTree === 'function');
    });
});
