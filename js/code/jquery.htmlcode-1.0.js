// jquery.html.js by zhangxinxu welcome to visit mu personal website http://www.zhangxinxu.com/
// 2010-04-21 v1.0
// 高亮显示某一段HTML，主要用在观察HTML的动态变化
(function($){
	$.fn.htmlcode = function(o,options){
		var that = $(this);
		options = options || {};
		var defaults = {
			css: {},
			indent: false,
			type: "html"
		};
		var settings = $.extend({}, defaults, options);
		if(!o || typeof(o) !== "object"){
			$('<div id="autoCreateHtmlBox"><div>').appendTo("body");
			o = $("#autoCreateHtmlBox");
		}
		//获取HTML内容
		var str = that.html();
		var s_re = /[&<>]/g, s_re_val = {"&":"&amp;","<":"&lt;",">":"&gt;"};
		str = str.replace(s_re, function(c){return s_re_val[c];});
		if(settings.indent){
			str = str.replace(/ /g,"&nbsp;").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
		}else{
			str = str.replace(/    /g,"&nbsp;").replace(/\t/g,"&nbsp;");
		}
		//替换换行符
		str = str.replace(/[\n]/g,"<br />");
		//给引号内容添加颜色
		str = str.replace(/"(.|\s)*?"/g,function(s){
			s = s.replace(/&nbsp;/g, " ").replace(/[:;]/g, function(r){
				return '<span style="color:#f0f;">'+r+'</span>';						   
			});
			return '<span style="color:#00f;">'+s+'</span>';										 
		});
		//给标签添加颜色
		str = str.replace(/&lt;(.|\s)*?&gt;/g,function(s){
			return '<span style="color:#009;">'+s+'</span>';							 
		});
		//注释
		str = str.replace(/&lt;!--(.|\s)*?--&gt;/g,function(s){
			return '<span style="color:#999;">'+s+'</span>';							 
		});
		//表单内容
		str = str.replace(/&lt;(input|button|form|textarea|select|option|optgroup|label)(.|\s)*?&gt;/gi,function(s){
			return '<span style="color:#f90;">'+s+'</span>';							 
		});
		o.css(settings.css);
		//显示内容
		if(settings.type === "before"){
			o.before(str);
		}else if(settings.type === "after"){
			o.after(str);
		}else if(settings.type === "append"){
			o.append(str);
		}else if(settings.type === "prepend"){
			o.prepend(str);
		}else{
			o.html(str);	
		}
	};	   
})(jQuery);