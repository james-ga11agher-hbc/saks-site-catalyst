/* global jQuery, pageData, window */

'use strict';

module.exports = function (app) {

  if (typeof(jQuery) === 'undefined') {
    return;
  }

  var $ = jQuery,
    isMobile = (pageData.site.is_mobile || '').toString() === 'true';;

  $(function () {
    // top nav
    var category = '',
      selector;

    if (!isMobile) {
      if (window.pageData && pageData.page) {
        if (pageData.page.categories && pageData.page.categories.length > 0) {
          if (pageData.page.categories[0] !== 'brand' && pageData.page.categories[0] !== 'sakssale') {
            category = pageData.page.categories[0];
          }
          else if (pageData.page.categories.length > 0) {
            category = pageData.page.categories[1];
          }
        }
        else if (pageData.page.section) {
          category = pageData.page.section;
        }
      }
    }

    selector = isMobile ? 'div.header-nav-hamburger' : 'div.nav, div.header-nav';

    $(selector).on('click', 'a', function () {
      var $this = $(this),
        newCategory = '';

      if (app.checkLink($this.attr('href'))) {
        if (!isMobile) {
          if ($('.header-nav-menu__list-item').length > 0) {
            newCategory = $this.parents('li.header-nav-menu__list-item').find('a:first').text().toLowerCase();
          }
          else {
            newCategory = ($this.closest('.menu-item').attr('id') || '').replace('NavMenu', '').toLowerCase();
          }
          category = app.getCategoryPrefix(newCategory || category);
        }
        app.c_w('v40', category || 'true');
      }
    });

    // left nav
    selector = isMobile ? 'nav.categories' : 'div.sfa-left-nav-content-container';

    $(selector).on('click', 'a', function () {
      if (app.checkLink($(this).attr('href'))) {
        if (!isMobile) {
          category = app.getCategoryPrefix(category);
        }
        app.c_w('v74', category || 'true');
      }
    });

    $('div.icons-container a, ul.external-links__social-links a').on('click', function () {
      $(window).trigger('social_icon_click', { vendor: $(this).attr('data-name') });
    });

    $('#designer-left-nav a').on('click', function () {
      app.c_w('c57', 'left nav:' + $(this).text().toLowerCase());
    });

    $('div.designer-list a').on('click', function () {
      app.c_w('c57', 'alpha list:' + $(this).text().toLowerCase());
    });

    $('#featuredDesigner-list a').on('click', function () {
      app.c_w('c57', 'featured list:' + $(this).text().toLowerCase());
    });
  });

};
