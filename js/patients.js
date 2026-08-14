// Patient records are stored in this array while the page is open.
var patients = [];
var nextPatientId = 1;
var editingPatientId = 0;

// Load saved patients when the page opens.
var savedPatients = localStorage.getItem("clinicPatients");

if (savedPatients !== null) {
  patients = JSON.parse(savedPatients);
}

// Continue patient IDs after the last saved ID.
for (var savedIndex = 0; savedIndex < patients.length; savedIndex++) {
  if (patients[savedIndex].id >= nextPatientId) {
    nextPatientId = patients[savedIndex].id + 1;
  }
}

// Select the form and its fields from the page.
var patientForm = document.getElementById("patientForm");
var patientName = document.getElementById("patientName");
var patientAge = document.getElementById("patientAge");
var patientGender = document.getElementById("patientGender");
var patientPhone = document.getElementById("patientPhone");
var patientBloodGroup = document.getElementById("patientBloodGroup");
var patientAllergies = document.getElementById("patientAllergies");
var patientHistory = document.getElementById("patientHistory");
var patientMessage = document.getElementById("patientMessage");
var patientTableBody = document.getElementById("patientTableBody");
var patientSearch = document.getElementById("patientSearch");
var formTitle = document.getElementById("formTitle");
var savePatientButton = document.getElementById("savePatientButton");
var cancelEditButton = document.getElementById("cancelEditButton");

// Convert the patients array to text and save it in the browser.
function savePatientsToLocalStorage() {
  localStorage.setItem("clinicPatients", JSON.stringify(patients));
}

function showPatientMessage(message, isError) {
  patientMessage.textContent = message;

  if (isError) {
    patientMessage.className = "patient-message error full-width";
  } else {
    patientMessage.className = "patient-message success full-width";
  }
}

function clearPatientForm() {
  patientForm.reset();
  editingPatientId = 0;
  formTitle.textContent = "Add New Patient";
  savePatientButton.textContent = "Add Patient";
  cancelEditButton.className = "secondary-button hidden";
}

function addTableCell(row, value) {
  var cell = document.createElement("td");
  cell.textContent = value;
  row.appendChild(cell);
}

// Display the supplied patient array inside the table.
function displayPatients(patientList) {
  patientTableBody.textContent = "";

  if (patientList.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyCell = document.createElement("td");
    emptyCell.colSpan = 8;
    emptyCell.className = "empty-table-message";
    emptyCell.textContent = "No patients found.";
    emptyRow.appendChild(emptyCell);
    patientTableBody.appendChild(emptyRow);
    return;
  }

  for (var index = 0; index < patientList.length; index++) {
    var patient = patientList[index];
    var row = document.createElement("tr");

    addTableCell(row, patient.name);
    addTableCell(row, patient.age);
    addTableCell(row, patient.gender);
    addTableCell(row, patient.phone);
    addTableCell(row, patient.bloodGroup);
    addTableCell(row, patient.allergies);
    addTableCell(row, patient.medicalHistory);

    var actionCell = document.createElement("td");
    actionCell.className = "table-actions";

    var editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", createEditHandler(patient.id));

    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", createDeleteHandler(patient.id));

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    patientTableBody.appendChild(row);
  }
}

// These small functions remember which patient's button was clicked.
function createEditHandler(patientId) {
  return function () {
    editPatient(patientId);
  };
}

function createDeleteHandler(patientId) {
  return function () {
    deletePatient(patientId);
  };
}

// Add a new patient or save changes to an existing patient.
function savePatient(event) {
  event.preventDefault();

  var name = patientName.value.trim();
  var age = patientAge.value.trim();
  var gender = patientGender.value;
  var phone = patientPhone.value.trim();
  var bloodGroup = patientBloodGroup.value;
  var allergies = patientAllergies.value.trim();
  var medicalHistory = patientHistory.value.trim();

  if (name === "" || age === "" || gender === "" || phone === "" || bloodGroup === "") {
    showPatientMessage("Please complete all required patient details.", true);
    return;
  }

  if (Number(age) < 1 || Number(age) > 120) {
    showPatientMessage("Please enter an age between 1 and 120.", true);
    return;
  }

  if (allergies === "") {
    allergies = "None";
  }

  if (medicalHistory === "") {
    medicalHistory = "None";
  }

  if (editingPatientId === 0) {
    var newPatient = {
      id: nextPatientId,
      name: name,
      age: age,
      gender: gender,
      phone: phone,
      bloodGroup: bloodGroup,
      allergies: allergies,
      medicalHistory: medicalHistory
    };

    patients.push(newPatient);
    nextPatientId = nextPatientId + 1;
    savePatientsToLocalStorage();
    showPatientMessage("Patient added successfully.", false);
  } else {
    for (var index = 0; index < patients.length; index++) {
      if (patients[index].id === editingPatientId) {
        patients[index].name = name;
        patients[index].age = age;
        patients[index].gender = gender;
        patients[index].phone = phone;
        patients[index].bloodGroup = bloodGroup;
        patients[index].allergies = allergies;
        patients[index].medicalHistory = medicalHistory;
      }
    }

    savePatientsToLocalStorage();
    showPatientMessage("Patient updated successfully.", false);
  }

  clearPatientForm();
  patientSearch.value = "";
  displayPatients(patients);
}

// Put the selected patient's details back into the form for editing.
function editPatient(patientId) {
  for (var index = 0; index < patients.length; index++) {
    if (patients[index].id === patientId) {
      editingPatientId = patientId;
      patientName.value = patients[index].name;
      patientAge.value = patients[index].age;
      patientGender.value = patients[index].gender;
      patientPhone.value = patients[index].phone;
      patientBloodGroup.value = patients[index].bloodGroup;
      patientAllergies.value = patients[index].allergies;
      patientHistory.value = patients[index].medicalHistory;
    }
  }

  formTitle.textContent = "Edit Patient";
  savePatientButton.textContent = "Save Changes";
  cancelEditButton.className = "secondary-button";
  patientMessage.textContent = "";
  window.scrollTo(0, 0);
}

// Remove the selected patient from the array after confirmation.
function deletePatient(patientId) {
  var shouldDelete = window.confirm("Are you sure you want to delete this patient?");

  if (shouldDelete === false) {
    return;
  }

  for (var index = 0; index < patients.length; index++) {
    if (patients[index].id === patientId) {
      patients.splice(index, 1);
      break;
    }
  }

  savePatientsToLocalStorage();

  if (editingPatientId === patientId) {
    clearPatientForm();
  }

  patientSearch.value = "";
  showPatientMessage("Patient deleted successfully.", false);
  displayPatients(patients);
}

// Search the array by patient name or phone number.
function searchPatients() {
  var searchText = patientSearch.value.trim().toLowerCase();
  var matchingPatients = [];

  for (var index = 0; index < patients.length; index++) {
    var patientNameText = patients[index].name.toLowerCase();
    var patientPhoneText = patients[index].phone.toLowerCase();

    if (patientNameText.indexOf(searchText) !== -1 || patientPhoneText.indexOf(searchText) !== -1) {
      matchingPatients.push(patients[index]);
    }
  }

  displayPatients(matchingPatients);
}

function cancelEdit() {
  clearPatientForm();
  patientMessage.textContent = "";
}

patientForm.addEventListener("submit", savePatient);
patientSearch.addEventListener("input", searchPatients);
cancelEditButton.addEventListener("click", cancelEdit);

displayPatients(patients);
