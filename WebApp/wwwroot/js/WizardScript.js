///<reference path="index.d.js"/>

//Program Crud functions
function SubmitProgram() {
    var newName = $('#programName').val()
    $('#programName').val('');
    $.ajax({
        type: 'POST',
        url: '/Wizard/NewProgram/',
        data: { "Name": newName },
        success: function (result) {
            console.log(result);
        }
    });
}

function GetPrograms() {
    $('.programButton').remove();
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetPrograms',
        success: function (data) {
            data.forEach(function (element) {
                $('#programCrud').append($('<button/>', {
                    text: element.name,
                    onclick: 'DeleteProgram(' + element.id + ')',
                    class: 'programButton',
                    id: 'programButton' + element.id
                }));
                $('#programIdInput').append($('<option/>', {
                    text: element.name,
                    value: element.id
                }));
            });
        }
    });
}

function DeleteProgram(id) {
    $('#programButton' + id).remove();
    $.ajax({
        type: 'POST',
        url: '/Wizard/DeleteProgram/' + id,
        success: function (data) {
            console.log(data);
        }
    });
};

//Program html append
$(function () {
    var name = $('<input/>', {
        id: 'programName',
        type: 'text',
    });
    var submitBtn = $('<button/>', {
        onclick: 'SubmitProgram()',
        text: 'Submit',
    });
    $('#programCrud').append(name).append(submitBtn);

    var getDataBtnTest = $('<button/>', {
        text: 'Get All Programs',
        onclick: 'GetPrograms()'
    });

    $('#programCrud').append(getDataBtnTest);
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
            var newDropDown = $('<select/>'); //subjectDropDown som namn kanske?
            data.forEach(function (subject) {
                newDropDown.append($('<option/>', {
                    value: subject.id,
                    text: subject.subjectCode
                }));
            });
            $target.append(newDropDown);
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
    var $ProgramIdInput = $('<select/>', { text: 'Välj Avdelning', id: 'programIdInput' });
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
        .append($ProgramIdInput)
        .append($AvailablePointsInput)
        .append($ContractInput);
});

//Student group ajax
$(function () {
    var $target = $('#studentGroupCrud');
    $.ajax({

    });
});
