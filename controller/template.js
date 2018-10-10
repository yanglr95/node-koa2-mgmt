
'use strict';

/**
 * template
 **/
const debug = require('debug')('controller:template');

async function template(ctx, next) {
  try {
    await next();
  } catch (err) {
  }
};

template.html = function(tpl) {
  return async function(ctx, next) {
    // tpl may change by state
    if (ctx.state && ctx.state.tpl) {
      tpl = ctx.state.tpl;
    }
    if (ctx.errors) {
      ctx.state.errors = ctx.errors;
      debug('html', ctx.errors, ctx.state);
    }
    ctx.render(tpl);
  };
};

module.exports = template;
