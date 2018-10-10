
'use strict';

/**
 * static url
 */
let crypto = require('crypto');
let fs = require('fs');
let path = require('path');

let mkdirp = require('mkdirp');
let mkdirpSync = mkdirp.sync;

let files = {};
let buildDir = 'build';

function loadFile(name, dir, options) {
  let pathname = path.normalize(path.join(options.prefix, name));
  let obj = files[pathname] = files[pathname] ? files[pathname] : {};
  let filename = obj.path = path.join(dir, name);
  // var stats = fs.statSync(filename);
  let buffer = fs.readFileSync(filename);

  obj.md5 = crypto.createHash('md5').update(buffer).digest('hex');

  let destDir = path.dirname(path.join(dir, buildDir, pathname));
  let prefix = obj.md5 ? (obj.md5 + '.') : '';
  let dest = prefix + path.basename(pathname);
  let destPath = path.join(destDir, dest);

  obj.dest = path.join('/', buildDir, path.dirname(pathname), dest);
  // copy to new path
  if (!fs.existsSync(destDir)) {
    mkdirpSync(destDir);
  }
  // not exists write
  if (!fs.existsSync(destPath)) {
    console.log('static build to %s', obj.dest);
    fs.writeFileSync(destPath, buffer);
  }

  // release memory
  buffer = null;

  return obj;
}
function safeDecodeURIComponent(text) {
  try {
    return decodeURIComponent(text);
  } catch (e) {
    return text;
  }
}
/**
 * export
 */
module.exports = function(setting) {
  let debug = (setting && setting.debug) || false;

  return function(name, options) {
    let dir = (setting && setting.static) || 'public';
    options = options || {};
    options.prefix = (options.prefix || '').replace(/\/$/, '') + path.sep;

    if (debug) {
      return name;
    }

    let filename = safeDecodeURIComponent(path.normalize(name));
    let file = files[filename];

    if (!file) {
      file = loadFile(filename, dir, options);
    }
    return file.dest.replace(/\\/g, '/');
  };
};
