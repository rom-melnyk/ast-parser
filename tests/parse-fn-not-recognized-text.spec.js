const assert = require('assert');
const Parser = require('../src/parser');
const { TYPES } = require('../src/nodes/constants');


const nodes = [
    { classId: 'number', type: TYPES.Terminal, masks: /^[0-9]+$/ },
    { classId: '+', type: TYPES.Infix, masks: [ '+', 'plus' ] }
];


describe('parse() error handling', () => {
    const parser = new Parser({ nodes });
    const WS_CLS_ID = parser.whitespaceNode.classId;
    const NOT_RECOG_CLS_ID = parser.notRecognizedNode.classId;

    const TESTS = {
        WithUnknownSymbols: {
            name: 'should parse unknown symbols',
            input: '$1 + 2 + $ + asdf',
            classIds: [ NOT_RECOG_CLS_ID, 'number', '+', 'number', '+', NOT_RECOG_CLS_ID, '+', NOT_RECOG_CLS_ID ],
            contents: [ '$', '1', '+', '2', '+', '$', '+', 'asdf' ]
        },
        PartiallyCoveredMask: {
            name: 'should not parse partially covered mask',
            input: '1 plu 2',
            classIds: [ 'number', NOT_RECOG_CLS_ID, 'number' ],
            contents: [ 1, 'plu', '2' ]
        },
        MaskWithPrepended: {
            name: 'should recognize mask with prepended junk',
            input: '1 pplus 2',
            classIds: [ 'number', NOT_RECOG_CLS_ID, '+', 'number' ],
            contents: [ 1, 'p', 'plus', '2' ]
        },
        MaskWithAppended: {
            name: 'should recognize mask with appended junk',
            input: '1 pluss 2',
            classIds: [ 'number', '+', NOT_RECOG_CLS_ID, 'number' ],
            contents: [ 1, 'plus', 's', '2' ]
        },
    };


    Object.keys(TESTS).forEach((key) => {
        const { name, input, classIds, contents } = TESTS[key];
        assert.equal(classIds.length, contents.length, `Bad TESTS.${key} designed: classIds and contents have different length`);

        it(name, () => {
            const parsed = parser.parse(input)
                .filter(({ classId }) => classId !== WS_CLS_ID); // filtering out the whitespace

            assert.equal(parsed.length, classIds.length, 'parsed.length');
            parsed.forEach(({ classId, content }, i) => {
                assert.equal(classId, classIds[i], `ClassId mismatch at ${key}#${i}`);
                assert.equal(content, contents[i], `Content mismatch at ${key}#${i}`);
            });
        });
    });
});
