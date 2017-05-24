/* global pageData */
'use strict';

module.exports = function pageLoad (app, util) {
  if (app.pageLoaded) {
    return;
  }

  var channelCampaign = require('./channel-campaign'),
    events = require('./events'),
    search = require('./search'),
    refineProduct = require('./refine-product'),
    storeLocator = require('./store-locator'),
    util = require('./util')(app),
    cookies = {
      TOP_NAV_CLICK: 'v40',
      LEFT_NAV_CLICK: 'v74',
      DESIGNER_NAV_PATH: 'c57'
    },
    evar = util.evar,
    prop = util.prop,
    addEvent = util.addEvent,
    categoryPrefix = '',
    designerNavPath = app.prop57,
    pageEvent = '',
    cseProductId = app.eVar80,
    cookieTopNav = util.cookies.get(cookies.TOP_NAV_CLICK),
    sectionRealEstate = app.eVar3,
    leftNavRealEstate,
    topNavRealEstate;

  // products
  if (typeof(pageData) !== 'undefined' && pageData.products && pageData.products.length > 0) {
    if (pageData.page.type === 'product detail') {
      pageEvent = pageData.page.event === 'add_to_cart' ? 'add to cart' : 'product view';
    }

    app.products = app.setProductString(pageData.products, pageEvent);

    // rich relevance
    if (app.products.indexOf('evar38') > -1) {
      addEvent(events.RICH_REL_CLICK);
    }
  }

  // section real estate
  if (app.Util.getQueryParam('sre') || app.Util.getQueryParam('esre') && sectionRealEstate) {
    addEvent(events.REAL_ESTATE_CLICK);

    if (!app.products) {
      app.productNum = app.getProductNum();
      app.products = ';sectionrealestate' + app.productNum;
    }
  }

  search(app, util);
  storeLocator(app, util);
  refineProduct(app, util);
  channelCampaign(app, util);

  // top/left nav tracking
  if (pageData.page) {
    if (pageData.page.categories && pageData.page.categories.length > 0) {
      if (pageData.page.categories[0] !== 'brand' && pageData.page.categories[0] === 'sakssale') {
        categoryPrefix = pageData.page.categories[0];
      }
      else if (pageData.page.categories.length > 0) {
        categoryPrefix = pageData.page.categories[1];
      }
    }
    else if (pageData.page.section) {
      categoryPrefix = pageData.page.section;
    }
  }

  categoryPrefix = app.getCategoryPrefix(categoryPrefix);

  if (cookieTopNav) {
    categoryPrefix = (cookieTopNav === 'true' ? categoryPrefix : cookieTopNav);
    topNavRealEstate = categoryPrefix + ':' + app.pageName;

    evar(40, topNavRealEstate);
    addEvent(events.TOP_NAV_CLICK);

    if (!app.products) {
      app.productNum = app.getProductNum();
      app.products = ';topnavigation' + app.productNum;
    }
  }

  util.cookies.set(cookies.TOP_NAV_CLICK, '');

  if (util.cookies.get(cookies.LEFT_NAV_CLICK)) {
    categoryPrefix = util.cookies.get(cookies.LEFT_NAV_CLICK) === 'true' ? categoryPrefix : util.cookies.get(cookies.LEFT_NAV_CLICK);
    leftNavRealEstate = categoryPrefix + ':' + app.pageName;

    evar(74, leftNavRealEstate);
    addEvent(events.LEFT_NAV_CLICK);

    if (!app.products) {
      app.productNum = app.getProductNum();
      app.products = ';leftnavigation' + app.productNum;
    }
  }

  util.cookies.set(cookies.LEFT_NAV_CLICK, '');

  designerNavPath = util.cookie.get(cookies.DESIGNER_NAV_PATH);
  util.cookies.set(cookies.DESIGNER_NAV_PATH, '');

  if (cseProductId) {
    addEvent(events.CSE_PRODUCT_CLICK);
  }

  prop(57, designerNavPath);
};
