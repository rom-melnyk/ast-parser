const { parse } = require('./src/parse');

const input = process.argv[2];

if (input) {
    console.log(parse(input));
} else {
    console.log('Run me with string parameter (what to parse)');
}

process.exit(0);
