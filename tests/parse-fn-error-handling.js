const assert = require('assert');
const Parser = require('../src/parser');
const { NodesConfig } = require('../src/nodes-config');



describe('parse() error handling', () => {
    const parser = new Parser({ nodes: NodesConfig });
    const WITH_UNKNOWN_SYMBOLS = '$1 + 2 + $ + asdf';

    it (`should throw SyntaxError`, () => {
        assert.throws(() => parser.parse(WITH_UNKNOWN_SYMBOLS), SyntaxError);
    });
    it (`should not throw error`, () => {
        parser.ignoreErrors = true;
        assert.ok(() => parser.parse(WITH_UNKNOWN_SYMBOLS));
    });
});
