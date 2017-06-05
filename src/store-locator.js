'use strict';

/*
 * Sets the store locator search criteria value
 */
module.exports = function storeLocator (app, util) {
  var events = require('./events'),
    value = app.eVar77,
    once;

  if (value) {
    value = app.cleanUrlData(value);
    once = app.getValOnce(value, 'v77', 0);

    if (once) {
      util.addEvent(events.STORE_LOCATOR_SEARCH);
    }
  }

  util.evar(77, value);
};
