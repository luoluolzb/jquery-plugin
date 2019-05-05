/**
 * jquery图片轮播插件
 * @author  luoluolzb
 * @github  https://github.com/luoluolzb/lqImgCarousel
 * @version 1.0
 */
;(function($){
	/**
	 * 创建图片导航元素
	 */
	function CreateNav($imgCarousel, imageCount) {
		var $carouselNav = $('<div></div>').addClass('carousel-nav');
		for(var i = 0; i < imageCount; ++ i) {
			var nav = $('<div></div>').text(i + 1).addClass('image-nav').data('index', i);
			if (i == 0) {
				nav.addClass('active');
			}
			$carouselNav.append(nav);
		}
		$imgCarousel.append($carouselNav);
	}

	/**
	 * 插件构造函数
	 * @param  object options 配置参数
	 * @return lqImgCarousel对象
	 */
	function lqImgCarousel(options) {
		var carousel = this;
		options = $.extend({
			speed: 2000,  //图片切换速度(单位：毫秒)
			delay: 100,   //鼠标悬停按钮时图片切换延迟(单位：毫秒)
		}, options);

		var $imgCarousel = $('.lqImgCarousel');
		var $wapperList = $('.lqImgCarousel .image-wapper');
		var imageCount = $wapperList.size();

		CreateNav($imgCarousel, imageCount);
		var $navList = $('.lqImgCarousel .image-nav');
		var activeIndex = 0, timer = null;

		/**
		 * 切换当前显示的图片
		 * @param  number targetIndex 要显示的图片序号(从0开始)
		 */
		this.change = function(targetIndex) {
			$wapperList.eq(activeIndex).removeClass('active');
			$navList.eq(activeIndex).removeClass('active');

			$wapperList.eq(targetIndex).addClass('active');
			$navList.eq(targetIndex).addClass('active');

			activeIndex = targetIndex;
		};

		//轮播切换定时器回调函数
		var ChangeTimerCallback = function() {
			if (activeIndex + 1 >= imageCount) {
				carousel.change(0);
			} else {
				carousel.change(activeIndex + 1);
			}
		};

		/**
		 * 开始轮播
		 */
		this.Start = function() {
			timer = setInterval(
				ChangeTimerCallback,
				options.speed
			);
		};

		/**
		 * 停止轮播
		 */
		this.Stop = function() {
			clearInterval(timer);
		};

		//监听鼠标悬停导航事件
		//鼠标经过导航时切换到相应的图片
		$navList.hover(function() {
			var targetIndex = $(this).data('index');
			setTimeout(function(){
				carousel.change(targetIndex);
			}, options.delay);
		});

		//监听鼠标悬停事件
		$('.lqImgCarousel').hover(function(){
			//鼠标经过时停止轮播
			carousel.Stop();
		}, function(){
			//鼠标移开时时继续轮播
			carousel.Start();
		});

		return this;
	}

	//扩展到jquery方法
	$.fn.extend({
		'lqImgCarousel': lqImgCarousel,
	});
})(jQuery);
