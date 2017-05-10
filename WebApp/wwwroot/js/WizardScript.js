///<reference path="jquery-2.1.0-vsdoc.js"/>

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

function GetTeams() {
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
                $('#teamIdInput').append($('<option/>', {
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

//Student group html rendering
$(function () {
    var $target = $('#studentGroupCrud');
    var nameInput = $('<input/>', {
        id: "studentGroupName",
        type: "text",
        placeholder: "Student Group Name..",
    });
    var thisYear = new Date().getFullYear();
    var startingYearDropDown = $('<select/>');
    //Dropdown to select starting year +-2 years from this year
    var years = [];
    for (let i = (thisYear + 2); i >= (thisYear - 2); i--) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = i;
        if (i === thisYear)
            opt.selected = "selected";
        startingYearDropDown.append(opt);
    }

    //Dropdown to select team 
    //var teamDropDown = $('<select/>', {
    //    id: "teamDropDown",
    //})
    //TODO : (Future) add pupilCount classroom assignment, prioritizing and if small classes can be grouped together
    $target.append(nameInput);
    $target.append(startingYearDropDown);
    //$target.append(teamDropDown);

});
