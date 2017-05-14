///<reference path="jquery-2.1.0-vsdoc.js"/>


//To generate advanced checkboxes, styled submitButtons and form messages
//Nice to have
function checkboxMaker(name, statement) {
    return '<label for="' + name + '" class="labelCheckbox">' + statement + ': </label><label class="switch"><div><span>JA</span><span>NEJ</span></div><input id="' + name + '" name="' + name + '" type="checkbox" value="1" /><div class="slider"></div></label>';
}

function submitButtonMaker(buttonId, buttonText, onClickFuncName) {
    return '<div class="wizButtonContainer"><button id="' + buttonId + '" onclick="' + onClickFuncName+'()" class="buttonSubmit">' + buttonText + '</button></div>';
}

function generateFormMessage(type, message) {
    if (type == "error")
        return '<p class="errorMessage">' + message + '</p>';
    else
        return '<p class="successMessage">' + message + '</p>';
}
//END



//ALEXANDERS OMRÅDE
//Team Crud functions

//Temporary info-box
function GetCounts() {
    var countLabels = ["Avdelningar", "Personal", "Tillgänglig personal", "Inkluderade kurser", "Kurser kvar att tilldela"];
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetAllCounts',
        success: function (counts) {
            for (var i = 0; i < counts.length; i++) {
                $('#teamCrud').append($('<p/>', { text: countLabels[i] + ': ' + counts[i] }));
            }
        }
    });
}

// #region TEAM-crud

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
function CreateInputTeam() {
    var $name = $('<input/>', {
        class: 'inputText',
        id: 'teamName',
        type: 'text'
    });


    var $submitBtn = submitButtonMaker("createInputTeam", "Lägg till arbetslag", "SubmitTeam");
    $('#teamCrudForm').append($name).append($submitBtn);

    var $getDataBtnTest = $('<button/>', {
        text: 'Get All Teams',
        onclick: 'GetTeams()'
    });

    $('#teamCrudForm').append($getDataBtnTest);
}

// #endregion

//Personnel Crud ajax - NOT USING ATM
//TODO : Change it to be general and not only for Personnel crud
//Get all subjects to be able to choose competences

var allChosenCompetences = [];
function GetAllSubjects() {
    var allSubjects = [];
    var $target = $('#personnelCrudForm');
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

// #region PERSONNEL - crud

function AddNewPersonnel() {
    var firstName = $('#firstNameInput').val();
    var lastName = $('#lastNameInput').val();
    var imageUrl = $('#imgUrlInput').val();
    var teamId = $('#teamIdInput').val();
    var availablePoints = $('#availablePointsInput').val();
    var contract = $('#contractSelect').val();

    var personnelData = {
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
        data: personnelData,
        success: function (id) {
            $('#personnelList').append($('<p/>', {
                text: firstName + ' ' + lastName
            })).append($('<button/>', {
                class: 'edit',
                onclick: 'GetPersonToEdit(' + id + ')'
            }));
            $('#firstNameInput').val('');
            $('#lastNameInput').val('');
            $('#imgUrlInput').val('');
            $('#teamIdInput').val('');
            $('#availablePointsInput').val('');
            $('#contractSelect').val('');
            allChosenCompetences = [];
            $('#competenceList').empty();

        }
    });
}

function GetPersonToEdit(id) {
    $.ajax({
        type: 'GET',
        url: '/Wizard/GetPersonnelById/' + id,
        success: function (person) {
            $('#firstNameInput').val(person.firstName);
            $('#lastNameInput').val(person.lastName);
            $('#imgUrlInput').val(person.imageUrl);
            $('#teamIdInput').val(person.teamId);
            $('#availablePointsInput').val(person.availablePoints);
            $('#contractSelect').val(person.contract);
            console.log(person.competences);
            person.competences.forEach(function (competence) {
                var $competenceDiv = $('<div/>', {
                    class: competence.qualified ? 'qualifiedCompetence' : 'competence',
                    id: competence.subjectId
                });
                var $competenceButton = $('<button/>', {
                    text: 'X',
                    onclick: 'RemoveCompetence("' + competence.subjectId + '")'
                });
                var $competenceText = $('<p/>', { text: competence.name });

                //if(not already in the list)
                allChosenCompetences.push({ "Qualified": competence.qualified, "SubjectId": competence.subjectId });

                $competenceDiv.append($competenceText);
                $competenceDiv.append($competenceButton);

                $('#competenceList')
                    .append($competenceDiv);
            });
        }
    });
}

