var recast = require('recast');
var fileUtils = require('./file-utils');
var bb = require('bluebird');

var instructions = [
  'You should create SourceCodeFile instance with code or filename:',
  ' code: `new SourceCodeFile( { code: \'var a = 1;\' } )`',
  ' file: `new SourceCodeFile( { file: \'./full/path/to/file.js\' } )`',
  ' ast:  `new SourceCodeFile( { ast: ast_object } )`',
].join('\n');

/**
 * SourceCode
 */
class SourceCode {

  constructor(opts) {
    this.__code = null;
    this.__ast = null;
    this.__file_path = null;

    // validate
    var doesNotHaveOpt = !opts.file && !opts.code && !opts.ast;
    if (doesNotHaveOpt) {
      throw new Error(instructions);
    }

    if (opts.code) {
      // from code string
      this.__initialize(opts.code, null, opts.file);
    } else if (opts.ast) {
      // from ast string
      this.__initialize(null, opts.ast, opts.file);
    } else if (opts.file) {
      // from source-code file
      this.__file_path = opts.file;
      return this.__loadFromFile(opts.file);
    }

  }

  __initialize(code, ast, file_path) {
    if (code) {
      this.__file_path = file_path;
      this.__code = code;
      this.__ast = recast.parse(code);
    } else if (ast) {
      this.__file_path = file_path;
      this.__ast = ast;
      this.__code = recast.print(ast).code;
    }
  }

  // async call.
  // bb.coroutine(function* -> returns a promise and can use 'yield'
  __loadFromFile(full_path) {
    return bb.coroutine(function* (full_path) {
      var file_content = yield fileUtils.read(full_path);
      this.__initialize(file_content, null);
      return this;
    }.bind(this))(full_path);
  }

  get code() {
    return this.__code;
  }

  get ast() {
    return this.__ast;
  }

  get filepath() {
    return this.__file_path;
  }

}

module.exports = SourceCode;
