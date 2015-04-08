var recast = require('recast');
var ast_types = recast.types;
// var R = require('ramda');

/**
 * AstSearcher (static class)
 * use directly: AstSearcher.getAllFunctionsPaths(souceCode.ast);
 */
module.exports = class AstSearcher {

  constructor() {
    throw new Error('use directly: AstSearcher.searchMainBody(souceCode.ast)');
  }

  /**
   * Search for all functions paths on ast
   * @return {ast paths Array}   All functions AST nodes
   */
  static getAllFunctionsPaths(ast) {
    var functions_list_path = [];
    ast_types.visit(ast, {
      visitFunction: function(path) {
        functions_list_path.push(path);
        this.traverse(path);
      },
    });
    return functions_list_path;
  }

  /**
   * Search for a functions on specified location
   * @return {ast path}   the function node
   */
  static getOnLocationFunctionPath(ast, current_line, current_column) {
    var selected_function_path = null;
    var _isLocInsideFunction = this._isLocInsideFunction;
    ast_types.visit(ast, {
      visitFunction: function(path) {
        var node = path.node;
        var loc = node.loc;

        // loc start check
        if (_isLocInsideFunction(current_line, current_column, loc)) {
          selected_function_path = path;
          return false;
        } else {
          this.traverse(path);
        }
      },
    });
    return selected_function_path;
  }

  /**
   * Check if current_line, current_column is inside a location
   * @return {Boolean}   isInside?
   */
  static _isLocInsideFunction(current_line, current_column, loc) {
    // check if is inside lines
    if (current_line < loc.start.line || current_line > loc.end.line) {
      return false;
    }

    // if on first line, check column
    if (current_line === loc.start.line) {
      return current_column >= loc.start.column &&
             current_column <= loc.start.column;
    }

    // if on last line, check column
    if (current_line === loc.end.line) {
      return current_column >= loc.end.column &&
             current_column <= loc.end.column;
    }

    // must be inside
    return true;
  }

  /**
   * Search function name
   * @return {string}   function name
   */
  static getNameFromFunctionPath(func_path) {

    /**
      function fNAME(a, b) {
        return a + b;
      }
     */
    var func_node = func_path.node;
    if (func_node.id && func_node.id.name) {
      return func_node.id.name;
    }

    /**
      var fNAME = function (a, b) {
        return a + b;
      }
     */
    // check if is part of a variable declaration
    if (func_path.parentPath.value.type === 'VariableDeclarator') {
      return func_path.parentPath.value.id.name;
    }

    /**
      obj = {
        fNAME: function (a, b) {
          return a + b;
        }
      }
     */
    if (func_path.parentPath.value.type === 'Property') {
      return func_path.parentPath.value.key.name;
    }

    /*
    class F3 {
      constructor() {}
      get fNAME1() {}
      set fNAME2(value) {}
      fNAME3() {}
      static fNAME4() {}
    }
    */
    if (func_path.parentPath.value.type === 'MethodDefinition') {
      var class_name = func_path.parentPath.parentPath.parentPath.parentPath.value.id.name;
      // /**/console.log('\n>>---------\n func_path.parentPath.value:\n', func_path.parentPath.value, '\n>>---------\n');/*-debug-*/
      // /**/console.log('\n>>---------\n func_path.parentPath:\n', func_path.parentPath, '\n>>---------\n');/*-debug-*/
      if (func_path.parentPath.value.key.name === 'constructor' ) {
        // constructor
        return 'new ' + class_name + '()';
      } else if (func_path.parentPath.value.kind === 'get' ||
        func_path.parentPath.value.kind === 'set') {
        // get or set
        var get_or_set_name = func_path.parentPath.value.key.name;
        return func_path.parentPath.value.kind + ' ' + class_name + '.' + get_or_set_name;
      } else {
        // method
        var static_prefix = func_path.parentPath.value.static ? 'static ' : '';
        return static_prefix + class_name + '.' + func_path.parentPath.value.key.name + '()';
      }
    }

    return 'anonymous';
  }

  /**
   * Search function's return expression
   * @return {ast path}   function's return expression AST
   */
  static getReturnStatementFromFunctionPath(func_ast) {
    var paths_to_return = [];

    ast_types.visit(func_ast, {
      visitReturnStatement: function(path) {
        paths_to_return.push(path);
        this.traverse(path);
      },
    });

    return paths_to_return;
  }

};
