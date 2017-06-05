/* eslint-disable */

module.exports = function (app) {

	/*
	 * Plugin: getValOnce v1.0
	 */
	app.getValOnce = new Function("v","c","e",""
	+"var s=this,a = new Date,v=v?v:v='',c=c?c:c='s_gvo',e=e?e:0,k=s.c_r(c"
	+");if(v){a.setTime(a.getTime()+e*86400000);s.c_w(c,v,e?a:0);}return"
	+" v==k?'':v");

	/*
	 * Plugin: getTimeParting 3.1, modified
	 */
	app.getTimeParting = new Function("t","z","y","l",""
	+"var s=this,d,A,B,C,D,U,W,X,Y,Z;d = new Date();A=d.getFullYear();if(A="
	+"='2011'){B='13';C='06'}if(A=='2012'){B='11';C='04'}if(A=='2013'){B="
	+"'10';C='03'}if(A=='2014'){B='09';C='02'}if(A=='2015'){B='08';C='01'"
	+"}if(A=='2016'){B='13';C='06'}if(A=='2017'){B='12';C='05'}if(!B||!C)"
	+"{B='08';C='01'}B='03/'+B+'/'+A;C='11/'+C+'/'+A;D = new Date('1/1/2000"
	+"');if(D.getDay()!=6||D.getMonth()!=0){return'Data Not Available'}el"
	+"se{z=z?z:'0';z=parseFloat(z);B = new Date(B);C = new Date(C);W = new Date"
	+"();if(W>B&&W<C&&l!='0'){z=z+1}W=W.getTime()+(W.getTimezoneOffset()*"
	+"60000);W = new Date(W+(3600000*z));X=['Sunday','Monday','Tuesday','We"
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
	app.getPercentPageViewed = new Function("n",""
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
	app.getTimeToComplete = new Function("v","cn","e",""
	+"var s=this,d = new Date,x=d,k;if(!s.ttcr){e=e?e:0;if(v=='start'||v=='"
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
	app.crossVisitParticipation = new Function("v","cn","ex","ct","dl","ev","dv",""
	+"var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var"
	+" ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.l"
	+"ength;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}i"
	+"f(!v||v==''){if(ce){s.c_w(cn,'');return'';}else return'';}v=escape("
	+"v);var arry = new Array(),a = new Array(),c=s.c_r(cn),g=0,h = new Array()"
	+";if(c&&c!='')arry=eval(c);var e = new Date();e.setFullYear(e.getFullY"
	+"ear()+5);if(dv==0&&arry.length>0&&arry[arry.length-1][0]==v)arry[ar"
	+"ry.length-1]=[v,new Date().getTime()];else arry[arry.length]=[v,new"
	+" Date().getTime()];var start=arry.length-ct<0?0:arry.length-ct;var "
	+"td = new Date();for(var x=start;x<arry.length;x++){var diff=Math.roun"
	+"d((td.getTime()-arry[x][1])/86400000);if(diff<ex){h[g]=unescape(arr"
	+"y[x][0]);a[g]=[arry[x][0],arry[x][1]];g++;}}var data=s.join(a,{deli"
	+"m:',',front:'[',back:']',wrap:\"'\"});s.c_w(cn,data,e);var r=s.join"
	+"(h,{delim:dl});if(ce)s.c_w(cn,'');return r;");

	/*
	 * s.join: 1.0 - s.join(v,p)
	 *  v - Array (may also be array of array)
	 *  p - formatting parameters (front, back, delim, wrap)
	 */
	app.join = new Function("v", "p", ""
	+ "var s=this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back"
	+ ":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0"
	+ ";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el"
	+ "se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");

	/*
	 * Function p_fo(x,y): Ensures the plugin code is fired only on the
	 *      first call of do_plugins
	 */
	app.p_fo = new Function("n",""
	+"var s=this;if(!s.__fo){s.__fo = new Object;}if(!s.__fo[n]){s.__fo[n]="
	+"new Object;return 1;}else {return 0;}");

	/*
	 * Plugin: clickPast - version 1.0
	 */
	app.clickPast = new Function("scp","ct_ev","cp_ev","cpc",""
	+"var s=this,scp,ct_ev,cp_ev,cpc,ev,tct;if(s.p_fo(ct_ev)==1){if(!cpc)"
	+"{cpc='s_cpc';}ev=s.events?s.events+',':'';if(scp){s.events=ev+ct_ev"
	+";s.c_w(cpc,1,0);}else{if(s.c_r(cpc)>=1){s.events=ev+cp_ev;s.c_w(cpc"
	+",0,0);}}}");

	/*
	 * Plugin Utility: apl v1.1
	 */
	app.apl = new Function("L","v","d","u",""
	+"var s=this,m=0;if(!L)L='';if(u){var i,n,a=s.split(L,d);for(i=0;i<a."
	+"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
	+"e()));}}if(!m)L=L?L+d+v:v;return L");

	/*
	 * Utility Function: split v1.5 - split a string (JS 1.0 compatible)
	 */
	app.split = new Function("l", "d", ""
	+ "var i,x=0,a = new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
	+ "++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

	/*
	 * Plugin: getPreviousValue_v1.0 - return previous value of designated
	 *   variable (requires split utility)
	 */
	app.getPreviousValue = new Function("v","c","el",""
	+"var s=this,t = new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
	+"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
	+"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
	+":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
	+"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");

	/*
	 * channelManager v2.8 - Tracking External Traffic
	 */
	app.channelManager = new Function("a","b","c","d","e","f","g",""
	+"var s=this,h = new Date,i=0,j,k,l,m,n,o,p,q,r,t,u,v,w,x,y,z,A,B,C,D,E"
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
	app.seList="google.,googlesyndication.com|q,as_q|Google>yahoo.com,yahoo"
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
	app.trackTNT = new Function("v","p","b",""
	+"var s=this,n='s_tnt',p=p?p:n,v=v?v:n,r='',pm=false,b=b?b:true;if(s."
	+"Util.getQueryParam){pm=s.Util.getQueryParam(p);}if(pm){r+=(pm+',');}if(window[v"
	+"]!=undefined){r+=window[v];}if(b){window[v]='';}return r;");

};
