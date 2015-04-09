module.exports = {
  __esModule: true,

  get SourceCode() { return require('./lib/src/source-code'); },
  get AstSearcher() { return require('./lib/src/ast-helpers/ast-searcher'); },
  get AstModifier() { return require('./lib/src/ast-helpers/ast-modifier'); },
};
