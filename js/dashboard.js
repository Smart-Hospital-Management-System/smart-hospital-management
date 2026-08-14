var totalPatients = document.getElementById("totalPatients");
var totalAppointments = document.getElementById("totalAppointments");
var totalDoctors = document.getElementById("totalDoctors");
var totalMedicines = document.getElementById("totalMedicines");

// Read an array from localStorage and return its item count.
function getSavedItemCount(storageKey) {
  var savedItems = localStorage.getItem(storageKey);

  if (savedItems === null) {
    return 0;
  }

  var items = JSON.parse(savedItems);
  return items.length;
}

// Load the doctor count from the local JSON file.
async function loadDoctorCount() {
  try {
    var response = await fetch("data/doctors.json");

    if (response.ok === false) {
      throw new Error("Doctor data could not be loaded.");
    }

    var doctors = await response.json();
    totalDoctors.textContent = doctors.length;
  } catch (error) {
    totalDoctors.textContent = 0;
  }
}

function showDashboardData() {
  totalPatients.textContent = getSavedItemCount("clinicPatients");
  totalAppointments.textContent = getSavedItemCount("clinicAppointments");
  totalMedicines.textContent = getSavedItemCount("clinicMedicines");
  loadDoctorCount();
}

showDashboardData();
