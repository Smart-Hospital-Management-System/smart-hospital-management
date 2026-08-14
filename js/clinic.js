var patients = [];
var appointments = [];
var consultations = [];
var medicines = [];
var nextConsultationId = 1;
var nextMedicineId = 1;

// Doctor Consultation page elements
var consultationForm = document.getElementById("consultationForm");
var consultationAppointment = document.getElementById("consultationAppointment");
var consultationPatientDetails = document.getElementById("consultationPatientDetails");
var consultationDiagnosis = document.getElementById("consultationDiagnosis");
var consultationPrescription = document.getElementById("consultationPrescription");
var consultationFollowUp = document.getElementById("consultationFollowUp");
var consultationMessage = document.getElementById("consultationMessage");

// Patient detail elements
var detailName = document.getElementById("detailName");
var detailAge = document.getElementById("detailAge");
var detailGender = document.getElementById("detailGender");
var detailBloodGroup = document.getElementById("detailBloodGroup");
var detailAllergies = document.getElementById("detailAllergies");
var detailMedicalHistory = document.getElementById("detailMedicalHistory");

// Medicine Inventory page elements
var medicineForm = document.getElementById("medicineForm");
var medicineName = document.getElementById("medicineName");
var medicineStock = document.getElementById("medicineStock");
var medicinePrice = document.getElementById("medicinePrice");
var medicineMessage = document.getElementById("medicineMessage");
var medicineTableBody = document.getElementById("medicineTableBody");

// Billing page elements
var billingForm = document.getElementById("billingForm");
var billMedicineSelect = document.getElementById("billMedicineSelect");
var billMedicineName = document.getElementById("billMedicineName");
var billQuantity = document.getElementById("billQuantity");
var billPrice = document.getElementById("billPrice");
var billingMessage = document.getElementById("billingMessage");
var simpleBill = document.getElementById("simpleBill");
var billDisplayMedicine = document.getElementById("billDisplayMedicine");
var billDisplayQuantity = document.getElementById("billDisplayQuantity");
var billDisplayPrice = document.getElementById("billDisplayPrice");
var billDisplayTotal = document.getElementById("billDisplayTotal");

function showServiceMessage(messageElement, message, isError) {
  messageElement.textContent = message;

  if (isError) {
    messageElement.className = "service-message error full-width";
  } else {
    messageElement.className = "service-message success full-width";
  }
}

function findPatient(patientId) {
  for (var index = 0; index < patients.length; index++) {
    if (String(patients[index].id) === String(patientId)) {
      return patients[index];
    }
  }

  return null;
}

function findAppointment(appointmentId) {
  for (var index = 0; index < appointments.length; index++) {
    if (String(appointments[index].id) === String(appointmentId)) {
      return appointments[index];
    }
  }

  return null;
}

function findMedicine(medicineId) {
  for (var index = 0; index < medicines.length; index++) {
    if (String(medicines[index].id) === String(medicineId)) {
      return medicines[index];
    }
  }

  return null;
}

// Load patients and appointments created on the other pages.
function loadConsultationData() {
  var savedPatients = localStorage.getItem("clinicPatients");
  var savedAppointments = localStorage.getItem("clinicAppointments");
  var savedConsultations = localStorage.getItem("clinicConsultations");

  if (savedPatients !== null) {
    patients = JSON.parse(savedPatients);
  }

  if (savedAppointments !== null) {
    appointments = JSON.parse(savedAppointments);
  }

  if (savedConsultations !== null) {
    consultations = JSON.parse(savedConsultations);
  }

  for (var index = 0; index < consultations.length; index++) {
    if (consultations[index].id >= nextConsultationId) {
      nextConsultationId = consultations[index].id + 1;
    }
  }

  for (var appointmentIndex = 0; appointmentIndex < appointments.length; appointmentIndex++) {
    var appointment = appointments[appointmentIndex];
    var appointmentOption = document.createElement("option");
    appointmentOption.value = appointment.id;
    appointmentOption.textContent = appointment.patientName + " - " + appointment.doctorName + " - " + appointment.date;
    consultationAppointment.appendChild(appointmentOption);
  }
}

