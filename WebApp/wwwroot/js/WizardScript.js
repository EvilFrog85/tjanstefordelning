///<reference path="jquery-2.1.0-vsdoc.js"/>

//Team Crud functions
function SubmitTeam() {
    var newName = $('#teamName').val();
    $('#teamName').val('');
    $.ajax({
        type: 'POST',
        url: '/Wizard/NewTeam/',
        data: { "Name": newName },
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
    var name = $('<input/>', {
        class: 'inputText',
        id: 'teamName',
        type: 'text'
    });
    var submitBtn = $('<button/>', {
        class: 'buttonSubmit',
        onclick: 'SubmitTeam()',
        text: 'Submit'
    });
    $('#teamCrud').append(name).append(submitBtn);

    var getDataBtnTest = $('<button/>', {
        text: 'Get All Teams',
        onclick: 'GetTeams()'
    });

    $('#teamCrud').append(getDataBtnTest);
});

//Personnel Crud ajax 
//TODO : CHange it to be general and not only for Personnel crud
//Get all subjects to be able to choose competences
$(function () {
    var $target = $('#personnelCrud');
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetAllSubjects',
        success: function (data) {
            console.log(data);
            var subjectDropDown = $('<select/>');
            data.forEach(function (subject) {
                subjectDropDown.append($('<option/>', {
                    value: subject.id,
                    text: subject.subjectCode + ' - ' + subject.name
                }));
            });
            $target.append(subjectDropDown);
        }
    });
});

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
    var $TeamIdInput = $('<select/>', { class: 'inputSelect', text: 'Välj Avdelning', id: 'teamIdInput' });
    GetTeams($('#teamIdInput'));
    var $AvailablePointsInput = $('<input/>', {
        type: 'range',
        name: 'Points',
        min: '0',
        max: '100'
    });
    var $ContractInput = $('<input/>', {
        class: 'inputText',
        type: 'number',
        min: '1',
        max: '5'
    });


    $('#personnelCrud')
        .append($firstNameInput)
        .append($lastNameInput)
        .append($imgUrlInput)
        .append($TeamIdInput)
        .append($AvailablePointsInput)
        .append($ContractInput);
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
        data: { Name : name, Starting_Year: year, TeamId: team },
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


