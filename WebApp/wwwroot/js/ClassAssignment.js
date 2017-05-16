///<reference path="jquery-2.1.0-vsdoc.js"/>

// #region utils
var durationEnum = {
    'Hela läsåret': 0,
    'HT': 1,
    'VT': 2
};
function string_of_enum(e, value) {
    for (var k in e) {
        if (e[k] === value)
            return k;
    }
    return null;
}

function ClearClassList() {
    $('#classList').empty();
}

function LoadCurrentStudentGroupsClasses(studentGroupId){
    $.ajax({
        type: 'GET',
        url: 'Assignment/GetStudentGroupClassesById/' + studentGroupId,
        success: function (includedClasses) {

        }
    });
}

// #endregion
// #region Adding and removing student groups "buttons".
var studentGroupsArray = [];
var allChosenStudentGroups = [];

function RemoveStudentGroup(studentGroupId) {
    $('#' + studentGroupId).remove();
    //TODO : Check findindex
    var index = allChosenStudentGroups.findIndex(function (element) { console.log(element); element.StudentGroupId === studentGroupId; });
    console.log(index);
    allChosenStudentGroups.splice(index);
    console.log(allChosenStudentGroups);
}

function AddStudentGroup(studentGroupName, studentGroupId) {
    var duration = $('#includedClassDurationDropDown').val();
    var $studentGroupDiv = $('<div/>', {
        class: 'groupToClass',
        id: studentGroupId,
        'data-id': studentGroupId,
        'data-duration': duration
    });
    var $studentGroupButton = $('<button/>', {
        text: 'X',
        onclick: 'RemoveStudentGroup("' + studentGroupId + '")',
        id: 'assignButton'
    });
    var $studentGroupText = $('<p/>', { text: studentGroupName });

    //if(not already in the list)
    allChosenStudentGroups.push({ "StudentGroupName": studentGroupName, "StudentGroupId": studentGroupId });

    $studentGroupDiv.append($studentGroupText);
    $studentGroupDiv.append($studentGroupButton);

    $('#studentGroupList')
        .append($studentGroupDiv);

    $('#studentGroupInput').val('');
    console.log(allChosenStudentGroups);
}
// #endregion

// #region Adding and removing classes "buttons".
var classesArray = [];
var allChosenClasses = [];
function RemoveClass(classId) {
    $('#' + classId).remove();
    //TODO : Check findindex
    var index = allChosenClasses.findIndex(function (element) { console.log(element); element.ClassId === classId; });
    console.log(index);
    allChosenClasses.splice(index);
    console.log(allChosenClasses);
}

function AddClass(className, classId) {
    //Clear error message
    $('#assignedClasses').empty();

    //Get data
    className = $('#classInput').val();
    //TODO : Kolla om denna fullösningen går att fixa lite snyggare
    classId = $('#hiddenClassId').val();
    var duration = $('#includedClassDurationDropDown').val();
    var teamId = $('#includedClassTeamIdDropDown').val();
    var teamName = $('#includedClassTeamIdDropDown option[value=' + teamId + ']').text();

    //Check that the user has input a valid class
    if (classesArray.findIndex(function (element) { return element.label === className; }) !== -1) {
        //Create the div to contain the included class information needed
        var $classDiv = $('<div/>', {
            class: 'classToStudentGroup',
            id: classId,
            'data-duration': duration,
            'data-teamid': teamId,
            'data-teamname': teamName,
            style: "display: flex; flex-direction: row;"
        });
        //Add a delete button
        var $classButton = $('<button/>', {
            text: 'X',
            onclick: 'RemoveClass("' + classId + '")',
            id: 'assignButton'
        });
        //Class information to display
        var infoText = "<b>Kurs:</b> " + className + "<br/><b>Arbetslag:</b> " + teamName + "<br/><b>Period:</b> " + string_of_enum(durationEnum, duration);
        var $classText = $('<div/>', { html: infoText });

        //Check if the class is in the class list
        var index = allChosenClasses.findIndex(function (element) { console.log(element); return element.ClassId === classId; });
        if (index === -1) {
            allChosenClasses.push({ "ClassName": className, "ClassId": classId });
            $classDiv.append($classButton);
            $classDiv.append($classText);

            $('#classList').append($classDiv);
            $('#classInput').val('');
        } else {
            $('#assignedClasses').html(generateFormMessage("error", "Kursen finns redan i listan."));
            $('#classInput').val('');
        }
    } else {
        $('#assignedClasses').html(generateFormMessage("error", "Du måste välja en klass och eller kurser att lägga till."));
    }

    console.log(allChosenClasses);
}
// #endregion

