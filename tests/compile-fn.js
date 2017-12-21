const assert = require('assert');
const Parser = require('../src/parser');
const { TYPES } = require('../src/nodes/constants');


const nodes = [
    { type: TYPES.Terminal, masks: /^[0-9]+$/ },
    { type: TYPES.Infix, masks: '+', priority: 10 },
    { type: TYPES.Infix, masks: '-', priority: 10 },
    { type: TYPES.Infix, masks: '*', priority: 100 },
    { type: TYPES.Infix, masks: '/', priority: 100 },
];

const EXPECTED = {
    Nums_Add: {
        input: '1 + 2 + 3 + 4',
        result: 10
    },
    Nums_AddSub: {
        input: '10 - 2 + 80 - 18',
        result: 70
    },
    // With_Whitespace: {
    //     input: ' 1 +22  + 37 \n  + \n\n444 ',
    //     types: [ 'number', '+', 'number', '+', 'number', '+', 'number' ],
    //     contents: [ '1', '+', '22', '+', '37', '+', '444' ]
    // },
    // Nums_MathSymbols: {
    //     input: '10 + 22 - 33 * 4 / 5',
    //     types: [ 'number', '+', 'number', '-', 'number', '*', 'number', '/', 'number' ],
    //     contents: [ '10', '+', '22', '-', '33', '*', '4', '/', '5' ]
    // },
    // Nums_MathSymbolsByLetters: {
    //     input: '10 plus 22 minus 33 mul 4 div 5 x 3',
    //     types: [ 'number', '+', 'number', '-', 'number', '*', 'number', '/', 'number', '*', 'number' ],
    //     contents: [ '10', 'plus', '22', 'minus', '33', 'mul', '4', 'div', '5', 'x', '3' ]
    // },
    // Nums_MathSymbolsByLetters_CaseSensitive: {
    //     input: '10 pLUs 22 MiNUS 33 muL 4 DIV 5 X 3',
    //     types: [ 'number', '+', 'number', '-', 'number', '*', 'number', '/', 'number', '*', 'number' ],
    //     contents: [ '10', 'pLUs', '22', 'MiNUS', '33', 'muL', '4', 'DIV', '5', 'X', '3' ]
    // },
};


describe('compile()', () => {
    const parser = new Parser({ nodes });

    it('should return `undefined` being run without parameters', () => {
        assert.ok( !parser.complile() );
    });


    Object.keys(EXPECTED).forEach((key) => {
        const expected = EXPECTED[key];

        it(`should compile parsed data for ${key}: "${expected.input}"`, () => {
            const nodes = parser.parse(expected.input);
            const compiled = parser.complile(nodes);

            assert.equal(typeof compiled, 'object');
            assert.equal(compiled.interpret(), expected.result);
        });
    });
});
