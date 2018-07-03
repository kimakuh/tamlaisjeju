function gnb(param,obj,btn,wrap,mbtn,elem,dur,meth){
	var wrap = $(wrap);
	var param = $(param);
	var obj = param.find(obj); 
	var btn = param.find(btn);
	var mbtn = $(mbtn);
	var w,h;
	var new_h = 260;
	var old_h = 55;
	var moresize = 0;
	var elem = elem-1;
	var n = elem;
	var data = false;
	var mmt;
	var ww = 234;
	var th1 = obj.find(">li"); // 1depth
	var th2 = th1.find(">ul"); // 2depth
	var th2_btn = th1.find(">a");
	var th3 = th2.find(">li"); // 2depth child


	w = $(window).width();
	h = $(window).height();

	$.each(obj,function(c){
		$(this).addClass("thmbox_"+(c+1));
		$(this).parent().addClass("ln_gnb"+(c+1));
	});

	th2_btn.addClass("th2_btn");
	obj.find("li:last-child").addClass("last");

	function _setting(){
		$("#shadow").hide();
		if(w <= 1024) wrap.hide(); else if (w > 1024) wrap.show();
		if(w <= 1024) obj.css({"height":"auto"}); else if (w > 1024) obj.css({"height":new_h});
		if(w <= 1024)$('#tnb').prepend($('#global').detach());else if(w > 1024)$('#top_head .wrapper').append($('#global').detach());
		if(w < 1024) _treemenu();
		if(w > 1024) $("#mwrap").css({"overflow-x":"hidden"});else if (w <= 1024) $("#mwrap").removeAttr("style");

		//if(w <= 1024) $(".submenu_3th").hide(); else if (w > 1024) $(".submenu_3th").show();
		mbtn.removeAttr("style");
		param.find(".mtt").hide();


		for(i=0;i<th1.size();i++){
			var nm_cnt = th1.eq(i).find("ul>li");
			for(j=0;j<nm_cnt.size();j++){
				th1.eq(i).find(">ul>li:eq("+j+")").addClass("toy_"+j);
			}
		}
	}
	$(document).ready(function(){
		$(window).resize(function(event){
			w = $(window).width();
			h = $(window).height();
			_setting(); 
			$("html,body,#mwrap,#swrap").removeAttr("style");
			wrap.removeAttr("style");
			param.removeAttr("style");
			if(w <= 1024)$('#tnb').prepend($('#global').detach());else if(w > 1024)$('#top_head .wrapper').append($('#global').detach());
			event.stopPropagation();
		});
	});

	function _current(s){
		btn.not(s).removeClass("current").eq(s).addClass("current");
		obj.removeClass("list_ov");
		obj.eq(s).addClass("list_ov");
		//btn.not(s).next('.submenu').removeClass("list_ov");
		//btn.eq(s).next('.submenu').addClass("list_ov");
	}
	//모바일
	function _open(){
		if(w > 1024) return false;
		mbtn.hide();
		wrap.height(h);
		wrap.show();
		$("#shadow").show().stop(true,true).animate({"opacity":"0.65"},dur/2,meth);
		$("html,body").css({"overflow":"hidden","height":h});
		$("#swrap,#mwrap").height(h);
		$("#swrap,#mwrap").stop(true,false).animate({right:ww},{duration:600,easing:"easeOutExpo"});

		param.stop(true,true).animate({opacity:1,scrollTop:btn.eq(elem).offset().top},dur,meth);
		data = true;
	
	}
	function _close(){
		if(w > 1024) return false;
		mbtn.show();
		wrap.hide();
		$("#swrap,#mwrap").stop(true,false).animate({right:0},{duration:600,easing:"easeOutExpo"});
		if(n != elem){
			btn.not(elem).removeClass("ov").next().stop(true,true).delay(300).slideUp(150);
			btn.eq(elem).addClass("ov").next().stop(true,true).slideDown(300);
		}
		$("#shadow").hide().stop(true,true).fadeOut(dur/2,function(){
			$("html,body,#mwrap,#swrap").removeAttr("style");
		});
		param.stop(true,true).delay(dur).animate({opacity:0,scrollTop:0},0,meth);
		data = false;

	}

	//pc및 태블릿
	function _on(){
		if(w <= 1024) return false;
		obj.hide();
		obj.eq(elem).show().stop(true,false).animate({"height":new_h-old_h},dur,meth);
		param.find(".mtt").not(elem).hide().eq(elem).show().stop(true,false).animate({"opacity":"1"},dur,meth);
		wrap.stop(true,false).animate({"height":new_h},dur,meth);
		$("#shadow").hide();
	}
	function _out(){
		if(w <= 1024) return false;
		obj.hide().stop(true,false).animate({"height":0},dur,meth);
		param.find(".mtt").hide().stop(true,false).animate({"opacity":"0"},dur,meth);
		wrap.stop(true,false).animate({"height":old_h},dur,meth);
		$("#shadow").hide();
	}

	mbtn.unbind().bind("click touchend",function(event){
		if(w > 1024) return false;
		if(data == false) $("#header_group").queue(_open).dequeue(); else $("#header_group").queue(_close).dequeue();
		event.preventDefault();
		event.stopPropagation();
	});

	$("#shadow").unbind().bind("click touchmove",function(event){
		$("#header_group").queue(_close).dequeue();
		event.preventDefault();
		event.stopPropagation();
	});
	
	// 전체 2th 버튼
	$("#tnb").find("a").bind("click",function(event){
		if($("#tm:animated").size()) return false;
		event.stopPropagation();
	})

	btn.bind("mouseenter focusin",function(event){
		elem = $(this).parent().index();
		switch(elem){
			case 0: new_h = 110; break;
			case 1: new_h = 110; break;
			case 2: new_h = 110; break;
			case 3: new_h = 110; break;
			case 4: new_h = 110; break;
			case 5: new_h = 55; break;
			//case 6: new_h = 110; break;
			//case 7: new_h = 110; break;
			default: "not yet";
		}
		_on();
		_current($(this).parent().index());
		btn.removeClass("current");
		event.preventDefault();
	});
	
	wrap.bind("mouseleave",function(){
		_out();
		_current(n);
		btn.removeClass("current");
	});
	obj.last().find(">li>a").last().bind("focusout",function(){
		_out();
		_current(n);
		btn.removeClass("current");
	});
	_current(n);

	if (w > 1024) btn.removeClass("current");
	function _treemenu(){
		if(w > 1024) return false;
		btn.next('.submenu').hide();
		btn.not(elem).next('.submenu').hide().eq(elem).show().prev().addClass("current");
		btn.bind("click",function(event){
			n = $(this).parent().index();
			if($(this).next().css("display") == "none"){
				btn.not(n).removeClass("current").next('.submenu').stop(true,true).slideUp(300);
				btn.eq(n).addClass("current").next('.submenu').stop(true,true).slideDown(300);
			}
			event.preventDefault();
			event.stopPropagation();
		});
	}

	_setting();
	if (w > 1024) _treemenu();

}



