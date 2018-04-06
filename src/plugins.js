/* global document, pageData */

'use strict';

module.exports = function (app) {

  require('./vendor-plugins')(app);

	/*
	 * Clean URL-encoded strings
	 */
  app.cleanUrlData = function (url) {
    if (!url) {
      return '';
    }

    var result = url.replace(/\+/g, ' ')
                    .replace(/[',"]/g, '')
                    .replace(/\t/g, '')
                    .replace(/\n/g, '')
                    .toLowerCase();

    return result;
  };

  app.lowerCaseVars = function (list) {
    var app = this,
      evars = list.split(','),
      evar,
      i;

    for (i = 0; i < evars.length; i++) {
      evar = evars[i];

      if (app[evar]) {
        app[evar] = ('' + app[evar]).toLowerCase();
      }
    }
  };

	/*
	 * Get the current "fake" product number
   * c_r - cookie read
   * c_w - cookie write
	 */
  app.getProductNum = function () {
    var productNumber = app.c_r('pn') || '0',
      expires = new Date();

    if (productNumber) {
      productNumber = parseInt(productNumber) + 1;
    }

    expires.setTime(expires.getTime() + (30 * 86400000));
    app.c_w('pn', productNumber, expires);

    return productNumber;
  };

  app.setProductRefinements = function (arr) {
    var refs = '',
      i;
      
    if (arr) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i].name && arr[i].values && (arr[i].name.indexOf('???') === -1)) {
          refs += (refs ? '|' : '') + arr[i].name + '=' + arr[i].values.join('^');
        }
      }
    }
    return refs.toLowerCase();
  };

  app.setProductString = function (products, event, eventData) {
    eventData = eventData || pageData;

    var qtyEvent,
      revEvent,
      productString = '',
      isConfirmation,
      subtotal = 0,
      shippingTotal,
      discountTotal,
      qty,
      thisProduct,
      unit_price,
      price,
      pctTotal,
      discount,
      bopus,
      avail,
      sreCode,
      i;

    if (typeof(eventData) !== 'undefined' && products) {
      if (event && event === 'add to cart') {
        qtyEvent = '5';
        revEvent = '6';
      }
      else if (event && event === 'remove from cart') {
        qtyEvent = '8';
        revEvent = '7';
      }

      isConfirmation = (typeof(eventData.order) !== 'undefined' && typeof(eventData.order.id) !== 'undefined');

      if (isConfirmation) {
        shippingTotal = parseFloat(eventData.order.shipping_total);
        discountTotal = parseFloat(eventData.order.order_discount_total);

        for (i = 0; i < products.length; i++) {
          subtotal += (parseFloat(products[i].paid_unit_price || products[i].price) * parseInt(products[i].quantity));
        }

        if (subtotal <= 0) {
          subtotal = parseFloat(pageData.order.subtotal);
        }
      }

      for (i = 0; i < products.length; i++) {
        qty = parseInt(products[i].quantity) || 1;
        unit_price = parseFloat(products[i].paid_unit_price || products[i].price);
        price = qty * unit_price;
        pctTotal = (price / subtotal);
        discount = discountTotal ? (pctTotal * discountTotal) : 0;
        bopus = products[i]. pick_up_in_store;

        thisProduct = [
          '',
          products[i].id,
          isConfirmation ? qty : '',
          isConfirmation ? price.toFixed(2) : '',
          '',
          ''
        ];

        if (qtyEvent && revEvent) {
          thisProduct[4] = (qty ? 'event' + qtyEvent + '=' + qty : '') + (price ? '|event' + revEvent + '=' + price.toFixed(2) : '');
          if (products[0].pick_up_in_store === 'true' && event === 'add to cart') {
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event25=' + qty;
	                    app.events = app.apl(app.events, 'event25', ',', 2);
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event26=' + price.toFixed(2);;
	                    app.events = app.apl(app.events, 'event26', ',', 2);
	                }
          else if (products[0].pick_up_in_store === 'true' && event === 'remove from cart') {
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event28=' + qty;
	                    app.events = app.apl(app.events, 'event28', ',', 2);
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event27=' + price.toFixed(2);;
	                    app.events = app.apl(app.events, 'event27', ',', 2);
	                }
        }

        if (shippingTotal) {
          thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event19=' + (pctTotal * shippingTotal).toFixed(2);
          app.events = app.apl(app.events, 'event19', ',', 2);

        }
        if (discount) {
          thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event43=' + discount.toFixed(2);
          app.events = app.apl(app.events, 'event43', ',', 2);
        }

        if (isConfirmation && bopus) {
	                if (bopus === 'true') {
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event80=' + qty;
	                    app.events = app.apl(app.events, 'event80', ',', 2);
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event81=' + price.toFixed(2);
	                    app.events = app.apl(app.events, 'event81', ',', 2);
	                }
	            }

				// add merchandising eVars here
        if (products[i].gift_wrap_type) {
	    			thisProduct[5] = (thisProduct[5] ? '|' : '') + 'evar34=' + products[i].gift_wrap_type;
        }
	            if (products[i].selected_sku) {
              thisProduct[5] += (thisProduct[5] ? '|' : '') + 'evar60=' + products[i].selected_sku;
            }
        if (products[i].availability_dc || products[i].availability_store) {
          avail = !(products[i].availability_dc === '0' && products[i].availability_store === '0') ? 'in stock' : 'out of stock';
          thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar61=' + avail);
        }
        if (products[i].price && app.pageName.match(/saksbag|checkout/gi) === null) {
          thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar62=' + products[i].price + app.currencyCode);
        }
        if (products[i].original_price) {
          thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar63=' + products[i].original_price + app.currencyCode);
        }
	            if (products[i].rr_position_id) {
	    			thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar38=' + products[i].rr_position_id);
            }
        else if (typeof(products[i].sre_code) === 'string' && products[i].sre_code.match(/(^|[A-Z]{0,3})(R|BAG)\d$/)) {
					//thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar38=' + products[i].sre_code);
          if (pageData.page.type === 'product detail') {
            thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar25=' + pageData.products[0].id);
          }
        }
        else {
          sreCode = app.Util.getQueryParam('sre');
          if (sreCode && sreCode.match(/(^|\_)[A-Z]{0,3}(R|BAG)\d$/)) {
						//thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar38=' + sreCode.substring(sreCode.lastIndexOf('R')));
            if (app.Util.getQueryParam('productCode')) {
              thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar25=' + app.Util.getQueryParam('productCode'));
            }
          }
        }
        if (products[i].ctl_position_id) {
          thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar53=' + products[i].ctl_position_id);
          if (eventData.referringProductId) {
            thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar25=' + eventData.referringProductId);
          }
        }
        if (event && event.match(/brand name click|size change|color change|video play|size guide|alt image click|add to waitlist|/g) !== null) {
          thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar75=' + event);
        }
        if (event && event.match(/add to cart/g) && app.c_r('v51') === 'favorites:product detail') {
          thisProduct[5] += (thisProduct[5] ? '|' : '') + 'evar51=Favorites Add to Cart';
        }

        productString += (productString ? ',' : '') + thisProduct.join(';').replace(/;+$/gi, '');
      }
      return productString;
    }

    return '';
  };

  app.getSaksTime = function () {
    var d = new Date(), currentOffset = d.getTimezoneOffset(), saksOffset = (4 * 60),
      months = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];
    if (currentOffset !== saksOffset) {
      d.setTime(d.getTime() + ((currentOffset - saksOffset) * 60 * 1000));
    }
    return (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + months[d.getMonth()] + d.getFullYear() + ':' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getHours() : d.getSeconds());
  };

  app.checkLink = function (clicked) {
    if (!clicked) {
      return false;
    }

    var current = document.location.href;

    if (clicked.indexOf('?') > -1) {
      clicked = clicked.substring(0, clicked.indexOf('?'));
    }
    if (clicked.indexOf('#') > -1) {
      clicked = clicked.substring(0, clicked.indexOf('#'));
    }
    if (current.indexOf('?') > -1) {
      current = current.substring(0, current.indexOf('?'));
    }
    if (current.indexOf('#') > -1) {
      current = current.substring(0, current.indexOf('#'));
    }

    return (current !== clicked);
  };

  app.getCategoryPrefix = function (category) {
    if (!category) {
      return '';
    }

    var defaultPrefix = 'OT',
      prefixes = {
        'WA'	: ['women\'s apparel', 'womensapparel'],
        'SH'	: ['shoesaccessories', 'shoes & handbags'],
        'SHO'	: ['shoes'],
        'HND'	: ['handbags'],
        'JA'	: ['jewelryaccessories', 'jewelry & accessories'],
        'BF'	: ['beautyfragrance', 'beauty & fragrance', 'saksbeautyplace', 'beauty'],
        'MS'	: ['men\'s', 'men', 'themensstore', 'the men\'s store'],
        'JK'	: ['kids', 'kid\'s', 'justkids', 'just kids'],
        'HG'	: ['home', 'home & gourmet', 'homehitech'],
        'SL'	: ['sale', 'sakssale'],
        'GS'	: ['giftshomekids', 'gift shop', 'gifts']
      },
      prefix,
      categories,
      i;

    for (prefix in prefixes) {
      categories = prefixes[prefix];

      for (i = 0; i < categories.length; i++) {
        if (categories[i].toLowerCase() === category.toLowerCase()) {
          return prefix;
        }
      }
    }

    return defaultPrefix;
  };

};
