var loginForm = document.getElementById("loginForm");
var roleInput = document.getElementById("role");
var usernameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");
var loginMessage = document.getElementById("loginMessage");

function showMessage(message, isSuccess) {
  loginMessage.textContent = message;

  if (isSuccess) {
    loginMessage.className = "login-message success";
  } else {
    loginMessage.className = "login-message";
  }
}

function validateLogin(event) {
  event.preventDefault();

  var selectedRole = roleInput.value;
  var username = usernameInput.value.trim();
  var password = passwordInput.value.trim();

  if (selectedRole === "" || username === "" || password === "") {
    showMessage("Please complete all fields.", false);
    return;
  }

  if (username === "clinic" && password === "1234") {
    showMessage("Login successful. Opening dashboard...", true);
    window.location.href = "dashboard.html";
  } else {
    showMessage("Incorrect username or password.", false);
  }
}

loginForm.addEventListener("submit", validateLogin);