// #region autocomplete for included classes and student groups
function PopulateStudentGroupsArray() {
    studentGroupsArray = []; //empty array
    $.ajax({
        type: 'GET',
        url: '/Assignment/GetAllStudentGroups/',
        success: function (studentGroups) {
            console.log("GetAllStudentGroups");
            console.log(studentGroups);
            studentGroups.forEach(function (studentGroup) {
                var newStudentGroup = { label: studentGroup.name, value: studentGroup.id };
                studentGroupsArray.push(newStudentGroup);
            });
            $('#studentGroupInput').autocomplete({
                source: studentGroupsArray,
                select: function (event, listItems) {
                    //Set current student group
                    $('#currentStudentGroup').empty();
                    $('#currentStudentGroup').append($('<div/>', { html: '<b>Vald klass</b>' }));
                    $('#currentStudentGroup').append($('<div/>', { id: 'CSG', text: listItems.item.label, 'data-id': listItems.item.value, style: 'font-weight: bold; color: green; font-size: 30px;' }));

                    //Load the current student groups included classes
                    LoadCurrentStudentGroupsClasses(listItems.item.value);

                    //clear input field on select
                    $('#studentGroupInput').val(''); //clear input field
                    return false; //cancel event
                }
            });

        }
    });
}

function PopulateClassesArray() {
    classesArray = []; //empty array
    $.ajax({
        type: 'GET',
        url: '/Assignment/GetAllClasses/',
        success: function (classes) {
            console.log("GetAllClasses");
            console.log(classes);
            classes.forEach(function (cls) {
                var newClass = { label: cls.className, value: cls.id };
                classesArray.push(newClass);
            });
            $('#classInput').autocomplete({
                source: classesArray,
                select: function (event, listItems) {
                    //set the selected classes name in the input and save its id in hidden input for later usage
                    $('#classInput').val(listItems.item.label);
                    $('#hiddenClassId').val(listItems.item.value);
                    return false;
                }
            });

        }
    });
}
// #endregion

// #region submit
function AssignStudentGroupsToClass() {
    console.log('AssignStudentGroupsToClass');
    //get data
    var duration = $('#includedClassDurationDropDown').val();
    var team = $('#includedClassTeamIdDropDown').val();
    var studentGroups = $('.groupToClass');
    console.log(duration);
    console.log(team);
    console.log(studentGroups);
    var studentGroupIds = [];
    studentGroups.each(function (studentGroup) {
        console.log('StudentGroup');
        //console.log(studentGroup);
        studentGroupIds.push(studentGroup.id);
        console.log(studentGroupIds);
    });
    //$.ajax({
    //    type: 'POST',
    //    url: 'Assignment/AssignStudentGroups',
    //    data: {},
    //    success: function (result) {
    //        console.log(result);
    //    }
    //});
}

function AssignClassesToStudentGroup() {
    var studentGroupId = $('#CSG').attr('data-id');
    var classes = $('.classToStudentGroup');
    if (studentGroupId && classes.length > 0) {
        var classDataToSend = [];
        classes.each(function (index, cls) {
            var newClass = { ClassId: cls.id, duration: cls.getAttribute('data-duration'), teamId: cls.getAttribute('data-teamid'), StudentGroupId: studentGroupId };
            classDataToSend.push(newClass);
        });
        $.ajax({
            type: 'POST',
            url: '/Assignment/AssignStudentGroups/',
            data: { ClassData: classDataToSend },
            success: function (result) {
                console.log(result);
                if (result > 0) {
                    $('#assignedClasses').html(generateFormMessage("success", result + " kurs/kurser har blivit tillagda."));
                    $('#currentStudentGroup').empty();
                } else {
                    $('#assignedClasses').html(generateFormMessage("error", "Inga kurser har blivit tillagda."));
                }
            }
        });
    }
    //TODO : Clear divs? maybe save? Can be used to add same set of classes to another class. Add button to clear maybe?
}
// #endregion

// #region CRUD Included Class
//needed?
//function SubmitIncludedClass() {
//    console.log("SubmitIncludedClass");
//    var teamId = $('#includedClassTeamBelongingDropDown').val();
//    var duration = $('#includedClassDurationDropDown').val();
//    //var studentGroupId = $('#');
//    console.log(team);
//    console.log(duration);
//    console.log(assignedTeacher);

