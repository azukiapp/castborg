var recast         = require('recast');
var AstSearcher    = require('./ast-searcher');
var debug          = require('debug')('castborg:AstModifier');
var hightLightCode = require('../../../index').hightLightCode;
var hightLightAST  = require('../../../index').hightLightAST;

/**
 * AstModifier (static class)
 * use directly: AstModifier.addDebugRequireOnTop(souceCode.ast);
 */
class AstModifier {

  constructor() {
    throw new Error('use directly: AstModifier.addDebugRequireOnTop(souceCode.ast);');
  }

  /**
   * Insert an AST on main program body start
   * @param {ast object}   original_ast     AST node
   * @param {ast object}   snippet_ast      AST node
   */
  static insertSnippetBeforeMainProgramBody(original_ast, snippet_ast) {
    // add snippet_ast to start of main program.body[]
    original_ast.program.body = snippet_ast.concat(original_ast.program.body);
    return original_ast;
  }

  /**
   * Insert an AST on function's body start
   * @param {ast object}   function_node    AST node
   * @param {ast object}   snippet_ast      AST node
   */
  static insertSnippetBeforeFunctionBody(function_node, snippet_ast) {
    function_node.body.body.unshift(snippet_ast[0]);
  }

  /**
   * Insert an AST just before function's returns statements
   * @param {ast object}   function_node    AST node
   * @param {ast object}   snippet_ast      AST node
   */
  static insertSnippetBeforeReturns(function_node, snippet_ast) {
    var func_body = AstSearcher.getFunctionBody(function_node);

    debug(hightLightCode('sourceCode', function_node));

    var existsReturnStatement = false;
    var types = recast.types;
    types.visit(func_body, {

      visitFunction: function(/* path */) {
        // avoid traversing this subtree.
        return false;
      },

      visitReturnStatement: function(path) {
        existsReturnStatement = true;
        // get block array from return statement
        var return_block_body = path.parentPath.value;

        debug(hightLightAST('AST return_block_body', return_block_body, 2));
        debug(hightLightCode('code path', path));

        return_block_body.pop();

        snippet_ast.forEach(function (ast_part) {
          // push snippets
          return_block_body.push(ast_part);
        });

        // push return back to here
        return_block_body.push(path.value);

        this.traverse(path);
      },
    });

    if (!existsReturnStatement) {
      function_node.body.body = function_node.body.body.concat(snippet_ast);
    }

    return function_node;
  }

  /**
   * Insert an AST on function's return statements
   * @param {ast object}   function_node    AST node
   * @param {ast object}   snippet_ast      AST node
   */
  static replaceFunctionReturnWithSnippet(function_node, snippet_ast) {

    var func_body = AstSearcher.getFunctionBody(function_node);

    var existsReturnStatement = false;
    var types = recast.types;
    types.visit(func_body, {

      visitFunction: function(/* path */) {
        // avoid traversing this subtree.
        return false;
      },

      visitReturnStatement: function(path) {
        existsReturnStatement = true;
        // get block array from return statement
        var return_block_body = path.parentPath.value;
        return_block_body.pop();

        snippet_ast.forEach(function (ast_part) {
          return_block_body.push(ast_part);
        });

        this.traverse(path);
      },
    });

    if (!existsReturnStatement) {
      function_node.body.body = function_node.body.body.concat(snippet_ast);
    }

    return function_node;
  }

}

module.exports = AstModifier;
