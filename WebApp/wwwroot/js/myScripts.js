$(document).ready(function () {
    function stickyFooter() {
        $('main').css({ 'paddingBottom': $('footer').height() });
        $('#innerFooter').css({ 'lineHeight': $('footer').height() - 20 + 'px' });
    }
    stickyFooter();
    $('#hamburgerBtn').on('click', function () {
        return $('nav').stop().slideToggle();
    });
    $(window).resize(function () {
        if ($(window).width() > 768) {
            $('nav').removeAttr('style');
        }
        stickyFooter();
    });

    /*
    CreateInputCompetence();
    CreateIncludedClassInput();
    GetCounts();
    //*/
    //CreateInputTeam();
    //CreateInputPersonnel();
    //CreateStudentGroupInput();
    //CreateAuxiliaryAssignmentInput();

    /* Wizard, innerLayOut Controlls */
    // When wizard is opened
    $('.wizard').on('click', function () {
        // Get data for list - first because of possible async-delay
        getTeamsPls();
        $('#overLay').fadeToggle("fast");
        // Hide body-scroll
        $('html').css('overflow', 'hidden');
        // Show data for team and add description
        $('#teamCrud').show();
        $('#teamCrudDesc').show();
    });

    // When wizard is exited
    $('#exitWizard').on('click', function () {
        // Reset active tab
        $('.wizActive').removeClass('wizActive');
        $('#teamCrudOpen').addClass('wizActive');
        $('.wizardDataBox').hide();
        $('#wizardBoxItemDesc div').hide();
        $('#overLay').fadeToggle("fast");
        $('html').css('overflow', 'auto');
    });

    // When menu-item in wizard is pushed
    $('#wizardLayout > nav > div:not(#exitWizard)').on('click', function () {

        // TODO - continue on else to get other lists..
        var listTarget = $(this).attr('id');
        if (listTarget == "teamCrudOpen") {
            getTeamsPls();
        }

        // Change "active" tab
        $(this).siblings('div').removeClass('wizActive');
        $(this).addClass('wizActive');

        // Hide all forms and wizard data
        $('.wizardDataBox').hide();
        $('#wizardBoxItemDesc div').hide();
        $('.crudForm').hide();

        // Get new wizard data from tab name
        var target = $(this).attr('id').slice(0, -4);
        $('#' + target).show();
        $('#' + target + 'Desc').show();
    });

    // Open edit data pop-up
    $('#addButton').on('click', function () {
        var target = $('.wizActive').attr('id');
        target = target.slice(0, -4);
        target = target + "Form";
        $('.innerOverLay').fadeToggle("fast");
        $('#' + target).show();
    });

    // Close edit data pop-up
    $('.closeInnerOverLay').on('click', function () {
        $('.innerOverLay').fadeToggle("fast");
    });
    /* END - Wizard, innerLayOut Controlls */


    /* Jonas lekplats */
    function getTeamsPls() {
        $.ajax({
            type: 'GET',
            url: '/Wizard/GetAllTeams',
            success: function (data) {
                console.log(data);
                data.forEach(function (e) {
                    $('#teamCrud table').append('<tr><td>' + e.name + '</td><td data-item="' + e.id + '"><p class="edit"></p><p class="delete"></p></td></tr>');
                });
            }
        });
    }

    $('.edit').on('click', function () {
        var id = $(this).parent().attr('data-item');
        var name = $(this).parent().prev().hmtl();
    });
    $('.delete').on('click', function () {
        var id = $(this).parent().attr('data-item');
    });
    /* END - Jonas lekplats */
});