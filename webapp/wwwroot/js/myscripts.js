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
    CreateIncludedClassInput();
    GetCounts();
    */
    CreateInputTeam();
    CreateInputPersonnel();
    CreateStudentGroupInput();
    CreateAuxiliaryAssignmentInput();
    CreateInputCompetence();

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
        $('#teamCrudOpen').addClass('wizActive');//TODO Fr�ga jonas
        $('.wizardDataBox').hide();
        $('#wizardBoxItemDesc div').hide();
        $('#overLay').fadeToggle("fast");
        $('html').css('overflow', 'auto');
    });

    // When menu-item in wizard is pushed
    $('#wizardLayout > nav > div:not(#exitWizard)').on('click', function () {
        var listTarget = $(this).attr('id');

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
        
        updateLists();
    });
    
    // Open add/edit data pop-up
    $('#addButton').on('click', function () {
        var target = $('.wizActive').attr('id');
        target = target.slice(0, -4);

        // Empty all field 
            //Team
            $('#teamName').val('');
            //Personnel
            $('#firstNameInput').val('');
            $('#lastNameInput').val('');
            $('#personnelCrudForm img').attr('src', '');
            $('#teamIdInput').val('');
            $('#availablePointsInput').val('');
            $('#contractSelect').val('');
            $('#competenceList').empty();
            allChosenCompetences = [];
            //Student_groups
            $('#studentGroupName').val('');
            //Auxiliary_assignments
            $('#auxiliaryAssignmentName').val('');
            $('#auxiliaryAssignmentDesc').val('');
            $('#auxiliaryAssignmentPoints').val('');
            $('#auxiliaryAssignmentPersonnel').val('');

        // Get list of subjects
        if (target == "personnelCrud" && allSubjectsExist == false)
            GetAllSubjects();

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

            //alert("Genomf�r uppdatering");

            if (target == "teamCrud") {
                //alert("Uppdaterar team");
                teamFirstVisit = false;
                $('#teamCrud table').find('tr:not(:first)').remove();
                $('#teamIdInput').empty();
                $('#teamIdInputForStudentGroup').empty();
                $('#includedClassTeamBelongingDropDown').empty();
                $.ajax({
                    type: 'GET',
                    url: '/Wizard/GetAllTeams',
                    success: function (data) {
                        data.forEach(function (element) {
                            $('#teamCrud table').append('<tr><td>' + element.name + '</td><td data-item="' + element.id + '"><p class="edit"></p><p class="delete"></p></td></tr>');
                            $('#teamIdInput').append($('<option/>', {
                                text: element.name,
                                value: element.id
                            }));
                            $('#teamIdInputForStudentGroup').append($('<option/>', {
                                text: element.name,
                                value: element.id
                            }));
                            $('#includedClassTeamBelongingDropDown').append($('<option/>', {
                                text: element.name,
                                value: element.id
                            }));
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

    $('.wizardDataBox').on('click', 'p.edit', function () {
        var itemId = $(this).parent().attr('data-item');
        var target = $(this).closest('.wizardDataBox').attr("id");
        
        if (target == "teamCrud") {
            return;
        }
        else if (target == "studentGroupCrud") {
            return;
            // UpdateStudentGroup(itemId);
        }
        else if (target == "personnelCrud") {
            // Get list of subjects
            if (allSubjectsExist == false)
                GetAllSubjects();

            GetPersonToEdit(itemId);
            // Byter ut spar-knappen mot en uppdatera-knapp och �ndrar funktionen som kallas. Kom ih�g att byta tillbaka efter�t / n�r "Add new" �ppnas.
            // ImgUrl uppdateras inte i nul�get..
            $('#addPersonnelButton').attr('onclick', 'EditPersonById(' + itemId + ')');
            $('#addPersonnelButton').text('Uppdatera');
        }
        else if (target == "auxiliaryAssignmentCrud") {
            return;
        }

        target = target + "Form";
        $('.innerOverLay').fadeToggle("fast");
        $('#' + target).show();
    });
    $('.wizardDataBox').on('click', 'p.delete', function () {
        var itemId = $(this).parent().attr('data-item');
        var target = $(this).closest('.wizardDataBox').attr("id");

        if (target == "teamCrud") {
            DeleteTeam(itemId);
            personnelFirstVisit = true;
            studentGroupFirstVisit = true;
            auxiliaryAssignmentFirstVisit = true;
        }
        if (target == "personnelCrud") {
            var removeConfirm = confirm('You sure you wanna remove?')
            if (removeConfirm)
                RemovePerson(itemId);
            else
                return;
        }
        if (target == "studentGroupCrud")
            DeleteStudentGroup(itemId);
        
    });
    /* END - Jonas lekplats */
});