//    $.ajax({
//        type: 'POST',
//        url: '/Wizard/NewIncludedClass/',
//        data: { Duration: duration, Assigned: assignedTeacher, TeamId: teamId, ClassId: classIds }, //StudentGroupId: studentGroupId },
//        success: function (result) {
//            console.log(result);
//        }
//    });
//}
// #endregion

// #region Populate dropdowns
function GetTeams() {
    $('#includedClassTeamIdDropDown').empty();
    $.ajax({
        type: 'GET',
        url: '/Assignment/GetAllTeams',
        success: function (teams) {
            console.log(teams);
            teams.forEach(function (team) {
                $('#includedClassTeamIdDropDown').append($('<option/>', {
                    text: team.name,
                    value: team.id
                }));
            });
        }
    });
}
// #endregion

//HTML injection for adding classes to student groups and the reversed

$(function () {
    // #region assign student groups to class
    $target = $('#assignStudentGroupsToClassDiv');


    //Choose class (autocomplete)
    var $classInput = $('<input/>', {
        id: 'classInput',
        type: 'text',
        placeholder: 'Kurs',
        class: 'inputTextAuto'
    });

    //Choose duration (HT, VT or Full year) for the included class
    var $includedClassduration = $('<select/>', {
        id: 'includedClassDurationDropDown',
        class: 'inputSelect'
    });


    //Drop down to choose which team the included class should belong to
    var $teamId = $('<select/>', {
        id: 'includedClassTeamIdDropDown',
        class: 'inputSelect'
    });


    //Contains the student groups that are to be assigned or are assigned to the current class
    var $studentGroupList = $('<div/>', {
        class: 'studentGroupList',
        id: 'studentGroupList'
    });


    //Text input with auto completion for choosing student groups
    var $studentGroupInput = $('<input/>', {
        id: 'studentGroupInput',
        type: 'text',
        placeholder: 'Klassnamn',
        class: 'inputTextAuto'
    });


    //User id is automatically set

    //PersonnelId should not be set in the wizard 

    var $submitBtn = $('<button/>', {
        class: 'buttonSubmit',
        onclick: 'AssignStudentGroupsToClass()',
        text: 'Lägg till kurs'
    });

    $($includedClassduration).append('<option value="0" selected="selected">Hela läsåret</option>');
    $($includedClassduration).append('<option value="1">HT</option>');
    $($includedClassduration).append('<option value="2">VT</option>');

    //$target.append($('<h2/>', { text: 'Klasser till kurs' }));
    //$target.append($classInput); //TODO : change how the class that is chosen is shown
    //$target.append($('<div/>', { id: 'currentClass' }));
    //$target.append($includedClassduration);
    //$target.append($teamId);
    //$target.append($studentGroupInput);
    //$target.append($studentGroupList);
    //$target.append($submitBtn);
    // #endregion

    // #region assign classes to student group
    var $target2 = $('#assignClassesToStudentGroupDiv');
    $target2.append($('<h2/>', { text: 'Tilldela kurser till klass' }));

    var $classList = $('<div/>', {
        class: 'classList',
        id: 'classList'
    });

    var $addButton = $('<button/>', {
        onclick: 'AddClass()',
        style: 'align-self: center; background-color: #a5cd4e',
        text: 'Lägg till kurs'
    });

    var $submitBtn2 = $('<button/>', {
        class: 'buttonSubmit',
        onclick: 'AssignClassesToStudentGroup()',
        text: 'Klar med klass',
        style: 'align-self: center; margin: 5px;'
    });

    var $clearClassListButton = $('<button/>', {
        onclick: 'ClearClassList()',
        text: 'Rensa kurslista',
        style: 'align-self: center; background-color: red;'
    });

    $target2.append($('<div/>', { class: 'messageBox', id: 'assignedClasses' }));
    $target2.append($studentGroupInput);
    $target2.append($('<div/>', { id: 'currentStudentGroup' }));
    $target2.append($classInput);
    $target2.append($includedClassduration);
    $target2.append($teamId);
    $target2.append($addButton);
    $target2.append($classList);
    $target2.append($clearClassListButton);
    $target2.append($submitBtn2);


    //Inserts all student groups into an array for autocompletion
    PopulateStudentGroupsArray();
    //Inserts all classes into an array for autocompletion
    PopulateClassesArray();
    //populate dropdown with available teams
    GetTeams();
    // #endregion
});


