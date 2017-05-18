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
            $('.navItem').removeClass('mainNavActive');
            $('#navClass').addClass('mainNavActive');
            $('.mainBoxItem').hide();
            $('#classesMainBox').fadeToggle();
            GenerateStudentGroups();
        }

        else if (target == "navPersonnel" && active != target) {
            $('.navItem').removeClass('mainNavActive');
            $('#navPersonnel').addClass('mainNavActive');
            $('.mainBoxItem').hide();
            $('#personnelMainBox').fadeToggle();
        }

        else if (target == "navBomb") {
            alert("Vet du verkligen vad du g�r nu?");
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
        console.log(target);

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
            $('#addPersonnelButton').text('L�gg till personal');
        }
        if (target == "teamCrud") {
            $('#addTeamButton').attr('onclick', 'SubmitTeam()');
            $('#addTeamButton').text('L�gg till arbetslag');
        }
        if (target == "studentGroupCrud") {
            $('#addStudentGroupButton').attr('onclick', 'SubmitStudentGroup()');
            $('#addStudentGroupButton').text('L�gg till klass');
        }
        if (target == "auxiliaryAssignmentCrud") {
            $('#addAuxiliaryAssignmentButton').attr('onclick', 'SubmitAuxiliaryAssignment()');
            $('#addAuxiliaryAssignmentButton').text('L�gg till uppdrag');
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
            // Byter ut spar-knappen mot en uppdatera-knapp och �ndrar funktionen som kallas. Kom ih�g att byta tillbaka efter�t / n�r "Add new" �ppnas.
            // ImgUrl uppdateras inte i nul�get..
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
    /* END - Jonas lekplats */

    // #region class to student group
    // #region utils
    var durationEnum = {
        'Hela l�s�ret': 0,
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
    // #region Adding and removing classes "buttons".



    // #endregion

    // #region autocomplete
    function PopulateClassesArray() {
        allClasses = []; //empty array
        $.ajax({
            type: 'GET',
            url: '/Assignment/GetAllClasses/',
            success: function (classes) {
                console.log("GetAllClasses");
                console.log(classes);
                classes.forEach(function (cls) {
                    var newClass = { label: cls.className, value: cls.id };
                    allClasses.push(newClass);
                });
                //$('#classInput').autocomplete({
                //    source: allClasses,
                //    select: function (event, listItems) {
                //        $('#classInput').val(listItems.item.label);
                //        $('#classInput').attr('data-classid', listItems.item.value);
                //        return false;
                //    },
                //    focus: function (event, ti) {
                //        event.preventDefault();
                //        $('#classInput').val(ti.item.label);
                //    }
                //});
            }
        });
    }
    // #endregion
    // #region html injection
    function CreateAssignClassesToStudentGroupsOverlay(studentGroupId, studentGroupName, teamId) {
        var $target = $('#overlayAssignClasses');
        var studentGroupName = "Te17a";//studentGroupName;
        var teamId = 4;//teamId;
        var studentGroupId = 2;//studentGroupId

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
            text: 'L�gg till',
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

        $($classDuration).append('<option value="0" selected="selected">Hela l�s�ret</option>');
        $($classDuration).append('<option value="1">HT</option>');
        $($classDuration).append('<option value="2">VT</option>');

        //TODO : kursen l�ses �ver fler �n 2 terminer l�s om du vill

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

        $('#overlayAssignClasses').append($semestersDiv);

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
    }
    // #endregion
    // #endregion
});

var allClasses = [];
var allChosenClasses = [];

//Removes class from curriculum
function RemoveClass(classId) {
    var res = $('.classToStudentGroup');
    res.each(function (index, element) {
        if (element.id == classId) {
            element.remove();
        }
    });
    var index = allChosenClasses.findIndex(function (element) { console.log(element); element.ClassId == classId; });
    allChosenClasses.splice(index);
    console.log(allChosenClasses);
}

