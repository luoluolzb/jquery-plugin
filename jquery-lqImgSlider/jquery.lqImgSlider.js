/**
 * jquery图片滚动插件
 * @author  luoluolzb
 * @github  https://github.com/luoluolzb/imgSlider
 * @version 1.0
 */
;(function($){
	function imgSlider(options) {
		options = $.extend({
			width: 150,
			height: 100,
			speed: 10,
		}, options);

		var $outWapper = this;
		var $inWapper = $outWapper.find('.img-slider-inwapper');
		var $slider = $inWapper.find('.img-slider');
		var $voidWapper = $('<div></div>');
		var $imgWapper = $slider.find('.img-slider-img');
		var $imgList = $slider.find('.img-slider-img img');
		$slider.append($voidWapper);

		/* set css */
		$outWapper.css('overflow', 'hidden');
		$outWapper.css('border', '1px dashed #CCC');

		$inWapper.css('float', 'left');
		$inWapper.css('width', '800%');

		$slider.css('float', 'left');
		$voidWapper.css('float', 'left');

		$imgWapper.css('display', 'inline-block');
		$imgWapper.css('margin', '0 5px');

		$imgList.css('width', options.width + 'px');
		$imgList.css('height', options.height + 'px');

		/* slider */
		var tab = $outWapper.get(0);
		var tab1 = $slider.get(0);
		var tab2 = $voidWapper.get(0);
		tab2.innerHTML = tab1.innerHTML;

		function marquee() {
			if (tab2.offsetWidth - tab.scrollLeft <= 0) {
				tab.scrollLeft -= tab1.offsetWidth;
			} else {
				++ tab.scrollLeft;
			} 
		}

		var MyMar = setInterval(marquee, options.speed);
		
		tab.onmouseover = function() {
			clearInterval(MyMar);
		};
		
		tab.onmouseout = function() {
			MyMar = setInterval(marquee, options.speed);
		};
	}

	$.fn.extend({
		'imgSlider': imgSlider,
	});
})(jQuery);
