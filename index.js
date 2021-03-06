module.exports = {
  __esModule: true,

  get SourceCode ()    { return require('./lib/src/source-code'); },
  get AstSearcher()    { return require('./lib/src/ast-helpers/ast-searcher'); },
  get AstModifier()    { return require('./lib/src/ast-helpers/ast-modifier'); },
  get hightLightCode() { return require('./lib/src/code-frame').default; },
  get hightLightAST()  { return require('./lib/src/code-frame').hightLightAST; },
};
