
const form        = document.getElementById("regForm");
const firstname   = document.getElementById("firstname");
const lastname    = document.getElementById("lastname");
const dayEl       = document.getElementById("bday-day");
const monthEl     = document.getElementById("bday-month");
const yearEl      = document.getElementById("bday-year");
const username    = document.getElementById("username");
const email       = document.getElementById("email");
const website     = document.getElementById("website");
const password    = document.getElementById("password");
const repassword  = document.getElementById("repassword");
const terms       = document.getElementById("terms");
const submitBtn   = document.getElementById("submitBtn");
const formStatus  = document.getElementById("formStatus");


function populateDropdown(selectEl, start, end) {
  for (let i = start; i <= end; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectEl.appendChild(option);
  }
}

populateDropdown(dayEl, 1, 31);

const months = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];
months.forEach((m, idx) => {
  const option = document.createElement("option");
  option.value = idx + 1;
  option.textContent = m;
  monthEl.appendChild(option);
});

const currentYear = new Date().getFullYear();
populateDropdown(yearEl, currentYear - 100, currentYear);


function showError(inputEl, errorId, message) {
  document.getElementById(errorId).textContent = message;
  const target = inputEl.closest(".input-icon") || inputEl;
  target.classList.add("invalid");
  target.classList.remove("valid");
}

function clearError(inputEl, errorId) {
  document.getElementById(errorId).textContent = "";
  const target = inputEl.closest(".input-icon") || inputEl;
  target.classList.remove("invalid");
  target.classList.add("valid");
}

function isValidEmail(value) {
  // simple, readable email pattern: text@text.text
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value);
}


function validateFirstname() {
  if (firstname.value.trim() === "") {
    showError(firstname, "err-firstname", "Firstname is required.");
    return false;
  }
  clearError(firstname, "err-firstname");
  return true;
}

function validateUsername() {
  if (username.value.trim() === "") {
    showError(username, "err-username", "Username is required.");
    return false;
  }
  clearError(username, "err-username");
  return true;
}

function validateEmail() {
 
  if (email.value.trim() !== "" && !isValidEmail(email.value.trim())) {
    showError(email, "err-email", "Please enter a valid email address.");
    return false;
  }
  clearError(email, "err-email");
  return true;
}

function validatePassword() {
  if (password.value.trim() === "") {
    showError(password, "err-password", "Password is required.");
    return false;
  }
  if (password.value.length < 6) {
    showError(password, "err-password", "Password must be at least 6 characters.");
    return false;
  }
  clearError(password, "err-password");
  return true;
}

function validateRepassword() {
  if (repassword.value.trim() === "") {
    showError(repassword, "err-repassword", "Please re-enter your password.");
    return false;
  }
  if (repassword.value !== password.value) {
    showError(repassword, "err-repassword", "Passwords do not match.");
    return false;
  }
  clearError(repassword, "err-repassword");
  return true;
}

function validateBirthday() {
  const errEl = document.getElementById("err-birthday");
  if (dayEl.value && monthEl.value && yearEl.value) {
    errEl.textContent = "";
    return true;
  }
  // Birthday not marked mandatory with * in the layout, so only warn,
  // don't block submission.
  errEl.textContent = "";
  return true;
}

function validateTerms() {
  const errEl = document.getElementById("err-terms");
  if (!terms.checked) {
    errEl.textContent = "You must agree to the terms & conditions.";
    return false;
  }
  errEl.textContent = "";
  return true;
}


[firstname, lastname, username, email, website, password, repassword].forEach(field => {
  field.addEventListener("focus", () => {
    console.log(`Focused: ${field.id}`);
  });
});

firstname.addEventListener("blur", validateFirstname);
username.addEventListener("blur", validateUsername);
email.addEventListener("blur", validateEmail);
password.addEventListener("blur", validatePassword);
repassword.addEventListener("blur", validateRepassword);

dayEl.addEventListener("change", validateBirthday);
monthEl.addEventListener("change", validateBirthday);
yearEl.addEventListener("change", validateBirthday);
terms.addEventListener("change", validateTerms);


repassword.addEventListener("input", validateRepassword);


form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop actual page reload for this demo

  const isFirstnameOk  = validateFirstname();
  const isUsernameOk   = validateUsername();
  const isEmailOk      = validateEmail();
  const isPasswordOk   = validatePassword();
  const isRepasswordOk = validateRepassword();
  const isBirthdayOk   = validateBirthday();
  const isTermsOk      = validateTerms();

  const allValid = isFirstnameOk && isUsernameOk && isEmailOk &&
                    isPasswordOk && isRepasswordOk && isBirthdayOk && isTermsOk;

  if (allValid) {
    formStatus.textContent = "Account created successfully for " + firstname.value + "!";
    formStatus.className = "status success";
    
    form.reset();
    [firstname, lastname, username, email, website, password, repassword]
      .forEach(f => f.classList.remove("valid", "invalid"));
  } else {
    formStatus.textContent = "Please fix the highlighted errors above.";
    formStatus.className = "status fail";
  }
});