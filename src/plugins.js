/* eslint-disable */

module.exports = function (s) {

	/*
	 * Clean URL-encoded strings
	 */
	s.cleanUrlData = function(val) {
		if (!val) {
			return '';
		}
		val = val.replace(/\+/g, " ");
		val = val.replace(/[',"]/g,"");
		val = val.replace(/\t/g, "");
		val = val.replace(/\n/g, "");
		val = val.toLowerCase();
		return val;
	}

	s.lowerCaseVars = function(list) {
		var s = this;
		list = list.split(',');
		for (var i=0; i<list.length; i++) {
			if (s[list[i]]) {
				s[list[i]] = s[list[i]].toString().toLowerCase();
			}
		}
	}

	/*
	 * Get the current "fake" product number
	 */
	s.getProductNum = function() {
		var s = this, pn, e = new Date();
		if (!s.c_r('pn')) pn = 1;
		else pn = parseInt(s.c_r('pn')) + 1;
		e.setTime(e.getTime() + (30 * 86400000));
		s.c_w('pn', pn, e);

		return pn;
	}

	s.setProductRefinements = function(arr) {
		var refs = '';
		if (arr) {
			for (var i=0; i<arr.length; i++) {
				if (arr[i].name && arr[i].values && (arr[i].name.indexOf('???') == -1)) {
					refs += (refs ? '|' : '') + arr[i].name + '=' + arr[i].values.join('^');
				}
			}
		}
		return refs.toLowerCase();
	}

	s.setProductString = function(products, event, eventData) {
		eventData = eventData || pageData;
		if (typeof(eventData) !== 'undefined' && products) {
			var qtyEvent, revEvent;
			if (event && event == 'add to cart') {
				qtyEvent = '5';
				revEvent = '6';
			} else if (event && event == 'remove from cart') {
				qtyEvent = '8';
				revEvent = '7';
			}

			var productString = '', isConfirmation = (typeof(eventData.order) !== 'undefined' && typeof(eventData.order.id) !== 'undefined'), subtotal = 0, shippingTotal, discountTotal;
			if (isConfirmation) {
				shippingTotal = parseFloat(eventData.order.shipping_total);
				discountTotal = parseFloat(eventData.order.order_discount_total);

				for (var i=0; i<products.length; i++) {
					subtotal += (parseFloat(products[i].paid_unit_price || products[i].price) * parseInt(products[i].quantity));
				}

				if (subtotal <= 0) {
					subtotal = parseFloat(pageData.order.subtotal);
				}
			}

			for (var i=0; i<products.length; i++) {
				var qty = parseInt(products[i].quantity) || 1, unit_price = parseFloat(products[i].paid_unit_price || products[i].price), price = qty * unit_price, pctTotal = (price / subtotal), discount = discountTotal ? (pctTotal * discountTotal) : 0, bopus = products[i]. pick_up_in_store;

				var thisProduct = [
					'',
					products[i].id,
					isConfirmation ? qty : '',
					isConfirmation ? price.toFixed(2) : '',
					'',
					''
				];

				if (qtyEvent && revEvent) {
					thisProduct[4] = (qty ? 'event' + qtyEvent + '=' + qty : '') + (price ? '|event' + revEvent + '=' + price.toFixed(2) : '');
					if (products[0].pick_up_in_store == 'true' && event == 'add to cart') {
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event25=' + qty;
	                    s.events = s.apl(s.events, 'event25', ',', 2);
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event26=' + price.toFixed(2);;
	                    s.events = s.apl(s.events, 'event26', ',', 2);
	                }else if (products[0].pick_up_in_store == 'true' && event == 'remove from cart') {
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event28=' + qty;
	                    s.events = s.apl(s.events, 'event28', ',', 2);
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event27=' + price.toFixed(2);;
	                    s.events = s.apl(s.events, 'event27', ',', 2);
	                }
				}

				if (shippingTotal) {
					thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event19=' + (pctTotal * shippingTotal).toFixed(2);
					s.events = s.apl(s.events, 'event19', ',', 2);

				}
				if (discount) {
					thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event43=' + discount.toFixed(2);
					s.events = s.apl(s.events, 'event43', ',', 2);
				}

				if (isConfirmation && bopus) {
	                if (bopus == 'true') {
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event80=' + qty;
	                    s.events = s.apl(s.events, 'event80', ',', 2);
	                    thisProduct[4] += (thisProduct[4] ? '|' : '') + 'event81=' + price.toFixed(2);
	                    s.events = s.apl(s.events, 'event81', ',', 2);
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
					var avail = !(products[i].availability_dc == '0' && products[i].availability_store == '0') ? 'in stock' : 'out of stock';
					thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar61=' + avail);
				}
				if (products[i].price && s.pageName.match(/saksbag|checkout/gi) == null) {
					thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar62=' + products[i].price + s.currencyCode);
				}
				if (products[i].original_price) {
					thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar63=' + products[i].original_price + s.currencyCode);
				}
	            if (products[i].rr_position_id) {
	    			thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar38=' + products[i].rr_position_id);
				} else if (typeof(products[i].sre_code) == 'string' && products[i].sre_code.match(/(^|[A-Z]{0,3})(R|BAG)\d$/)) {
					//thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar38=' + products[i].sre_code);
					if (pageData.page.type == 'product detail') {
						thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar25=' + pageData.products[0].id);
					}
				} else {
					var sreCode = s.Util.getQueryParam('sre');
					if (sreCode && sreCode.match(/(^|\_)[A-Z]{0,3}(R|BAG)\d$/)) {
						//thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar38=' + sreCode.substring(sreCode.lastIndexOf('R')));
						if (s.Util.getQueryParam('productCode')) {
							thisProduct[5] += (thisProduct[5] ? '|' : '') + ('evar25=' + s.Util.getQueryParam('productCode'));
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

				productString += (productString ? ',' : '') + thisProduct.join(';').replace(/;+$/gi, '');
			}
			return productString;
		}

		return '';
	}

	s.getSaksTime = function() {
		var d = new Date(), currentOffset = d.getTimezoneOffset(), saksOffset = (4 * 60),
			months = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];
		if (currentOffset != saksOffset) {
			d.setTime(d.getTime() + ((currentOffset - saksOffset) * 60 * 1000));
		}
		return (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + months[d.getMonth()] + d.getFullYear() + ':' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getHours() : d.getSeconds());
	}

	s.setupLinkTracking = function($) {
		$(function() {
			// top nav
			var isMobile = window.pageData && pageData.site && pageData.site.is_mobile && pageData.site.is_mobile == 'true';
			var cat = '';
			if (!isMobile) {
				if (window.pageData && pageData.page) {
					if (pageData.page.categories && pageData.page.categories.length > 0) {
						if (pageData.page.categories[0] != 'brand' && pageData.page.categories[0] != 'sakssale') {
							cat = pageData.page.categories[0];
						} else if (pageData.page.categories.length > 0) {
							cat = pageData.page.categories[1];
						}
					} else if (pageData.page.section) {
						cat = pageData.page.section;
					}
				}
			}

			var sel = isMobile ? 'div.header-nav-hamburger' : 'div.nav, div.header-nav';
			$(sel).on('click', 'a', function() {
				var $this = $(this);
				if (s.checkLink($this.attr('href'))) {
					var newCat = '';
					if (!isMobile) {
	                    if ($('.header-nav-menu__list-item').length > 0){
	                        newCat = $this.parents('li.header-nav-menu__list-item').find('a:first').text().toLowerCase();
	                        }
	                    else {
	    				    newCat = ($this.closest('.menu-item').attr('id') || '').replace('NavMenu', '').toLowerCase();
	                    }
						cat = s.getCategoryPrefix(newCat || cat);
					}
					s.c_w('v40', cat || 'true');
				}
			});

			// left nav
			sel = isMobile ? 'nav.categories' : 'div.sfa-left-nav-content-container';
			$(sel).on('click', 'a', function() {
				if (s.checkLink($(this).attr('href'))) {
					if (!isMobile) {
						cat = s.getCategoryPrefix(cat);
					}
					s.c_w('v74', cat || 'true');
				}
			});

			$('div.icons-container a, ul.external-links__social-links a').on('click', function() {
				$(window).trigger('social_icon_click', {vendor: $(this).attr('data-name')});
			});

			$('#designer-left-nav a').on('click', function() {
				s.c_w('c57', 'left nav:' + $(this).text().toLowerCase());
			});

			$('div.designer-list a').on('click', function() {
				s.c_w('c57', 'alpha list:' + $(this).text().toLowerCase());
			});

			$('#featuredDesigner-list a').on('click', function() {
				s.c_w('c57', 'featured list:' + $(this).text().toLowerCase());
			});
		});
	};
	if (typeof(jQuery) !== 'undefined') {
		s.setupLinkTracking(jQuery);
	}

	s.checkLink = function(clicked) {
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

		if (current !== clicked) {
			return true;
		}

		return false;
	}

	s.getCategoryPrefix = function(cat) {
		if (!cat) {
			return '';
		}
		var defaultPrefix = 'OT'
			,prefixes = {
				'WA'	: ['women\'s apparel', 'womensapparel']
				,'SH'	: ['shoesaccessories', 'shoes & handbags']
				,'SHO'	: ['shoes']
				,'HND'	: ['handbags']
				,'JA'	: ['jewelryaccessories', 'jewelry & accessories']
				,'BF'	: ['beautyfragrance', 'beauty & fragrance', 'saksbeautyplace', 'beauty']
				,'MS'	: ['men\'s', 'men', 'themensstore', 'the men\'s store']
				,'JK'	: ['kids', 'kid\'s', 'justkids', 'just kids']
				,'HG'	: ['home', 'home & gourmet', 'homehitech']
				,'SL'	: ['sale', 'sakssale']
				,'GS'	: ['giftshomekids', 'gift shop', 'gifts']
			};

		for (var i in prefixes) {
			for (var j=0; j<prefixes[i].length; j++) {
				if (prefixes[i][j].toLowerCase() == cat.toLowerCase()) {
					return i;
				}
			}
		}

		return defaultPrefix;
	}


	/*
	 * Plugin: getValOnce v1.0
	 */
	s.getValOnce=new Function("v","c","e",""
	+"var s=this,a=new Date,v=v?v:v='',c=c?c:c='s_gvo',e=e?e:0,k=s.c_r(c"
	+");if(v){a.setTime(a.getTime()+e*86400000);s.c_w(c,v,e?a:0);}return"
	+" v==k?'':v");

	/*
	 * Plugin: getTimeParting 3.1, modified
	 */
	s.getTimeParting=new Function("t","z","y","l",""
	+"var s=this,d,A,B,C,D,U,W,X,Y,Z;d=new Date();A=d.getFullYear();if(A="
	+"='2011'){B='13';C='06'}if(A=='2012'){B='11';C='04'}if(A=='2013'){B="
	+"'10';C='03'}if(A=='2014'){B='09';C='02'}if(A=='2015'){B='08';C='01'"
	+"}if(A=='2016'){B='13';C='06'}if(A=='2017'){B='12';C='05'}if(!B||!C)"
	+"{B='08';C='01'}B='03/'+B+'/'+A;C='11/'+C+'/'+A;D=new Date('1/1/2000"
	+"');if(D.getDay()!=6||D.getMonth()!=0){return'Data Not Available'}el"
	+"se{z=z?z:'0';z=parseFloat(z);B=new Date(B);C=new Date(C);W=new Date"
	+"();if(W>B&&W<C&&l!='0'){z=z+1}W=W.getTime()+(W.getTimezoneOffset()*"
	+"60000);W=new Date(W+(3600000*z));X=['Sunday','Monday','Tuesday','We"
	+"dnesday','Thursday','Friday','Saturday'];B=W.getHours();C=W.getMinu"
	+"tes();if(C<10){C='0'+C};D=W.getDay();Z=X[D];U='AM';A='Weekday';X='0"
	+"0';if(C>30){X='30'}if(B>=12){U='PM';B=B-12};if(B==0){B=12};if(D==6|"
	+"|D==0){A='Weekend'}if(t=='ds'){return (W.getMonth()+1>9?'':'0')+(W."
	+"getMonth()+1)+'/'+(W.getDate()>9?'':'0')+W.getDate()+'/'+W.getFullY"
	+"ear();}W=B+':'+X+U;if(y&&y!=Y){return'Data Not Availabl"
	+"e'}else{if(t){if(t=='h'){return W}if(t=='m'){return B+':'+C+' '+U}i"
	+"f(t=='d'){return Z}if(t=='w'){return A}if(t=='f'){return B+':'+C+' "
	+"'+U+' - '+Z}}else{return Z+', '+W}}}");

	/*
	 * Plugin: getPercentPageViewed v1.71
	 */
	s.getPercentPageViewed=new Function("n",""
	+"var s=this,W=window,EL=W.addEventListener,AE=W.attachEvent,E=['load"
	+"','unload','scroll','resize','zoom','keyup','mouseup','touchend','o"
	+"rientationchange','pan'];W.s_Obj=s;s_PPVid=(n=='-'?s.pageName:n)||s"
	+".pageName||location.href;if(!W.s_PPVevent){s.s_PPVg=function(n,r){v"
	+"ar k='s_ppv',p=k+'l',c=s.c_r(n||r?k:p),a=c.indexOf(',')>-1?c.split("
	+"',',10):[''],l=a.length,i;a[0]=unescape(a[0]);r=r||(n&&n!=a[0])||0;"
	+"a.length=10;if(typeof a[0]!='string')a[0]='';for(i=1;i<10;i++)a[i]="
	+"!r&&i<l?parseInt(a[i])||0:0;if(l<10||typeof a[9]!='string')a[9]='';"
	+"if(r){s.c_w(p,c);s.c_w(k,'?')}return a};W.s_PPVevent=function(e){va"
	+"r W=window,D=document,B=D.body,E=D.documentElement,S=window.screen|"
	+"|0,Ho='offsetHeight',Hs='scrollHeight',Ts='scrollTop',Wc='clientWid"
	+"th',Hc='clientHeight',C=100,M=Math,J='object',N='number',s=W.s_Obj|"
	+"|W.s||0;e=e&&typeof e==J?e.type||'':'';if(!e.indexOf('on'))e=e.subs"
	+"tring(2);s_PPVi=W.s_PPVi||0;if(W.s_PPVt&&!e){clearTimeout(s_PPVt);s"
	+"_PPVt=0;if(s_PPVi<2)s_PPVi++}if(typeof s==J){var h=M.max(B[Hs]||E[H"
	+"s],B[Ho]||E[Ho],B[Hc]||E[Hc]),X=W.innerWidth||E[Wc]||B[Wc]||0,Y=W.i"
	+"nnerHeight||E[Hc]||B[Hc]||0,x=S?S.width:0,y=S?S.height:0,r=M.round("
	+"C*(W.devicePixelRatio||1))/C,b=(D.pageYOffset||E[Ts]||B[Ts]||0)+Y,p"
	+"=h>0&&b>0?M.round(C*b/h):0,O=W.orientation,o=!isNaN(O)?M.abs(o)%180"
	+":Y>X?0:90,L=e=='load'||s_PPVi<1,a=s.s_PPVg(s_PPVid,L),V=function(i,"
	+"v,f,n){i=parseInt(typeof a==J&&a.length>i?a[i]:'0')||0;v=typeof v!="
	+"N?i:v;v=f||v>i?v:i;return n?v:v>C?C:v<0?0:v};if(new RegExp('(iPod|i"
	+"Pad|iPhone)').exec(navigator.userAgent||'')&&o){o=x;x=y;y=o}o=o?'P'"
	+":'L';a[9]=L?'':a[9].substring(0,1);s.c_w('s_ppv',escape(W.s_PPVid)+"
	+"','+V(1,p,L)+','+(L||!V(2)?p:V(2))+','+V(3,b,L,1)+','+X+','+Y+','+x"
	+"+','+y+','+r+','+a[9]+(a[9]==o?'':o))}if(!W.s_PPVt&&e!='unload')W.s"
	+"_PPVt=setTimeout(W.s_PPVevent,333)};for(var f=W.s_PPVevent,i=0;i<E."
	+"length;i++)if(EL)EL(E[i],f,false);else if(AE)AE('on'+E[i],f);f()};v"
	+"ar a=s.s_PPVg();return!n||n=='-'?a[1]:a");

	/*
	 * Plugin: getTimeToComplete 0.4 - return the time from start to stop
	 */
	s.getTimeToComplete=new Function("v","cn","e",""
	+"var s=this,d=new Date,x=d,k;if(!s.ttcr){e=e?e:0;if(v=='start'||v=='"
	+"stop')s.ttcr=1;x.setTime(x.getTime()+e*86400000);if(v=='start'){s.c"
	+"_w(cn,d.getTime(),e?x:0);return '';}if(v=='stop'){k=s.c_r(cn);if(!s"
	+".c_w(cn,'',d)||!k)return '';v=(d.getTime()-k)/1000;var td=86400,th="
	+"3600,tm=60,r=5,u,un;if(v>td){u=td;un='days';}else if(v>th){u=th;un="
	+"'hours';}else if(v>tm){r=2;u=tm;un='minutes';}else{r=.2;u=1;un='sec"
	+"onds';}v=v*r/u;return (Math.round(v)/r)+' '+un;}}return '';");

	/*
	 *  Plug-in: crossVisitParticipation v1.6 - stacks values from
	 *  specified variable in cookie and returns value
	 */
	s.crossVisitParticipation=new Function("v","cn","ex","ct","dl","ev","dv",""
	+"var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var"
	+" ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.l"
	+"ength;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}i"
	+"f(!v||v==''){if(ce){s.c_w(cn,'');return'';}else return'';}v=escape("
	+"v);var arry=new Array(),a=new Array(),c=s.c_r(cn),g=0,h=new Array()"
	+";if(c&&c!='')arry=eval(c);var e=new Date();e.setFullYear(e.getFullY"
	+"ear()+5);if(dv==0&&arry.length>0&&arry[arry.length-1][0]==v)arry[ar"
	+"ry.length-1]=[v,new Date().getTime()];else arry[arry.length]=[v,new"
	+" Date().getTime()];var start=arry.length-ct<0?0:arry.length-ct;var "
	+"td=new Date();for(var x=start;x<arry.length;x++){var diff=Math.roun"
	+"d((td.getTime()-arry[x][1])/86400000);if(diff<ex){h[g]=unescape(arr"
	+"y[x][0]);a[g]=[arry[x][0],arry[x][1]];g++;}}var data=s.join(a,{deli"
	+"m:',',front:'[',back:']',wrap:\"'\"});s.c_w(cn,data,e);var r=s.join"
	+"(h,{delim:dl});if(ce)s.c_w(cn,'');return r;");

	/*
	 * s.join: 1.0 - s.join(v,p)
	 *  v - Array (may also be array of array)
	 *  p - formatting parameters (front, back, delim, wrap)
	 */
	s.join = new Function("v", "p", ""
	+ "var s=this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back"
	+ ":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0"
	+ ";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el"
	+ "se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");

	/*
	 * Function p_fo(x,y): Ensures the plugin code is fired only on the
	 *      first call of do_plugins
	 */
	s.p_fo=new Function("n",""
	+"var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="
	+"new Object;return 1;}else {return 0;}");

	/*
	 * Plugin: clickPast - version 1.0
	 */
	s.clickPast=new Function("scp","ct_ev","cp_ev","cpc",""
	+"var s=this,scp,ct_ev,cp_ev,cpc,ev,tct;if(s.p_fo(ct_ev)==1){if(!cpc)"
	+"{cpc='s_cpc';}ev=s.events?s.events+',':'';if(scp){s.events=ev+ct_ev"
	+";s.c_w(cpc,1,0);}else{if(s.c_r(cpc)>=1){s.events=ev+cp_ev;s.c_w(cpc"
	+",0,0);}}}");

	/*
	 * Plugin Utility: apl v1.1
	 */
	s.apl=new Function("L","v","d","u",""
	+"var s=this,m=0;if(!L)L='';if(u){var i,n,a=s.split(L,d);for(i=0;i<a."
	+"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
	+"e()));}}if(!m)L=L?L+d+v:v;return L");

	/*
	 * Utility Function: split v1.5 - split a string (JS 1.0 compatible)
	 */
	s.split = new Function("l", "d", ""
	+ "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
	+ "++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

	/*
	 * Plugin: getPreviousValue_v1.0 - return previous value of designated
	 *   variable (requires split utility)
	 */
	s.getPreviousValue=new Function("v","c","el",""
	+"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
	+"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
	+"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
	+":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
	+"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");

	/*
	 * channelManager v2.8 - Tracking External Traffic
	 */
	s.channelManager=new Function("a","b","c","d","e","f","g",""
	+"var s=this,h=new Date,i=0,j,k,l,m,n,o,p,q,r,t,u,v,w,x,y,z,A,B,C,D,E"
	+",F,G,H,I,J,K,L,M,N,O,P,Q,R,S;h.setTime(h.getTime()+1800000);if(e){i"
	+"=1;if(s.c_r(e))i=0;if(!s.c_w(e,1,h))s.c_w(e,1,0);if(!s.c_r(e))i=0;i"
	+"f(f&&s.c_r('s_tbm'+f))i=0;}j=s.referrer?s.referrer:document.referre"
	+"r;j=j.toLowerCase();if(!j)k=1;else {l=j.indexOf('?')>-1?j.indexOf('"
	+"?'):j.length;m=j.substring(0,l);n=s.split(j,'/');o=n[2].toLowerCase"
	+"();p=s.linkInternalFilters.toLowerCase();p=s.split(p,',');for(q=0;q"
	+"<p.length;q++){r=o.indexOf(p[q])==-1?'':j;if(r)break;}}if(!r&&!k){t"
	+"=j;u=v=o;w='Other Natural Referrers';x=s.seList+'>'+s._extraSearchE"
	+"ngines;if(d==1){m=s.repl(m,'oogle','%');m=s.repl(m,'ahoo','^');j=s."
	+"repl(j,'as_q','*');}y=s.split(x,'>');for(z=0;z<y.length;z++){A=y[z]"
	+";A=s.split(A,'|');B=s.split(A[0],',');for(C=0;C<B.length;C++){D=m.i"
	+"ndexOf(B[C]);if(D>-1){if(A[2])E=v=A[2];else E=o;if(d==1){E=s.repl(E"
	+",'#',' - ');j=s.repl(j,'*','as_q');E=s.repl(E,'^','ahoo');E=s.repl("
	+"E,'%','oogle');}F=s.split(A[1],',');for(G=0;G<F.length;G++){if(j.in"
	+"dexOf(F[G]+'=')>-1||j.indexOf('https://www.google.')==0)H=1;I=s.Util.get"
	+"QueryParam(F[G],'',j).toLowerCase();if(H||I)break;}}if(H||I)break;}"
	+"if(H||I)break;}}if(!r||g!='1'){r=s.Util.getQueryParam(a,b);if(r){v=r;if("
	+"E)w='Paid Search';else w='Unknown Paid Channel';}if(!r&&E){v=E;w='N"
	+"atural Search';}}if(k==1&&!r&&i==1)t=u=v=w='Typed/Bookmarked';J=s._"
	+"channelDomain;if(J&&o){K=s.split(J,'>');for(L=0;L<K.length;L++){M=s"
	+".split(K[L],'|');N=s.split(M[1],',');O=N.length;for(P=0;P<O;P++){Q="
	+"N[P].toLowerCase();R=o.indexOf(Q);if(R>-1){w=M[0];break;}}if(R>-1)b"
	+"reak;}}J=s._channelParameter;if(J){K=s.split(J,'>');for(L=0;L<K.len"
	+"gth;L++){M=s.split(K[L],'|');N=s.split(M[1],',');O=N.length;for(P=0"
	+";P<O;P++){R=s.Util.getQueryParam(N[P]);if(R){w=M[0];break;}}if(R)break;}"
	+"}J=s._channelPattern;if(J){K=s.split(J,'>');for(L=0;L<K.length;L++)"
	+"{M=s.split(K[L],'|');N=s.split(M[1],',');O=N.length;for(P=0;P<O;P++"
	+"){Q=N[P].toLowerCase();R=r.toLowerCase();S=R.indexOf(Q);if(S==0){w="
	+"M[0];break;}}if(S==0)break;}}S=w?r+u+w+I:'';c=c?c:'c_m';if(c!='0')S"
	+"=s.getValOnce(S,c,0);if(S){s._campaignID=r?r:'n/a';s._referrer=t?t:"
	+"'n/a';s._referringDomain=u?u:'n/a';s._campaign=v?v:'n/a';s._channel"
	+"=w?w:'n/a';s._partner=E?E:'n/a';s._keywords=H?I?I:'Keyword Unavaila"
	+"ble':'n/a';if(f&&w!='Typed/Bookmarked'){h.setTime(h.getTime()+f*864"
	+"00000);s.c_w('s_tbm'+f,1,h);}}");
	/* Top 130 - Grouped */
	s.seList="google.,googlesyndication.com|q,as_q|Google>yahoo.com,yahoo"
	+".co.jp|p,va|Yahoo!>bing.com|q|Bing>altavista.co,altavista.de|q,r|Al"
	+"taVista>.aol.,suche.aolsvc.de|q,query|AOL>ask.jp,ask.co|q,ask|Ask>w"
	+"ww.baidu.com|wd|Baidu>daum.net,search.daum.net|q|Daum>icqit.com|q|i"
	+"cq>myway.com|searchfor|MyWay.com>naver.com,search.naver.com|query|N"
	+"aver>netscape.com|query,search|Netscape Search>reference.com|q|Refe"
	+"rence.com>seznam|w|Seznam.cz>abcsok.no|q|Startsiden>tiscali.it,www."
	+"tiscali.co.uk|key,query|Tiscali>virgilio.it|qs|Virgilio>yandex|text"
	+"|Yandex.ru>search.cnn.com|query|CNN Web Search>search.earthlink.net"
	+"|q|Earthlink Search>search.comcast.net|q|Comcast Search>search.rr.c"
	+"om|qs|RoadRunner Search>optimum.net|q|Optimum Search";

	/*
	 * TNT Integration Plugin v1.0
	 */
	s.trackTNT=new Function("v","p","b",""
	+"var s=this,n='s_tnt',p=p?p:n,v=v?v:n,r='',pm=false,b=b?b:true;if(s."
	+"Util.getQueryParam){pm=s.Util.getQueryParam(p);}if(pm){r+=(pm+',');}if(window[v"
	+"]!=undefined){r+=window[v];}if(b){window[v]='';}return r;");

};
