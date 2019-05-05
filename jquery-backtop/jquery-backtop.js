/**
 * jQuery插件：返回顶部
 * @author luoluolzb
 * @time   2018/5/26
 */
(function(){
    var distance = window.screen.availHeight ? window.screen.availHeight / 3 : 300;
    var $backtop = $('#jquery-backtop');

    $backtop.click(function(event){
        event.preventDefault();
        $('html,body').animate({scrollTop: 0}, 350);
    });

    var updatePos = function(){
        if ($(document).scrollTop() > distance) {
            $backtop.show();
        } else {
            $backtop.hide();
        }
    };

    $(document).scroll(updatePos);
    $(updatePos);
})();