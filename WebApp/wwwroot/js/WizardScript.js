///<reference path="index.d.js"/>

//Team Crud functions
function SubmitTeam() {
    var newName = $('#teamName').val()
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

function GetTeams(test) {
    $('.teamButton').remove();
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
                test.append($('<option/>', {
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
};

//Team html append
$(function () {
    var name = $('<input/>', {
        id: 'teamName',
        type: 'text',
    });
    var submitBtn = $('<button/>', {
        onclick: 'SubmitTeam()',
        text: 'Submit',
    });
    $('#teamCrud').append(name).append(submitBtn);

    var getDataBtnTest = $('<button/>', {
        text: 'Get All Teams',
        onclick: 'GetTeams()'
    });

    $('#teamCrud').append(getDataBtnTest);
});

//Personnel Crud ajax
//Get all subjects to be able to choose competences
$(function () {
    var $target = $('#personnelCrud');
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetAllSubjects',
        success: function (data) {
            console.log(data);
            var subjectDropDown = $('<select/>'); //subjectDropDown som namn kanske?
            data.forEach(function (subject) {
                subjectDropDown.append($('<option/>', {
                    value: subject.id,
                    text: subject.subjectCode
                }));
            });
            $target.append(subjectDropDown);
        }
    });
});

//Personnel crud
$(function () {
    var $firstNameInput = $('<input/>', {
        placeholder: 'Förnamn..',
        id: 'firstNameInput'
    });
    var $lastNameInput = $('<input/>', {
        placeholder: 'Efternamn..',
        id: 'lastNameInput'
    });
    var $imgUrlInput = $('<input/>', {
        placeholder: 'Bild..',
        id: 'imgUrlInput'
    });
    var $TeamIdInput = $('<select/>', { text: 'Välj Avdelning', id: 'teamIdInput' });
    GetTeams($('#teamIdInput'));
    var $AvailablePointsInput = $('<input/>', {
        type: 'range',
        name: 'Points',
        min: '0',
        max: '100'
    });
    var $ContractInput = $('<input/>', {
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

//Student group ajax
$(function () {
    var $target = $('#studentGroupCrud');
    $.ajax({

    });
});
