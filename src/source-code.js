var recast = require('recast');
var fileUtils = require('./file-utils');
var bb = require('bluebird');

var instructions = [
  'SourceCode creation Error. You should create SourceCode instance with a code or a filename:',
  ' code: `new SourceCode( { code: \'var a = 1;\' } )`',
  ' file: `new SourceCode( { file: \'./full/path/to/file.js\' } )`',
  ' ast:  `new SourceCode( { ast: ast_object } )`',
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
      try {
        this.__ast = recast.parse(code);
      } catch (err) {
        this.__print_parse_error(code, err);
        throw err;
      }
    } else if (ast) {
      this.__file_path = file_path;
      this.__ast = ast;
      this.__code = recast.print(ast).code;
    }
  }

  __print_parse_error(code, err) {
    // get the source code line of the error
    var errorLine = '';
    if (err.lineNumber) {
      errorLine = code.split('\n')[err.lineNumber - 1];
    }

    // show column indicator
    var errorColumnIndicator = '';
    if (err.column) {
      for (var i = 0; i < err.column - 1; i++) {
        errorColumnIndicator += '-';
      }
      errorColumnIndicator += '^';
    }

    // error complement
    var error_message_complement = [
      '',
      '        ' + errorLine,
      '        ' + errorColumnIndicator,
      '        ' + err.message
    ].join('\n');

    // throw esprima error
    err.message = error_message_complement;
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
