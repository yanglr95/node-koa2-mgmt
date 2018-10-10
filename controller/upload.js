
'use strict';

/**
 * upload
 */
const path = require('path');
const url = require('url');
const fse = require('fs-extra');

const debug = require('debug')('controller:upload');

const {moment, config} = require('../util/index.js');

const UPLOAD_PATH = config.bodyParser.formidable.uploadDir;
const UPLOAD_PREFIX = '/upload';
const UPLOAD_MIN_SIZE = 1024; // 1k
const UPLOAD_MAX_SIZE = 5 * 1024 * 1024; // 5m

exports.file = async(ctx, next) => {
  const ACTIONS = {
    'banner': 'banner',
    'cert': 'cert',
    'splash': 'splash',
    'discount': 'discount',
    'popups': 'popups'
  };
  let subDir;
  let newDir;
  let newPath;
  let file;

  const action = ctx.checkParams('action').notEmpty().value;
  if (ACTIONS[action] === 'discount') {
    file = await ctx.checkFile('file').notEmpty().size(UPLOAD_MIN_SIZE, UPLOAD_MAX_SIZE).value;
  } else {
    file = await ctx.checkFile('file').notEmpty().size(UPLOAD_MIN_SIZE, UPLOAD_MAX_SIZE).isImageContentType().value;
  }

  let fileName = path.basename(file.path);

  if (ctx.errors) {
    ctx.dumpJSON(400, '上传失败，文件大小：1k-5M');
    return;
  }

  subDir = ACTIONS[action] + '/' + moment().format('YYYYMM');
  newDir = path.join(UPLOAD_PATH, subDir);
  newPath = path.join(newDir, fileName);

  debug('file:', file.path, newPath);

  await fse.moveSync(file.path, newPath);
  file.path = url.format(
    path.join(UPLOAD_PREFIX, path.relative(UPLOAD_PATH, newPath))
  );

  debug('newPath:', file.path);

  ctx.dumpJSON({
    size: file.name,
    name: file.name,
    hash: file.hash,
    path: file.path,
    type: file.type
  });
};
