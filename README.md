# castborg

#### SourceCode

Represents `code <--> AST`
Can be initialized with a code, an AST or a file path

```js
// by code
var sourceCode = new SourceCode({ code: 'var obj = { a: 1, b: 2 };' });
// by AST
var sourceCode = new SourceCode({ ast: some_ast_object });
// by file
var sourceCode = new SourceCode({ file: './some-file.js' });
```

All `source code` instances have `ast`, `code` and `filename` properties

```js
var ast       = sourceCode.ast;
var code      = sourceCode.code;
var file_name = sourceCode.file;
```

---------------

#### AstSearcher

AstSearcher has only static method that parse an AST and return a path

---------------

#### AstModifier

AstModifier has only static method that can modify an AST
It will then return a new copy of the existing code / AST / filepath.
