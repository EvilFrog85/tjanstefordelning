function stickyFooter() {
    $('main').css({ 'paddingBottom': $('footer').height() });
    $('#innerFooter').css({ 'lineHeight': $('footer').height() - 20 + 'px' });
}
stickyFooter();
$('#hamburgerBtn').on('click', function () { return $('nav').stop().slideToggle(); });
$(window).resize(function () {
    if ($(window).width() > 768) {
        $('nav').removeAttr('style');
    }
    stickyFooter();
});
//# sourceMappingURL=myScripts.js.map