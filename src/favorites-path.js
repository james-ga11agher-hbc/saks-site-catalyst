'use strict';

/*
 * Track path from My Account Fav > PDP > Add To Bag CTA click
 */
module.exports = function trackFavoritesPath (app, util) {
  var FAVORITES_CHANNEL = 'v51';
  var FAVORITES_PATH = 'favorites:product detail';
  var cookieFavoritesChannel = util.cookies.get(FAVORITES_CHANNEL);

  // If we have the correct path, AND the event add to cart is triggered, fire evar51
  if (cookieFavoritesChannel === FAVORITES_PATH && app.events.indexOf('scAdd') > -1) {
    util.trackVar('eVar51');
  }
};
