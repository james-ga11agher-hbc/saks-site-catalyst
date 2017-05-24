
module.exports = function internalSearch (app, util) {
  var events = require('./events'),
    term = app.prop21,
    termCorrected = app.prop22,
    resultCount = app.prop24,
    once;

  if (term) {
    term = app.cleanUrlData(term.toLowerCase());
    once = app.getValOnce(term, 'c21', 0);

    if (once) {
      if (resultCount === '0') {
        resultCount = 'zero';
        term = 'null:' + app.prop21;
      }

      util.addEvent(events.INTERNAL_SEARCH);

      if (!resultCount) {
        resultCount = 'redirect';
      }

      term = term ? 'D=c21' : '';
      termCorrected = termCorrected ? 'D=c22' : '';
      resultCount = resultCount ? 'D=c24' : '';

      util.evar(21, term);
      util.evar(22, termCorrected);
      util.evar(24, resultCount);

      if (!app.products) {
        app.productNum = app.getProductNum();
        app.products = ';productsearch' + app.productNum;
      }
    }
  }
};
