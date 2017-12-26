const eBNF = [
    {
        classId: 'program',
        rule: [
            'string',
            /regexp/,
            { classId: 'statement', repeat: [ 0, 'more' ] },
            // oneOf()
        ]
    },
];

module.exports = eBNF;
