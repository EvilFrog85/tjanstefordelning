$(document).ready(function () {
    $('.navItem').on('click', function () {
        var target = $(this).attr('id');
        var active = $('.mainNavActive').attr('id');

        if (target == "navHome" && active != target) {
            $('.navItem').removeClass('mainNavActive');
            $('#navHome').addClass('mainNavActive');
            $('.mainBoxItem').hide();
            $('#homeMainBox').fadeToggle();
        }

        // When wizard is opened
        else if (target == "navWizard") {
            //Get data for list - first because of possible async-delay
            updateLists();
            $('#overLay').fadeToggle("fast");
            // Hide body-scroll
            $('html').css('overflow', 'hidden');
            // Show data for team and add description
            $('#teamCrud').show();
            $('#teamCrudDesc').show();
        }

        else if (target == "navClass" && active != target) {
            GenerateStudentGroups();
            $('.navItem').removeClass('mainNavActive');
            $('#navClass').addClass('mainNavActive');
            $('.mainBoxItem').hide();
            $('#classesMainBox').fadeToggle();
        }

        else if (target == "navPersonnel" && active != target) {
            generatePersonnelHtml();
            $('.navItem').removeClass('mainNavActive');
            $('#navPersonnel').addClass('mainNavActive');
            $('.mainBoxItem').hide();
            $('#personnelMainBox').fadeToggle();
        }

        else if (target == "navBomb") {
            if (confirm("Vill du verkligen släppa bomben?")) {
                $.ajax({
                    type: 'POST',
                    url: '/Boom/BoomMethod',
                    success: function (data) {
                        alert("Jihaaa!");

                        isGeneratedPersonnelHtml = false;
                        generatePersonnelHtml();
                    }
                });
            }           
        }
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
    CreateAssignClassesToStudentGroupsOverlay();
    /* Wizard, innerLayOut Controlls */

    // When wizard is exited
    $('#exitWizard').on('click', function () {
        // Reset active tab
        $('.wizActive').removeClass('wizActive');
        $('#teamCrudOpen').addClass('wizActive');//TODO Fråga jonas
        $('.wizardDataBox').hide();
        $('#wizardBoxItemDesc div').hide();
        $('#overLay').fadeToggle("fast");
        $('html').css('overflow', 'auto');
        isGeneratedPersonnelHtml = false;
        if ($('.mainNavActive').attr('id') == "navPersonnel")
            generatePersonnelHtml();
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
        //console.log(target);

        var listLength = $('#' + target + ' table tr:not(:first)');
        var name = $('#' + target + 'Open').text();

        UpdateCounterInfo(listLength, name);
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
        if (target == "personnelCrud") {
            $('#addPersonnelButton').attr('onclick', 'AddNewPersonnel()');
            $('#addPersonnelButton').text('Lägg till personal');
        }
        if (target == "teamCrud") {
            $('#addTeamButton').attr('onclick', 'SubmitTeam()');
            $('#addTeamButton').text('Lägg till arbetslag');
        }
        if (target == "studentGroupCrud") {
            $('#addStudentGroupButton').attr('onclick', 'SubmitStudentGroup()');
            $('#addStudentGroupButton').text('Lägg till klass');
        }
        if (target == "auxiliaryAssignmentCrud") {
            $('#addAuxiliaryAssignmentButton').attr('onclick', 'SubmitAuxiliaryAssignment()');
            $('#addAuxiliaryAssignmentButton').text('Lägg till uppdrag');
        }
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
                        var name = $('#teamCrudOpen').text();

                        UpdateCounterInfo(data, name);
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
                        var name = $('#personnelCrudOpen').text();

                        UpdateCounterInfo(data, name);
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
                        var name = $('#studentGroupCrudOpen').text();

                        UpdateCounterInfo(data, name);
                    }
                });
            }
            else if (target == "auxiliaryAssignmentCrud") {
                //alert("Uppdaterar uppdrag");
                GetAllPersonnel();
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
                        var name = $('#auxiliaryAssignmentCrudOpen').text();

                        UpdateCounterInfo(data, name);
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
            GetTeamToEdit(itemId);
            $('#addTeamButton').attr('onclick', 'UpdateTeam(' + itemId + ')');
            $('#addTeamButton').text('Uppdatera');
        }
        else if (target == "studentGroupCrud") {
            GetStudentGroupToEdit(itemId);
            $('#addStudentGroupButton').attr('onclick', 'UpdateStudentGroup(' + itemId + ')');
            $('#addStudentGroupButton').text('Uppdatera');
        }
        else if (target == "personnelCrud") {
            // Get list of subjects
            if (allSubjectsExist == false)
                GetAllSubjects();

            GetPersonToEdit(itemId);
            // Byter ut spar-knappen mot en uppdatera-knapp och ändrar funktionen som kallas. Kom ihåg att byta tillbaka efteråt / när "Add new" öppnas.
            // ImgUrl uppdateras inte i nuläget..
            $('#addPersonnelButton').attr('onclick', 'EditPersonById(' + itemId + ')');
            $('#addPersonnelButton').text('Uppdatera');
        }
        else if (target == "auxiliaryAssignmentCrud") {
            $('#addAuxiliaryAssignmentButton').attr('onclick', 'UpdateAuxiliaryAssignment(' + itemId + ')');
            $('#addAuxiliaryAssignmentButton').text('Uppdatera');
            GetAuxiliaryAssignmentToEdit(itemId);
        }

        target = target + "Form";
        $('.innerOverLay').fadeToggle("fast");
        $('#' + target).show();
    });
    $('.wizardDataBox').on('click', 'p.delete', function () {
        var itemId = $(this).parent().attr('data-item');
        var target = $(this).closest('.wizardDataBox').attr("id");

        $('#removeConfirmation').attr('data-action', target);
        $('#removeConfirmation').attr('data-id', itemId);
        $('#removeOverLay').fadeToggle("fast");
    });

    $('#removeContent button').on('click', function () {
        $('#removeOverLay').fadeToggle("fast");
        if ($(this).attr('id') == "removeConfirmation") {
            var action = $(this).attr('data-action');
            var itemId = $(this).attr('data-id');
            if (action == "teamCrud") {
                DeleteTeam(itemId);
                submitClickCounter = 1;
            }
            else if (action == "personnelCrud") {
                RemovePerson(itemId);
                submitClickCounter = 1;
            }
            else if (action == "studentGroupCrud") {
                DeleteStudentGroup(itemId);
                submitClickCounter = 1;
            }
            else if (action == "auxiliaryAssignmentCrud") {
                DeleteAuxiliaryAssignment(itemId);
                submitClickCounter = 1;
            }
            else
                return;
        }
    });


    // #region Genereate html for personnel-page
    var isGeneratedPersonnelHtml;
    function generatePersonnelHtml() {
        if (!isGeneratedPersonnelHtml) {
            $('#personnelMainBox').empty();
            $.ajax({
                type: 'GET',
                url: '/Wizard/GetAllPersonnelToOverView',
                success: function (data) {
                    data.forEach(function (e) {
                        var assignedPointsPercentage = 0;
                        if (e.assignedPoints > 0)
                            var assignedPointsPercentage = (e.assignedPoints / 6).toFixed(1);
                        var contractType = contractEnum[e.contract];
                        $('#personnelMainBox').append('<div class="personnelBox"><div class="personnelBoxTop"><div><img src="/img/staff_pictures/' + e.imageUrl + '.jpg" alt="' + e.firstName + ' ' + e.lastName + '" /></div><div><button class="personnelEditButton" data-id="' + e.id + '" data-name="' + e.firstName + ' ' + e.lastName + '">Kurser & behörighet</button><p class="personnelTeamName">' + e.teamName + '</p><p class="personnelContract">' + contractType + '</p></div></div><div class="personnelBoxCenter"><p>' + e.signature + '</p><p>' + e.firstName + ' ' + e.lastName + '</p></div><div class="personnelBoxBottom"><div class="personnelMeterBox"><p>Tjänstegrad: ' + e.availablePoints + '%</p><div class="personnelAvailableMeter"><span style="width: ' + e.availablePoints + '%;"></span></div></div><div class="personnelMeterBox"><p>Tilldelat: ' + assignedPointsPercentage + '%</p><div class="personnelAssignedMeter"><span style="width: ' + assignedPointsPercentage + '%;"></span></div></div></div><div class="personnelCompetenceBox"></div></div>');
                    });
                }
            });
            isGeneratedPersonnelHtml = true;
        }
    }

    $('#personnelMainBox').on('click', '.personnelEditButton', function () {
        var id = $(this).attr('data-id');
        var name = $(this).attr('data-name');

        generatePersonnelEditBox(id, name);
    });

    function generatePersonnelEditBox(id, name) {
        $.ajax({
            type: 'GET',
            url: '/Wizard/GetPersonInfo/' + id,
            success: function (data) {
                var isEmpty = true;
                var $overLayData = '<h2 class="overViewName">' + name + '</h2>';
                // Print competences
                $overLayData += '<div class="overViewCompetenceBox">';
                var obehorig = false;
                data.competences.forEach(function (c) {
                    isEmpty = false;
                    if (c.qualified)
                        $overLayData += '<div class="competence qualified"><p>' + c.name + '</p></div>';
                    else {
                        $overLayData += '<div class="competence"><p>' + c.name + '*</p></div>';
                        obehorig = true;
                    }
                });
                if (obehorig)
                    $overLayData += '<p>*Obehörig i ämnet.</p>';
                $overLayData += '</div>';

                var headersBool = true;
                // Print available work
                var counter = 0;
                data.includedClasses.forEach(function (w) {
                    isEmpty = false;
                    if (headersBool)
                        $overLayData += '<div class="personnelHtVtHeader"><p>HT</p><p>VT</p></div>';
                    headersBool = false;
                    var times = w.points / 50;
                    counter = 0;
                    for (var i = 1; i <= times; i++) {
                        if (counter % 2 == 0) {
                            $overLayData += '<div class="personnelHtVt">';
                        }
                        if (w.duration == 0) {
                            if (i % 2 == 0) {
                                $overLayData += '<div class="personnelVtBox"><div class="HtVtLeftSide"><p class="deleteFakeBox">-</p><p title="' + w.className + '">' + w.className + ' (' + w.points + ')</p></div><div class="HtVtRightSide"><p>' + w.studentGroupName + '</p><p>' + w.teamName + '</p></div></div>';
                                counter++;
                            }
                            else {
                                if (i > 2)
                                    $overLayData += '<div class="personnelHtBox"><div class="HtVtLeftSide"><p class="deleteFakeBox">-</p><p title="' + w.className + '">' + w.className + ' (' + w.points + ')</p></div><div class="HtVtRightSide"><p>' + w.studentGroupName + '</p><p>' + w.teamName + '</p></div></div>';
                                else
                                    $overLayData += '<div class="personnelHtBox"><div class="HtVtLeftSide"><p class="delete" data-pid="'+ id +'" data-name="'+ name +'" data-type="pers" data-id="' + w.classId + '"></p><p title="' + w.className + '">' + w.className + ' (' + w.points + ')</p></div><div class="HtVtRightSide"><p>' + w.studentGroupName + '</p><p>' + w.teamName + '</p></div></div>';
                                counter++;
                                if (i == times) {
                                    $overLayData += '<div class="personnelVtBox"></div>';
                                    counter++;
                                }
                            }
                        }
                        else if (w.duration == 1) {
                            if (i == times)
                                $overLayData += '<div class="personnelHtBox"><div class="HtVtLeftSide"><p class="delete" data-type="pers" data-pid="' + id + '" data-name="' + name +'" data-id="' + w.classId + '"></p><p title="' + w.className + '">' + w.className + ' (' + w.points + ')</p></div><div class="HtVtRightSide"><p>' + w.studentGroupName + '</p><p>' + w.teamName + '</p></div></div>';
                            else
                                $overLayData += '<div class="personnelHtBox"><div class="HtVtLeftSide"><p class="deleteFakeBox">-</p><p title="' + w.className + '">' + w.className + ' (' + w.points + ')</p></div><div class="HtVtRightSide"><p>' + w.studentGroupName + '</p><p>' + w.teamName + '</p></div></div>';
                            counter++;
                        }
                        else {
                            if (i == times)
                                $overLayData += '<div class="personnelVtBox"><div class="HtVtLeftSide"><p class="delete" data-type="pers" data-pid="' + id + '" data-name="' + name +'" data-id="' + w.classId + '"></p><p title="' + w.className + '">' + w.className + ' (' + w.points + ')</p></div><div class="HtVtRightSide"><p>' + w.studentGroupName + '</p><p>' + w.teamName + '</p></div></div>';
                            else
                                $overLayData += '<div class="personnelVtBox"><div class="HtVtLeftSide"><p class="deleteFakeBox">-</p><p title="' + w.className + '">' + w.className + ' (' + w.points + ')</p></div><div class="HtVtRightSide"><p>' + w.studentGroupName + '</p><p>' + w.teamName + '</p></div></div>';
                            counter++;
                        }
                        if (counter % 2 == 0 || i == times) {
                            $overLayData += '</div>';
                            counter = 0;
                        }
                    }
                });
                // Print aux assignments
                data.auxAssignments.forEach(function (aux) {
                    isEmpty = false;
                    var times = aux.points / 50;
                    counter = 0;
                    for (var i = 1; i <= times; i++) {
                        if (counter % 2 == 0) {
                            $overLayData += '<div class="personnelHtVt">';
                        }
                        if (aux.duration == 0) {
                            if (i % 2 == 0) {
                                $overLayData += '<div class="personnelVtBox personnelAuxColor"><div class="HtVtLeftSide"><p class="deleteFakeBox">-</p><p>' + aux.name + ' (' + aux.points + ')</p></div></div>';
                                counter++;
                            }
                            else {
                                if (i > 2)
                                    $overLayData += '<div class="personnelHtBox personnelAuxColor"><div class="HtVtLeftSide"><p class="deleteFakeBox">-</p><p>' + aux.name + ' (' + aux.points + ')</p></div></div>';
                                else
                                    $overLayData += '<div class="personnelHtBox personnelAuxColor"><div class="HtVtLeftSide"><p class="delete" data-pid="' + id + '" data-name="' + name +'" data-type="aux" data-id="' + aux.id + '"></p><p>' + aux.name + ' (' + aux.points + ')</p></div></div>';
                                counter++;
                                if (i == times) {
                                    $overLayData += '<div class="personnelVtBox personnelAuxColor"></div>';
                                    counter++;
                                }
                            }
                        }
                        else if (duration == 1) {
                            if (i == times)
                                $overLayData += '<div class="personnelHtBox personnelAuxColor"><div class="HtVtLeftSide"><p class="delete" data-pid="' + id + '" data-name="' + name +'" data-type="aux" data-id="' + aux.id + '"></p><p>' + aux.name + ' (' + aux.points + ')</p></div></div>';
                            else
                                $overLayData += '<div class="personnelHtBox personnelAuxColor"><div class="HtVtLeftSide"><p class="deleteFakeBox">-</p><p>' + aux.name + ' (' + aux.points + ')</p></div></div>';
                            counter++;
                        }
                        else {
                            if (i == times)
                                $overLayData += '<div class="personnelVtBox personnelAuxColor"><div class="HtVtLeftSide"><p class="delete" data-pid="' + id + '" data-name="' + name +'" data-type="aux" data-id="' + aux.id + '"></p><p>' + aux.name + ' (' + aux.points + ')</p></div></div>';
                            else
                                $overLayData += '<div class="personnelVtBox personnelAuxColor"><div class="HtVtLeftSide"><p class="deleteFakeBox">-</p><p>' + aux.name + ' (' + aux.points + ')</p></div></div>';
                            counter++;
                        }
                        if (counter % 2 == 0 || i == times) {
                            $overLayData += '</div>';
                            counter = 0;
                        }
                    }
                });
                if (isEmpty)
                    $overLayData += '<p>Ingen information om personen är tillagd.</p>';
                // Hide body-scroll
                $('html').css('overflow', 'hidden');
                $('#mainOverLayContent').html($overLayData);
                if ($('#mainOverLay').is(":hidden"))
                    $('#mainOverLay').fadeToggle();
            }
        });
    }

    // Remove techer from included_class
    $('#mainOverLayContent').on('click', '.delete', function () {
        var classId = $(this).attr('data-id');
        var type = $(this).attr('data-type');
        var name = $(this).attr('data-name');
        var pid = $(this).attr('data-pid');

        if (type == "pers") {
            $.ajax({
                type: 'POST',
                url: '/Wizard/RemoveTeacherFromIncludedClass/' + classId,
                success: function () {
                    generatePersonnelEditBox(pid, name);
                    // TODO - Update list behind pop-up. Assigned points not updated when classes are removed from techers.
                }
            });
        }
        else if (type == "aux") {
            // TODO - Fixa delete för auxiliary_assignment
        }

    });


    $('#closeMainOverLay').on('click', function () {
        $('#mainOverLay').fadeToggle();
        // Show body-scroll again
        $('html').css('overflow', 'auto');
        //TODO : LÄGG TILL EMPTY ALLCHOSENCLASSES
        allChosenClasses = [];
    });
    // #endregion


    /* Dummy chatbox */
    $('#chatForm button').on('click', function () {
        var message = $('#chatForm textarea').val();
        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes();
        $('#chatBox').append('<p class="chatTimeStamp">19 maj - ' + time + '</p><p><span class="userMessage">Du:</span>' + message + '</p>');
        setTimeout(reply, 4200);
        $('#chatForm textarea').val('');
    });

    function reply() {
        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes();
        $('#chatBox').append('<p class="chatTimeStamp">19 maj - ' + time + '</p><p><span class="operatorMessage">David:</span>Vad vill du nu då?</p>');
    }
    /* END - Jonas lekplats */

    // #region class to student group
    // #region utils
    var contractEnum = [
        'Tillsvidare',
        'Tidsbegränsad',
        'Projektanställning',
        'Fast anställning',
        'Övrig'
    ];

    var durationEnum = {
        'Hela läsåret': 0,
        'HT': 1,
        'VT': 2
    };
    function string_of_enum(e, value) {
        for (var k in e) {
            if (e[k] == value)
                return k;
        }
        return null;
    }
    // #endregion

    // #region html injection
    $('#classesMainBox').on('click', '.classEditButton', function () {
        var id = $(this).attr('data-sgid');
        var name = $(this).attr('data-sgname');
        var teamId = $(this).attr('data-teamid');
        var pointsArray = $(this).attr('data-points-array');

        CreateAssignClassesToStudentGroupsOverlay(id, name, teamId, pointsArray);
        $('#mainOverLay').fadeToggle();
    });

    function CreateAssignClassesToStudentGroupsOverlay(studentGroupId, studentGroupName, teamId, pointsArray) {
        var $target = $('#overlayAssignClasses');

        var $headline = $('<h2/>', { id: 'currentClassHeadline' });

        var $classInput = $('<input/>', {
            id: 'classInput',
            type: 'text',
            placeholder: 'Kurs',
            class: 'inputTextAuto'
        });

        PopulateClassesArray();

        var $classDuration = $('<select/>', {
            id: 'classDurationDropDown',
            name: 'classDurationDropDown',
            class: 'inputSelect'
        });

        var $submitBtn = $('<button/>', {
            class: 'buttonSubmit',
            id: 'addClassButton',
            onclick: 'AddClassToCurriculum()',
            text: 'Lägg till',
            style: 'align-self: center',
            'data-studentGroupId': studentGroupId,
            'data-studentGroupName': studentGroupName,
            'data-team-id': teamId
            
        });

        var $submitBtn2 = $('<button/>', {
            class: 'buttonSubmit',
            id: 'saveAddedClassesButton',
            onclick: 'SaveAddedClasses()',
            text: 'Spara',
            style: 'align-self: center'
        });

        $($classDuration).append('<option value="0" selected="selected">Hela läsåret</option>');
        $($classDuration).append('<option value="1">HT</option>');
        $($classDuration).append('<option value="2">VT</option>');

        //TODO : kursen läses Ã¶ver fler än 2 terminer lÃ¶s om du vill

        //lots of divs
        var $semestersDiv = $('<div/>', { id: 'semestersDiv' }).append('<h2>Vald klass: ' + studentGroupName + '</h2>');
        var $fullYearDiv = $('<div/>', { id: 'fullYearDiv' });
        var $container = $('<div/>', { id: 'containerDiv' })
            .append($('<div/>', { class: 'assignClassDivs', id: 'HTDiv' }))
            .append($('<div/>', { class: 'assignClassDivs', id: 'VTDiv' }));
        var $fullYearHTDiv = $('<div/>', { class: 'assignClassDivs', id: 'fullYearHTDiv' }).append($('<h2/>', { text: 'HT' }));
        var $fullyearVTDiv = $('<div/>', { class: 'assignClassDivs', id: 'fullYearVTDiv' }).append($('<h2/>', { text: 'VT' }));
        $fullYearDiv.append($fullYearHTDiv).append($fullyearVTDiv);

        $semestersDiv
            .append($headline)
            .append($classInput)
            .append($classDuration)
            .append($submitBtn)
            .append($fullYearDiv)
            .append($container)
            .append($submitBtn2)
            .append($('<div/>', { id: 'messageBoxAssignClasses' }));

        //$('#overlayAssignClasses').append($semestersDiv);
        $('#mainOverLayContent').html($semestersDiv);


        //delay for how fast the list will update when user stops typing
        $('#classInput').autocomplete({ delay: 500 });
        //Set up autocomplete
        $('#classInput').autocomplete({
            source: allClasses,
            select: function (event, listItems) {
                $('#classInput').val(listItems.item.label);
                $('#classInput').attr('data-classid', listItems.item.value);
                return false;
            },
            focus: function (event, ti) {
                event.preventDefault();
                $('#classInput').val(ti.item.label);
            }
        });

        LoadIncludedClasses(studentGroupId);
    }
    // #endregion
    // #endregion
});