//Personnel crud html injection
function CreateInputPersonnel() {
    var $personnelList = $('<ul/>', { id: 'personnelList' });
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
    $('#personnelCrudForm')
        .append($firstNameInput)
        .append($lastNameInput)
        .append($imgUrlInput)
        .append($teamIdInput)
        .append($availablePointsInput)
        .append($contractSelect)
        .append($personnelList);

    $('#personnelList').append($('<p/>', {
        text: 'Björn'
    })).append($('<button/>', {
        class: 'edit',
        onclick: 'GetPersonToEdit(67)'
    }));
}

// #endregion


// #region COMPETENCE - crud

//Competence crud

function SubmitCompetence() {
    $.ajax({
        type: 'POST',
        url: '/Wizard/NewCompetence/',
        data: allChosenCompetences,
        success: function (succeeded) {
            console.log(succeeded);
            allChosenCompetences.empty();
        }
    });
}

function RemoveCompetence(subjectId) {
    $('#' + subjectId).remove();
    var index = allChosenCompetences.findIndex(function (element) { return element.SubjectId == subjectId; });
    allChosenCompetences.splice(index, 1);
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

function CreateInputCompetence() {
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
        source: subjectsArray
    });

    var $addCompetenceButton = $('<button/>', {
        id: 'addCompetenceButton',
        class: 'add',
        onclick: 'AddCompetence()'
    });

    var $submitNewPersonnel = submitButtonMaker("CreateInputCompetence", "Lägg till kompetens", "AddNewPersonnel");

    $('#competenceCrudForm')
        .append($competenceInput)
        .append($CompetenceQualified)
        .append($addCompetenceButton)
        .append($competenceList)
        .append($submitNewPersonnel);
}

// #endregion

//BJÖRNS OMRÅDE

// #region STUDENTGROUP - crud

function SubmitStudentGroup() {
    var name = $('#studentGroupName').val();
    var year = $('#studentGroupStartingYearDropDown').val();
    var team = $('#teamIdInputForStudentGroup').val();
    $.ajax({
        type: 'POST',
        url: '/Wizard/NewStudentGroup/',
        data: { Name: name, Starting_Year: year, TeamId: team },
        success: function (inputIsSuccess) {
            console.log(inputIsSuccess);
        }
    });
}
//TODO: Create form for update information (automatically filled in inputs)
function UpdateStudentGroup(id) {
    var name = $('#studentGroupName').val();
    var year = $('#studentGroupStartingYearDropDown').val();
    var team = $('#teamIdInputForStudentGroup').val();
    $.ajax({
        type: 'POST',
        url: '/Wizard/UpdateStudentGroup/' + id,
        data: { Name: name, Starting_Year: year, TeamId: team },
        success: function (inputIsSuccess) {
            console.log(inputIsSuccess);
        }
    });
}

function DeleteStudentGroup(studentGroupId) {
    $.ajax({
        type: 'POST',
        url: '/Wizard/DeleteStudentGroup/' + studentGroupId,
        success: function (deletionSucceeded) {
            console.log(deletionSucceeded);
        }
    });
}

//Student group html injection
function CreateStudentGroupInput() {
    var $target = $('#studentGroupCrudForm');
    var $nameInput = $('<input/>', {
        class: 'inputText',
        id: "studentGroupName",
        type: "text",
        placeholder: "Klassbeteckning"
    });

    //Get current year
    var thisYear = new Date().getFullYear();

    var $startingYearDropDown = $('<select/>', {
        id: 'studentGroupStartingYearDropDown',
        class: 'inputSelect'
    });
    //Dropdown to select starting year +-2 years from this year
    for (let i = thisYear + 2; i >= thisYear - 2; i--) {
        //Create new option
        var option = document.createElement('option');
        option.value = i;
        option.text = i;
        if (i === thisYear) //This year is default choice
            option.selected = "selected";
        $startingYearDropDown.append(option);
    }

    var $submitBtn = submitButtonMaker("CreateStudentGroupInput", "Lägg till klass", "SubmitStudentGroup");
    
    //TODO : (Future) add pupilCount. USE: classroom assignment, prioritizing and if small classes can be grouped together

    //Add all elements to the student group div
    var $teamDropDown = $('<select/>', { class: 'inputSelect', text: 'Välj Avdelning', id: 'teamIdInputForStudentGroup' });
    $target.append($nameInput);
    $target.append($startingYearDropDown);
    $target.append($teamDropDown);
    $target.append($submitBtn);

}

