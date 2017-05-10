//Team Crud functions
var ContractsArray = [{ 'value': '1', 'name': 'Timanställd' },
    { 'value': '2', 'name': 'Deltid' },
    { 'value': '3', 'name': 'Heltid' }];


function SubmitTeam() {
    var $newName = $('#teamName').val()
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
    var $name = $('<input/>', {
        class: 'inputText',
        id: 'teamName',
        type: 'text',
    });
    var $submitBtn = $('<button/>', {
        class: 'buttonSubmit',
        onclick: 'SubmitTeam()',
        text: 'Submit',
    });
    $('#teamCrud').append($name).append($submitBtn);

    var $getDataBtnTest = $('<button/>', {
        text: 'Get All Teams',
        onclick: 'GetTeams()'
    });

    $('#teamCrud').append($getDataBtnTest);
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
                    text: subject.name + ' (' +subject.subjectCode + ')'
                }));
            });
            $target.append(subjectDropDown);
        }
    });
});

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
        Contract: contract
    };
    console.log(dataToInsert);

    $.ajax({
        type: 'POST',
        url: '/Wizard/AddNewPersonnel',
        data: dataToInsert,
        success: function (data) {
            console.log(data)
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

    var $submitNewPersonnel = $('<button/>', {
        text: 'Lägg till',
        onclick: 'AddNewPersonnel()',
        class: 'buttonSubmit'
    });

    $('#personnelCrud')
        .append($firstNameInput)
        .append($lastNameInput)
        .append($imgUrlInput)
        .append($teamIdInput)
        .append($availablePointsInput)
        .append($contractSelect)
        .append($submitNewPersonnel);
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
    var teamDropDown = $('<select/>', {
        id: "teamDropDown",
    })
    //TODO : (Future) add pupilCount classroom assignment, prioritizing and if small classes can be grouped together
    GetTeams(teamDropDown);
    $target.append(nameInput);
    $target.append(startingYearDropDown);
    $target.append(teamDropDown);

});