var allChosenClasses = [];
var allClasses = [];

//Removes class from curriculum
function RemoveClass(classId) {
    var res = $('.classToStudentGroup');
    res.each(function (index, element) {
        if (element.id == classId) {
            element.remove();
        }
    });
    allChosenClasses = jQuery.grep(allChosenClasses, function (elem, index) { return elem.ClassId != classId; });
    console.log("allChosenClasses");
    console.log(allChosenClasses);
}

//Called when classes should be saved to database
function SaveAddedClasses() {
    var studentGroupId = $('#addClassButton').attr('data-studentGroupId');
    if (studentGroupId && allChosenClasses.length > 0) {
        var classDataToSend = [];
        allChosenClasses.forEach(function (cls) {
            var newClass = { ClassId: cls.ClassId, Duration: cls.Duration, TeamId: cls.TeamId, StudentGroupId: cls.StudentGroupId };
            classDataToSend.push(newClass);
        });
        $.ajax({
            type: 'POST',
            url: '/Assignment/AssignStudentGroups/',
            data: { ClassData: classDataToSend },
        }).then(function (result) {
            if (result > 0) {
                $('#messageBoxAssignClasses').html(generateFormMessage("success", result + " kurs/kurser har blivit tillagda.")).hide().fadeToggle("fast").delay(2000).fadeToggle("fast");
                $('#currentStudentGroup').empty();
            } else {
                $('#messageBoxAssignClasses').html(generateFormMessage("error", "Inga kurser har blivit tillagda.")).hide().fadeToggle("fast").delay(2000).fadeToggle("fast");
            }
            $('#classesMainBox').empty();
            GenerateStudentGroups();
        });
    }

}

