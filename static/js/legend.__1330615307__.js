/*------------panel--------------*/
/*
@author lwg<lwg_8088@yahoo.com.cn>
@update 2010-01-26
*/

var Legend = Legend || {};
var L = Legend;
L.version = '2010-01-26';

//取得最新载入的js的目录url
L.getLastJsFileDir = function(){
    var script, src, urls;
	var script = document.getElementsByTagName("script");
	if ( script ) src = script[script.length - 1].src;
	if (src.indexOf('http') !== 0 && src.indexOf('/') !== 0) {
		urls = location.href.split("/");
		urls.pop();
		src = urls.join("/") + "/" + src;
	}
	urls = src.split("/");
	urls.pop();
	return urls.join("/") + "/";
}
var JQ_UTIL_FILE_DIR = L.getLastJsFileDir();

/*------------global------------*/
(function() {
	var ua = navigator.userAgent;
	isWebKit = /WebKit/.test(ua);
	isOldWebKit = isWebKit && !window.getSelection().getRangeAt;
	isIE6 = $.browser.msie && /MSIE [56]/.test(ua);
	isGecko = !isWebKit && /Gecko/.test(ua);
	isMac = ua.indexOf('Mac') != -1;
	isChrome = /Chrome/.test(ua);

	$.browser.webkit = isWebKit;
	$.browser.oldwebkit = isOldWebKit;
	$.browser.ie6 = isIE6;
	$.browser.gecko = isGecko;
	$.browser.mac = isMac;

	L.Dom = {
        getViewPort: function() {
			var d = document, b = d.body;
            var mode = d.compatMode;

            var width = self.innerWidth;  // Safari
            var height = self.innerHeight; // Safari, Opera
			if (mode || $.browser.msie) { // IE, Gecko, Opera
                width = (mode == 'CSS1Compat') ? d.documentElement.clientWidth : b.clientWidth;
				if (!$.browser.opera ) height = (mode == 'CSS1Compat') ? d.documentElement.clientHeight : b.clientHeight;
            }

			return {
				x: Math.max(d.documentElement.scrollLeft, b.scrollLeft),
				y: Math.max(d.documentElement.scrollTop, b.scrollTop),
				w: width,
				h: height
			};
        },

		getContextXY : function (src_id, dst_id, place, pageXY){
			var opt = {}, dst_pos, src_pos, obj_src, obj_dst, vp;

			obj_src = $(src_id);
			if (obj_src.length == 0) return opt;
			src_pos = { x:obj_src.offset().left, y:obj_src.offset().top, w:obj_src.width(), h:obj_src.height() };

			if (dst_id && (obj_dst = $(dst_id)).length > 0) dst_pos = { x:obj_dst.offset().left, y:obj_dst.offset().top, w:obj_dst.width(), h:obj_dst.innerHeight() };
			else if (pageXY && pageXY.x && pageXY.y) dst_pos = { x:pageXY.x, y:pageXY.y, w:0, h:0 };
			else return opt;

			vp = this.getViewPort();

			if (!place) place = "bottom";
			if (place == "bottom"){
				opt.x = dst_pos.x;
				if (src_pos.h+dst_pos.y+dst_pos.h > vp.y+vp.h && dst_pos.y-vp.y > src_pos.h) opt.y = dst_pos.y - src_pos.h;
				else opt.y = dst_pos.y + dst_pos.h;
			}
			else if (place == "right"){
				if (dst_pos.x+dst_pos.w+src_pos.w > vp.x+vp.w && dst_pos.x-vp.x>src_pos.w)opt.x = dst_pos.x-src_pos.w;
				else opt.x = dst_pos.x+dst_pos.w;
				opt.y = dst_pos.y;
			}
			else if (place == "left"){
				if (dst_pos.x-src_pos.w < vp.x && dst_pos.x-vp.x<src_pos.w)opt.x = dst_pos.x+dst_pos.w;
				else opt.x = dst_pos.x-src_pos.w;
				opt.y = dst_pos.y;
			}
			else if (place == "top"){
				opt.x = dst_pos.x;
				if (dst_pos.y-vp.y < src_pos.h && vp.h+vp.y-dst_pos.y-dst_pos.h > src_pos.h) opt.y = dst_pos.y + dst_pos.h;
				else opt.y = dst_pos.y-src_pos.h;
			}

			if (place == "bottom" || place == "top"){
				if (dst_pos.x+src_pos.w > vp.x+vp.w && dst_pos.x+dst_pos.w-vp.x>src_pos.w)opt.x = dst_pos.x+dst_pos.w-src_pos.w;
			}
			if (place == "left" || place == "right"){
				if (src_pos.h+dst_pos.y > vp.y+vp.h && dst_pos.y+dst_pos.h-vp.y > src_pos.h) opt.y = dst_pos.y+dst_pos.h - src_pos.h;
			}
			return opt;
		},

		getIframeWindow : function(id) {
			var el = (typeof id == 'object') ? $(id) : $("#"+id);
			return el.contentWindow;
		},

		getIframeDocument : function(id) {
			var el = (typeof id == 'object') ? $(id) : $("#"+id);
			return el.contentDocument||el.contentWindow.document;
		},

		getScrollBarWidth : function  () {  
			var inner = document.createElement('p');  
			inner.style.width = "100%";  
			inner.style.height = "200px";  
		  
			var outer = document.createElement('div');  
			outer.style.position = "absolute";  
			outer.style.top = "0px";  
			outer.style.left = "0px";  
			outer.style.visibility = "hidden";  
			outer.style.width = "200px";  
			outer.style.height = "150px";  
			outer.style.overflow = "hidden";  
			outer.appendChild (inner);  
		  
			document.body.appendChild (outer);  
			var w1 = inner.offsetWidth;  
			outer.style.overflow = 'scroll';  
			var w2 = inner.offsetWidth;  
			if (w1 == w2) w2 = outer.clientWidth;  
		  
			document.body.removeChild (outer);  
		  
			return (w1 - w2);  
		}
	};

	L.global = {
		counter_id : 0,
		generateId : function (el, prefix) {
			if (el && el.id) return el.id;
			var id = (prefix || 'jqauto_') + L.global.counter_id++;
			if (el) el.id = id;
			return id;
		},

		htmlEncode : function (s) {
			return s ? ('' + s).replace(/[<>&\"]/g, function (c, b) {
				switch (c) {
					case '&': return '&amp;';
					case '"': return '&quot;';
					case '<': return '&lt;';
					case '>': return '&gt;';
				}
				return c;
			}) : s;
		}
	};

	L.extend = function(subc, superc) 
	{
        if (!superc||!subc) {
            alert("extend failed");
			return false;
        }
        var F = function() {};
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor=superc;
        }
    };
	
	L.Json = new function()
	{
		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			meta = { 
				'\b': '\\b',
				'\t': '\\t',
				'\n': '\\n',
				'\f': '\\f',
				'\r': '\\r',
				'"' : '\\"',
				'\\': '\\\\'
			};

		function quote(string) {
			escapable.lastIndex = 0;
			return escapable.test(string) ?
				'"' + string.replace(escapable, function (a) {
					var c = meta[a];
					return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				}) + '"' :
				'"' + string + '"';
		}

		function str(value) {
			var i, k, v, partial, is_list;

			switch (typeof value) {
			case 'string':
				return quote(value);

			case 'number':
				return isFinite(value) ? String(value) : 'null';

			case 'boolean':
			case 'null':
				return String(value);
				
			case 'object':
				if (!value) return 'null';
				value = value.valueOf();

				partial = [];
				is_list = (Object.prototype.toString.apply(value) === '[object Array]');

				for (k in value) {
					if (Object.hasOwnProperty.call(value, k)) {
						v = str(value[k]);
						if (is_list) {
							partial.push(v || 'null');
						}
						else if (v) {
							partial.push(quote(k) + ':' + v);
						}
					}
				}

				return is_list ? '[' + partial.join(',') + ']' : '{' + partial.join(',') + '}';
			}
		}

		return {
			encode : function (value) {
				return str(value);
			},

			decode : function (text) {
				cx.lastIndex = 0;
				if (cx.test(text)) {
					text = text.replace(cx, function (a) {
						return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
					});
				}

				if (/^[\],:{}\s]*$/.
					test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
					replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
					replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) 
				{
					return eval('(' + text + ')');
				}

				alert('JSON decode error');
			}
		};
	};

	L.Url = {
		currentUrlData : null,

		parseUrl : function (url) {
			var currUrl;
			if (!url) {
				if (this.currentUrlData) return this.currentUrlData;
				currUrl = url = window.location.href;
			}
			var a =  document.createElement('a');
			a.href = url;
			var data = {
				source: url,
				protocol: a.protocol.replace(':',''),
				host: a.hostname,
				port: a.port,
				query: a.search,
				params: (function(){
					var ret = {},
						seg = a.search.replace(/^\?/,'').split('&'),
						len = seg.length, i = 0, s;
					for (;i<len;i++) {
						if (!seg[i]) { continue; }
						s = seg[i].split('=');
						ret[s[0]] = s[1] || '';
					}
					return ret;
				})(),
				file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
				hash: a.hash.replace('#',''),
				path: a.pathname.replace(/^([^\/])/,'/$1'),
				relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
				segments: a.pathname.replace(/^\//,'').split('/')
			};
			if (currUrl) this.currentUrlData = data;
			return data;
		},

		createUrl : function(data)
		{
			if (!data) data = this.currentUrlData;
			if (!data) return window.location.href;
			var url = data.protocol + "://" + data.host;
			if (data.port) url += ':' + data.port;
			url += data.path;
			var param = [];
			for (var i in data.params) {
				if (data.params[i] != null) {
					param[param.length] = i+"="+data.params[i];
				}
			}
			if (param.length > 0) url += "?" + param.join('&');
			if (data.hash) url += '#' + data.hash;
			return url;
		}
	};

	L.Layout = {
		getFixedDiv : function()
		{
			var $fixedDiv = $('#__fixed_container');
			if ($fixedDiv.size() == 0) {
				var $body = $(document.body);
				$body.append('<div id="__fixed_container" style="position:absolute;top:0;left:0;margin:0;padding:0;border:0"></div>');
				$fixedDiv = $('#__fixed_container');
				if ($body.css('background-image') != 'none') {
					$body.css({backgroundAttachment:'fixed'});
				} 
				else {
					$body.css({backgroundImage:'url(about:blank)', backgroundAttachment:'fixed'});
				}
				var css = '<style type="text/css">' + 
				          '.fixed-top    {position:fixed;bottom:auto;top:0px;}' + 
					      '.fixed-bottom {position:fixed;bottom:0px;top:auto;}' + 
					      '.fixed-left   {position:fixed;right:auto;left:0px;}' + 
					      '.fixed-right  {position:fixed;right:0px;left:auto;}' + 
					      '* html .fixed-top    {position:absolute;bottom:auto;top:expression(eval(document.documentElement.scrollTop));}' + 
					      '* html .fixed-right  {position:absolute;right:auto;left:expression(eval(document.documentElement.scrollLeft+document.documentElement.clientWidth-this.offsetWidth)-(parseInt(this.currentStyle.marginLeft,10)||0)-(parseInt(this.currentStyle.marginRight,10)||0));}' + 
					      '* html .fixed-bottom {position:absolute;bottom:auto;top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)));}' + 
					      '* html .fixed-left   {position:absolute;right:auto;left:expression(eval(document.documentElement.scrollLeft));}' + 
					      '</style>';
				$($('head').get(0)).append(css);
			}
			return $fixedDiv;
		},

		setFixed : function(el, type, place, number, width, height)
		{
			var $el= $(el);
			if ($el.size() == 0) {
				alert('[Layout::setBottomFixed]未找到文档对象');
				return false;
			}
			if (type != 'top' && type != 'bottom' && type != 'middle') {
				alert('[Layout::setFixed]参数无效');
				return false;
			}
			width  = width||$el.outerWidth();
			height = height||$el.outerHeight();
			number = parseInt(number);
			var className = number > 0 ? 'fixed-'+type+'_'+number : 'fixed-'+type;
			if (number > 0 || type == 'middle') {
				var css = '<style type="text/css">';
				if (type == 'top'){
					css += '.'+className+'    {position:fixed;bottom:auto;top:'+number+'px;}';
					css += '* html .'+className+'    {position:absolute;bottom:auto;top:expression(eval(document.documentElement.scrollTop+'+number+'));}';
				}
				else if (type == 'bottom'){
				    css += '.'+className+'    {position:fixed;bottom:'+number+'px;top:auto;}';
					css += '* html .'+className+' {position:absolute;bottom:auto;top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0))-'+number+');}';
				}
				else if (type == 'middle'){
				    css += '.'+className+'    {position:fixed;top:50%;left:50%;margin-top:-'+Math.floor(height/2)+'px;margin-left:-'+Math.floor(width/2)+'px;}';
					css += '* html .'+className+' {position:absolute;bottom:auto;top:expression(eval(document.documentElement.scrollTop+(document.documentElement.clientHeight-this.offsetHeight)/2-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)));right:auto;left:expression(eval(document.documentElement.scrollLeft+(document.documentElement.clientWidth-this.offsetWidth)/2)-(parseInt(this.currentStyle.marginLeft,10)||0)-(parseInt(this.currentStyle.marginRight,10)||0));}';
				}
				css += '</style>';
				$($('head').get(0)).append(css);
			}
			var $fixedDiv = this.getFixedDiv();
			var $div = $('<div style="border:0"></div>');
			$fixedDiv.append($div);
			$div.addClass(className);
			if (type == 'top' || type == 'bottom'){
				$div.addClass(place == 'right' ? 'fixed-right' : 'fixed-left');
				$div.css({margin:0,padding:0});
			}
			$div.append($el);
			$div.css({width:width, height:height});
			$el.data('fixedElement', $div);
		}
	};

	$.fn.L_top_left_fixed = $.fn.L_left_top_fixed = function(spacing, width, height){
		return this.each(function(k,v){
			L.Layout.setFixed(this, 'top', 'left', spacing, width, height);
		});
	};
	$.fn.L_top_right_fixed = $.fn.L_right_top_fixed = function(spacing, width, height){
		return this.each(function(k,v){
			L.Layout.setFixed(this, 'top', 'right', spacing, width, height);
		});
	};
	$.fn.L_bottom_left_fixed = $.fn.L_left_bottom_fixed = function(spacing, width, height){
		return this.each(function(k,v){
			L.Layout.setFixed(this, 'bottom', 'left', spacing, width, height);
		});
	};
	$.fn.L_bottom_right_fixed = $.fn.L_right_bottom_fixed = function(spacing, width, height){
		return this.each(function(k,v){
			L.Layout.setFixed(this, 'bottom', 'right', spacing, width, height);
		});
	};
	$.fn.L_middle_fixed = function(width, height){
		return this.each(function(k,v){
			L.Layout.setFixed(this, 'middle', null, 0, width, height);
		});
	};


	L.Cookie = {
		remove : function(name, path, domain) {
			var dt = new Date();
			dt.setTime(dt.getTime() - 1000);
			this.set(name, '', dt, path, domain);
		},

		get : function(name) {
			var c = document.cookie, e, p = name + "=", b;

			if (!c)
				return;

			b = c.indexOf("; " + p);

			if (b == -1) {
				b = c.indexOf(p);

				if (b != 0)
					return null;
			} else
				b += 2;

			e = c.indexOf(";", b);

			if (e == -1)
				e = c.length;

			return unescape(c.substring(b + p.length, e));
		},

		//expire过期时间(秒)
		set : function(name, value, expire, path, domain, s) {
			expire = parseInt(expire);
			if (expire <= 0) this.remove(name, path, domain);
			var dt = new Date();
			dt.setTime(dt.getTime() + 1000 * expire);
			document.cookie = name + "=" + escape(value) +
				((expire) ? "; expires=" + dt.toGMTString() : "") +
				((path) ? "; path=" + escape(path) : "") +
				((domain) ? "; domain=" + domain : "") +
				((s) ? "; secure" : "");
		}
	};

	L.Image = {
		getResizeInfo : function (srcW, srcH, dstW, dstH, cut)
		{ 
			var x = dstW > 0 ? srcW / dstW : 0;
			var y = dstH > 0 ? srcH / dstH : 0;
			var newsize = [];	
			if (((x == 0 || x == 1) && (y == 0 || y == 1)) || (x < 1 && y < 1 && !cut)) newsize = [srcW, srcH, srcW, srcH];
			else {
				if (x > y){
					if (cut){
						srcW = Math.floor(srcW/y);
						srcH = dstH;
					}
					else {
						dstW = Math.floor(srcW/x);
						dstH = Math.floor(srcH/x);			
					}
				}
				else {
					if (cut){
						srcW = dstW;
						srcH = Math.floor(srcH/x);
					}
					else {
						dstW = Math.floor(srcW/y);
						dstH = Math.floor(srcH/y);
					}
				}
				if (!cut){
					srcW = dstW;
					srcH = dstH;
				}
				newsize = [dstW, dstH, srcW, srcH];
			}

			return newsize;
		},

		resize : function (img, dstW, dstH, cut)
		{
			var newsize = this.getResizeInfo(img.width, img.height, dstW, dstH, cut);
			$(img).css({width:newsize[2], height:newsize[3]});

			if (cut) {
				var left = 0, top = 0, div=$('<div style="position:relative;overflow:hidden;"></div>');
				var div_inline = $('<div style="display:-moz-inline-stack;display:inline-block;vertical-align:top;zoom:1;*display:inline;"></div>');
				if (newsize[2] <= newsize[0]) left = 0;
				else left = Math.floor((newsize[2] - newsize[0])/2);
				if (newsize[3] <= newsize[1]) top = 0;
				else top = Math.floor((newsize[3] - newsize[1])/2);
				div.css({width:newsize[0], height:newsize[1]});
				$(img).after(div_inline);
				div_inline.append(div); div.append(img);
				$(img).css({position:'absolute', left:-left, top:-top});
			}
		}
	};

	//缩小图片插件
	$.fn.L_image_resize = function(width, height, cut){
		return this.each(function(k,v){
			L.Image.resize(this, width, height, cut);
		});
	};

	function IframeInfo(){
		this.container = null;
		this.iframe    = null;
		this.window    = null;
		this.document  = null;
		this.setHeight = function (height){
			try{
				if (!height) {
					var doc = this.document;
					this.iframe.css({height: $('body', doc).outerHeight()});
					var bHeight = doc.body.scrollHeight;
					var dHeight = doc.documentElement.scrollHeight;
					this.iframe.css({height: '100%'});
					height = Math.max(bHeight, dHeight);
				}
				
				this.container.css({height: height});
			}catch (ex){}
		};
	};

	L.Iframe = {
		iframes : {},

		setHeight : function (id, height){
			if (!this.iframes[id]) return false;
			this.iframes[id].setHeight(height);
		},
		
		add : function(containerId, params){
			var _container = typeof containerId == 'string' ? $('#'+containerId) : $(containerId);
			if (_container.size() == 0) {
				alert('不存在元素 "'+containerId+'"。');
				return;
			}
			params = $.extend({
				url : '',
				id : L.global.generateId(),
				scrolling : 'no',
				height : 0,
				onLoad : null,
				autoResizeHeight : false
			}, params||{});
			if (!params.url) return;
			params.url + (params.url.indexOf('?') == -1 ? '?' : '&') + '&random=' + (new Date().getTime()+Math.random());
			if (this.iframes[params.id]) {
				alert('Iframe "'+params.id+'" 已在存在了。');
				return;
			}
			var container = $('<div></div>');
			container.css({
				overflow : 'hidden',
				position : 'relative',
				height : params.height
			});
			var iframe = $('<iframe></iframe>');
			var obj = new IframeInfo();
			this.iframes[params.id] = obj;
			obj.iframe = iframe;
			obj.container = container;
			iframe.attr({
				frameBorder:0, 
				scrolling:params.scrolling != 'yes' ? 'no' : 'yes'
			});
			iframe.css({
				border:0,
				padding:0,
				margin:0,
				width: '100%',
				height: '100%',
				visibility : 'hidden'
			});
			var autoHeight, t=this;
			iframe.load(function(){
				if (autoHeight) {
					clearInterval(autoHeight);
					autoHeight = null;
				}
				iframe.css({visibility:'visible'});
				try{
					obj.document = iframe.get(0).contentDocument||iframe.get(0).contentWindow.document;
					iframe.get(0).contentWindow.iframeIdInParent = params.id;
					obj.window = iframe.get(0).contentWindow;

					if (params.autoResizeHeight){
						autoHeight = setInterval(function(){obj.setHeight();}, 200);
					}
				}
				catch(e){}
				if (params.onLoad == 'function')params.onLoad(obj);
			});
			_container.append(container);
			container.append(iframe);
			iframe.attr("src", params.url);
		},
		
		get : function(id){
			return this.iframes[id] ? this.iframes[id] : null;
		}
	};


	var JqDnR = new function()
	{
		var dnr={}, E, useProxy, objProxy, onStop, onMove, pos={}, ret={}, sHandler;
		getCss = function (kind, defaultVal){
			return parseInt(E.css(kind))||defaultVal;
		};
		drag = function (ev){
			ret.event = ev;
			if (useProxy && !objProxy){
				objProxy = $('<div id="jqDnR_move" style="position:absolute; border:1px dotted #000;background:#ccc;opacity:0.5; filter:alpha(opacity=50);z-index:600000;"></div>');
				$(document.body).append(objProxy);
				objProxy.css({left:dnr.X, top:dnr.Y, width:dnr.W, height:dnr.H, marginLeft:dnr.marginLeft, marginTop:dnr.marginTop});
			}

			var sl = $(document).scrollLeft(), st = $(document).scrollTop();

			if (Math.abs(ev.pageX - dnr.pX) > 5 || Math.abs(ev.pageY - dnr.pY) > 5) {
				if (dnr.kind == 'drag') {
					if (dnr.inViewPort) {					
						var left = Math.max(5-dnr.marginLeft+sl, dnr.X+ev.pageX-dnr.pX);
						var top = Math.max(5-dnr.marginTop+st, dnr.Y+ev.pageY-dnr.pY);
						left = Math.min(left, dnr.vp.w-dnr.W-dnr.marginLeft-5+sl);
						top = Math.min(top, dnr.vp.h-dnr.H-dnr.marginTop-5+st);
					}
					else {
						var left = dnr.X+ev.pageX-dnr.pX
						var top  = dnr.Y+ev.pageY-dnr.pY;
					}
					pos = {left:left, top:top};
				}
				else {
					if (dnr.inViewPort) {
						var width = Math.max(ev.pageX-dnr.pX+dnr.W, 0);
						var height = Math.max(ev.pageY-dnr.pY+dnr.H, 0);
						width = Math.min(width, dnr.vp.w+sl-dnr.marginLeft-dnr.X-5);
						height = Math.min(height, dnr.vp.h+st-dnr.marginTop-dnr.Y-5);
					}
					else {
						var width  = Math.max(ev.pageX-dnr.pX+dnr.W,0)
						var height = Math.max(ev.pageY-dnr.pY+dnr.H,0);
					}
					pos = {width:width, height:height};
				}

				if (objProxy)objProxy.css(pos);
				else E.css(pos);

				if (onMove) {
					ret.left   = pos.left   || dnr.X; 
					ret.top    = pos.top    || dnr.Y; 
					ret.width  = pos.width  || dnr.W; 
					ret.height = pos.height || dnr.H;
					onMove(ret);
				}
			}

			return false;
		};
		stop = function (ev){
			ret.event = ev;
			if (onStop){
				ret.left   = pos.left   || dnr.X; 
				ret.top    = pos.top    || dnr.Y; 
				ret.width  = pos.width  || dnr.W; 
				ret.height = pos.height || dnr.H;
				onStop(ret);
			}
			else E.css(pos);

			if (objProxy) objProxy.remove();

			pos = {};
			ret = {};
			dnr={};
			E = null;
			useProxy = false;
			objProxy = null;
			onStop = null;
			onMove = null;
			$(document).unbind('mousemove',drag).unbind('mouseup',stop);
			sHandler = null;
		};
		return {
			getProxy : function(){return objProxy; },
			eachJqDnR : function($s, cfg)
			{
				var handle = cfg.handle || null;
				var kind = cfg.type;
				var proxy = cfg.useProxy || true;
				var scb = cfg.onStop || null;
				var mcb = cfg.onMove || null;
				var inViewPort = cfg.inViewPort || false;

				return $s.each(function (){
					var obj = $(this);
					sHandler=(handle)?$(handle,obj):obj;
					sHandler.bind('mousedown', function (ev){
						ret.element = obj;
						ret.handle = sHandler;
						ret.event = ev;
						var p={};
						onStop = scb;
						onMove = mcb;
						E=obj;
						//if(E.css('position')!='relative'){
							//try{ p = E.position(); }catch(e){}
						//}

						if(E.css('position')=='absolute'){
							try{ p = E.position(); }catch(e){}
							var marginLeft = getCss('margin-left', 0);
							var marginTop = getCss('margin-top', 0);
						}
						else {
							p = {left:E.offset().left,top:E.offset().top};
							var marginLeft = 0;
							var marginTop = 0;
						}

						dnr={
							X:p.left||getCss('left', 0),
							Y:p.top||getCss('top', 0),
							W:E.outerWidth(),
							H:E.outerHeight(),
							pX:ev.pageX,
							pY:ev.pageY,
							kind:kind,
							marginLeft:marginLeft,
							marginTop:marginTop,
							zIndex:getCss('z-index', 0),
							vp:L.Dom.getViewPort(),
							inViewPort : inViewPort
						};

						useProxy = proxy;

						if (typeof cfg.mousedownHandler == 'function') {
							cfg.mousedownHandler(ret);
						}

						if (typeof cfg.dragEnable == 'function') {
							if (!cfg.dragEnable(ret)) return false;
						}

						$(document).mousemove(drag).mouseup(stop);
						return false;
					});
				});
			}
		}
	};

	$.fn.L_drag=function (cfg){
		if (!cfg) cfg = {};
		cfg.type = 'drag';
		return JqDnR.eachJqDnR(this, cfg);
	};

	$.fn.L_resize=function (cfg){
		if (!cfg) cfg = {};
		cfg.type = 'resize';
		return JqDnR.eachJqDnR(this, cfg);
	};

	/*-------panel-----------*/
	L.Panel = {
		panels : [],
		currId : 0,
		zIndex : 300000,

		getJqObj : function(el)
		{
			return (typeof el == 'object') ? $(el) : $("#"+el);
		},

		getPanel : function(id)
		{
			var ix = 0, p, v, i;
			if (id) {
				if (typeof id == 'object' && id.id && this.panels[id.id]){
					return this.panels[id.id];
				}
				else if (typeof id == 'string' && this.panels[id]){
					return this.panels[id];
				}
				return null;
			}
			for (i in this.panels){
				if ((v = this.panels[i]) && (v.config.type == 'panel' || v.config.type == 'alert' || v.config.type == 'confirm' || v.config.type == 'dropdown' || v.config.type == 'loading') && v.zIndex > ix && v.isHide === false){
					p = v;
					ix = v.zIndex;
				}
			}
			return p;
		},	

		alert : function(txt, opt)
		{
			opt = opt || {};
			if (typeof opt.onSubmit != 'function') opt.onSubmit = null;
			if (typeof opt.onClose != 'function') opt.onClose = null;

			var id = 'lpn_panel_alert';
			var panel = this.getPanel(id);
			if (panel) {
				panel.show();
				panel.setContent(txt);
				panel.config.onSubmit = opt.onSubmit;
				panel.config.onClose = opt.onClose;
			}
			else {
				var opt = {
					title : "信息提示",
					type : 'alert',
					mask : true,
					content : txt,
					width : 400,
					id : id,
					onSubmit : opt.onSubmit,
					onClose : opt.onClose
				};
				panel = new PanelElement(opt).show();
			}
			return panel;
		},

		confirm : function(txt, opt)
		{
			opt = opt || {};
			if (typeof opt.onSubmit != 'function') opt.onSubmit = null;
			if (typeof opt.onCancel != 'function') opt.onCancel = null;
			if (typeof opt.onClose != 'function') opt.onClose = null;
			
			var id = 'lpn_panel_confirm';
			var panel = this.getPanel(id);
			if (panel) {
				panel.show();
				panel.setContent(txt);
				panel.config.onSubmit = opt.onSubmit;
				panel.config.onCancel = opt.onCancel;
				panel.config.onClose = opt.onClose;
			}
			else {
				var opt = {
					title : "信息提示",
					type : 'confirm',
					mask : true,
					content : txt,
					width : 400,
					id : id,
					onSubmit : opt.onSubmit,
					onCancel : opt.onCancel,
					onClose : opt.onClose
				};
				panel = new PanelElement(opt).show();
			}
			return panel;
		},

		loading : function(txt)
		{
			var id = 'lpn_panel_loading';
			var panel = this.getPanel(id);
			if (panel) {
				panel.show();
				panel.setContent(txt);
			}
			else {
				var opt = {
					title : "",
					closeable : false,
					moveable : false,
					minimizable : false,
					resizeable : false,
					type : 'loading',
					mask : true,
					content : txt,
					width : 300,
					id : id
				};
				panel = new PanelElement(opt).show();
			}
			return panel;
		},

		tooltip : function(el, width)
		{
			el = this.getJqObj(el);
			if (!el) return false;
			var title = el.attr('title');
			if (!title) return false;
			el.attr('title', '');
			el.addClass('lpn_panel_tooltip_el');

			var id = 'lpn_panel_tooltip';
			var panel = this.getPanel(id);
			if (!panel) {
				var opt = {
					content : title,
					width : width || 0,
					type : 'tooltip',				
					el : el,
					resizeable : false,
					moveable : false,
					closeable : false,
					minimizable : false,
					//context : [el, 'bottom'],
					id : id
				};
				panel = new PanelElement(opt);
			}

			el.hover(
				function (e){
					panel.config.width = width || 0;
					//panel.config.context = [el, 'bottom'];
					panel.setContent(title);					
					panel.config.left = e.pageX+20;
					panel.config.top = e.pageY+10;
					panel.show().setPlace();
				}, 
				function (){
					panel.close();
				}
			);

			return panel;
		},

		panel : function(opt)
		{
			if (!opt.id) opt.id = L.global.generateId();
			return new PanelElement(opt).show();
		},
		
		dropdown : function(el, opt, ifDropDownHandler)
		{
			el = this.getJqObj(el);
			if (!el) return false;

			var p, on_panel=false, on_el=false, tmo_el = null, tmo_panel = null;

			opt = opt || {};
			opt.type = 'dropdown';
			opt.el = el;
			opt.resizeable = opt.resizeable ? true : false;
			opt.moveable = opt.moveable ? true : false;
			opt.closeable = opt.closeable ? true : false;
			opt.minimizable = opt.minimizable ? true : false;	
			if (!opt.context)opt.context = [el, opt.align || 'bottom'];
			if (!opt.id) opt.id = L.global.generateId();

			function clearTimer()
			{
				if(tmo_el){
					clearTimeout(tmo_el);
					tmo_el=null;
				}
				if(tmo_panel){
					clearTimeout(tmo_panel);
					tmo_panel=null;
				}
			}

			var over_handler = function(e){
				if (typeof ifDropDownHandler == 'function' && !ifDropDownHandler()){
					return false;
				}

				if(!p){
					p = new PanelElement(opt);
					p.panel.hover(
						function(){
							p.show();
							on_panel = true;
							clearTimer();
						},
						function(){
							on_panel = false;
							tmo_panel = setTimeout(function (){
								if (!on_el)p.close();
							}, 100);
						}
					);
				}
				p.show().setPlace();
				if(p.config.overClassName)el.addClass(p.config.overClassName);
				on_el = true;
				clearTimer();
			}

			var out_handler = function(){
				if (typeof ifDropDownHandler == 'function' && !ifDropDownHandler()){
					return false;
				}
				if(!p)return false;
				on_el = false;
				tmo_el = setTimeout(function (){
					if (!on_panel)p.close();
				},100);
			}

			if (opt.mouseType == 'click'){
				el.click(function (e){ over_handler(e); return false; });
				el.mouseout(out_handler);
			}
			else el.hover(over_handler, out_handler);
		},

		context : function(el, opt, ifContextHandler)
		{
			el = this.getJqObj(el);
			if (!el) return false;

			var p, on_panel=false, on_el=false, tmo_el = null, tmo_panel = null;

			opt = $.extend(opt || {}, {
				type:'context',
				resizeable:false,
				moveable:false,
				closeable:false,
				minimizable:false
			});
			opt.context = [];
			if (!opt.id) opt.id = L.global.generateId();

			var closePanel = function(){
				if (p) p.close();
				$(document).unbind('mousedown', closePanel);
			}

			el.bind('contextmenu', function(e){
				if (typeof ifContextHandler == 'function' && !ifContextHandler()){
					return false;
				}

				if(!p) p = new PanelElement(opt);
				p.config.left = e.pageX+10;
				p.config.top = e.pageY;
				p.setPlace().show();

				$(document).bind('mousedown', closePanel);
				return false;
			});

			el.bind('mousedown', function(e){return false;});
		},

		module : function (opt)
		{
			var p, id;

			opt = opt || {};

			//if (!opt.id || $('#'+opt.id).size() == 0){
			//	alert('请用文档对象id作为面板id');
			//}

			opt.inline = true;
			opt.type = 'module';
			opt.moveable = opt.moveable ? true : false;

			p = new PanelElement(opt);
			p.show();

			return p;
		},

		closePanel : function (id, speed)
		{ 
			var panel = this.getPanel(id);
			if(panel)panel.close(speed); 
		}
	};

	var PanelElement = function (opt)
	{
		opt = opt || {};

		this.id = opt.id || L.global.generateId();

		if (L.Panel.panels[this.id]){
			return L.Panel.panels[this.id];
		}
		else {
			L.Panel.panels[this.id] = this;
		}

		this.data = opt.data || {};
		this.config = PanelElement.getConfig(opt);
		delete opt;
		var cfg = this.config;
		this.styleClassName = PanelElement.getStyleClassName(cfg.style);

		this._w = null;
		this._h = null;
		this._is_img = false;
		this.panel = null;
		this.underlay = null;
		this.wrapper = null;
		this.iframe = null;
		this.iframeDocment = null;
		this.iframeWindow = null;
		this.canvas = null;
		this._canvas = null;
		this.hd = null;
		this.bd = null;
		this.ft = null;
		this.mask = null;
		this.btnMinimiz = null;
		this.btnResize = null;
		this.btnRefresh = null;
		this.loader = null;
		this.headerBtnGroup = null;
		this.zIndex = 0;
		this.hd_height= 0;
		this.ft_height= 0;
		this.isHide = null;
		this.isMin= false;
		this.loaded = false;
		this.error = '';
		this.borderWidth = 0;
		this.borderHeight = 0;
		this.btnGroupWidth = 0;
		this.bd_padding_w = 0;
		this.bd_padding_h = 0;

		var t = this, id, cls, dw = 0, dh = 0, vp, po, mdf, we, w, h_set=false, lpn_id, qm;
		var tmp_hd, tmp_bd;
		var showhd = showft = showicon = showrefresh = false;

		lpn_id = cfg.lpn_id || $("#"+t.id);
		if (lpn_id.size() > 0) {
			if ((tmp_hd = $(".hd", lpn_id)).size() > 0) cfg.title = tmp_hd.get(0);
			if ((tmp_bd = $(".bd", lpn_id)).size() > 0) cfg.content = tmp_bd.get(0);
		}
		if (cfg.content){
			if (typeof cfg.content == 'object'){				
				if ($(cfg.content).attr('tagName').toLowerCase() == 'iframe') {
					t.jqp_iframe = $(cfg.content);					
					t.jqp_iframe.attr('frameBorder', 0);
					t.jqp_iframe.css({border:0, width:'100%', height:'100%', overflowX:'hidden'});
					cfg.iframe = true;
					cfg.content = null;
				}
				else {
					id = $(cfg.content).attr('id');
					if (id) t.id = id;
					$(cfg.content).addClass("bd");
				}
			}
			if (cfg.content) cfg.url = '';
		}
		
		if (cfg.url) t.setUrl(cfg.url);
		else t.setContent(cfg.content);

		cls = 'lpn_panel lpn_panel_' + cfg.type;
		if (cfg.inline)cls += ' lpn_inline';
		if (cfg.type == 'alert' || cfg.type == 'confirm'){
			cfg.resizeable = false;
			cfg.minimizable = false;
		}
		if (cfg.moveable)cls += ' lpn_hd_move';
		cls += ' ' + t.styleClassName + ' ' + cfg.className;

		if (cfg.type == 'alert' || cfg.type == 'confirm' || cfg.type == 'loading') {
			if (cfg.type != 'loading') cfg.submitButton = true;
			showicon = true;
			this.height = '';
			if (cfg.type == 'confirm') cfg.cancelButton = true; 
		}
		if (cfg.type != 'alert' && cfg.type != 'confirm' && cfg.url) {
			if (cfg.refresh === true)showrefresh = true;
		}
		if (cfg.title || cfg.closeable || cfg.moveable || cfg.minimizable) showhd = true;
		if (cfg.submitButton || cfg.cancelButton || cfg.resizeable) showft = true;

		var str = '';
		if (cfg.mask){
			t.mask = $('<div class="lpn_mask"></div>');
		}
		t.panel = $('<div class="'+cls+'"></div>');
		t.panel.data('id', t.id);
		if (cfg.shadow && !cfg.inline){
			t.underlay = $('<div class="lpn_underlay"></div>');
			t.panel.append(t.underlay);
		}
		t.wrapper = $('<div id="'+t.id+'" class="lpn_wrapper"></div>');
		t.panel.append(t.wrapper);
		if (showhd) {
			t.hd = $('<div class="hd">窗口</div>');
			t.wrapper.append(t.hd);
		}
		t.canvas = $('<div class="lpn_canvas"></div>');
		t.wrapper.append(t.canvas);
		if (t.jqp_iframe) t.jqp_canvas.append(t.jqp_iframe);
		if (!(cfg.url && cfg.iframe)) {
			t.bd = $('<div class="bd"></div>');
			t.canvas.append(t.bd);
		}
		var lpn_button_group;
		if (showft){
			t.ft = $('<div class="ft"></div>');
			t.wrapper.append(t.ft);
			if (cfg.submitButton || cfg.cancelButton) {
				lpn_button_group = $('<div class="lpn_button_group"></div>');
				t.ft.append(lpn_button_group);
				lpn_button_group.append('<button type="button" class="lpn_submit">确定</button>');
				if (cfg.cancelButton){
					lpn_button_group.append('<button type="button" class="lpn_cancel">取消</button>');
				}
			}
			if (cfg.resizeable) {
				t.btnResize = $('<div class="lpn_resize_br"></div>');
				t.ft.append(t.btnResize);
			}
		}
		t.headerBtnGroup = $('<div class="lpn_ctrl_group"></div>');
		t.wrapper.append(t.headerBtnGroup);
		if (showicon){
			t.wrapper.append('<div class="lpn_icon"></div>');
		}	

		if (cfg.inline) {
			lpn_id.after(t.panel);
			if (t.mask){
				lpn_id.after(t.mask);
			}
			lpn_id.remove();
		}
		else {
			if (t.mask){
				$("body").append(t.mask);
			}
			$("body").append(t.panel);
			if (lpn_id && lpn_id.length > 0){
				lpn_id.remove();
			}
		}

		if (cfg.closeable) t.addHeaderButton($('<a class="lpn_close" href="#">'+(cfg.closeText||'&nbsp;')+'</a>'), t.close);
		
		if (cfg.minimizable) t.btnMinimiz = t.addHeaderButton($('<a class="lpn_minimiz lpn_minimiz_open" href="#">'+(cfg.minimizOpenText||'&nbsp;')+'</a>'), function(e){
			t.minimiz(e.target.className == 'lpn_minimiz lpn_minimiz_open' ? true : false);
		});
		
		if (showrefresh) t.btnRefresh = t.addHeaderButton($('<a class="lpn_refresh" href="#">'+(cfg.refreshText||'&nbsp;')+'</a>'), t.doRefresh);
		
		if (t.hd){
			t.hd_height = t.hd.height();
			t.setTitle(cfg.title);
		}
		if (t.ft){			
			t.ft_height = t.ft.outerHeight(true);
		}

		t.borderWidth = t.wrapper.outerWidth() - t.canvas.outerWidth();
		t.borderHeight = t.wrapper.outerHeight() - t.canvas.outerHeight() - t.hd_height - t.ft_height;

		if (typeof cfg.onInit == 'function') cfg.onInit.call(t);
		
		if (t.hd) t.panel.L_drag({
			handle:t.hd,
			useProxy:true,
			onStop:function(ret){ 
				if (typeof cfg.onDragStop == 'function') cfg.onDragStop.call(this, ret);
				else {
					t.moveBy(ret.left, ret.top);
					t.focus();
				}
			},
			onMove:function(ret){
				if (typeof cfg.onDragMove == 'function') cfg.onDragMove.call(this, ret);
			},
			inViewPort:cfg.mask,
			dragEnable:function(){ return cfg.moveable; }
		});
		if (t.btnResize) t.panel.L_resize({
			handle:t.btnResize,
			useProxy:true,
			onStop:function(ret){ t.resize(ret.width, ret.height);t.focus();},
			inViewPort:cfg.mask
		});

		if (lpn_button_group) {
			lpn_button_group.bind('click', function(e) {
				var className = e.target.className;
				if (className == 'lpn_submit'){
					t.close(0);
					if (typeof cfg.onSubmit == 'function')cfg.onSubmit.call(t);
				}
				else if (className == 'lpn_cancel') {
					t.close();
					if (typeof cfg.onCancel == 'function')cfg.onCancel.call(t);
				}
			});
		}

		t.panel.bind('mousedown', function(e) {
			t.focus();
		});
	};

	PanelElement.getStyleClassName = function (style)
	{
		return style ? 'lpn_panel_' + style : '';
	};

	PanelElement.getConfig = function(opt)
	{
		var cfg = {};
		cfg.type = opt.type || 'panel';
		cfg.content = opt.content || '';
		cfg.title = opt.title || '';
		cfg.url = opt.url && opt.url != '#' ? opt.url : '';
		cfg.inline = opt.inline || false;
		cfg.width = cfg.inline ? "100%" : (opt.width || 0);
		cfg.height = parseInt(opt.height || 0);
		cfg.left = parseInt(opt.left || 0);
		cfg.top = parseInt(opt.top || 0);
		cfg.minWidth = 100;
		cfg.minHeight = 20;
		cfg.mask = (opt.mask || cfg.type == 'alert' || cfg.type == 'confirm') ? true : false;
		cfg.moveable = opt.moveable != false ? true : false;
		cfg.resizeable = opt.resizeable != false ? true : false;
		cfg.closeable = opt.closeable != false ? true : false;
		cfg.minimizable = opt.minimizable != false ? true : false;
		cfg.shadow = opt.shadow != false ? true : false;
		cfg.showLoading = opt.showLoading != false ? true : false;
		cfg.iframeScrolling = opt.iframeScrolling != 'no' ? 'yes' : 'no';
		cfg.refresh = typeof(opt.refresh) == 'undefined' ? true : opt.refresh;
		cfg.el = opt.el || null;
		cfg.iframe = opt.iframe ? true : false;
		cfg.display = opt.display || 'normal'; //normal、minsize
		cfg.opennew = opt.opennew ? true : false;
		cfg.context = opt.context || [];
		cfg.className = opt.className || '';
		cfg.overClassName = opt.overClassName || '';
		cfg.lpn_id = opt.lpn_id || null;
		cfg.style = (opt.style || 'default') + '';
		cfg.closeSpeed = typeof(opt.closeSpeed) == 'undefined' ? null : opt.closeSpeed;
		var useText = cfg.style.indexOf('text') != -1 ? true : false;
		cfg.closeText = opt.closeText || (useText ? '关闭' : '');
		cfg.minimizOpenText = opt.minimizOpenText || (useText ? '收起' : '');
		cfg.minimizCloseText = opt.minimizCloseText || (useText ? '展开' : '');
		cfg.refreshText = opt.refreshText || (useText ? '刷新' : '');
		cfg.submitButton = opt.submitButton || false;
		cfg.cancelButton = opt.cancelButton || false;
		cfg.onInit = opt.onInit || null;
		cfg.onBeforeShow = opt.onBeforeShow || null;
		cfg.onLoad = opt.onLoad || null;
		cfg.onShow = opt.onShow || null;
		cfg.onFocus = opt.onFocus || null;
		cfg.onMinimiz = opt.onMinimiz || null;
		cfg.onSubmit = opt.onSubmit || null;
		cfg.onCancel = opt.onCancel || null;
		cfg.onClose = opt.onClose || null;
		cfg.onDragStop = opt.onDragStop || null;
		cfg.onDragMove = opt.onDragMove || null;
		return cfg;
	};

	PanelElement.prototype.addHeaderButton = function(a, callback)
	{
		var t=this, m=5;
		var btn = $(a);
		t.headerBtnGroup.css('width', 500);
		btn.bind('focus', function(){this.blur();});
		t.headerBtnGroup.append(btn);
		btn.css('marginLeft', m);
		t.btnGroupWidth += m + btn.outerWidth() + 10;
		t.headerBtnGroup.css('width', t.btnGroupWidth);
		if (typeof callback == 'function')btn.bind('click', function(e){callback.call(t, e);return false;});	
		return btn;
	};

	PanelElement.prototype.showMask = function()
	{
		if (this.mask) {
			if (typeof document.body.style.maxHeight === "undefined") {
				//$("body","html").css({height: "100%", width:"100%"});
			}

			this.mask.css({left:$(document).scrollLeft(), top:$(document).scrollTop(), width:3000, height:$(document).height()+500});
			$(document.body).addClass("lpn_masked");
			$('body').css({overflow:'hidden'});
			if (!isGecko){
				$('html').css({overflow:'hidden'});
			}
			this.mask.show();
		}
		return this;
	};

	PanelElement.prototype.hideMask = function()
	{
		if (this.mask) {
			this.mask.hide();

			if (typeof document.body.style.maxHeight === "undefined") {
				//$("body","html").css({height: "auto", width:"auto"});
			}

			$(document.body).removeClass("lpn_masked");
			if (!isGecko){
				$('html').css({overflow:''});
			}
			$('body').css({overflow:''});
		}
		return this;
	};

	PanelElement.prototype.setScroll = function(bool)
	{
		if (isChrome || !this.iframe) return false;
		if (bool) {
			this.iframe.attr("scrolling", "yes");
			if (this.iframeDocment) $("body", this.iframeDocment).attr("scroll", "yes");
		}
		else {
			this.iframe.attr("scrolling", "no");
			if (this.iframeDocment) $("body", this.iframeDocment).attr("scroll", "no");
		}
	};

	PanelElement.prototype.setTitle = function(title)
	{
		var t = this;
		title = title || t.config.title;
		if (typeof title == 'object') {
			t.hd.replaceWith(title);
			t.hd = $(title);
		}
		else if(typeof title == 'string' && title != '') {
			t.hd.html(title);
		}
		return this;
	};

	PanelElement.prototype.setUrl = function(url)
	{
		if (url) {
			var baseURL, qm;
			this._is_img = false;
			this.config.url = url;
			this.config.content = '';
			this.loaded = false;

			if((qm = this.config.url.indexOf("?")) !== -1) baseURL = this.config.url.substr(0, qm);
			else baseURL = this.config.url;
			if(/\.(jpg|jpeg|png|gif|bmp)$/i.test(baseURL)){
				this.config.content = '<img src="'+this.config.url+'" onload="L.Panel.getPanel(\''+this.id+'\').hideLoading().replaceCanvas()">';
				this.config.url = '';
				this._is_img = true;
			}

			if (this.isHide === false) this.loadContent();	
		}
		return this;
	};

	PanelElement.prototype.setContent = function(content)
	{
		if (content) {
			this._is_img = false;
			this.config.content = content;
			this.loaded = false;
			this.config.url = '';
			if (this.isHide === false) this.loadContent();
		}
		return this;
	};

	PanelElement.prototype.loadContent = function()
	{
		var t = this, canvas, bd_class;

		if (t.loaded) return this;
		t.loaded = true;

		if ((t.config.url == '' || t.config.url == '#') && !t.config.content && t.config.type != 'loading') {
			t.error = 'No content or URL ';
			alert(t.error);
			return this;
		}
		t.error = '';
		
		if (t.iframe){
			t.iframe.unbind();
			//t.iframe.attr("src", "javascript:false");
			//t.iframe.remove();
			//delete t.iframe, t.iframeDocment, t.iframeWindow;
		}
		else if (t.bd){
			if (t.config.width > 0 && !t.config.url) {
				if (typeof t.config.content == 'object') {
					t.bd.replaceWith(t.config.content);
					t.bd = $(t.config.content);
				}
				else if(typeof t.config.content == 'string') {
					t.bd.html(t.config.content);
				}
				return this;
			}
			
			t.bd_padding_w = parseInt(t.bd.css('padding-left')) + parseInt(t.bd.css('padding-right'));
			t.bd_padding_h = parseInt(t.bd.css('padding-top'))  + parseInt(t.bd.css('padding-bottom'));
			t.bd.removeClass('bd');
			bd_class = t.bd.attr('class');
			t.bd.remove();
			delete t.bd;
		}

		t.showLoading();

		if (t.config.url && t.config.iframe){
			if (!t.config.width) t.config.width = 320;
			if (!t.config.height) t.config.height = 240;
			if (!t.jqp_iframe) {
				t.canvas.html('<iframe id="'+t.id+'_ifr" name="'+t.id+'_ifr" frameBorder="0" scrolling="'+t.config.iframeScrolling+'" style="border:0px;width:100%;height:100%;overflow-x:hidden;"></iframe>');
				t.iframe = $("#"+t.id+ '_ifr');
			}
			t.iframe.css({visibility:'hidden'});
			t.iframe.load(function(){
				t.iframe.css({visibility:'visible'});
				try{
					t.iframe.contents().find("head").append('<style type="text/css">html{overflow-x:hidden;overflow-y:auto;}*html body{min-width:auto;max-width:auto;width:auto;position:absolute;}</style>');
					t.iframeDocment = t.iframe.get(0).contentDocument||t.iframe.get(0).contentWindow.document;
					$(t.iframeDocment).mousedown(function() { t.focus(); });
					t.iframe.get(0).contentWindow.currentPanel = t;
					t.iframeWindow = t.iframe.get(0).contentWindow;
				}
				catch(e){}
				t.hideLoading();
				if (t.config.type != 'alert' && t.config.type != 'confirm' && typeof t.config.onLoad == 'function')t.config.onLoad.call(t);
			});

			t.iframe.attr("src",t.getUrl());
		}
		else {
			t._canvas = $('<div class="'+t.styleClassName+' lpn_tmp_canvas '+t.config.className+'"></div>');
			$("body").append(t._canvas);
			
			t.bd = $('<div class="bd'+(bd_class ? ' '+bd_class : '')+'"></div>');
			t._canvas.append(t.bd);

			if (t.config.url){
				if (!t.config.width) t.config.width = 320;
				t.bd.load(t.getUrl(), null, function(){  t.hideLoading().replaceCanvas(); });
			}
			else {
				if (typeof t.config.content == 'object') {
					t.bd.replaceWith(t.config.content);
					t.bd = $(t.config.content);
				}
				else if(typeof t.config.content == 'string') {
					t.bd.html(t.config.content);
				}

				if (!t._is_img) t.replaceCanvas();
			}
		}
		return this;
	};

	PanelElement.prototype.replaceCanvas = function()
	{
		if (!this.config.inline) {
			if (this.config.width) {
				this._canvas.css('width', this.config.width);
				this._h = this._canvas.outerHeight() + this.bd_padding_h;
				this._canvas.css('width', '100%');
			}
			else {
				this._w = this._canvas.outerWidth() + this.bd_padding_w + this.borderWidth;
				this._h = this._canvas.height() + this.bd_padding_h;
				if (this.config.type == 'tooltip' && this._w > 350) {
					this._w = 350;
				}
			}
		}
		
		this._canvas.removeClass('lpn_tmp_canvas');
		this._canvas.removeClass(this.styleClassName);
		if (this.config.className) this._canvas.removeClass(this.config.className);
		this._canvas.addClass('lpn_canvas');
		this.canvas.replaceWith(this._canvas);
		this.canvas = this._canvas;
		this._canvas = null;
		this.resize().setPlace();
		return this;
	};

	PanelElement.prototype.show = function()
	{
		if (this.error)return this;
		
		if (this.isHide === false) return this.focus();

		if (this.config.type != 'alert' && this.config.type != 'confirm' && typeof this.config.onBeforeShow == 'function'){
			this.config.onBeforeShow.call(this);
		}
		
		this.panel.show();
		this.isHide = false;
		if (this.config.display == 'normal') {
			if (this.config.opennew && this.config.url) this.loaded = false;
			this.showMask().loadContent().resize();
		}
		else this.minimiz(true);
		this.setPlace().focus();

		if (this.config.type != 'alert' && this.config.type != 'confirm'){
			if (this.config.display == 'normal' && typeof this.config.onShow == 'function') {
				this.config.onShow.call(this);
			}
			else if (typeof this.config.onShowMinimiz == 'function') {
				this.config.onShowMinimiz.call(this);
			}
		}
		
		return this;
	};

	PanelElement.prototype.minimiz = function (bool)
	{
		if (this.error)return this;

		if (bool){
			this.btnMinimiz.removeClass("lpn_minimiz_open");
			this.btnMinimiz.addClass("lpn_minimiz_close");
			this.btnMinimiz.html(this.config.minimizCloseText || '');
			this.canvas.hide();
			if (this.ft)this.ft.hide();
			this.isMin = true;
		}
		else {
			this.loadContent();
			this.btnMinimiz.removeClass("lpn_minimiz_close");
			this.btnMinimiz.addClass("lpn_minimiz_open");
			this.btnMinimiz.html(this.config.minimizOpenText || '');
			this.canvas.show();
			if (this.ft)this.ft.show();
			this.isMin = false;
			this.config.display = 'normal';
		}
		this.setUnderlaySize();

		if (this.config.type != 'alert' && this.config.type != 'confirm' && typeof this.config.onMinimiz == 'function')this.config.onMinimiz.call(this, bool);

		return this;
	};

	PanelElement.prototype.focus = function()
	{
		if (this.error)return this;
		$('.lpn_submit', this.panel).focus();
		L.Panel.currId = this.id;

		if (!this.config.inline){
			if (this.mask)this.mask.css('z-index', L.Panel.zIndex++);
			this.panel.css('z-index', L.Panel.zIndex++);
			//this.lpn_wrapper.css('z-index', L.Panel.zIndex++);
			this.zIndex = L.Panel.zIndex;
		}

		if (this.config.type != 'alert' && this.config.type != 'confirm' && typeof this.config.onFocus == 'function')this.config.onFocus.call(this);

		return this;
	};

	PanelElement.prototype.close = function(seconds)
	{
		if (this.error || this.isHide)return this;
		var t = this, d = window.document, ix = 0, p;	
		
		function hide(){
			t.hideMask();
			if(t.config.el && t.config.overClassName)t.config.el.removeClass(t.config.overClassName);
			t.isHide = true;
			if (typeof t.config.onClose == 'function')t.config.onClose.call(t);

            if (t.config.openNew && t.config.url){
                if (t.iframe){
                    t.iframe.unbind();
                    $("body", this.iframeDocment).html('');
                    t.iframe.attr("src", "javascript:false");
                    t.iframe.remove();
                    delete t.iframe, t.iframeDocment, t.iframeWindow;
                }
                else {
                    t.bd.html('');
                }
            }
		}

		seconds = (!isNaN(seconds)) ? parseInt(seconds) : (!isNaN(this.config.closeSpeed) ? parseInt(this.config.closeSpeed) : 'fast');

		if (seconds == 'fast') {
			t.panel.fadeOut("fast", hide);
		}
		else if (seconds == 0) {
			t.panel.hide();
			hide();
		}
		else {
			setTimeout(function(){t.panel.fadeOut("fast", hide);}, seconds * 1000);
		}

		return this;
	};

	PanelElement.prototype.showLoading = function()
	{
		if (this.error)return this;
		if (this.config.url || this._is_img){
			if (!this.loader) {
				this.wrapper.append('<div class="lpn_load">&nbsp;</div>');
				this.loader = $(".lpn_load", this.panel);
			}
			this.loader.show();
		}
		return this;
	}

	PanelElement.prototype.hideLoading = function()
	{
		if (this.error)return this;
		if (this.loader) this.loader.hide();
		return this;
	}

	PanelElement.prototype.doRefresh = function()
	{
		if (this.error)return this;
		if (this.isMin == true || !this.config.url) return this;
		
		if (this.iframe) {
			if (this.iframeDocment) {
				try{
					this.iframeDocment.location.reload();
					this.showLoading();
				}
				catch(e){}
			}
		}
		else {
			this.showLoading();
			var t = this;
			this.bd.load(this.getUrl(), function(){  t.hideLoading(); });
		}

		return this;
	};

	PanelElement.prototype.moveBy = function(left, top)
	{
		if (this.error)return this;
		var t = this, moveTo;

		t.panel.css({left:left, top:top});

		return this;
	};

	PanelElement.prototype.setUnderlaySize = function()
	{
		if (this.error)return this;
		if (this.underlay) {
			var h = -(parseInt(this.underlay.css('marginTop') || 0) + parseInt(this.underlay.css('marginBottom') || 0));
			var w = -(parseInt(this.underlay.css('marginLeft') || 0) + parseInt(this.underlay.css('marginRight') || 0));
			this.underlay.css({"width":this.wrapper.outerWidth(true)+w, "height":this.wrapper.outerHeight(true)+h});
		}
	};

	PanelElement.prototype.resizeBody = function(dw, dh)
	{
		return this.resize(dw, dh, true);
	};

	PanelElement.prototype.resize = function(dw, dh, isBody)
	{
		if (this.error)return this;
		if (this.config.inline) dw = "100%";
		if (dw != undefined) this.config.width = dw;
		if (dh != undefined) this.config.height = dh;
		if (dw === '' || dw === 0) this._w = 0;
		if (dh === '' || dh === 0) this._h = 0;

		var w, h, vp = L.Dom.getViewPort();
		w = this.config.width > 0 ? this.config.width : this._w;
		if (!this.config.inline){
			if (isBody) {
				w += this.borderWidth;
				if (this.config.url && this.config.iframe && this.config.iframeScrolling == 'yes') {
					w += L.Dom.getScrollBarWidth();
				}
			}
			if (w > vp.w - 30) w = vp.w - 30;
			if (w < this.config.minWidth) w = this.config.minWidth;
		}
		this.panel.css("width", w);

		if (isBody) {
			h = this.config.height > 0 ? this.config.height : this._h;
		}
		else {
			h = this.config.height > 0 ? this.config.height-this.hd_height-this.ft_height-this.borderHeight : this._h;
		}
		if (h > 0) {
			if (h > vp.h - 60) this.canvas.css("height", vp.h - 60);
			else if (h < this.config.minHeight) this.canvas.css("height", this.config.minHeight);
			else if (this.config.height > 0) this.canvas.css("height", h);
		}

		this.setUnderlaySize();

		return this;
	};

	PanelElement.prototype.setPlace = function()
	{
		if (this.error)return this;
		if (this.config.type == 'dropdown' || this.config.type == 'context' || this.config.type == 'tooltip' || (this.config.context && this.config.context[0])) {
			var opt_xy={};
			if (this.config.context && this.config.context[0]) opt_xy = L.Dom.getContextXY(this.panel, this.config.context[0], this.config.context[1]);
			else if (this.config.left && this.config.top) opt_xy = L.Dom.getContextXY(this.panel, null, null, {x:this.config.left, y:this.config.top});
			if (opt_xy.x && opt_xy.y){
				this.panel.css({top:opt_xy.y, left:opt_xy.x});
			}
		}
		else if (this.config.inline){
			this.panel.css({top:0, left:0, marginLeft:0, marginTop:0});
		}
		else {
			var marginLeft = this.config.left ? 0 : -Math.round(this.panel.width() / 2.0)+$(document).scrollLeft();
			var marginTop  = this.config.top ? 0  : -Math.round(this.panel.height() / 2.0)+$(document).scrollTop();
			this.panel.css({top:this.config.top||'50%', left:this.config.left||'50%', marginLeft:marginLeft, marginTop:marginTop});
		}

		return this;
	};

	PanelElement.prototype.useIframe = function(bool)
	{
		this.config.iframe = bool ? true : false;
		return this;
	};

	PanelElement.prototype.setStyle = function(style)
	{
		if (this.panel) {
			if (this.styleClassName) {
				this.panel.removeClass(this.styleClassName);
			}
			if(style) {
				this.styleClassName = PanelElement.getStyleClassName(style);
				this.panel.addClass(this.styleClassName);
			}
			this.setUnderlaySize();
		}		
		return this;
	};

	PanelElement.prototype.getUrl = function()
	{
		if (this.config.url){
			return this.config.url + (this.config.url.indexOf('?') == -1 ? '?' : '&') + '&random=' + (new Date().getTime()+Math.random());
		}
		return '';
	};

	function getParams(obj, params, type)
	{
		var opt = {}, title, url, rel, rels, className;
		obj = $(obj);
		if (title = obj.attr("title")) opt.title = title;
		if (url = obj.attr("href")) opt.url = url;
		if (type == 'module' && (className = obj.attr("class"))) opt.className = className;
		var rel = obj.attr("rel");
		if (rel){
			rels = rel.split(/&amp;|&/);
			$.each(rels, function(k,v){
				vs = v.split("=");
				if (!/^([\d\.+\-]+|true|false|null|undefined)$/i.test(vs[1])) vs[1] = '"'+vs[1]+'"';
				if (vs[0]) eval("opt."+vs[0]+"="+vs[1]);
			});
		}
		if (params) opt = $.extend(opt, params);
		return opt;
	}

	$.fn.extend({
		L_panel: function(opt) {
			return this.each(function() {
				var param = getParams(this, opt);
				$(this).click(function(){ L.Panel.panel(param); this.blur(); return false; });
			});
		},
		L_module: function(opt) {
			return this.each(function() {
				var param = getParams(this, opt, 'module');
				var id = $(this).attr('id');
				param.id = id;
				param.lpn_id = $(this);
				L.Panel.module(param);
			});
		},
		L_dropdown: function(opt, ifDropDownHandler) {
			return this.each(function() {
				var param = getParams(this, opt);
				L.Panel.dropdown(this, param, ifDropDownHandler);
			});
		},
		L_tooltip: function(width) {
			return this.each(function() {
				L.Panel.tooltip(this, width);
			});
		},
		L_context: function(opt, ifContextHandler) {
			return this.each(function() {
				var param = getParams(this, opt);
				L.Panel.context(this, param, ifContextHandler);
			});
		}
	});

	$(document.body).keydown(function(event){
		if(event.which == 27){
			L.Panel.closePanel();
		}
	});

	//调试
	(function() {
		var debugPanel;
		var debubText = ' ';
		var debugCanvas;
		L.debug = function(txt)
		{
			if (!debugPanel) {
				debugPanel = L.Panel.panel({left:1, top:1, width:300, height:160, content:debubText, title:'调试信息', moveable:false});
				debugCanvas = debugPanel.canvas.get(0);
				L.Layout.setFixed(debugPanel.panel, 'top', 'right', 0, debugPanel.panel.outerWidth()+5, debugPanel.panel.outerHeight()+5);
				var fixedEl = debugPanel.panel.data('fixedElement');
				debugPanel.config.onBeforeShow = function(){ fixedEl.show(); };
				debugPanel.config.onClose = function(){ fixedEl.hide(); };
			}
			debubText += txt + '<br />';
			debugPanel.show();
			debugPanel.setContent(debubText);
			debugCanvas.scrollTop=debugCanvas.scrollHeight;
		}
	})();

	//将内容向上滚动插件
	$.fn.L_top_scroll = function(height, speed){
		if (isNaN(height)) return ;
		if (!speed) speed = 30;
		return this.each(function(){
			var mov = $(this), chren = mov.children(), movHeight;
			if (height > mov.height()) return;
			mov.css({position:'relative', overflow:'hidden', height:height});
			var mov1 = $('<div style="display:block;margin:0;padding:0;border:0;"></div>');
			mov1.append(chren);
			mov.append(mov1);
			movHeight = mov1.height();
			if (movHeight < height) return;
			var mov2 = mov1.clone(true);
			mov.append(mov2);
			var movEl = mov.get(0);
			
			function move(){
				movEl.scrollTop++;
				if(movHeight-movEl.scrollTop<=0) movEl.scrollTop=0;
			}

			var MyMov=setInterval(move, speed);
			mov.bind('mouseover', function() {clearInterval(MyMov)});
			mov.bind('mouseout', function() {MyMov=setInterval(move, speed);});
		});
	};

	//将内容向左滚动插件
	$.fn.L_left_scroll = function(speed){
		if (!speed) speed = 30;
		return this.each(function(k,v){
			var container = $(this), chren = container.children(), width=0, mov2;

			var mov = $('<div style="margin:0;padding:0;border:0;position:relative;overflow:hidden;"></div>');
			container.append(mov);

			var mov1 = $('<div style="display:block;margin:0;padding:0;border:0;position:absolute;top:0;"></div>');
			mov.append(mov1);
			for (var i=0; i<chren.size(); i++) {
				var c = $('<div style="float:left;margin:0;padding:0;border:0;"></div>');
				c.append(chren[i]);
				mov1.append(c);
				width += c.width();
			}	
			mov1.css({width:width, left:0});
			mov.css({height:mov1.height()});

			var movEl = mov.get(0);

			function move(){
				if (mov.width() > width) {
					if (mov2) {
						mov2.remove();
						mov2 = null;
					}
					movEl.scrollLeft=0;
					return ;
				}
				if (!mov2) {
					mov2 = mov1.clone(true);
					mov.append(mov2);
					mov2.css({left:width});
				}
				movEl.scrollLeft++;
				if(width-movEl.scrollLeft<=0) movEl.scrollLeft=0;
			}

			var MyMov=setInterval(move, speed);
			mov.bind('mouseover', function() {clearInterval(MyMov)});
			mov.bind('mouseout', function() {MyMov=setInterval(move, speed);});
		});
	};

})();
