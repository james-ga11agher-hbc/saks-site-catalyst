/* global pageData */
'use strict';
/*
* Sets product refinement information
*/
module.exports = function refineProduct (app, util) {
  var events = require('./events'),
    fields = app.eVar44,
    sortBy = app.eVar39;

  if (!fields && typeof pageData !== 'undefined' && pageData.product_array) {
    fields = app.setProductRefinements(pageData.product_array.refinements);
  }

  if (fields) {
    util.prop(41, 'D=v44');
    util.addEvent(events.PRODUCT_REFINEMENT);
  }

  if (sortBy) {
    util.prop(4, 'D=v39');
    util.addEvent(events.SORT_BY);
  }

  if ((sortBy || fields) && !app.products) {
    app.productNum = app.getProductNum();
    app.products = ';productarrayrefinement' + app.productNum;
  }

  util.evar(39, sortBy);
  util.evar(44, fields);
};
