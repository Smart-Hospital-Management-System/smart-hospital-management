var patients = [];
var doctors = [];
var appointments = [];
var nextAppointmentId = 1;

var appointmentForm = document.getElementById("appointmentForm");
var patientSelect = document.getElementById("appointmentPatient");
var doctorSelect = document.getElementById("appointmentDoctor");
var appointmentDate = document.getElementById("appointmentDate");
var appointmentTime = document.getElementById("appointmentTime");
var appointmentReason = document.getElementById("appointmentReason");
var appointmentMessage = document.getElementById("appointmentMessage");
var appointmentTableBody = document.getElementById("appointmentTableBody");

function showAppointmentMessage(message, isError) {
  appointmentMessage.textContent = message;

  if (isError) {
    appointmentMessage.className = "appointment-message error full-width";
  } else {
    appointmentMessage.className = "appointment-message success full-width";
  }
}

// Load patients saved by the Patient Management page.
function loadPatients() {
  var savedPatients = localStorage.getItem("clinicPatients");

  if (savedPatients !== null) {
    patients = JSON.parse(savedPatients);
  }

  for (var index = 0; index < patients.length; index++) {
    var patientOption = document.createElement("option");
    patientOption.value = patients[index].id;
    patientOption.textContent = patients[index].name + " - " + patients[index].phone;
    patientSelect.appendChild(patientOption);
  }
}

// Load the sample doctors from the local JSON file.
async function loadDoctors() {
  try {
    var response = await fetch("data/doctors.json");

    if (response.ok === false) {
      throw new Error("Doctor data could not be loaded.");
    }

    doctors = await response.json();
    doctorSelect.textContent = "";

    var firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = "Select a doctor";
    doctorSelect.appendChild(firstOption);

    for (var index = 0; index < doctors.length; index++) {
      var doctorOption = document.createElement("option");
      doctorOption.value = doctors[index].id;
      doctorOption.textContent = doctors[index].name + " - " + doctors[index].specialization;
      doctorSelect.appendChild(doctorOption);
    }
  } catch (error) {
    doctorSelect.textContent = "";

    var errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Doctors could not be loaded";
    doctorSelect.appendChild(errorOption);

    showAppointmentMessage("Doctors could not be loaded. Open the project using a local server.", true);
  }
}

// Load appointments that were saved earlier.
function loadAppointments() {
  var savedAppointments = localStorage.getItem("clinicAppointments");

  if (savedAppointments !== null) {
    appointments = JSON.parse(savedAppointments);
  }

  for (var index = 0; index < appointments.length; index++) {
    if (appointments[index].id >= nextAppointmentId) {
      nextAppointmentId = appointments[index].id + 1;
    }
  }
}

// Save the complete appointment array in the browser.
function saveAppointments() {
  localStorage.setItem("clinicAppointments", JSON.stringify(appointments));
}

function findPatient(patientId) {
  for (var index = 0; index < patients.length; index++) {
    if (String(patients[index].id) === patientId) {
      return patients[index];
    }
  }

  return null;
}

function findDoctor(doctorId) {
  for (var index = 0; index < doctors.length; index++) {
    if (String(doctors[index].id) === doctorId) {
      return doctors[index];
    }
  }

  return null;
}

function addAppointmentTableCell(row, value) {
  var cell = document.createElement("td");
  cell.textContent = value;
  row.appendChild(cell);
}

// Display every appointment from the array in the table.
function displayAppointments() {
  appointmentTableBody.textContent = "";

  if (appointments.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyCell = document.createElement("td");
    emptyCell.colSpan = 7;
    emptyCell.className = "empty-table-message";
    emptyCell.textContent = "No appointments found.";
    emptyRow.appendChild(emptyCell);
    appointmentTableBody.appendChild(emptyRow);
    return;
  }

  for (var index = 0; index < appointments.length; index++) {
    var appointment = appointments[index];
    var row = document.createElement("tr");

    addAppointmentTableCell(row, appointment.patientName);
    addAppointmentTableCell(row, appointment.doctorName);
    addAppointmentTableCell(row, appointment.doctorSpecialization);
    addAppointmentTableCell(row, appointment.date);
    addAppointmentTableCell(row, appointment.time);
    addAppointmentTableCell(row, appointment.reason);

    var actionCell = document.createElement("td");
    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button appointment-delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", createDeleteAppointmentHandler(appointment.id));

    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    appointmentTableBody.appendChild(row);
  }
}

function createDeleteAppointmentHandler(appointmentId) {
  return function () {
    deleteAppointment(appointmentId);
  };
}

// Create an appointment using the selected patient and doctor.
function bookAppointment(event) {
  event.preventDefault();

  var patientId = patientSelect.value;
  var doctorId = doctorSelect.value;
  var date = appointmentDate.value;
  var time = appointmentTime.value;
  var reason = appointmentReason.value.trim();

  if (patientId === "" || doctorId === "" || date === "" || time === "" || reason === "") {
    showAppointmentMessage("Please complete all appointment details.", true);
    return;
  }

  var selectedPatient = findPatient(patientId);
  var selectedDoctor = findDoctor(doctorId);

  if (selectedPatient === null || selectedDoctor === null) {
    showAppointmentMessage("Please select a valid patient and doctor.", true);
    return;
  }

  var newAppointment = {
    id: nextAppointmentId,
    patientId: selectedPatient.id,
    patientName: selectedPatient.name,
    doctorId: selectedDoctor.id,
    doctorName: selectedDoctor.name,
    doctorSpecialization: selectedDoctor.specialization,
    date: date,
    time: time,
    reason: reason
  };

  appointments.push(newAppointment);
  nextAppointmentId = nextAppointmentId + 1;
  saveAppointments();
  displayAppointments();
  appointmentForm.reset();
  showAppointmentMessage("Appointment booked successfully.", false);
}

// Delete one appointment and save the updated array.
function deleteAppointment(appointmentId) {
  var shouldDelete = window.confirm("Are you sure you want to delete this appointment?");

  if (shouldDelete === false) {
    return;
  }

  for (var index = 0; index < appointments.length; index++) {
    if (appointments[index].id === appointmentId) {
      appointments.splice(index, 1);
      break;
    }
  }

  saveAppointments();
  displayAppointments();
  showAppointmentMessage("Appointment deleted successfully.", false);
}

appointmentForm.addEventListener("submit", bookAppointment);

loadPatients();
loadAppointments();
displayAppointments();
loadDoctors();
