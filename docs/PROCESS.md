# How the language is handled?

The language is a set of syntactical constructions obeying some rules. Those ruses describe

- all atomic parts of the language (how things are _broken apart_),
- how atoms (nodes) _interact_ with each other (e.g., operator-operand relations, blocks),
- how to interpret it (e.g., what _action_ should be performed upon numbers in "1 + 2").

The parser instance provides following methods:

1. `.parse()` for parsing the text (or Buffer) into array of nodes (breaking apart);
1. `.compile()` for building so called Syntax Tree;
1. `.interpret()` for calculating the tree (running the program).
