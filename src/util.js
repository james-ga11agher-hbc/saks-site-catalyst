'use strict';

module.exports = function (app) {

  var util = {
    addEvent: function (event) {
      // https://marketing.adobe.com/resources/help/en_US/sc/implement/appendList.html
      app.events = app.apl(app.events, event, ',', 2);
    },

    trackVar: function (variable) {
      app.linkTrackVars = app.apl(app.linkTrackVars, variable, ',', 2);
    },

    set: function (number, value, kind) {
      if (typeof value !== 'undefined') {
        app[kind + number.toString()] = value;
      }
    },

    evar: function (number, value) {
      util.set(number, value, 'eVar');
    },

    prop: function (number, value) {
      util.set(number, value, 'prop');
    },

    cookie: {
      get: function (key) {
        return app.c_r(key);
      },

      set: function (key, value) {
        app.c_w(key, value, app.expDate);
      }
    }
  };

  return util;
};
