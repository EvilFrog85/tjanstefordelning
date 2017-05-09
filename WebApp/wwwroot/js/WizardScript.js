///<reference path="index.d.js"/>
function SubmitProgram() {
    console.log($('#programName').val());
    $.ajax({
        type: 'POST',
        url: '/Wizard/NewProgram/',
        data: { "Name": $('#programName').val() },
        success: function (result) {
            alert(result);
        }
    });
}

function GetPrograms() {
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetPrograms',
        success: function (data) {
            console.log(data);
        }
    });
}

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