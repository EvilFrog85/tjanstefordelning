$(document).ready(function () {
    function stickyFooter() {
        $('main').css({ 'paddingBottom': $('footer').height() });
        $('#innerFooter').css({ 'lineHeight': $('footer').height() - 20 + 'px' });
    }
    stickyFooter();
    $('#hamburgerBtn').on('click', function () {
        return $('header nav').stop().slideToggle();
    });
    $(window).resize(function () {
        if ($(window).width() > 768) {
            $('header nav').removeAttr('style');
        }
        stickyFooter();
    })
    $('.wizard').on('click', function () {
        window.location.href = "/wizard";
    });
});