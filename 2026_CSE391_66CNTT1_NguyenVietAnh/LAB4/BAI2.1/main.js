const form = document.getElementById("form");
const successBox = document.getElementById("success");

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const span = document.getElementById(fieldId + "Error");
  if (span) {
    span.textContent = message;
    span.style.display = "block";
  }
  if (field) {
    field.classList.remove("valid");
    field.classList.add("invalid");
  } else {
    // cho gender, terms (div)
    document.getElementById(fieldId).classList.add("invalid");
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const span = document.getElementById(fieldId + "Error");
  if (span) {
    span.textContent = "";
    span.style.display = "none";
  }
  if (field) {
    field.classList.remove("invalid");
  } else {
    document.getElementById(fieldId).classList.remove("invalid");
  }
}

function markValid(fieldId) {
  clearError(fieldId);
  const field = document.getElementById(fieldId);
  if (field) field.classList.add("valid");
}

// từng hàm validate 1 trường
function validateFullName() {
  const v = document.getElementById("fullName").value.trim();
  const re = /^[a-zA-ZÀ-ỹ\s]+$/;
  if (!v) return showError("fullName", "Không được trống."), false;
  if (v.length < 3) return showError("fullName", "Ít nhất 3 ký tự."), false;
  if (!re.test(v)) return showError("fullName", "Chỉ chữ và khoảng trắng."), false;
  markValid("fullName");
  return true;
}

function validateEmail() {
  const v = document.getElementById("email").value.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!v) return showError("email", "Không được trống."), false;
  if (!re.test(v)) return showError("email", "Email không hợp lệ."), false;
  markValid("email");
  return true;
}

function validatePhone() {
  const v = document.getElementById("phone").value.trim();
  const re = /^0[0-9]{9}$/;
  if (!v) return showError("phone", "Không được trống."), false;
  if (!re.test(v)) return showError("phone", "10 số và bắt đầu bằng 0."), false;
  markValid("phone");
  return true;
}

function validatePassword() {
  const v = document.getElementById("password").value;
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!v) return showError("password", "Không được trống."), false;
  if (!re.test(v))
    return showError("password", "≥8 ký tự, có hoa, thường, số."), false;
  markValid("password");
  return true;
}

function validateConfirmPassword() {
  const p = document.getElementById("password").value;
  const c = document.getElementById("confirmPassword").value;
  if (!c) return showError("confirmPassword", "Nhập lại mật khẩu."), false;
  if (p !== c)
    return showError("confirmPassword", "Không khớp mật khẩu."), false;
  markValid("confirmPassword");
  return true;
}

function validateGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  if (!checked) return showError("gender", "Chọn giới tính."), false;
  clearError("gender");
  document.getElementById("gender").classList.remove("invalid");
  return true;
}

function validateTerms() {
  const checked = document.getElementById("termsCheckbox").checked;
  if (!checked) return showError("terms", "Bạn phải đồng ý."), false;
  clearError("terms");
  document.getElementById("terms").classList.remove("invalid");
  return true;
}

// submit: dùng toán tử &
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let ok = true;
  ok = validateFullName() & ok;
  ok = validateEmail() & ok;
  ok = validatePhone() & ok;
  ok = validatePassword() & ok;
  ok = validateConfirmPassword() & ok;
  ok = validateGender() & ok;
  ok = validateTerms() & ok;

  if (ok) {
    const name = document.getElementById("fullName").value.trim();
    form.style.display = "none";
    successBox.style.display = "block";
    successBox.innerHTML = `Đăng ký thành công! 🎉<br/>Chào mừng, <b>${name}</b>.`;
  }
});

// blur: kiểm tra từng trường
document.getElementById("fullName").addEventListener("blur", validateFullName);
document.getElementById("email").addEventListener("blur", validateEmail);
document.getElementById("phone").addEventListener("blur", validatePhone);
document.getElementById("password").addEventListener("blur", validatePassword);
document.getElementById("confirmPassword").addEventListener("blur", validateConfirmPassword);
document.querySelectorAll('input[name="gender"]').forEach((r) => r.addEventListener("change", validateGender));
document.getElementById("termsCheckbox").addEventListener("change", validateTerms);

["fullName", "email", "phone", "password", "confirmPassword"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => clearError(id));
});