// 占쏙옙占쏙옙占�
function gnb_open(param,obj,btn,index1,index2,index3,dur,meth,mno){
	var param = $(param);
	var obj = $(obj);
	var btn = $(btn);
	var index1 = index1-1;
	var index2 = index2;
	var index3 = index3;
	var n = index1;
	var w = 224;
	var data = false;
	var str = location.href;
	var notbad = false;

	if(str.match("sitemap")){
		notbad = true;
	}

	param.find(".th2").hide();

	var _open = function(){
		obj.css({'overflow':'visible'}).animate({left:w},dur,meth);
		$("#shadow_device").stop(true,true).fadeIn(dur/2);
		$("html,body").css({"overflow":"hidden","height":$(window).height()});
		param.show().stop().animate({"opacity":"1"},dur,meth);
		param.css({height:$(window).height()});
		param.find(".th3").hide();
		
		param.stop(true,true).delay(dur/2).animate({scrollTop:0},dur,meth);
	
		if(mno != "" && notbad != true){
			var tobj = param.find(".ln_1th").eq(index1).next().find(">li").eq(index2).find(".th3");
			if(tobj.is($(".th3"))){
				tobj.find("a").eq(index3).addClass("ov");
				param.stop(true,true).delay(dur).animate({scrollTop:tobj.parent().offset().top},dur,meth,function(){
					tobj.slideDown(150);
				});
			}
		}

		
		data = true;


		

	};

	var _close = function(){
			param.hide().stop().animate({"opacity":"0"},dur,meth);
		obj.stop(true,true).animate({left:0},dur,meth,function(){
			if(mno != "" && notbad != true){
				param.find(".ln_1th").not(n).removeClass("ov").eq(n).addClass("ov").next().show();
			}else{
				param.find(".ln_1th").removeClass("ov").next().hide();
			}
		});

		$("#shadow_device").stop(true,true).fadeOut(dur/2,function(){
			$("html,body").removeAttr("style");
			obj.removeAttr("style");
			data = false;
		});

		//param.stop(true,true).delay(dur).animate({opacity:0,scrollTop:0},0,meth);

	};

	btn.unbind().bind("click touchmove",function(event){
		//alert('aa');
		//$("html").animate({scrollTop:0},0,meth);
		 $("#header_group").queue(_open).dequeue();
		 
		event.preventDefault();
	//	event.stopPropagation();

		
		/*
		if(data == false) obj.queue(_open).dequeue(); else obj.queue(_close).dequeue();
		$(window).resize(function(){
			$("#shadow_device").click();
		});
		event.preventDefault();
		*/
		//event.stopPropagation();
	});
	
	$("#shadow_device").unbind().bind("click touchmove",function(event){
		$("#header_group").queue(_close).dequeue();
		event.preventDefault();
		event.stopPropagation();
	});


	param.find("a").bind("click",function(event){
		if($("#topmenu:animated").size()){ return false; }
		event.stopPropagation();
		
	});

	

	if(mno != "" && notbad != true){ 
		param.find(".ln_1th").not(index1).next().hide().eq(index1).show().prev().addClass("ov");
	}

	param.find(".ln_1th").bind("click",function(event){
		n = $(this).parent().index();
		if($(this).next().css("display") == "none"){
			param.find(".ln_1th").not(n).removeClass("ov").next().stop(true,true).delay(150).slideUp(150);
			param.find(".ln_1th").eq(n).addClass("ov").next().stop(true,true).slideDown(150);
		}
		event.preventDefault();
		event.stopPropagation();
	});

	param.find(".th2>li>a").bind("click",function(event){
		if($(this).next().attr("class") == "th3"){
			if($(this).next().css("display") != "block"){
				$(this).next().slideDown(150);
			}else{
				$(this).next().slideUp(150);
			}
			event.preventDefault();	
			event.stopPropagation();
		}
	});


}

$(document).ready(function(){
	var param = $("#mobile_languege");
	var obj = param.find(".obj");
	var btn = param.find(".btn");

	btn.bind("click",function(event){
		if($("#topmenu:animated").size()){ return false; }

		if(obj.css("display") == "none"){
			obj.stop(true,true).slideDown(300);
		}else{
			obj.stop(true,true).slideUp(300);
		}

		event.preventDefault();
		event.stopPropagation();
	});
});