///<reference path="jquery-2.1.0-vsdoc.js"/>

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

function AddStudentGroup(className, classId) {
    var duration = $('#includedClassDurationDropDown').val();
    var $studentGroupDiv = $('<div/>', {
        class: 'groupToClass',
        id: classId,
        'data-id': classId,
        'data-duration': duration
    });
    var $studentGroupButton = $('<button/>', {
        text: 'X',
        onclick: 'RemoveStudentGroup("' + classId + '")'
    });
    var $studentGroupText = $('<p/>', { text: className });

    //if(not already in the list)
    allChosenStudentGroups.push({ "StudentGroupName": className, "StudentGroupId": classId });

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
    var $classDiv = $('<div/>', {
        class: 'groupToClass',
        id: classId
    });
    var $classButton = $('<button/>', {
        text: 'X',
        onclick: 'RemoveClass("' + classId + '")'
    });
    var $classText = $('<p/>', { text: className });

    //if(not already in the list)
    allChosenClasses.push({ "ClassName": className, "ClassId": classId });

    $classDiv.append($classText);
    $classDiv.append($classButton);

    $('#classList')
        .append($classDiv);

    $('#classInput').val('');
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
                    //ui.item./ label = klassnamn,/ value=klass id
                    AddStudentGroup(listItems.item.label, listItems.item.value);
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
            //$classInput.autocomplete({
            $('#classInput').autocomplete({
                source: classesArray,
                select: function (event, listItems) {
                    //Show selected course
                    $('#currentClass').empty();
                    $('#currentClass').append($('<div/>', {text : 'Vald kurs'}));
                    $('#currentClass').append($('<div/>', {text: listItems.item.label, 'data-id': listItems.item.value}))

                    ////ui.item./ label = klassnamn,/ value=klass id
                    //AddClass(listItems.item.label, listItems.item.value);
                    $('#classInput').val(''); //clear input field
                    return false; //cancel event
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
    $target.append($('<h2/>', { text: 'Klasser till kurs' }));

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

    $target.append($classInput); //TODO : change how the class that is chosen is shown
    $target.append($('<div/>', { id: 'currentClass' }));
    $target.append($includedClassduration);
    $target.append($teamId);
    $target.append($studentGroupInput);
    $target.append($studentGroupList);
    $target.append($submitBtn);
    // #endregion

    //// #region assign classes to student group
    //var $target2 = $('#assignClassesToStudentGroupDiv');
    //$target2.append($('<h2/>', { text: 'Kurser till klass' }));

    //var $classList = $('<div/>', {
    //    class: 'classList',
    //    id: 'classList'
    //});

    //$target2.append($studentGroupInput);
    //$target2.append($classInput);
    //$target2.append($includedClassduration);
    //$target2.append($teamId);
    //$target2.append($classList);



    //Inserts all student groups into an array for autocompletion
    PopulateStudentGroupsArray();
    //Inserts all classes into an array for autocompletion
    PopulateClassesArray();
    //populate dropdown with available teams
    GetTeams();
    // #endregion
});


