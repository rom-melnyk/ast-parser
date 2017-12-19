## Abstract Node description
All the node description must inherit from this one (must have properties and methods described below).
```javascript
{
    /**
    * @param {String|Number|Symbol} classId
    * Must be unique application-wide
    */ 
    classId: "...",


    /**
    * @param {String} type
    * One of "leaf", "infix", "postfix", "prefix", "block"
    */
    type: "...",


    /**
    * @param {String|RegExp|Array<String|RegExp>} masks
    * Describes how the node should look like (e.g., `/^[0-9]+$/` for NumberDecimal, `/^0x[0-9a-z]+$/i` for NumberHex and so on).
    * This is used on parsing phase only.
    */
    masks: [ "+" ],


    /**
    * @param {Function} interpret
    * @context { Object{content: {String}, children: {Array<Node>}}) }      `this` context for the function
    * @returns {*}
    * How the interpreter should handle the node.
    * This function is invoked in the way that the Node with all it's properties (e.g., `content`, `children`) is available as `this` context.
    * It returns the value, result of calculations. E.g. for Math operators:
    *   () => {
    *       const {content, children} = this;
    *       switch (content) {
    *           case "+":
    *               return children[0].interpret() + children[1].interpret();
    *           case "-":
    *               return children[0].interpret() - children[1].interpret();
    *           case "/":
    *               return children[0].interpret() / children[1].interpret();
    *           case "*":
    *               return children[0].interpret() * children[1].interpret();
    *           default:
    *       }
    *   }
    */
    interpret() { return this.content; }
```



## Terminal Node

Also known as _Leaf node._ Intended to be a terminal leaf of the syntax tree (no more children). It inherits the config from the `AbstractNode`.

`type` should be one of `"leaf"` or `"terminal"`. `interpret()` should handle `this.content`. No extra properties needed.

#### Example

```javascript
{
    classId: "NumericDecimal",
    type: "leaf",
    masks: /^[0-9]+$/,
    interpret() { return +this.content; }
}
```



## Infix Node

This node represents an operator that resides _between_ two of its operands (think "+", "-", "*", "/"). The infix node supports two operands: first preceding the operator and second following it. Both _operands_ will be compiled to operator's `.children`.

`type` is `"infix"`. `interpret()` should handle `this.content` and `this.children` (the latter is `Array(2)`).

#### Extra properties

- `proirity {Number}`; the more number is the higher is the priority of the operator among other infix operators. See example below for realization details.
- `isChildValid {Function(childNode)}` uses the node as context and returns boolean value defining whether the `childNode` might or might not be appended to current node. By default returns `true` (any child is valid).

#### Example

```javascript
{
    classId: "MathAdd",
    type: "infix",
    masks: "+",
    priority: 10,
    interpret() { return children[0].interpret() + children[1].interpret(); }
},
{
    classId: "MathMultiply",
    type: "infix",
    masks: "*",
    priority: 100,
    interpret() { return children[0].interpret() * children[1].interpret(); }
}
```

This ensures `2 + 2 * 2` to be **`6`** not **`8`.** In terms of AST graph it looks so:

```
Priority values:  (*) > (+)               (*) <= (+)
                                                    
Calculation result:   6                       8     
                                                    
Syntax tree:          +                       *     
                     / \                     / \    
                    *   2                   +   2   
                   / \                     / \      
                  2   2                   2   2     
```



## Prefix, postfix Nodes

Reside in front of it's operand _(prefix node)_ or follow it's operand _(postfix node)._ Think _`new`_ in `new Ctor` or _increment (`++`)_ in `++i` as **prefix** node. Think _increment (`++`)_ in `i++` as **postfix** node.

Both prefix and postfix nodes support one operand (will be compiled to node's `.children`).

`type` is `"prefix"` or `"postfix"` respectively. `interpret()` should handle `this.content` and `this.children` (the latter is `Array(1)`).

#### Extra properties

- `isChildValid {Function(childNode)}` behaves as similar method for _infix_ nodes. By default returns `true` (any child is valid).

#### Example

```javascript
{
    classId: "Inc10",
    type: "prefix",
    masks: "inc10",
    interpret() { return children[0].interpret() + 10; }
},
{
    classId: "Inc",
    type: "postfix",
    masks: "++",
    interpret() { return children[0].interpret() + 1; }
}
```

This calculates both `inc10 5` and `14++` to **`15`.**



## Block Node

`type` is `block`.

#### Extra properties

- `isChildValid {Function(childNode)}` behaves as similar method for _infix_ nodes. By default returns `true` (any child is valid).
- `isClosed {Function}` uses the node as context and returns boolean value defining whether compiler should append new children to this node or not.

#### Simple example
----------------- TBD -----------------

```javascript
{
    classId: "(",
    type: "block",
    masks: "(",
    interpret() {
        const children = this.children.slice(0, this.children.length - 1);
        const compliled = parser.complile(children);
        return compliled && compliled.interpret();
    },
    isClosed() {
        const lastChild = this.children[ this.children.length - 1 ];
        return lastChild && lastChild.content === ')'
    }
}
```


The _block_ operator node is useful for describing some usual language constructions, e.g., `function (a, b) {...}`

```javascript

```