'use strict';

/*
 * Time to completion from shopping cart open to purchase
 */
module.exports = function timeToComplete (app, util) {
  var util = require('./util')(app),
    value;

  if (app.events.indexOf('scOpen') > -1 && !app.c_r('v7')) {
    value = 'start';
  }
  if (app.events.indexOf('purchase') > - 1) {
    value = 'stop';
  }

  value = app.getTimeToComplete(value, 'v7', 0);

  util.evar(7, value);
};
