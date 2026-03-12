const hoTenInput = document.getElementById('hoTen');
const diemInput = document.getElementById('diem');
const btnThem = document.getElementById('btnThem');
const tbody = document.getElementById('tbodySinhVien');
const tongSVSpan = document.getElementById('tongSV');
const diemTBSpan = document.getElementById('diemTB');

const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filterXepLoai');
const thDiem = document.getElementById('thDiem');

let students = [];
let filteredStudents = [];
let sortDirection = null; // null | 'asc' | 'desc'

function xepLoai(diem) {
  if (diem >= 8.5) return 'Giỏi';
  if (diem >= 7.0) return 'Khá';
  if (diem >= 5.0) return 'Trung bình';
  return 'Yếu';
}

function capNhatThongKe() {
  const tong = students.length;
  const tongDiem = students.reduce((sum, sv) => sum + sv.diem, 0);
  const tb = tong === 0 ? 0 : tongDiem / tong;
  tongSVSpan.textContent = tong;
  diemTBSpan.textContent = tb.toFixed(2);
}

function renderTable() {
  tbody.innerHTML = '';

  if (filteredStudents.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Không có kết quả</td></tr>`;
    capNhatThongKe();
    return;
  }

  filteredStudents.forEach((sv, index) => {
    const tr = document.createElement('tr');
    if (sv.diem < 5) tr.classList.add('row-yeu');

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${sv.hoTen}</td>
      <td>${sv.diem.toFixed(1)}</td>
      <td>${xepLoai(sv.diem)}</td>
      <td><button class="btnXoa" data-index="${sv.indexGoc}">Xóa</button></td>
    `;

    tbody.appendChild(tr);
  });

  capNhatThongKe();
}

function updateSortHeader() {
  if (sortDirection === 'asc') {
    thDiem.textContent = 'Điểm ▲';
  } else if (sortDirection === 'desc') {
    thDiem.textContent = 'Điểm ▼';
  } else {
    thDiem.textContent = 'Điểm';
  }
}

function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const loai = filterSelect.value;

  // bắt đầu từ mảng gốc + lưu index gốc
  let arr = students.map((sv, index) => ({
    ...sv,
    indexGoc: index
  }));

  // tìm kiếm theo tên
  if (keyword) {
    arr = arr.filter(sv =>
      sv.hoTen.toLowerCase().includes(keyword)
    );
  }

  // lọc theo xếp loại
  if (loai !== 'all') {
    arr = arr.filter(sv => xepLoai(sv.diem) === loai);
  }

  // sắp xếp theo điểm
  if (sortDirection) {
    arr.sort((a, b) => {
      return sortDirection === 'asc'
        ? a.diem - b.diem
        : b.diem - a.diem;
    });
  }

  filteredStudents = arr;
  renderTable();
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

  students.push({ hoTen, diem });

  hoTenInput.value = '';
  diemInput.value = '';
  hoTenInput.focus();

  applyFilters();
}

// Sự kiện thêm
btnThem.addEventListener('click', themSinhVien);

// Enter ở ô điểm để thêm
diemInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    themSinhVien();
  }
});

// Xóa (event delegation)
tbody.addEventListener('click', function (e) {
  if (e.target.classList.contains('btnXoa')) {
    const index = Number(e.target.getAttribute('data-index'));
    students.splice(index, 1);
    applyFilters();
  }
});

// Tìm kiếm realtime
searchInput.addEventListener('input', applyFilters);

// Lọc theo xếp loại
filterSelect.addEventListener('change', applyFilters);

// Sắp xếp khi click tiêu đề "Điểm"
thDiem.addEventListener('click', function () {
  if (sortDirection === null) sortDirection = 'asc';
  else if (sortDirection === 'asc') sortDirection = 'desc';
  else sortDirection = 'asc';
  updateSortHeader();
  applyFilters();
});

// Khởi tạo
updateSortHeader();
applyFilters();