const assert = require('assert');
const Parser = require('../src/parser');
const { nodes } = require('./nodes-test-config');


const TESTS = {
    Nums_Add: {
        input: '1+22+33304+4',
        classIds: [ 'number', '+', 'number', '+', 'number', '+', 'number' ],
        contents: [ '1', '+', '22', '+', '33304', '+', '4' ]
    },
    Nums_MathSymbols: {
        input: '10 + 22 - 33 * 4 / 5',
        classIds: [ 'number', '+', 'number', '-', 'number', '*', 'number', '/', 'number' ],
        contents: [ '10', '+', '22', '-', '33', '*', '4', '/', '5' ]
    },
    Nums_MathSymbolsByLetters: {
        input: '10 plus 22 minus 33 mul 4 div 5 x 3',
        classIds: [ 'number', '+', 'number', '-', 'number', '*', 'number', '/', 'number', '*', 'number' ],
        contents: [ '10', 'plus', '22', 'minus', '33', 'mul', '4', 'div', '5', 'x', '3' ]
    },
    Nums_MathSymbolsByLetters_CaseSensitive: {
        input: '10 pLUs 22 MiNUS 33 muL 4 DIV 5 X 3',
        classIds: [ 'number', '+', 'number', '-', 'number', '*', 'number', '/', 'number', '*', 'number' ],
        contents: [ '10', 'pLUs', '22', 'MiNUS', '33', 'muL', '4', 'DIV', '5', 'X', '3' ]
    },
};


describe('parse()', () => {
    const parser = new Parser({ nodes });
    const WS_CLS_ID = parser.whitespaceNode.classId;
    const NOT_RECOG_CLS_ID = parser.notRecognizedNode.classId;

    it('should return an Array', () => {
        assert.ok(Array.isArray( parser.parse() ));
    });


    it('should parse whitespaces', () => {
        const parsed = parser.parse(' 1 +22  + 37 \n  + \n\n444 ');
        const classIds = [ WS_CLS_ID, 'number', WS_CLS_ID, '+', 'number', WS_CLS_ID, '+', WS_CLS_ID, 'number', WS_CLS_ID, '+', WS_CLS_ID, 'number', WS_CLS_ID ];
        const contents = [ ' ', '1', ' ', '+', '22', '  ', '+', ' ', '37', ' \n  ', '+', ' \n\n', '444', ' ' ];

        assert.equal(classIds.length, contents.length, `Bad whitespace test designed: classIds and contents have different length`);
        assert.equal(parsed.length, classIds.length);
        parsed.forEach(({ classId, content }, i) => {
            assert.equal(classId, classIds[i], `ClassId mismatch at #${i}`);
            assert.equal(content, contents[i], `Content mismatch at #${i}`);
        });
    });


    Object.keys(TESTS).forEach((key) => {
        const { input, classIds, contents } = TESTS[key];
        assert.equal(classIds.length, contents.length, `Bad TESTS.${key} designed: classIds and contents have different length`);

        it(`should parse ${key}: "${input.replace(/\n/g, '\\n')}"`, () => {
            const parsed = parser.parse(input)
                .filter(({ classId }) => classId !== WS_CLS_ID); // filtering out the whitespace

            assert.equal(parsed.length, classIds.length);
            parsed.forEach(({ classId, content }, i) => {
                assert.equal(classId, classIds[i], `ClassId mismatch at ${key}#${i}`);
                assert.equal(content, contents[i], `Content mismatch at ${key}#${i}`);
            });
        });
    });


    it('should respect case sensitivity', () => {
        const parser = new Parser({ nodes, isCaseSensitive: true, ignoreErrors: true });
        const parsed = parser.parse('10 pLUs 22 MiNUS 33 muL 4 DIV 5 X 3')
            .filter(({ classId }) => classId !== WS_CLS_ID); // filtering out the whitespace

        const classIds = [ 'number', NOT_RECOG_CLS_ID, 'number', NOT_RECOG_CLS_ID, 'number', NOT_RECOG_CLS_ID, 'number', NOT_RECOG_CLS_ID, 'number', NOT_RECOG_CLS_ID, 'number' ];
        const contents = [ '10', 'pLUs', '22', 'MiNUS', '33', 'muL', '4', 'DIV', '5', 'X', '3' ];

        assert.equal(parsed.length, 11, 'parsed.length');
        parsed.forEach(({ classId, content }, i) => {
            assert.equal(classId, classIds[i], `ClassId mismatch at #${i}`);
            assert.equal(content, contents[i], `Content mismatch at #${i}`);
        });
    });
});
