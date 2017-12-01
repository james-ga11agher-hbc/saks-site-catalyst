/* global window */
'use strict';

module.exports = function () {

  if (!window.optimizelyClientInstance || !window.optimizelyClientInstance.experiments) {
    return '';
  }

  var experiments = window.optimizelyClientInstance.experiments,
    resultString = '',
    key,
    value;

  for (key in experiments) {
    if (experiments.hasOwnProperty(key)) {
      value = experiments[key] !== null ? experiments[key] : '';
      resultString += key + '|' + value + ';';
    }
  }

  return resultString;

};
