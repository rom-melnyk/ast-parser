const assert = require('assert');
const Parser = require('../src/parser');
const { NodesConfig } = require('../src/nodes-config');



describe('new Parser()', () => {
    it('should be a constructor', () => {
        assert.ok(typeof Parser === 'function');
    });

    it('should generate proper object', () => {
        const parser = new Parser({ nodes: NodesConfig });
        assert.ok(typeof parser.parse === 'function', 'parse()');
        assert.ok(parser.isCaseSensitive === false, '.isCaseSensitive');
        assert.ok(parser.ignoreErrors === false, '.ignoreErrors');
        assert.ok(Array.isArray(parser.nodes), '.nodes[]');
    });
});