// #endregion


// #region INCLUDEDCLASS - crud

//Included Class CRUD
var allChosenStudentGroups = [];

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
var studentGroupsArray = [];
function CreateIncludedClassInput() {
    $target = $('#includedClassCrudForm');
    studentGroupsArray = [];
    function PopulateStudentGroupArray() {
        $.ajax({
            type: 'GET',
            url: '/Wizard/GetAllStudentGroups/',
            success: function (studentGroups) {
                console.log("GetAllStudentGroups");
                console.log(studentGroups);
                studentGroups.forEach(function (studentGroup) {
                    var newStudentGroup = { label: studentGroup.name, key: studentGroup.value };
                    studentGroupsArray.push(newStudentGroup);
                });
                $studentGroupInput.autocomplete({
                    source: studentGroupsArray
                });
            }
        });
    }

    var $studentGroupList = $('<div/>', {
        class: 'studentGroupList',
        id: 'studentGroupList'
    });

    PopulateStudentGroupArray();

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
    var $studentGroupInput = $('<input/>', {
        id: 'studentGroupInput',
        type: 'text',
        placeholder: 'Klassnamn',
        class: 'inputTextAuto'
    });

    var $submitBtn = submitButtonMaker("CreateIncludedClassInput", "Lägg till kurs", "SubmitIncludedClass");

    $($duration).append('<option value="0" selected="selected">Hela läsåret<option/>');
    $($duration).append('<option value="1">HT<option/>');
    $($duration).append('<option value="2">VT<option/>');

    $target.append($teamBelonging);
    $target.append($classBelonging);
    $target.append($studentGroupInput);
    $target.append($duration);
    $target.append($assignedLabel).append($assigned);
    $target.append($submitBtn);
}

// #endregion


// JONAS area

// #region AUXILIARYASSIGNMENT - crud

/* Auxiliary_assignments */
function SubmitAuxiliaryAssignment() {

    var name = $('#auxiliaryAssignmentName').val();
    var description = $('#auxiliaryAssignmentDesc').val();
    var points = $('#auxiliaryAssignmentPoints').val();
    var duration = $('#auxiliaryAssignmentDurationDropDown').val();
    var mandatory;
    if ($('#auxiliaryAssignmentMandatory').prop('checked'))
        mandatory = true;
    else
        mandatory = false;
    var personnel = $('#auxiliaryAssignmentPersonnel').val();
    var assigned = false;
    if (personnel !== "") {
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
            console.log(data);
        }
    });
}

function CreateAuxiliaryAssignmentInput() {
    var $target = $('#auxiliaryAssignmentCrudForm');

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

    var $mandatoryInput = checkboxMaker("auxiliaryAssignmentMandatory", "Måste tillsättas");
    
    //TODO - Make autocomplete!
    var $personnelInput = $('<input />', {
        class: 'inputTextAuto',
        id: 'auxiliaryAssignmentPersonnel',
        type: 'text',
        placeholder: 'Tillsätt personal..'
    });

    var $submitBtn = submitButtonMaker("CreateAuxiliaryAssignmentInput", "Spara uppdrag", "SubmitAuxiliaryAssignment");

    $target.append($nameInput);
    $target.append($descInput);
    $target.append($pointsInput);
    $target.append($durationInput);
    $($durationInput).append('<option value="0" selected="selected">Läsår</option>');
    $($durationInput).append('<option value="1">HT</option>');
    $($durationInput).append('<option value="2">VT</option>');
    $target.append($mandatoryInput);
    $target.append($personnelInput);
    $target.append($submitBtn);

}
/* END Auxiliary_assignments */
// #endregion


// SOFIAS area