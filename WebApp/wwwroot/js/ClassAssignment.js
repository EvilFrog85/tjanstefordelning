///<reference path="jquery-2.1.0-vsdoc.js"/>

// #region utils
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
        onclick: 'RemoveStudentGroup("' + studentGroupId + '")'
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
    className = $('#classInput').val();
    //TODO : Kolla om denna fullösningen går att fixa lite snyggare
    classId = $('#hiddenClassId').val();
    var duration = $('#includedClassDurationDropDown').val();
    console.log(document.getElementById('includedClassTeamIdDropDown').selectedIndex);
    var teamId = $('#includedClassTeamIdDropDown').val();
    var teamName = $('#includedClassTeamIdDropDown option[value=' + teamId + ']').text();
    console.log(classId);
    var $classDiv = $('<div/>', {
        class: 'classToStudentGroup',
        id: classId,
        'data-duration': duration,
        'data-teamid': teamId,
        'data-teamname': teamName,
        style: "display: flex; flex-direction: row;"
    });
    var $classButton = $('<button/>', {
        text: 'X',
        onclick: 'RemoveClass("' + classId + '")',
        style: "margin: 2px;"
    });
    var infoText = "Kurs: " + className + "    Arbetslag: " + teamName + "    Period: " + string_of_enum(durationEnum, duration);
    var $classText = $('<pre/>', { text: infoText });

    //if(not already in the list)
    var index = allChosenClasses.findIndex(function (element) { console.log(element); return element.ClassId === classId; });
    if (index == -1) {
        allChosenClasses.push({ "ClassName": className, "ClassId": classId });
        $classDiv.append($classButton);
        $classDiv.append($classText);

        $('#classList')
            .append($classDiv);

        $('#classInput').val('');

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
                    $('#currentStudentGroup').empty();
                    $('#currentStudentGroup').append($('<div/>', { text: 'Vald klass' }));
                    $('#currentStudentGroup').append($('<div/>', { id: 'CSG', text: listItems.item.label, 'data-id': listItems.item.value }));

                    //ui.item./ label = klassnamn,/ value=klass id
                    //AddStudentGroup(listItems.item.label, listItems.item.value);
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
                    //$('#currentClass').empty();
                    //$('#currentClass').append($('<div/>', {text : 'Vald kurs'}));
                    //$('#currentClass').append($('<div/>', {text: listItems.item.label, 'data-id': listItems.item.value}))

                    //ui.item./ label = klassnamn,/ value=klass id
                    $('#classInput').val(listItems.item.label);
                    $('#hiddenClassId').val(listItems.item.value);
                    return false;

                    //AddClass(listItems.item.label, listItems.item.value);
                    //$('#classInput').val(''); //clear input field
                    //return false; //cancel event
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
    console.log('AssignClassesToStudentGroup');
    var studentGroupId = $('#CSG').attr('data-id');
    console.log(studentGroupId);
    var classes = $('.classToStudentGroup');
    console.log(classes);
    var classDataToSend = [];
    classes.each(function (index, cls) {
        var newClass = { ClassId: cls.id, duration: cls.getAttribute('data-duration'), teamId: cls.getAttribute('data-teamid'), StudentGroupId: studentGroupId };
        classDataToSend.push(newClass);
    });
    console.log(classDataToSend);
    $.ajax({
        type: 'POST',
        url: '/Assignment/AssignStudentGroups/',
        data: { ClassData: classDataToSend },
        success: function (result) {
            console.log(result);
        }
    });
    //TODO : Clear divs
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
    $target2.append($('<h2/>', { text: 'Kurser till klass' }));

    var $classList = $('<div/>', {
        class: 'classList',
        id: 'classList'
    });

    var $addButton = $('<button/>', {
        class: 'add',
        onclick: 'AddClass()'
    });

    var $submitBtn2 = $('<button/>', {
        class: 'buttonSubmit',
        onclick: 'AssignClassesToStudentGroup()',
        text: 'Spara'
    });

    $target2.append($studentGroupInput);
    $target2.append($('<div/>', { id: 'currentStudentGroup' }));
    $target2.append($classInput);
    $target2.append($includedClassduration);
    $target2.append($teamId);
    $target2.append($classList);
    $target2.append($addButton);
    $target2.append($submitBtn2);


    //Inserts all student groups into an array for autocompletion
    PopulateStudentGroupsArray();
    //Inserts all classes into an array for autocompletion
    PopulateClassesArray();
    //populate dropdown with available teams
    GetTeams();
    // #endregion
});