//Called when classes should be saved to database
function SaveAddedClasses() {
    var studentGroupId = $('#addClassButton').attr('data-studentGroupId');
    if (studentGroupId && allChosenClasses.length > 0) {
        var classDataToSend = [];
        allChosenClasses.forEach(function (cls) {
            console.log(cls);
            var newClass = { ClassId: cls.ClassId, Duration: cls.Duration, TeamId: cls.TeamId, StudentGroupId: cls.StudentGroupId };
            classDataToSend.push(newClass);
        });
        console.log(classDataToSend);
        $.ajax({
            type: 'POST',
            url: '/Assignment/AssignStudentGroups/',
            data: { ClassData: classDataToSend },
            success: function (result) {
                console.log(result);
                if (result > 0) {
                    $('#messageBoxAssignClasses').html(generateFormMessage("success", result + " kurs/kurser har blivit tillagda.")).hide().fadeToggle("fast").delay(2000).fadeToggle("fast");
                    $('#currentStudentGroup').empty();
                } else {
                    $('#messageBoxAssignClasses').html(generateFormMessage("error", "Inga kurser har blivit tillagda.")).hide().fadeToggle("fast").delay(2000).fadeToggle("fast");
                }
            }
        });
    }
}

function AddClassToCurriculum() {
    //Get data
    className = $('#classInput').val();
    var cls = $('#classInput').val();
    console.log(cls);
    if (cls) {
        var index = allClasses.findIndex(function (element) { return element.label == cls; });
        var classId = allClasses[index].value;
        console.log('classId: ' + classId);
    }
    var duration = $('#classDurationDropDown').val();
    var studentGroupId = $('#addClassButton').attr('data-studentGroupId');
    var studentGroupName = $('#addClassButton').attr('data-studentGroupName');
    var teamId = $('#addClassButton').attr('data-team-id');
    console.log(teamId);

    //Check that the user has input a valid class
    if (allClasses.findIndex(function (element) { return element.label == className; }) !== -1) {
        //Create the div to contain the included class information needed
        var $classDiv = $('<div/>', {
            class: 'classToStudentGroup',
            id: classId,
            'data-duration': duration,
            'data-team-id': teamId,
            //'data-teamname': teamName,
            text: className,
            title: className
        });
        if ($classDiv.text().length > 23) {
            $classDiv.text($classDiv.text().substring(0, 24) + "..");
        }
        //Add a delete button
        var $classButton = $('<button/>', {
            text: 'X',
            onclick: 'RemoveClass("' + classId + '")',
            class: 'deleteAssignedClassButton'
        });

        //Check if the class is in the class list
        var index = allChosenClasses.findIndex(function (element) { console.log(element); return element.ClassId == classId; });
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
            $('#messageBoxAssignClasses').html(generateFormMessage("error", "Kursen finns redan i listan.")).hide().fadeToggle("fast").delay(2000).fadeToggle("fast");
            //$('#assignedClasses').html(generateFormMessage("error", "Kursen finns redan i listan."));
            $('#classInput').val('');
        }
    } else {
        $('#messageBoxAssignClasses').html(generateFormMessage("error", "Du m�ste v�lja en kurs fr�n listan.")).hide().fadeToggle("fast").delay(2000).fadeToggle("fast");
        //$('#assignedClasses').html(generateFormMessage("error", "Du m�ste v�lja en klass och eller kurser att l�gga till."));
    }
    console.log(allChosenClasses);
}

//TODO : Load classes for a studentgroup

//SOFIA
function GenerateStudentGroups() {

    $.ajax({
        type: 'GET',
        url: '/Wizard/GetAllStudentGroups',
        success: function (data) {
            data.forEach(function (g) {
                console.log(g.name);
                $('#classesMainBox')
                    .append($('<div/>', { class: 'classBox', id: 'classBox' + g.name }));
                $('#classBox' + g.name)
                    .append($('<h3/>', { text: g.name, class: 'classNameBox' }))
                    .append($('<button/>', { class: 'classEditButton', text: 'L�gg till kurser' }));

                ajax({
                    type: 'GET',

                })
                //    .append($('<div/>', { class: 'allClassesBox', id: '#allClassesBox' + g.name }))
                //    .append($('<div/>', { class: 'allClassesHeader', id: '#allClassesHeader' + g.name }));
                ////$('#allClassesBox' + g.name)
                //$('#allClassesHeader' + g.name)
                //    .append($('<p/>', { text: 'Hello', class: 'allClassesHeader' }));
                //    .append($('<div/>'), { class: 'fullSemesterBox' });


            });
        }
    });


}