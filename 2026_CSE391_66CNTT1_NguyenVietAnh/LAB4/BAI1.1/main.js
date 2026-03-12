const hoTenInput = document.getElementById('hoTen');
const diemInput = document.getElementById('diem');
const btnThem = document.getElementById('btnThem');
const tbody = document.getElementById('tbodySinhVien');
const tongSVSpan = document.getElementById('tongSV');
const diemTBSpan = document.getElementById('diemTB');

let danhSachSV = [];

function xepLoai(diem) {
  if (diem >= 8.5) return 'Giỏi';
  if (diem >= 7.0) return 'Khá';
  if (diem >= 5.0) return 'Trung bình';
  return 'Yếu';
}

function capNhatThongKe() {
  const tong = danhSachSV.length;
  let tongDiem = 0;
  danhSachSV.forEach(sv => tongDiem += sv.diem);
  const tb = tong === 0 ? 0 : tongDiem / tong;
  tongSVSpan.textContent = tong;
  diemTBSpan.textContent = tb.toFixed(2);
}

function renderTable() {
  tbody.innerHTML = '';
  danhSachSV.forEach((sv, index) => {
    const tr = document.createElement('tr');
    if (sv.diem < 5) {
      tr.classList.add('row-yeu');
    }

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${sv.hoTen}</td>
      <td>${sv.diem.toFixed(1)}</td>
      <td>${xepLoai(sv.diem)}</td>
      <td><button class="btnXoa" data-index="${index}">Xóa</button></td>
    `;

    tbody.appendChild(tr);
  });

  capNhatThongKe();
}

function themSinhVien() {
  const hoTen = hoTenInput.value.trim();
  const diemStr = diemInput.value.trim();
  const diem = parseFloat(diemStr);

  if (!hoTen) {
    alert('Họ tên không được để trống!');
    hoTenInput.focus();
    return;
  }

  if (diemStr === '' || isNaN(diem) || diem < 0 || diem > 10) {
    alert('Điểm phải là số từ 0 đến 10!');
    diemInput.focus();
    return;
  }

  danhSachSV.push({ hoTen, diem });
  renderTable();

  hoTenInput.value = '';
  diemInput.value = '';
  hoTenInput.focus();
}

btnThem.addEventListener('click', themSinhVien);

diemInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    themSinhVien();
  }
});

tbody.addEventListener('click', function (e) {
  if (e.target.classList.contains('btnXoa')) {
    const index = Number(e.target.getAttribute('data-index'));
    danhSachSV.splice(index, 1);
    renderTable();
  }
});