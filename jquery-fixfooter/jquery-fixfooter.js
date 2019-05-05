/**
 * jQuery插件：调整使footer使它在底部
 * @author  luoluolzb
 * @version 2.0
 * @time    2019/5/2
*/
;(function($){
	//给head添加一个style(固定样式)
	$(document.head).append($('<style>.jquery-fixfooter{position: fixed;bottom: 0;width:100%;}</style>'));
	var $footer = $("#jquery-fixfooter");

	var fixFooter = function(){
		$footer.removeClass("jquery-fixfooter");
		var contentHeight = document.body.scrollHeight; //网页正文全文高度
		var winHeight = window.innerHeight;             //可视窗口高度，不包括浏览器顶部工具栏
		if(!(contentHeight > winHeight)){               //当网页正文高度小于可视窗口高度时
			$footer.addClass("jquery-fixfooter");       //为footer添加固定样式
		}
	};
	$.extend({
		fixFooter: function(){
			return fixFooter();
		},
	});
	$(fixFooter);  //页面加载后调转一次
	$(window).resize(fixFooter);  //resize只对window有效
})(jQuery);