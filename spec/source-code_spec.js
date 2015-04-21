import h from './spec-helper';
import SourceCode from '../src/source-code';
var bb = require('bluebird');

/**
 * source-code
 */
describe('SourceCode:', function() {

  var sourceCode;

  it('should load from CODE string', function() {
    var sample_code = [
      'var path = require(\'path\');',
      '',
      'var sum = function(a, b) {',
      '  return a + b;',
      '}',
    ].join('\n');
    sourceCode = new SourceCode({ code: sample_code });

    // check ast
    h.expect(sourceCode.ast).to.not.be.undefined;
    var bodyArray = sourceCode.ast.program.body;
    h.expect(bodyArray).to.be.an.array;
    h.expect(bodyArray[0].type).to.be.equal('VariableDeclaration');
    h.expect(bodyArray[1].type).to.be.equal('VariableDeclaration');

    // check code
    h.expect(sourceCode.code).to.equal([
      'var path = require(\'path\');',
      '',
      'var sum = function(a, b) {',
      '  return a + b;',
      '}',
    ].join('\n'));
  });

  it('should load from AST string', function() {
    // get first AST
    var sample_code_string_1 = [
      'var path = require(\'path\');',
      '',
      'var sum = function(a, b) {',
      '  return a + b;',
      '}',
    ].join('\n');
    var sourceCode1 = new SourceCode({ code: sample_code_string_1 });

    // load from AST
    var sourceCode2 = new SourceCode({ ast: sourceCode1.ast });

    var bodyArray = sourceCode2.ast.program.body;
    h.expect(bodyArray).to.be.an.array;
    h.expect(bodyArray[0].type).to.be.equal('VariableDeclaration');
    h.expect(bodyArray[1].type).to.be.equal('VariableDeclaration');

    // check code
    h.expect(sourceCode2.code).to.equal([
      'var path = require(\'path\');',
      '',
      'var sum = function(a, b) {',
      '  return a + b;',
      '}',
    ].join('\n'));
  });

  it('should throw an errors when the origin string is wrong', function() {
    var wrong_source = [
      'var sum = function(a, b) {',
      '  return a + b;',
      '}',
      'var path = require(\'path\';); // this is a comment', // do not fix this
      'var sum2 = function(a, b) {',
      '  return a + b;',
      '}',
    ].join('\n');

    // TODO: read error to test properly
    h.expect(() => new SourceCode({ code: wrong_source })).to.throw;

    // // load from AST
    // var sourceCode2 = new SourceCode({ ast: sourceCode1.ast });
    //
    // var bodyArray = sourceCode2.ast.program.body;
    // h.expect(bodyArray).to.be.an.array;
    // h.expect(bodyArray[0].type).to.be.equal('VariableDeclaration');
    // h.expect(bodyArray[1].type).to.be.equal('VariableDeclaration');
    //
    // // check code
    // h.expect(sourceCode2.code).to.equal([
    //   'var path = require(\'path\');',
    //   '',
    //   'var sum = function(a, b) {',
    //   '  return a + b;',
    //   '}',
    // ].join('\n'));
  });

  it('should load a javascript FILE (promises)', function() {
    var sourceCodePromise = new SourceCode({ file: __filename });
    sourceCodePromise.then(function (sourceCodeInstance) {
      h.expect(sourceCodeInstance.code).to.not.be.undefined;
      h.expect(sourceCodeInstance.ast).to.not.be.undefined;
    });
  });

  it('should load a javascript FILE (promises + generators yield)', function() {
    return bb.coroutine(function* () {
      sourceCode = yield new SourceCode({ file: __filename });
      h.expect(sourceCode.code).to.not.be.undefined;
      h.expect(sourceCode.ast).to.not.be.undefined;
    })();
  });

  //---------------------------------------------------------------

});
