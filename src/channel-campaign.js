
/*
 * Manages setting data for channels and campaigns
 */
module.exports = function channelCampaign (app, util) {

  var evar = util.evar,
    events = require('./events'),
    searchKeyword = app.Util.getQueryParam('kw_refer'),
    campaign = app.Util.getQueryParam('site_refer'),

    AFF001SiteId,
    AffiliateMid,
    campaignStacking,
    channel,
    channelTime,
    channelStacking,
    matches,
    siteId,
    stackingTime,
    topLevelChannel;

  if (searchKeyword) {
    campaign = campaign + ' ' + searchKeyword;
  }

  if (app.Util.getQueryParam('siteID') && campaign.indexOf('AFF001') > -1) {
    siteId = app.Util.getQueryParam('siteID');
    matches = siteId.match(/^([^\-]+)-(.+)$/i);

    if (matches && matches.length) {
      campaign += ' ' + matches[1];
      AFF001SiteId = matches[2];
      AffiliateMid = app.Util.getQueryParam('mid');

      evar(47, AFF001SiteId);
      evar(58, AffiliateMid);
    }
  }

  app.channelManager('site_refer', '', 'cm', '', 'v0', '14', '');

  if (channel && channel !== 'n/a' && channel.toLowerCase() !== 'typed/bookmarked') {
    channel = channel.toLowerCase();
    app._referringDomain = app._referringDomain.replace('.mail.', '');
    app._keywords = app.cleanUrlData(app._keywords);

    if (channel === 'natural search' || (channel === 'non-affiliated referrers' && app._referringDomain.indexOf('.google.') > -1)) {
      if (!app._partner || app._partner === 'n/a') {
        app._partner = 'google';
        channel = 'natural search';
      }
    }

    if (channel === 'non-affiliated referrers' || channel === 'other natural referrers') {
      channel = 'referral';
    }

    if (app._keywords !== 'n/a' && channel.indexOf('search') > -1) {
      searchKeyword = (channel === 'natural search' ? 'natural' : 'paid');
      searchKeyword += ':' + (searchKeyword || app._keywords || 'keyword unavailable');
      searchKeyword = searchKeyword.toLowerCase();
    }

    if (!campaign) {
      if (app._partner !== 'n/a') {
        campaign = app._partner;
      }
      else if (app._referringDomain !== 'n/a') {
        campaign = app._referringDomain;
      }
    }

    campaign = app.getValOnce(campaign, 'v0', 14);

    if (campaign) {
      campaignStacking = app.crossVisitParticipation(campaign, 'v11', '14', '5', '>', 'purchase', 0);
      channelTime = app.getSaksTime();
      stackingTime = app.crossVisitParticipation(channelTime, 'v55', '14', '5', '>', 'purchase', 0);

      if (channel) {
        topLevelChannel = channel;
        channelStacking = app.crossVisitParticipation(topLevelChannel, 'v50', '14', '5', '>', 'purchase', 0);
      }
    }
  }

  app.campaign = campaign;
  app._channel = channel;

  evar(11, campaignStacking);
  evar(35, searchKeyword);
  evar(36, topLevelChannel);
  evar(50, channelStacking);
  evar(54, channelTime);
  evar(55, stackingTime);

  app.clickPast(campaign, events.CLICKTHROUGH, events.CLICKS);
};
