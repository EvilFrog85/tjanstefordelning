/// <reference path="index.d.ts" />

function stickyFooter() {
    $('main').css({ 'paddingBottom': $('footer').height() });
    $('#innerFooter').css({ 'lineHeight': $('footer').height() - 20 + 'px' });
}

stickyFooter();

$('#hamburgerBtn').on('click',
    () => $('nav').stop().slideToggle()
);

$(window).resize(
    () => {
        if ($(window).width() > 768) {
            $('nav').removeAttr('style')
        }
    stickyFooter()
});