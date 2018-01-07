function oneOf() {}
function repeat() {}
function optional(arg) {
    return repeat(arg, 0, 1);
}


const eBNF = [
    {
        classId: 'program',
        rule: [
            'string',
            /regexp/,
            repeat({ classId: 'statement' }),
            oneOf()
        ]
    },
];

module.exports = eBNF;

const test = [
    
    {
        classId: 'variable',
        rule: [ '%', { classId: 'letter' }, repeat(oneOf({ classId: 'letter' }, { classId: 'number' }, '_'), 0, 'more'), '%' ]
    },
    {
        classId: 'symbol',
        rule: [ /[^a-z\d]+/i ]
    },
    {
        classId: 'number',
        rule: [ /-?\d+/ ]
    },
    {
        classId: 'letter',
        rule: [ /[a-z]+/i ]
    },
    {
        classId: 'whitespace',
        rule: [ /\s|\n/ ]
    },
    {
        classId: 'all-text',
        rule: [ /.+/ ]
    },
];



const alternative = {

    whitespace: [ /\s|\n/ ]
};

/*---------------------------------------

# rule: Array()
- String | RegExp for terminal symbols
- { classId: '...', repeat: [..., ...] } for non-terminal symbols
- oneOf()


---------------------------------------*/