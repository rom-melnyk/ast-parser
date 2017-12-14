const assert = require('assert');
const Parser = require('../src/parser');


const nodes = [
    { type: 'number', masks: /^[0-9]+$/ },
    { type: '+', masks: [ '+', 'plus' ] },
    { type: '++', masks: 'plussisimo' }
];


describe('parse() nodes with overlapping masks', () => {
    it('should parse correctly if mask from different nodes overlap each other', () => {
        const parser = new Parser({ nodes: nodes });
        const parsed1 = parser.parse('1 plus 2');
        const parsed2 = parser.parse('1 plussisimo 2');

        assert.equal(parsed1.length, 3, 'nodes count (1)');
        assert.equal(parsed2.length, 3, 'nodes count (2)');

        assert.equal(parsed1[1].type, '+', '"+" recognition');
        assert.equal(parsed2[1].type, '++', '"++" recognition');
    });
});