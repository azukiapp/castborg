var fs = require('fs-extra');
var bb = require('bluebird');
bb.promisifyAll(fs);

module.exports = {
  /**
   * read :: fs.readFile
   * @param  {String} full_path  file fullpath
   * @return {String}            file content
   */
  read: bb.coroutine(function* (full_path) {
    var file_content = yield fs.readFileAsync(full_path);
    return file_content;
  }),

  /**
   * stat :: fs.stat
   * @param  {string} full_path     file's fullpath to get stat
   * @return {object} fsStat        stat functions: isFile, isDirectory, isBlockDevice, isCharacterDevice, isSymbolicLink, isFIFO, isSocket
   */
  stat: bb.coroutine(function* (full_path) {
    var fsStat = yield fs.statAsync(full_path);
    return fsStat;
  }),

  /**
   * write :: fs.writeFile
   * @param  {String} full_path  file fullpath
   * @param  {String} data       file content
   */
  write: bb.coroutine(function* (full_path, data) {
    yield fs.writeFileAsync(full_path, data);
  }),

  /**
   * mkdirs :: fs.mkdirs
   * @param  {String} full_path  folder fullpath
   */
  mkdirs: bb.coroutine(function* (full_path) {
    yield fs.mkdirs(full_path);
  }),

  /**
   * glob :: glob
   */
  glob: require('glob'),

};
