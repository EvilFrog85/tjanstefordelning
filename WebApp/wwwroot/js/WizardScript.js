///<reference path="index.d.js"/>
function SubmitProgram() {
    var newName = $('#programName').val()
    $('#programName').val('');
    $.ajax({
        type: 'POST',
        url: '/Wizard/NewProgram/',
        data: { "Name": newName},
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
                $('section').append($('<button/>', {
                    text: element.name,
                    onclick: 'DeleteProgram(' + element.id + ')',
                    class: 'programButton',
                    id: 'programButton' + element.id
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

$(function () {
    var name = $('<input/>', {
        id: 'programName',
        type: 'text',
    });
    var submitBtn = $('<button/>', {
        onclick: 'SubmitProgram()',
        text: 'Submit',
    });
    $('section').append(name).append(submitBtn);

    var getDataBtnTest = $('<button/>', {
        text: 'Get All Programs',
        onclick: 'GetPrograms()'
    });

    $('section').append(getDataBtnTest);
});