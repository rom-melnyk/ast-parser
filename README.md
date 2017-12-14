# Abstract Syntax Tree (AST) parser


## `new Parser(options)`

Creates the Parser object based on given `{object} options`. One Parser is able to compile one language (think a set of syntax rules). The Parser instance provides following methods:

- `{Function} .parse({String|Buffer} input)` parses the text input into an array of nodes;
- `{Function} .compile({Array<Node>} nodes)` compiles parsed nodes into a tree;
- `{Function} .interpret(Node)` runs the compiled object.

### Parser options

- `{Boolean} options.isCaseSensitive = false` makes the language case-sensitive (like JavaScript); `false` by default so language tends to ignore case (like SQL).
   This behavior might be overridden on the node level (see below);
- `{Boolean} options.ignoreErrors = false` controls whether `.parse()` **throws errors** (this is default behavior) or ignores 'em.
   With the second option the array returned will contain a property `{Array<SyntaxError>} .errors` if any appear;
- `{Array{Object}} options.nodes = []` which  describes language syntax; se below for more details;
- `{RegExp} options.whitespace = /\s|\n/` which describes which symbols should be considered as whitespace (so should be ignored unless belong to a node).

### Describing a node

Node should be described as an object containing following properties:

- `{*} type` which describes the node in human-friendly way. This must be **unique**, so use Strings (preferable), Symbols or any other data type which ensures uniquity and is is human-friendly;
- `{String|RegExp|Array<String|RegExp>} masks` describes how the node should look like (e.g., `/^[0-9]+$/` for NumberDecimal, `/^0x[0-9a-z]+$/i` for NumberHex and so on).
   **Some caveats here**
- `{Boolean} isCaseSensitive = <Parser.isCaseSensitive>}` can override language-wide behavior for a particular node;
- `{Number} priority` makes sense for infix operators. The _higher_ this number is, the _higher_ priority the operator haves.
   In real life: `{ type: '+', priority: 10 }`, `{ type: '*', priority: 100 }`, `{ type: '()', priority: 1000 }`.
- `{Function} interpret({ content, children })` determines how current node should be interpreted. E.g.:
  - given `"1+2"`,
     `new Parser({ nodes: [ { type: 'num', ..., interpret({ content }) { return +content;} } ] })`
  - --( parsing )--> `[ <Node(1)>, <Node('+')>, <Node(2)> ]`,
  - --( compilation ) --> `Node( '+', children: [ Node(1), Node(2) ] )`.
  - So for `numeric` node the `.interpret()` method looks like `interpret({ content, children }) { return +content; }`,
     for `+` it looks like `interpret({ content, children }) { return children[0] + children[1]; }`.

