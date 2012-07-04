var Bang = Bang || {};

Bang.isEdit = false;

function setFeedbackValidator()
{
	$.validator("description")
	.setTipSpanId("tip_span_description")
	.setDefaultMsg("请输入留言内容")
	.setFocusMsg("请输入留言内容")
	.setRequired("请输入留言内容")
	.setMaxLength(800, "留言内容不能多于800个字");

	$.validator("contact")
	.setTipSpanId("tip_span_contact")
	.setDefaultMsg("请输入联系方式")
	.setFocusMsg("请输入联系方式")
	.setRequired("请输入联系方式")
	.setMaxLength(50, "联系方式不能多于50个字");

	$.validator("checkcode")
	.setTipSpanId("tip_span_checkcode")
	.setRequired("请输入验证码")
	.setAjax("/ajax/check_code.php", "验证码输入不正确")
	.setDefaultMsg("请输入验证码")
	.setFocusMsg("请输入验证码");

	$.validator.addFormCallback('feedback_form', function(){
		$('#feedback_submit_btn').html('<span style="color:red;font-size:14px;">正在提交···</span>');
		return true;
	});
};

function addFavorite(sURL, sTitle)
{
    var pgUrl = window.location.href;
    var pgTitle = document.title;
    if (window.sidebar) {
    	window.sidebar.addPanel(pgTitle, pgUrl,"");
    }else if( document.all ) {
    	window.external.AddFavorite( pgUrl, pgTitle);
    } else if( window.opera && window.print ) {
    	var elem = document.createElement('a');elem.setAttribute('href',pgUrl);elem.setAttribute('title',pgTitle);elem.setAttribute('rel','sidebar');elem.click();
    }
} 

function setHome(obj){
	var url=window.location.href;
	try{
		obj.style.behavior='url(#default#homepage)';
		obj.setHomePage(url);
	}
	catch(e){
		if(window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			}
			catch (e) {
				alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage',url);
		}
	}
}


Bang.CHANEL_TYPE_INDEX               = 1;
Bang.CHANEL_TYPE_DESCRIPTION         = 2;
Bang.CHANEL_TYPE_NEWS                = 3;
Bang.CHANEL_TYPE_PHOTO               = 4;
Bang.CHANEL_TYPE_PRODUCT             = 5;
Bang.CHANEL_TYPE_FEEDBACK            = 6;
Bang.CHANEL_TYPE_POST                = 7;
Bang.CHANEL_TYPE_HONOR               = 8;
Bang.CHANEL_TYPE_RICH_TEXT           = 9;
Bang.CHANEL_TYPE_URL                 = 10;

Bang.BLOCK_TYPE_NEWS_CATEGORY          = 10;
Bang.BLOCK_TYPE_NEWS_LIST              = 11;
Bang.BLOCK_TYPE_NEWS_NEW               = 12;
Bang.BLOCK_TYPE_NEWS_RECOMMEND         = 13;
Bang.BLOCK_TYPE_NEWS_DETAIL            = 14;
Bang.BLOCK_TYPE_PHOTO_CATEGORY         = 20;
Bang.BLOCK_TYPE_PHOTO_NEW              = 21;
Bang.BLOCK_TYPE_PHOTO_RECOMMEND        = 22;
Bang.BLOCK_TYPE_PHOTO_LIST             = 23;
Bang.BLOCK_TYPE_PHOTO_DETAIL           = 24;
Bang.BLOCK_TYPE_PRODUCT_CATEGORY       = 30;
Bang.BLOCK_TYPE_PRODUCT_NEW            = 31;
Bang.BLOCK_TYPE_PRODUCT_RECOMMEND      = 32;
Bang.BLOCK_TYPE_PRODUCT_LIST           = 33;
Bang.BLOCK_TYPE_PRODUCT_DETAIL         = 34;
Bang.BLOCK_TYPE_HONOR_CATEGORY         = 40;
Bang.BLOCK_TYPE_HONOR_LIST             = 41;
Bang.BLOCK_TYPE_HONOR_DETAIL           = 42;
Bang.BLOCK_TYPE_HONOR_NEW              = 43;
Bang.BLOCK_TYPE_HONOR_RECOMMEND        = 44;
Bang.BLOCK_TYPE_POST_LIST              = 51;
Bang.BLOCK_TYPE_POST_NEW               = 52;
Bang.BLOCK_TYPE_DESCRIPTION            = 60;
Bang.BLOCK_TYPE_CONTACT                = 70;
Bang.BLOCK_TYPE_FRIEND_LINKS           = 80;
Bang.BLOCK_TYPE_SEARCH                 = 90;
Bang.BLOCK_TYPE_MAP                    = 100;
Bang.BLOCK_TYPE_FEEDBACK               = 110;
Bang.BLOCK_TYPE_RICH_TEXT              = 120;



Bang.resetCheckcode = function()
{
    var img = document.getElementById('img_checkcode');
    if (img != null) {
        img.src = '/common/checkcode.php?nocache=' + (new Date() * 1);
		if ($('input[name="checkcode"]').size()>0 && $.validator){
			$.validator('checkcode').setValid(false);
		}
    }
    return false;
};

Bang.showIm = function()
{
    if($("body").css('background-image')){
         var backImage =  $("body").css('background-image');
    }else{
        var backImage = '';
    }
	//显示即时通讯
	var divIm = $('#div_im'), divImMin = $('#div_im_min');
	if (divIm.size() > 0) {
		divIm.L_top_left_fixed(100);
		divImMin.L_top_left_fixed(100);
		var fixedIm = divIm.data('fixedElement');
		var fixedImMin = divImMin.data('fixedElement');
		var im_min = L.Cookie.get('bang_im_min');
		if (im_min) {
			fixedImMin.show();
			fixedIm.hide();
		}
		else {
			fixedImMin.hide();
			fixedIm.show();
		}
		$('.btn_im', divIm).bind('click', function(){			
			fixedImMin.show();
			fixedIm.hide();
			L.Cookie.set('bang_im_min', 1, 3600*20, '/', '.ganji.com');
			return false;
		});
		$('.btn_im', divImMin).bind('click', function(){			
			fixedImMin.hide();
			fixedIm.show();
			L.Cookie.remove('bang_im_min', '/', '.ganji.com');
			return false;
		});
        $("body").css('background-image', backImage);
	}
}

Bang.getOpenIframeConfig = function(params)
{
	params = params || {};
	return $.extend(params, { width:200, height:150,  iframe:true, minimizable:false, opennew:true, mask:true, style:'text' });
}

Bang.init = function (blockInfo)
{
	if ($('.block_type_'+Bang.BLOCK_TYPE_FEEDBACK).size() > 0) {
		setFeedbackValidator();
	}

	$('.scroll_type_1').L_left_scroll();

	$('.scroll_type_2').L_top_scroll(150);


	Bang.showIm();

	$('#down_mobile').L_panel(Bang.getOpenIframeConfig());
};

