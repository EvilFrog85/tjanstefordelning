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
    var $studentGroupDiv = $('<div/>', {
        class: 'groupToClass',
        id: classId
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

    $('#studentGroupInput').val('');
    console.log(allChosenStudentGroups);
}
// #endregion

// #region autocomplete for included classes and student groups
//studentGroupsArray = []; //empty array
function PopulateStudentGroupsArray() {
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetAllStudentGroups/', //TODO: new controller?
        success: function (studentGroups) {
            console.log("GetAllStudentGroups");
            console.log(studentGroups);
            studentGroups.forEach(function (studentGroup) {
                var newStudentGroup = { label: studentGroup.name, value: studentGroup.id };
                studentGroupsArray.push(newStudentGroup);
            });
            $studentGroupInput.autocomplete({
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
//classesArray = []; //empty array
function PopulateClassesArray() {
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetAllClasses/', //TODO : new controller?
        success: function (classes) {
            console.log("GetAllClasses");
            console.log(classes);
            classes.forEach(function (cls) {
                var newClass = { label: cls.name, value: cls.id };
                classesArray.push(newClass);
            });
            $classInput.autocomplete({
                source: classesArray,
                select: function (event, listItems) {
                    //ui.item./ label = klassnamn,/ value=klass id
                    AddClass(listItems.item.label, listItems.item.value);
                    $('#classInput').val(''); //clear input field
                    return false; //cancel event
                }
            });

        }
    });
}
// #endregion

// #region CRUD Included Class
function SubmitIncludedClass() {
    console.log("SubmitIncludedClass");
    var teamId = $('#includedClassTeamBelongingDropDown').val();
    var classId = $('#includedClassClassBelongingInputText').val();
    var duration = $('#includedClassDurationDropDown').val();
    var assignedTeacher = $('#includedClassAssignedTeacher').prop('checked');
    //var studentGroupId = $('#');
    console.log(team);
    console.log(classBelonging);
    console.log(duration);
    console.log(assignedTeacher);

    $.ajax({
        type: 'POST',
        url: '/Wizard/NewIncludedClass/',
        data: { Duration: duration, Assigned: assignedTeacher, TeamId: teamId, ClassId: classIds }, //StudentGroupId: studentGroupId },
        success: function (result) {
            console.log(result);
        }
    });
}
// #endregion



//HTML injection for adding classes to student groups and the reversed

$(function () {
    // #region assign student group to class
    $target = $('#assignStudentGroupsToClassDiv');

    //Contains the student groups that are to be assigned to the current class
    var $studentGroupList = $('<div/>', {
        class: 'studentGroupList',
        id: 'studentGroupList'
    });

    //Inserts all student groups into an array for autocompletion
    PopulateStudentGroupsArray();

    //Text input with auto completion for choosing student groups
    var $studentGroupInput = $('<input/>', {
        id: 'studentGroupInput',
        type: 'text',
        placeholder: 'Klassnamn',
        class: 'inputTextAuto'
    });

    //Choose class (autocomplete)
    var $classInput = $('<input/>', {
        id: 'classInput',
        type: 'text',
        placeholder: 'Kursnamn',
        class: 'inputTextAuto'
    });

    //Choose duration (HT, VT or Full year) for the included class
    var $includedClassduration = $('<select/>', {
        id: 'includedClassDurationDropDown',
        class: 'inputSelect'
    });

    //User id is automatically set

    //Drop down to choose which team the included class should belong to
    var $teamId = $('<select/>', {
        id: 'includedClassTeamIdDropDown',
        class: 'inputSelect'
    });

    //Choose class from Class table (autocomplete)
    var $classBelonging = $('<input/>', {
        id: 'includedClassClassBelongingInputText',
        type: 'text',
        class: 'inputTextAuto',
        placeholder: 'Kurs'
    });

    //PersonnelId should not be set in the wizard 

    var $submitBtn = $('<button/>', {
        class: 'buttonSubmit',
        onclick: 'SubmitIncludedClass()',
        text: 'Lägg till kurs'
    });
    $includedClassduration.empty();
    $($includedClassduration).append('<option value="0" selected="selected">Hela läsåret</option>');
    $($includedClassduration).append('<option value="1">HT</option>');
    $($includedClassduration).append('<option value="2">VT</option>');

    $target.append($teamId);
    $target.append($classBelonging);
    //$target.append($studentGroupInput);
    $target.append($includedClassduration);
    //$target.append($studentGroupList);
    $target.append($assignedLabel).append($assigned);
    $target.append($submitBtn);
    // #endregion

    // #region student group
    $target = $('#assignClassToStudentGroupDiv');

    var $classList = $('<div/>', {
        class: 'classList',
        id: 'classList'
    });

    PopulateClassesArray();



    // #endregion
});