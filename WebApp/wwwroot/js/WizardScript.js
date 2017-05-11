///<reference path="jquery-2.1.0-vsdoc.js"/>

//Team Crud functions

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
//Personnel crud
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

//Student Group
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

function DeleteStudentGroup(id) {
    //$('#teamButton' + id).remove();

    //$.ajax({
    //    type: 'POST',
    //    url: '/Wizard/DeleteStudentGroup/' + id,
    //    success: function (data) {
    //        console.log(data);
    //    }
    //});
}

//Student group html rendering
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

function AddCompetence() {
    
    var qualified = $('#IsCompetenceQualified').prop('checked');
    var competence = $('#competenceInput').val();
    var subjectId = subjectsArray.indexOf(competence) + 1;
    var $competenceDiv = $('<div/>', {
        class: qualified ? 'qualifiedCompetence' : 'competence'
    });
    var $competenceButton = $('<button/>', {
        text: 'X'
    });
    var $competenceText = $('<p/>', { text: competence });

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



//Student group ajax
$(function () {
    var $target = $('#studentGroupCrud');
    var $nameInput = $('<input/>', {
        class: 'inputText',
        id: "studentGroupName",
        type: "text",
        placeholder: "Student Group Name.."
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
        text: 'Submit'
    });

    //TODO : (Future) add pupilCount classroom assignment, prioritizing and if small classes can be grouped together


    var $teamDropDown = $('<select/>', { class: 'inputSelect', text: 'Välj Avdelning', id: 'teamIdInputForStudentGroup' });
    $target.append($nameInput);
    $target.append($startingYearDropDown);
    $target.append($teamDropDown);
    $target.append($submitBtn);

});


