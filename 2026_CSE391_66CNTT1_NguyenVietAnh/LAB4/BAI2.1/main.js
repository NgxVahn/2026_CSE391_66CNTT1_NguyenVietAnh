const $ = id => document.getElementById(id);

function showError(id, msg) {
  $(id + 'Error').textContent = msg;
  const inp = $(id);
  if (inp && inp.type !== 'checkbox') { inp.classList.remove('ok'); inp.classList.add('bad'); }
}
function clearError(id) {
  $(id + 'Error').textContent = '';
  const inp = $(id);
  if (inp && inp.type !== 'checkbox') { inp.classList.remove('bad'); }
}

const RE = {
  ten: /^[a-zA-ZÀ-ỹ\s]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  sdt: /^0[0-9]{9}$/,
  mk: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
};

function valTen() {
  clearError('hoTen');
  const v = $('hoTen').value.trim();
  if (!v) { showError('hoTen', 'Không được trống.'); return false; }
  if (v.length < 3) { showError('hoTen', 'Ít nhất 3 ký tự.'); return false; }
  if (!RE.ten.test(v)) { showError('hoTen', 'Chỉ chữ và khoảng trắng.'); return false; }
  $('hoTen').classList.add('ok');
  return true;
}
function valEmail() {
  clearError('email');
  const v = $('email').value.trim();
  if (!v) { showError('email', 'Không được trống.'); return false; }
  if (!RE.email.test(v)) { showError('email', 'Sai định dạng email.'); return false; }
  $('email').classList.add('ok');
  return true;
}
function valSdt() {
  clearError('sdt');
  const v = $('sdt').value.trim();
  if (!v) { showError('sdt', 'Không được trống.'); return false; }
  if (!RE.sdt.test(v)) { showError('sdt', '10 số, bắt đầu bằng 0.'); return false; }
  $('sdt').classList.add('ok');
  return true;
}
function valMk() {
  clearError('mk');
  const v = $('mk').value;
  if (!v) { showError('mk', 'Không được trống.'); return false; }
  if (!RE.mk.test(v)) { showError('mk', '≥8 ký tự, có hoa, thường, số.'); return false; }
  $('mk').classList.add('ok');
  return true;
}
function valMk2() {
  clearError('mk2');
  if ($('mk2').value !== $('mk').value) { showError('mk2', 'Không khớp mật khẩu.'); return false; }
  $('mk2').classList.add('ok');
  return true;
}
function valGt() {
  $('gtError').textContent = '';
  if (!document.querySelector('input[name="gt"]:checked')) {
    $('gtError').textContent = 'Bắt buộc chọn.';
    return false;
  }
  return true;
}
function valDk() {
  clearError('dk');
  if (!$('dk').checked) { showError('dk', 'Phải tick.'); return false; }
  return true;
}

// input → xóa lỗi khi gõ lại
['hoTen','email','sdt','mk','mk2'].forEach(id => {
  $(id).addEventListener('input', () => clearError(id));
});
$('mk').addEventListener('input', () => clearError('mk2'));

// blur → validate từng trường
$('hoTen').addEventListener('blur', valTen);
$('email').addEventListener('blur', valEmail);
$('sdt').addEventListener('blur', valSdt);
$('mk').addEventListener('blur', () => { valMk(); if ($('mk2').value) valMk2(); });
$('mk2').addEventListener('blur', valMk2);

// submit → gọi hết bằng & (không dừng sớm)
$('form').addEventListener('submit', e => {
  e.preventDefault();
  const ok = valTen() & valEmail() & valSdt() & valMk() & valMk2() & valGt() & valDk();
  if (!ok) return;
  $('form').classList.add('hidden');
  $('ok').classList.remove('hidden');
  $('ten').textContent = $('hoTen').value.trim();
});