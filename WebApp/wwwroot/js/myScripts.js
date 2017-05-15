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
        updateLists();
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

        /* Kör de andra tre, men inte teams
        if (listTarget == "teamCrudOpen") {
            updateTeamList();
        }
        */

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

        // Check if first visit on tab, if so populate list
        updateLists();
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
        updateLists();
    });
    /* END - Wizard, innerLayOut Controlls */


    /* Jonas lekplats */
    var teamFirstVisit = true;
    var personnelFirstVisit = true;
    var studentGroupFirstVisit = true;
    var auxiliaryAssignmentFirstVisit = true;

    function updateLists() {
        if (submitClickCounter > 0 || teamFirstVisit == true || personnelFirstVisit == true || studentGroupFirstVisit == true || auxiliaryAssignmentFirstVisit == true) {
            //alert("Inne i funktionen");
            var target = $('.wizActive').attr('id');
            target = target.slice(0, -4);

            // To prevent bug (list from updating) following the first "if()" of this function
            if (submitClickCounter == 0) {
                if (teamFirstVisit == false && target == "teamCrud")
                    return;
                else if (personnelFirstVisit == false && target == "personnelCrud")
                    return;
                else if (studentGroupFirstVisit == false && target == "studentGroupCrud")
                    return;
                else if (auxiliaryAssignmentFirstVisit == false && target == "auxiliaryAssignmentCrud")
                    return;
            }

            //alert("Genomför uppdatering");

            if (target == "teamCrud") {
                //alert("Uppdaterar team");
                teamFirstVisit = false;
                $('#teamCrud table').find('tr:not(:first)').remove();
                $.ajax({
                    type: 'GET',
                    url: '/Wizard/GetAllTeams',
                    success: function (data) {
                        data.forEach(function (e) {
                            $('#teamCrud table').append('<tr><td>' + e.name + '</td><td data-item="' + e.id + '"><p class="edit"></p><p class="delete"></p></td></tr>');
                        });
                    }
                });
            }
            else if (target == "personnelCrud") {
                //alert("Uppdaterar personal");
                personnelFirstVisit = false;
                $('#personnelCrud table').find('tr:not(:first)').remove();
                $.ajax({
                    type: 'GET',
                    url: '/Wizard/GetAllPersonnelToWizardList',
                    success: function (data) {
                        data.forEach(function (e) {
                            $('#personnelCrud table').append('<tr><td>' + e.teamName + '</td><td>' + e.firstName + '</td><td>' + e.lastName + '</td><td>' + e.signature + '</td><td data-item="' + e.id + '"><p class="edit"></p><p class="delete"></p></td></tr>');
                        });
                    }
                });
            }
            else if (target == "studentGroupCrud") {
                //alert("Uppdaterar klasser");
                studentGroupFirstVisit = false;
                $('#studentGroupCrud table').find('tr:not(:first)').remove();
                $.ajax({
                    type: 'GET',
                    url: '/Wizard/GetAllStudentGroups',
                    success: function (data) {
                        data.forEach(function (e) {
                            $('#studentGroupCrud table').append('<tr><td>' + e.teamName + '</td><td>' + e.name + '</td><td>' + e.startingYear + '</td><td data-item="' + e.id + '"><p class="edit"></p><p class="delete"></p></td></tr>');
                        });
                    }
                });
            }
            else if (target == "auxiliaryAssignmentCrud") {
                //alert("Uppdaterar uppdrag");
                auxiliaryAssignmentFirstVisit = false;
                $('#auxiliaryAssignmentCrud table').find('tr:not(:first)').remove();
                $.ajax({
                    type: 'GET',
                    url: '/Wizard/GetAllAuxiliaryAssignments',
                    success: function (data) {
                        data.forEach(function (e) {
                            var yesOrNo = "Nej";
                            if (e.assigned == true)
                                yesOrNo = "Ja";
                            $('#auxiliaryAssignmentCrud table').append('<tr><td>' + e.name + '</td><td>' + e.points + '</td><td>' + yesOrNo + '</td><td data-item="' + e.id + '"><p class="edit"></p><p class="delete"></p></td></tr>');
                        });
                    }
                });
            }
            else {
                alert("Error...");
            }
            submitClickCounter = 0;
        }
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