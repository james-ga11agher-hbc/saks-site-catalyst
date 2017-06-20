/* global pageData */
'use strict';

/*
 * https://marketing.adobe.com/resources/help/en_US/sc/implement/function_doPlugins.html
 *
 * Adobe SiteCatalyst has this janky callback to extend the app object
 * for every tracking call.
 */

module.exports = function doPlugins (app) {

  var util = require('./util')(app),
    pageLoad = require('./page-load'),
    timeToComplete = require('./cart-time-complete'),
    allVars = require('./vars'),

    evar = util.evar,
    prop = util.prop,
    addEvent = util.addEvent,
    trackVar = util.trackVar,

    findProductMethod = '',
    siteCatalystVersion = app.version,
    isMobile = (pageData.site.is_mobile || '').toString() === 'true',

    ppv, // percentPageViewed
    ppvData,
    siteType,
    visitTime,
    prevPageProp,

    // evar definitions
    sectionRealEstate = app.eVar3,
    marketingChannel = app.eVar36,
    searchTerm,
    searchResultCount = app.eVar24,
    topNavRealEstate = app.eVar40,
    leftNavRealEstate = app.eVar74,
    searchTermCorrected = app.eVar22,
    merchCategory = app.eVar4,
    sortBy = app.eVar39,
    refinementFields = app.eVar44,
    signupLocation = app.eVar78,
    orderId = app.eVar65,
    pageType  = app.eVar70,
    pageName = app.eVar71,
    prevPage = app.eVar72,
    locale = app.eVar79,
    visitTime = app.eVar8,
    designerName = app.eVar14,
    AFF001SiteId = app.eVar47,

    // prop definitions
    // we may not need to initialize all of these first, but it's there to be safe.
    siteTypePageName = app.prop42,
    pageTypeProp  = app.prop1,
    localeProp = app.prop59,
    AFF001SiteIdProp = app.prop36,
    pageUrlProp = app.prop50,
    productCategory = app.prop19,
    designerNameProp = app.prop14,
    visitTimeProp = app.prop8;

  function merchPageName () {
    var pageName = '',
      orderId = '',
      merchpageTypeProp  = '';

    if (pageTypeProp  !== 'product detail' && pageTypeProp  !== 'quick look') {
      pageName = 'D=pageName';
      orderId = 'D=ch';
      merchpageTypeProp  = 'D=c1';
    }

    evar(59, pageName);
    evar(69, orderId);
    evar(88, merchpageTypeProp );
  }

  app.events = app.events || '';

  if (pageData.site.is_production === 'true') {
    visitTime = app.getTimeParting('f', '-5');
  }
  else if (pageData.site.is_production === 'false') {
    visitTime = app.getSaksTime();
  }

  evar(8, visitTime);
  prop(33, siteCatalystVersion);

  app.expDate = new Date();
  app.expDate.setDate(app.expDate.getDate() - 1);

  prevPageProp  = app.getPreviousValue(app.pageName, 'c38', '');

  if (prevPageProp) {
    ppvData = app.getPercentPageViewed(app.pageName);

    if (ppvData && ppvData.length > 1 && ppvData[1] && ppvData[2]) {
      ppv = ppvData[1] + '|' + ppvData[2];
    }
    else if (prevPageProp !== app.pageName && pageTypeProp !== 'quick look') {
      ppv = 'No Data Available';
    }
    else {
      ppv = '';
    }
  }

  prop(38, prevPageProp );
  prop(39, ppv);

  if (app.events.indexOf('scAdd') > -1 ||
      app.events.indexOf('scRemove') > -1 ||
      app.events.indexOf('scView') > -1) {
    addEvent('scOpen');
    trackVar('events');

    app.linkTrackEvents = app.apl(app.linkTrackEvents, 'scOpen', ',', 2);
  }

  timeToComplete(app, util);
  pageLoad(app, util);
  merchPageName(app, util);

  // must be assigned after pageLoad > search executes
  searchTerm = app.eVar21;

  if (app.events.match(/event48($|,)/g)) {
    findProductMethod = 'rich relevance';
    trackVar('eVar6');
  }
  else if (app.products.indexOf('evar53') > -1) {
    findProductMethod = 'complete the look';
    trackVar('eVar6');
  }
  else if (sectionRealEstate && sectionRealEstate !== 'non-section real estate') {
    findProductMethod = 'section real estate';
    trackVar('eVar6');
  }
  else if (!app.pageLoaded) {
    if (marketingChannel) {
      findProductMethod = 'external channel: ' + marketingChannel;
    }
    else if (searchTerm) {
      findProductMethod = 'internal search';
    }
    else if (app.purchaseID) {
      findProductMethod = 'unknown at time of purchase';
    }
    else if (topNavRealEstate) {
      findProductMethod = 'top navigation';
    }
    else if (leftNavRealEstate) {
      findProductMethod = 'left navigation';
    }
  }

  if (findProductMethod) {
    if (!searchTerm) {
      searchTerm = searchResultCount = 'non-internal search';
      searchTermCorrected = 'no corrected term';
    }
    if (!sectionRealEstate) {
      sectionRealEstate = 'non-section real estate';
    }
    if (!merchCategory) {
      merchCategory = 'non-site navigation';
    }
    if (!(sortBy || refinementFields)) {
      sortBy = refinementFields = 'no product refinement';
    }
    if (!app.products) {
      app.productNum = app.getProductNum();
      app.products = ';findingmethods' + app.productNum;
    }
  }

  if (app.events.match(/event32($|,)/g) && !signupLocation) {
    signupLocation = 'D=c1';
    trackVar('eVar78');
  }

  if (typeof(pageData) !== 'undefined') {
    siteType = isMobile ? 'mobile' : 'desktop';
    siteTypePageName = 'D="' + siteType + ':"+pageName';
  }

  app.tnt = app.trackTNT();
  app.lowerCaseVars(allVars.join(','));

  trackVar('channel');
  trackVar('prop1');
  trackVar('prop38');
  trackVar('prop42');
  trackVar('eVar70');
  trackVar('eVar71');
  trackVar('eVar72');

  orderId = orderId || (app.purchaseID ? 'D=purchaseID' : '');
  pageType = pageTypeProp  ? 'D=c1' : '';
  pageName = 'D=pageName';
  prevPage = prevPageProp  ? 'D=c38' : '';
  locale = localeProp ? 'D=c59' : '';

  visitTimeProp = visitTime ? 'D=v8' : '';
  designerNameProp = designerName ? 'D=v14' : '';
  productCategory = (merchCategory !== 'non-site navigation') ? 'D=v4' : '';
  AFF001SiteIdProp = AFF001SiteId ? 'D=v47' : '';
  pageUrlProp = 'D=g';

  evar(4, merchCategory);
  evar(6, findProductMethod);
  evar(3, sectionRealEstate);
  evar(21, searchTerm);
  evar(22, searchTermCorrected);
  evar(24, searchResultCount);
  evar(39, sortBy.toLowerCase());
  evar(44, refinementFields);
  evar(65, orderId);
  evar(70, pageType);
  evar(71, pageName);
  evar(72, prevPage);
  evar(78, signupLocation);
  evar(79, locale);

  prop(8, visitTimeProp);
  prop(14, designerNameProp);
  prop(19, productCategory);
  prop(36, AFF001SiteIdProp);
  prop(42, siteTypePageName);
  prop(50, pageUrlProp);

  app.pageLoaded = true;
};
