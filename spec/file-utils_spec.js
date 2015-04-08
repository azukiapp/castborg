import h from './spec-helper';
import fileUtils from '../src/file-utils';

var bb = require('bluebird');

describe('fileUtils:', function() {

  it('should read a file', function () {
    return bb.coroutine(function* () {
      var file_content = yield fileUtils.read(__filename);
      h.expect(file_content).not.been.undefined;
    })();
  });

  it('should get fsStat from file', function () {
    return bb.coroutine(function* () {
      var fsStat = yield fileUtils.stat(__filename);
      h.expect(fsStat.isFile()).to.eql(true);
    })();
  });

  it('should write a file', function () {
    return bb.coroutine(function* () {
      var TMP_FILE_PATH = '/tmp/file_content.js';

      // get this content
      var file_content = yield fileUtils.read(__filename);

      // write file
      yield fileUtils.write(TMP_FILE_PATH, file_content);

      // check file stat
      var stat = yield fileUtils.stat(TMP_FILE_PATH);
      h.expect(stat.isFile()).to.be.equal(true);
    })();
  });

});
