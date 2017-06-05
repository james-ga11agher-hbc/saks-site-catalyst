/* global AppMeasurement, document, Visitor, window */
(function (root) {
  'use strict';

  require('./polyfill');
  require('./app-measurement');
  require('./activity-map');


  var dataPresent = !!window.pageData,
    app = new AppMeasurement();

  // backfill pageData
  root.pageData = Object.assign({
    order: {},
    locator: {},
    page: {},
    products: [],
    product_array: {},
    site: {},
    visitor: {},
    wasPresent: dataPresent
  }, root.pageData),

  require('./plugins')(app);
  require('./link-tracking')(app);

  app = Object.assign(app, {
    charSet: 'UTF-8',
    currencyCode: 'USD',

    linkDownloadFileTypes: 'exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx,swf',
    linkInternalFilters: 'javascript:,saksfifthavenue.com,sakcom,richrelevance.com,paypal.com,checkout.fiftyone.com,paypalcom' + document.location.hostname,
    linkLeaveQueryString: false,
    linkTrackEvents: '',
    linkTrackVars: '',

    trackDownloadLinks: true,
    trackExternalLinks: true,
    trackInlineStats: true,
    trackingServer: 'sitectlyst.saksfifthavenue.com',
    trackingServerSecure: 'ssitectlyst.saksfifthavenue.com',

    usePlugins: true,

    visitor: Visitor.getapp('5B7B123F5245ADFC0A490D45@AdobeOrg'),
    visitorNamespace: 'saksfifthavenue',

    _channelDomain: 'Social Media Organic|facebook.com,flickr.com,twitter.com,/t.co,youtube.com,myspace.com,pinterest.com,foursquare.com,instagram.com>Saks Network|saksfifthavenue.com,off5th.com',
    _channelParameter: 'Search|kw_refer',
    _channelPattern: 'Email|EML,SalesfloorEML>Affiliates|AFF>Banner Click|MED,DFA>AOL|AOL>eBilling|EBILL>Brand Links|VEND>Social Media|FCBK,TWEET,SOC_>Shopping Comparison|CSE,SD001,BZR002,PGR002,NEX002,YAH301,YAH300,LIKE01,BZR001,SDF001,PGR001,SHOP002,GIFTS01,SHOP001,AMZN001,PRONTO01,SMART001,GGLBASE001,MSNLIVE001,SORTPRICE01,MSNSHOP001,360IFROOGLE,GGLPRADS001>Search|360i,360I>Partnerships|PAR>SMS|SMS>Natural Search|BLMR'
  });

  app.doPlugins = require('./do-plugins');

  root.s = app;

})(window);
