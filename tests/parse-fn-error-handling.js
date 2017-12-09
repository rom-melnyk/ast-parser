const assert = require('assert');
const { parse } = require('../src/parse');


describe('parse() error handling', () => {
    const WITH_UNKNOWN_SYMBOLS = '$1 + 2 + $ + asdf';
    it (`should throw SyntaxError`, () => {
        assert.throws(() => parse(WITH_UNKNOWN_SYMBOLS), SyntaxError);
    });
    it (`should not throw error`, () => {
        assert.ok(() => parse(WITH_UNKNOWN_SYMBOLS, { ignoreErrors: true }));
    });
});
