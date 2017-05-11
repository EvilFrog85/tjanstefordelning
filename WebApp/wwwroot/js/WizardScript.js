///<reference path="jquery-2.1.0-vsdoc.js"/>

//ALEXANDERS OMRÅDE
//Team Crud functions
var ContractsArray = [{ 'value': '0', 'name': 'Tillsvidare' },
    { 'value': '1', 'name': 'Tidsbegränsad' },
    { 'value': '2', 'name': 'Projektanställning' },
    { 'value': '3', 'name': 'Fast anställning' },
    { 'value': '4', 'name': 'Övrig' }
];

function SubmitTeam() {
    var $newName = $('#teamName').val();
    $('#teamName').val('');
    $.ajax({
        type: 'POST',
        url: '/Wizard/NewTeam/',
        data: { "Name": $newName },
        success: function (result) {
            console.log(result);
        }
    });
}

function GetTeams() {
    $('.teamButton').remove();
    $('#teamIdInput').empty();
    $('#teamIdInputForStudentGroup').empty();
    $('#includedClassTeamBelongingDropDown').empty();
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetAllTeams',
        success: function (data) {
            console.log(data);
            data.forEach(function (element) {
                $('#teamCrud').append($('<button/>', {
                    text: element.name,
                    onclick: 'DeleteTeam(' + element.id + ')',
                    class: 'teamButton',
                    id: 'teamButton' + element.id
                }));
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

function DeleteTeam(id) {
    $('#teamButton' + id).remove();
    $.ajax({
        type: 'POST',
        url: '/Wizard/DeleteTeam/' + id,
        success: function (data) {
            console.log(data);
        }
    });
}

//Team html injection
$(function () {
    var $name = $('<input/>', {
        class: 'inputText',
        id: 'teamName',
        type: 'text'
    });
    var $submitBtn = $('<button/>', {
        class: 'buttonSubmit',
        onclick: 'SubmitTeam()',
        text: 'Submit'
    });
    $('#teamCrud').append($name).append($submitBtn);

    var $getDataBtnTest = $('<button/>', {
        text: 'Get All Teams',
        onclick: 'GetTeams()'
    });

    $('#teamCrud').append($getDataBtnTest);
});

//Personnel Crud ajax 
//TODO : CHange it to be general and not only for Personnel crud
//Get all subjects to be able to choose competences
function GetAllSubjects() {
    var allSubjects = [];
    var $target = $('#personnelCrud');
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetAllSubjects',
        success: function (data) {
            var subjectDropDown = $('<select/>', { class: 'inputSelect' }); //subjectDropDown som namn kanske?
            data.forEach(function (subject) {
                subjectDropDown.append($('<option/>', {
                    value: subject.id,
                    text: subject.name + ' (' + subject.subjectCode + ')'
                }));
                allSubjects.push({ 'id': subject.id, 'name': subject.name });
            });
            $target.append(subjectDropDown);
        }
    });
    console.log(allSubjects);
}

function AddNewPersonnel() {

    var firstName = $('#firstNameInput').val();
    var lastName = $('#lastNameInput').val();
    var imageUrl = $('#imgUrlInput').val();
    var teamId = $('#teamIdInput').val();
    var availablePoints = $('#availablePointsInput').val();
    var contract = $('#contractSelect').val();

    var dataToInsert = {
        FirstName: firstName,
        LastName: lastName,
        ImageUrl: imageUrl,
        TeamId: teamId,
        AvailablePoints: availablePoints,
        Contract: contract,
        Competences: allChosenCompetences
    };

    $.ajax({
        type: 'POST',
        url: '/Wizard/AddNewPersonnel',
        data: dataToInsert,
        success: function (data) {
            console.log(data);
        }
    });
}

//Personnel crud html injection
$(function () {
    var $firstNameInput = $('<input/>', {
        class: 'inputText',
        placeholder: 'Förnamn..',
        id: 'firstNameInput'
    });
    var $lastNameInput = $('<input/>', {
        class: 'inputText',
        placeholder: 'Efternamn..',
        id: 'lastNameInput'
    });
    var $imgUrlInput = $('<input/>', {
        class: 'inputText',
        placeholder: 'Bild..',
        id: 'imgUrlInput'
    });
    var $teamIdInput = $('<select/>', { class: 'inputSelect', text: 'Välj Avdelning', id: 'teamIdInput' });
    var $availablePointsInput = $('<input/>', {
        type: 'number',
        class: 'inputText',
        placeholder: 'Anställning i procent',
        id: 'availablePointsInput',
        step: '0.5',
        min: '0',
        max: '100'
    });
    var $contractSelect = $('<select/>', { class: 'inputSelect', id: 'contractSelect' });

    ContractsArray.forEach(function (contract) {
        $contractSelect.append($('<option/>', {
            text: contract.name,
            value: contract.value
        }));
    });

    

    $('#personnelCrud')
        .append($firstNameInput)
        .append($lastNameInput)
        .append($imgUrlInput)
        .append($teamIdInput)
        .append($availablePointsInput)
        .append($contractSelect);
});


//Competence crud

var allChosenCompetences = [];

function SubmitCompetence() {
    $.ajax({
        type: 'POST',
        url: '/Wizard/NewCompetence/',
        data: allChosenCompetences,
        success: function (result) {
            console.log(result);
            allChosenCompetences.empty();
        }
    });
}
//Snälla lös hela findIndex 
function RemoveCompetence(subjectId) {
    $('#' + subjectId).remove();
    var index = allChosenCompetences.findIndex(function (element) { console.log(element); element.SubjectId === subjectId; });
    console.log(index);
    allChosenCompetences.splice(index);
}

function AddCompetence() {
    var qualified = $('#IsCompetenceQualified').prop('checked');
    var competence = $('#competenceInput').val();
    var subjectId = subjectsArray.indexOf(competence) + 1;
    var $competenceDiv = $('<div/>', {
        class: qualified ? 'qualifiedCompetence' : 'competence',
        id: subjectId
    });
    var $competenceButton = $('<button/>', {
        text: 'X',
        onclick: 'RemoveCompetence("' + subjectId + '")'
    });
    var $competenceText = $('<p/>', { text: competence });

    //if(not already in the list)
    allChosenCompetences.push({ "Qualified": qualified, "SubjectId": subjectId });

    $competenceDiv.append($competenceText);
    $competenceDiv.append($competenceButton);

    $('#competenceList')
        .append($competenceDiv);

    $('#competenceInput').val('');
    console.log(allChosenCompetences);
}

$(function () {
    var $competenceList = $('<div/>', {
        class: 'competenceList',
        id: 'competenceList'
    });

    var $CompetenceQualified = $('<input/>', {
        type: 'checkbox',
        id: 'IsCompetenceQualified'
    });

    var $competenceInput = $('<input/>', {
        id: 'competenceInput',
        class: 'inputTextAuto'
    });

    $competenceInput.autocomplete({
        source: subjectsArray,
        appendTo: '#competenceInput'
    });

    var $addCompetenceButton = $('<button/>', {
        id: 'addCompetenceButton',
        class: 'add',
        onclick: 'AddCompetence()'
    });
    var $submitNewPersonnel = $('<button/>', {
        text: 'Lägg till',
        onclick: 'AddNewPersonnel()',
        class: 'buttonSubmit'
    });

    $('#competenceCrud')
        .append($competenceInput)
        .append($CompetenceQualified)
        .append($addCompetenceButton)
        .append($competenceList)
        .append($submitNewPersonnel);

    //    .on('click', function IsCompetenceQualified() {
    //    if ($(this).is(':checked')) {
    //        console.log("checked");
    //        var dropDownValue = $('#personnelCrud').val();
    //        console.log(dropDownValue.subjectCode);
    //    }
    //    else {
    //        console.log("not checked");
    //    }
    //});
});



//BJÖRNS OMRÅDE
function SubmitStudentGroup() {
    console.log("SubmitStudentGroup");
    var name = $('#studentGroupName').val();
    var year = $('#studentGroupStartingYearDropDown').val();
    var team = $('#teamIdInputForStudentGroup').val();
    console.log(name);
    console.log(year);
    console.log(team);
    $.ajax({
        type: 'POST',
        url: '/Wizard/NewStudentGroup/',
        data: { Name: name, Starting_Year: year, TeamId: team },
        success: function (result) {
            console.log(result);
        }
    });
}
//TODO: Create form for update information and decide where to do the update from (clicking SG etc..)
function UpdateStudentGroup(id) {
    console.log("UpdateStudentGroup");
    var name = $('#studentGroupName').val();
    var year = $('#studentGroupStartingYearDropDown').val();
    var team = $('#teamIdInputForStudentGroup').val();
    console.log(name);
    console.log(year);
    console.log(team);
    $.ajax({
        type: 'POST',
        url: '/Wizard/UpdateStudentGroup/' + id,
        data: { Name: name, Starting_Year: year, TeamId: team },
        success: function (result) {
            console.log(result);
        }
    });
}

function DeleteStudentGroup(id) {
    $.ajax({
        type: 'POST',
        url: '/Wizard/DeleteStudentGroup/' + id,
        success: function (data) {
            console.log(data);
        }
    });
}

//Student group html injection
$(function () {
    var $target = $('#studentGroupCrud');
    var $nameInput = $('<input/>', {
        class: 'inputText',
        id: "studentGroupName",
        type: "text",
        placeholder: "Klassbeteckning"
    });
    var thisYear = new Date().getFullYear();
    var $startingYearDropDown = $('<select/>', {
        id: 'studentGroupStartingYearDropDown',
        class: 'inputSelect'
    });
    //Dropdown to select starting year +-2 years from this year
    for (let i = thisYear + 2; i >= thisYear - 2; i--) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = i;
        if (i === thisYear)
            opt.selected = "selected";
        $startingYearDropDown.append(opt);
    }

    var $submitBtn = $('<button/>', {
        class: 'buttonSubmit',
        onclick: 'SubmitStudentGroup()',
        text: 'Lägg till klass'
    });

    //TODO : (Future) add pupilCount classroom assignment, prioritizing and if small classes can be grouped together

    var $teamDropDown = $('<select/>', { class: 'inputSelect', text: 'Välj Avdelning', id: 'teamIdInputForStudentGroup' });
    $target.append($nameInput);
    $target.append($startingYearDropDown);
    $target.append($teamDropDown);
    $target.append($submitBtn);

});
//Included class functions
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

//Included classes html injection
$(function () {
    $target = $('#includedClassCrud');

    var $assigned = $('<input/>', {
        id: 'includedClassAssignedTeacher',
        name: 'isTeacherAssigned',
        type: 'checkbox'
    });

    var $assignedLabel = $('<label/>', {
        for: 'isTeacherAssigned',
        text: 'Kursen har en tilldelad lärare '
    });

    //Kopiera jonas lösning :)
    var $duration = $('<select/>', {
        id: 'includedClassDurationDropDown',
        class: 'inputSelect'
    });

    //User id is automatically set

    var $teamBelonging = $('<select/>', {
        id: 'includedClassTeamBelongingDropDown',
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

    //TODO : StudentGroup - should be able to select several, which method? Compare competence

    var $submitBtn = $('<button/>', {
        class: 'buttonSubmit',
        onclick: 'SubmitIncludedClass()',
        text: 'Lägg till kurs'
    });

    $($duration).append('<option value="0" selected="selected">Hela läsåret<option/>');
    $($duration).append('<option value="1">HT<option/>');
    $($duration).append('<option value="2">VT<option/>');

    $target.append($teamBelonging);
    $target.append($classBelonging);
    $target.append($duration);
    $target.append($assignedLabel).append($assigned);
    $target.append($submitBtn);
});




// JONAS area

/* Auxiliary_assignments */
function SubmitAuxiliaryAssignment() {

    var name = $('#auxiliaryAssignmentName').val();
    var description = $('#auxiliaryAssignmentDesc').val();
    var points = $('#auxiliaryAssignmentPoints').val();
    var duration = $('#auxiliaryAssignmentDurationDropDown').val();
    if ($('#auxiliaryAssignmentMandatory').prop('checked'))
        var mandatory = true;
    else
        var mandatory = false;
    var personnel = $('#auxiliaryAssignmentPersonnel').val();
    var assigned = false;
    if (personnel != "") {
        assigned = true;
    }

    var dataToInsert = {
        Name: name,
        Description: description,
        Points: points,
        Duration: duration,
        Mandatory: mandatory,
        PersonnelSignature: personnel,
        Assigned: assigned
    };
    console.log(dataToInsert);

    $.ajax({
        type: 'POST',
        url: '/Wizard/NewAuxiliaryAssignment',
        data: dataToInsert,
        success: function (data) {
            console.log(data)
        }
    });
}

$(function () {
    var $target = $('#auxiliaryAssignmentCrud');

    var $nameInput = $('<input/>', {
        class: 'inputText',
        id: "auxiliaryAssignmentName",
        type: "text",
        placeholder: "Namn på uppdraget.."
    });

    var $descInput = $('<input />', {
        class: 'inputText',
        id: 'auxiliaryAssignmentDesc',
        type: 'text',
        placeholder: 'Beskrivning av uppdraget..'
    });

    var $pointsInput = $('<input/>', {
        type: 'number',
        class: 'inputText',
        placeholder: 'Poäng (uppdragets omfattning)..',
        id: 'auxiliaryAssignmentPoints',
        step: '1',
        min: '1',
        max: '1000'
    });

    var $durationInput = $('<select/>', {
        id: 'auxiliaryAssignmentDurationDropDown',
        class: 'inputSelect'
    });
    // Options added further down

    var $mandatoryInput = $('<input />', {
        name: 'auxiliaryAssignmentMandatory',
        type: 'checkbox',
        class: 'checkbox',
        value: '1',
        id: 'auxiliaryAssignmentMandatory'
    });

    var $mandatoryLabel = $('<label />', {
        for: 'auxiliaryAssignmentMandatory',
        text: 'Uppdraget måste tillsättas: '
    });

    //TODO - Make autocomplete!
    var $personnelInput = $('<input />', {
        class: 'inputTextAuto',
        id: 'auxiliaryAssignmentPersonnel',
        type: 'text',
        placeholder: 'Tillsätt personal..'
    });

    var $submitBtn = $('<button/>', {
        class: 'buttonSubmit',
        onclick: 'SubmitAuxiliaryAssignment()',
        text: 'Spara uppdrag'
    });

    $target.append($nameInput);
    $target.append($descInput);
    $target.append($pointsInput);
    $target.append($durationInput);
    $($durationInput).append('<option value="0" selected="selected">Läsår</option>');
    $($durationInput).append('<option value="1">HT</option>');
    $($durationInput).append('<option value="2">VT</option>');
    $target.append($mandatoryLabel);
    $target.append($mandatoryInput);
    $target.append($personnelInput);
    $target.append($submitBtn);

});
/* END Auxiliary_assignments */



// SOFIAS area