// Show patient information when an appointment is selected.
function showSelectedPatient() {
  var selectedAppointment = findAppointment(consultationAppointment.value);

  if (selectedAppointment === null) {
    consultationPatientDetails.className = "consultation-patient-details full-width hidden";
    return;
  }

  var selectedPatient = findPatient(selectedAppointment.patientId);

  if (selectedPatient === null) {
    showServiceMessage(consultationMessage, "Patient details could not be found.", true);
    consultationPatientDetails.className = "consultation-patient-details full-width hidden";
    return;
  }

  detailName.textContent = selectedPatient.name;
  detailAge.textContent = selectedPatient.age;
  detailGender.textContent = selectedPatient.gender;
  detailBloodGroup.textContent = selectedPatient.bloodGroup;
  detailAllergies.textContent = selectedPatient.allergies;
  detailMedicalHistory.textContent = selectedPatient.medicalHistory;
  consultationPatientDetails.className = "consultation-patient-details full-width";
  consultationMessage.textContent = "";
}

// Save one completed consultation in localStorage.
function saveConsultation(event) {
  event.preventDefault();

  var selectedAppointment = findAppointment(consultationAppointment.value);
  var diagnosis = consultationDiagnosis.value.trim();
  var prescription = consultationPrescription.value.trim();
  var followUpDate = consultationFollowUp.value;

  if (selectedAppointment === null || diagnosis === "" || prescription === "" || followUpDate === "") {
    showServiceMessage(consultationMessage, "Please complete all consultation details.", true);
    return;
  }

  var selectedPatient = findPatient(selectedAppointment.patientId);

  if (selectedPatient === null) {
    showServiceMessage(consultationMessage, "Patient details could not be found.", true);
    return;
  }

  var newConsultation = {
    id: nextConsultationId,
    appointmentId: selectedAppointment.id,
    patientId: selectedPatient.id,
    patientName: selectedPatient.name,
    doctorName: selectedAppointment.doctorName,
    diagnosis: diagnosis,
    prescription: prescription,
    followUpDate: followUpDate
  };

  consultations.push(newConsultation);
  nextConsultationId = nextConsultationId + 1;
  localStorage.setItem("clinicConsultations", JSON.stringify(consultations));

  consultationForm.reset();
  consultationPatientDetails.className = "consultation-patient-details full-width hidden";
  showServiceMessage(consultationMessage, "Consultation saved successfully.", false);
}

// Load medicines saved in the browser.
function loadMedicines() {
  var savedMedicines = localStorage.getItem("clinicMedicines");

  if (savedMedicines !== null) {
    medicines = JSON.parse(savedMedicines);
  }

  for (var index = 0; index < medicines.length; index++) {
    if (medicines[index].id >= nextMedicineId) {
      nextMedicineId = medicines[index].id + 1;
    }
  }
}

function addMedicineTableCell(row, value) {
  var cell = document.createElement("td");
  cell.textContent = value;
  row.appendChild(cell);
}

// Display medicines and show a warning when stock is below 10.
function displayMedicines() {
  medicineTableBody.textContent = "";

  if (medicines.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyCell = document.createElement("td");
    emptyCell.colSpan = 4;
    emptyCell.className = "empty-table-message";
    emptyCell.textContent = "No medicines found.";
    emptyRow.appendChild(emptyCell);
    medicineTableBody.appendChild(emptyRow);
    return;
  }

  for (var index = 0; index < medicines.length; index++) {
    var medicine = medicines[index];
    var row = document.createElement("tr");

    addMedicineTableCell(row, medicine.name);
    addMedicineTableCell(row, medicine.stock);
    addMedicineTableCell(row, "Rs. " + Number(medicine.price).toFixed(2));

    var statusCell = document.createElement("td");

    if (Number(medicine.stock) < 10) {
      statusCell.textContent = "Low Stock";
      statusCell.className = "low-stock";
    } else {
      statusCell.textContent = "In Stock";
      statusCell.className = "in-stock";
    }

    row.appendChild(statusCell);
    medicineTableBody.appendChild(row);
  }
}

