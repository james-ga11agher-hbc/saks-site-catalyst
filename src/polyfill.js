/* eslint one-var: ["off"], eqeqeq: ["off"], no-unused-vars: ["off"] */

// Object.assign polyfill
if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) { // .length of function is 2
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target),
      index,
      nextSource,
      nextKey;

    for (index = 1; index < arguments.length; index++) {
      nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}