function AddClassToCurriculum(newClass) {
    //Get data
    var index;
    if (newClass) {
        var className = newClass.className + " (" + newClass.points + ")";
        var classId = newClass.classId;
        var duration = newClass.duration;
        var teamId = newClass.teamId;
        index = 0;
    } else {
        var className = $('#classInput').val();
        if (className) {
            index = allClasses.findIndex(function (element) { return element.label == className; });
            if (index != -1) {
                var classId = allClasses[index].value;
            } else {
                $('#messageBoxAssignClasses').html(generateFormMessage("error", "Du måste välja en kurs från listan.")).hide().fadeToggle("fast").delay(2000).fadeToggle("fast");
                return;
            }
        }
        var duration = $('#classDurationDropDown').val();
        var teamId = $('#addClassButton').attr('data-team-id');
    }

    //Get StudentGroup info from button
    var studentGroupId = $('#addClassButton').attr('data-studentGroupId');
    var studentGroupName = $('#addClassButton').attr('data-studentGroupName');

    //Check that the user has input a valid class
    if (index != -1) {
        var classTitle = className;
        if (className.substring(0, className.length-5).length > 19) {
            var className = className.substring(0, 20-5) + ".." + className.substring(className.length - 5, className.length);
        }

        //Create the div to contain the included class information needed
        var $classDiv = $('<div/>', {
            class: 'classToStudentGroup',
            id: classId,
            'data-duration': duration,
            'data-team-id': teamId,
            text: className,
            //text: points ? className + '(' + points + ')' : className,
            title: classTitle
        });

        //Add a delete button
        var $classButton = $('<button/>', {
            text: 'X',
            onclick: 'RemoveClass("' + classId + '")',
            class: 'deleteAssignedClassButton'
        });

        //Check if the class is in the chosen class list
        var index = allChosenClasses.findIndex(function (element) { return element.ClassId == classId; });
        if (index == -1) {
            allChosenClasses.push({ "ClassName": className, "ClassId": classId, 'Duration': duration, 'TeamId': teamId, 'StudentGroupId': studentGroupId });
            $classDiv.append($classButton);
            if (duration == 0) {
                $classDiv.appendTo('#fullYearHTDiv, #fullYearVTDiv');
            } else if (duration == 1) {
                $('#HTDiv').append($classDiv);
            } else if (duration == 2) {
                $('#VTDiv').append($classDiv);
            }
            $('#classInput').val('');
        } else {
            $('#messageBoxAssignClasses').html(generateFormMessage("error", "Kursen finns redan i listan.")).hide().fadeToggle("fast").delay(3000).fadeToggle("fast");
            //$('#assignedClasses').html(generateFormMessage("error", "Kursen finns redan i listan."));
            $('#classInput').val('');
        }
    } else {
        $('#messageBoxAssignClasses').html(generateFormMessage("error", "Du måste välja en kurs från listan.")).hide().fadeToggle("fast").delay(3000).fadeToggle("fast");
        //$('#messageBoxAssignClasses').html(generateFormMessage("error", "Du måste välja en klass från listan."));
    }
}