// Refresh the medicine list used by Billing.
function displayBillingMedicineOptions() {
  billMedicineSelect.textContent = "";

  var firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = "Select from inventory";
  billMedicineSelect.appendChild(firstOption);

  for (var index = 0; index < medicines.length; index++) {
    var medicineOption = document.createElement("option");
    medicineOption.value = medicines[index].id;
    medicineOption.textContent = medicines[index].name;
    billMedicineSelect.appendChild(medicineOption);
  }
}

// Add a medicine to the inventory array and save it.
function addMedicine(event) {
  event.preventDefault();

  var name = medicineName.value.trim();
  var stock = medicineStock.value;
  var price = medicinePrice.value;

  if (name === "" || stock === "" || price === "") {
    showServiceMessage(medicineMessage, "Please complete all medicine details.", true);
    return;
  }

  if (Number(stock) < 0 || Number(price) < 0) {
    showServiceMessage(medicineMessage, "Stock and price cannot be negative.", true);
    return;
  }

  var newMedicine = {
    id: nextMedicineId,
    name: name,
    stock: Number(stock),
    price: Number(price)
  };

  medicines.push(newMedicine);
  nextMedicineId = nextMedicineId + 1;
  localStorage.setItem("clinicMedicines", JSON.stringify(medicines));

  medicineForm.reset();
  displayMedicines();
  displayBillingMedicineOptions();
  showServiceMessage(medicineMessage, "Medicine added successfully.", false);
}

// Fill the billing price when an inventory medicine is selected.
function selectBillingMedicine() {
  var selectedMedicine = findMedicine(billMedicineSelect.value);

  if (selectedMedicine === null) {
    return;
  }

  billMedicineName.value = "";
  billPrice.value = selectedMedicine.price;
}

// Use the typed medicine name instead of a previous selection.
function enterBillingMedicine() {
  if (billMedicineName.value.trim() !== "") {
    billMedicineSelect.value = "";
  }
}

// Calculate quantity multiplied by price and display a basic bill.
function calculateBill(event) {
  event.preventDefault();

  var selectedMedicine = findMedicine(billMedicineSelect.value);
  var enteredMedicineName = billMedicineName.value.trim();
  var finalMedicineName = enteredMedicineName;
  var quantity = Number(billQuantity.value);
  var price = Number(billPrice.value);

  if (selectedMedicine !== null) {
    finalMedicineName = selectedMedicine.name;
  }

  if (finalMedicineName === "" || billQuantity.value === "" || billPrice.value === "") {
    showServiceMessage(billingMessage, "Please enter the medicine, quantity, and price.", true);
    simpleBill.className = "simple-bill hidden";
    return;
  }

  if (quantity <= 0 || price < 0) {
    showServiceMessage(billingMessage, "Enter a valid quantity and price.", true);
    simpleBill.className = "simple-bill hidden";
    return;
  }

  var total = quantity * price;

  billDisplayMedicine.textContent = finalMedicineName;
  billDisplayQuantity.textContent = quantity;
  billDisplayPrice.textContent = "Rs. " + price.toFixed(2);
  billDisplayTotal.textContent = "Rs. " + total.toFixed(2);
  simpleBill.className = "simple-bill";
  showServiceMessage(billingMessage, "Bill calculated successfully.", false);
}

consultationAppointment.addEventListener("change", showSelectedPatient);
consultationForm.addEventListener("submit", saveConsultation);
medicineForm.addEventListener("submit", addMedicine);
billMedicineSelect.addEventListener("change", selectBillingMedicine);
billMedicineName.addEventListener("input", enterBillingMedicine);
billingForm.addEventListener("submit", calculateBill);

loadConsultationData();
loadMedicines();
displayMedicines();
displayBillingMedicineOptions();
