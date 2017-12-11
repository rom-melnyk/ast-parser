const assert = require('assert');
const Parser = require('../src/parser');


const nodes = [
    { type: 'number', masks: /^[0-9]+$/ },
    { type: '+', masks: [ '+', 'plus' ] }
];


describe('parse() error handling', () => {
    const WITH_UNKNOWN_SYMBOLS = '$1 + 2 + $ + asdf';

    it('should throw SyntaxError', () => {
        const parser = new Parser({ nodes });
        assert.throws(() => {
            const parsed = parser.parse(WITH_UNKNOWN_SYMBOLS);
        }, SyntaxError);
    });

    it('should not throw error with `ignoreErrors=true`', () => {
        const parser = new Parser({ nodes, ignoreErrors: true });
        const parsed = parser.parse(WITH_UNKNOWN_SYMBOLS);
        assert.ok(Array.isArray(parsed));
        assert.ok(Array.isArray(parsed.errors));
    });


    it('should not parse partially covered mask', () => {
        const parser = new Parser({ nodes });
        assert.throws(() => {
            const parsed = parser.parse('1 plu 2');
        }, SyntaxError);
    });


    it('should not parse text with equals to mask but contains appended ot prepended parts', () => {
        const parser = new Parser({ nodes });
        assert.throws(() => {
            const parsed = parser.parse('1 pluss 2');
        }, SyntaxError);
        assert.throws(() => {
            const parsed = parser.parse('1 pplus 2');
        }, SyntaxError);
    });
});