function LoadIncludedClasses(studentGroupId) {
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetIncludedClassByStudentGroupId/' + studentGroupId,
    }).then(function (includedClasses) {
        if (includedClasses) {
            console.log(includedClasses);
            includedClasses.forEach(function (elem, ind) {
                console.log(elem);
                AddClassToCurriculum(elem);
            });
        } else {
            $('#messageBoxAssignClasses').html(generateFormMessage("error", "Not success.")).hide().fadeToggle("fast").delay(2000).fadeToggle("fast");
        }
    }, function () {
        $('#messageBoxAssignClasses').html(generateFormMessage("error", "Nånting gick fel.")).hide().fadeToggle("fast").delay(2000).fadeToggle("fast");
    });
}

function PopulateClassesArray() {
    allClasses = []; //empty array
    $.ajax({
        type: 'GET',
        url: '/Assignment/GetAllClasses/',
        success: function (classes) {
            classes.forEach(function (cls) {
                var newClass = { label: cls.className + " (" + cls.points + ")", value: cls.id };
                allClasses.push(newClass);
            });
        }
    });
}

$('#mainOverLayContent').on('click', '#saveAddedClassesButton', function () {
    isGeneratedStudentsGroupHtml = false;
});

var isGeneratedStudentsGroupHtml = false;
function GenerateStudentGroups() {
    if (isGeneratedStudentsGroupHtml == false) {
        $.ajax({
            type: 'GET',
            url: '/Wizard/GetAllStudentGroups',
            success: function (data) {
                data.forEach(function (g) {
                    var htBox = $('<div/>', { class: 'htBox', id: 'htBox' + g.name });
                    var vtBox = $('<div/>', { class: 'vtBox', id: 'vtBox' + g.name });

                    $('#classesMainBox')
                        .append($('<div/>', { class: 'classBox', id: 'classBox' + g.name }));
                    $('#classBox' + g.name)
                        .append($('<h3/>', { text: g.name, class: 'classNameBox' }))
                        .append($('<button/>', { class: 'classEditButton', text: 'Lägg till kurser', 'data-sgid': g.id, 'data-sgname': g.name, 'data-teamid': g.teamId, 'data-points-array': g.classes  }))
                        .append($('<div/>', { class: 'allClassesBox', id: 'allClassesBox' + g.name }));

                    $('#allClassesBox' + g.name)
                        .append($('<div/>', { class: 'allClassesHeader', id: 'allClassesHeader' + g.name }))
                        .append($('<div>', { class: 'fullSemesterBox', id: 'fullSemesterBox' + g.name }))
                        .append($('<div>', { class: 'halfSemesterBox', id: 'halfSemesterBox' + g.name }));

                    $('#allClassesHeader' + g.name)
                        .append('<p>HT</p><p>VT</p>');

                    //$('#fullSemesterBox' + g.name)
                    //    .append($('<div/>', { class: 'studentGroupClass', id: 'studentGroupClass' + g.name }));

                    $('#halfSemesterBox' + g.name)
                        .append(htBox)
                        .append(vtBox);
                    $.ajax({
                        type: 'GET',
                        url: '/Wizard/GetIncludedClassByStudentGroupId/' + g.id,
                    }).then(function (c) {
                        c.forEach(function (d) {
                            var classTitle = d.className
                            if (d.className.length > 20) {
                                d.className = d.className.slice(0, 20);
                                d.className += '..';
                            }

                            if (d.duration == 0) {
                                var group = $('<div/>', { class: 'studentGroupClass', id: 'studentGroupClass' + d.id });
                                var htFullBox = $('<div/>', { class: 'htFullBox', id: 'htFullBox' + d.id });
                                var vtFullBox = $('<div/>', { class: 'vtFullBox', id: 'vtFullBox' + d.id });

                                htFullBox
                                    .append($('<p/>', { text: d.className, title: classTitle }));
                                vtFullBox
                                    .append($('<p/>', { text: d.className, title: classTitle }));
                                if (d.personnelSignature) {
                                    vtFullBox
                                        .append($('<p/>', { text: d.personnelSignature, class: 'personnelSignatureClass' }));
                                }
                                group
                                    .append(htFullBox)
                                    .append(vtFullBox);
                                $('#fullSemesterBox' + g.name).append(group);
                            }
                            else if (d.duration == 1) {
                                var halfClass = $('<div/>', { class: 'studentGroupHalfClass', id: 'studentGroupHalfClass' + d.id });

                                halfClass
                                    .append($('<p/>', { text: d.className, title: classTitle }));
                                if (d.personnelSignature) {
                                    halfClass
                                        .append($('<p/>', { text: d.personnelSignature, class: 'personnelSignatureClass' }));
                                }
                                htBox
                                    .append(halfClass);
                                //$('#halfSemesterBox' + g.name)
                                //    .append(htBox);
                            }
                            else {
                                var halfClass = $('<div/>', { class: 'studentGroupHalfClass', id: 'studentGroupHalfClass' + d.id });

                                halfClass
                                    .append($('<p/>', { text: d.className, title: classTitle }));
                                if (d.personnelSignature) {
                                    halfClass
                                        .append($('<p/>', { text: d.personnelSignature, class: 'personnelSignatureClass' }));
                                }
                                vtBox
                                    .append(halfClass)
                            }

                        })
                    });
                });
            }
        });
        isGeneratedStudentsGroupHtml = true;
    }
}