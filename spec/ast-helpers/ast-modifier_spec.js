import h                  from '../spec-helper';
import AstModifier        from '../../src/ast-helpers/ast-modifier';
import AstSearcher        from '../../src/ast-helpers/ast-searcher';
import SourceCode         from '../../src/source-code';

/**
 * debug-insert
 */
describe('AstModifier:', function() {

  it('should throw error when someone try to instantiate this class', function () {
    h.expect( () => (new AstModifier()) ).to.throw(Error);
  });
  //---------------------------------------------------------------

  describe('insertSnippetBeforeFunctionBody:', function () {

    it('should insert console log before', function() {

      // original code
      var sourceCode = new SourceCode({ code: [
        "function sum(a, b) {",
        "  return a + b;",
        "}",
      ].join('\n') });

      // get function
      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      var first_function_ast = functions_list_path[0].node;

      // get snippet AST
      var console_snippet = new SourceCode({ code: "console.log('HERE');" });
      var snippet_ast = console_snippet.ast.program.body;

      // ! insert Snippet Before Function Body
      AstModifier.insertSnippetBeforeFunctionBody(first_function_ast, snippet_ast);

      // check result
      var result_source_code = new SourceCode({ ast: first_function_ast });
      h.expect(result_source_code.code).to.eql([
        "function sum(a, b) {",
        "  console.log('HERE');",
        "  return a + b;",
        "}",
      ].join('\n'));

    });

  });
  //---------------------------------------------------------------

  describe('Insert return statement:', function () {

    it('should insert snippet on return statement', function() {
      // original code
      var sourceCode = new SourceCode({ code: [
        "function sum(a, b) {",
        "  return a + b;",
        "}",
      ].join('\n') });

      // get function
      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      var first_function_ast = functions_list_path[0].node;

      // get snippet AST
      var console_snippet = new SourceCode({ code: "console.log('HERE');" });
      var snippet_ast = console_snippet.ast.program.body;

      // ! insert Snippet On Return Function
      AstModifier.replaceFunctionReturnWithSnippet(first_function_ast, snippet_ast);

      // check result
      var result_source_code = new SourceCode({ ast: first_function_ast });
      h.expect(result_source_code.code).to.eql([
        "function sum(a, b) {",
        "  console.log('HERE');",
        "}",
      ].join('\n'));

    });

    it('should insert on last line if no return was found', function() {
      // original code
      var sourceCode = new SourceCode({ code: [
        "function sum(a, b) {",
        "  this.result = a + b;",
        "}",
      ].join('\n') });

      // get function
      var functions_list_path = AstSearcher.getAllFunctionsPaths(sourceCode.ast);
      var first_function_ast = functions_list_path[0].node;

      // get snippet AST
      var console_snippet = new SourceCode({ code: "console.log('HERE');" });
      var snippet_ast = console_snippet.ast.program.body;

      // ! insert Snippet On Return Function
      AstModifier.replaceFunctionReturnWithSnippet(first_function_ast, snippet_ast);

      // check result
      var result_source_code = new SourceCode({ ast: first_function_ast });
      h.expect(result_source_code.code).to.eql([
        "function sum(a, b) {",
        "  this.result = a + b;",
        "  console.log('HERE');",
        "}",
      ].join('\n'));

    });

  });
  //---------------------------------------------------------------
});
