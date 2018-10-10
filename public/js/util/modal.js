
'use strict';

/**
 * modal
 */
// const $el = {};
const template = require('./modal.pug');

function init(opt) {
  return $(template(opt)).appendTo(document.body);
}

module.exports = function(opt) {
  return init(opt);
};
