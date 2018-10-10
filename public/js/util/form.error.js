
'use strict';

/**
 * form
 */
// const CACHE = {};

module.exports = opt => {
  Object.keys(opt).forEach(key => {
    formFieldError(key, opt[key]);
  });
};

function formFieldError(idx, item) {
  const $form = $(idx);
  const fields = arr2obj(item);
  const cls = 'error';
  var formNeedUpdate;
  Object.keys(fields).forEach(key => {
    $(`[name=${key}]`, $form).closest('.field').addClass(cls);
    formNeedUpdate = true;
  });
  if (formNeedUpdate) {
    $form.addClass(cls);
  }
}

function arr2obj(arr) {
  const ret = {};
  arr.forEach(el => {
    Object.keys(el).forEach(k => {
      if (!ret[k]) {
        ret[k] = [];
      }
      ret[k].push(el[k]);
    });
  });
  return ret;
}
