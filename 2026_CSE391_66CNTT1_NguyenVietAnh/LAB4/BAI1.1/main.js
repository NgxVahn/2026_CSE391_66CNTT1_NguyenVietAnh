let ds = [];

const hoTen = document.getElementById('hoTen');
const diem = document.getElementById('diem');
const btnThem = document.getElementById('btnThem');
const tbody = document.getElementById('tbodySV');
const thongKe = document.getElementById('thongKe');

function xepLoai(d) {
  if (d >= 8.5) return 'Giỏi';
  if (d >= 7) return 'Khá';
  if (d >= 5) return 'Trung bình';
  return 'Yếu';
}

function capNhatThongKe() {
  const tong = ds.length;
  let tb = 0;
  if (tong > 0) {
    const sum = ds.reduce((s, sv) => s + sv.diem, 0);
    tb = sum / tong;
  }
  thongKe.textContent = `Tổng số sinh viên: ${tong} | Điểm trung bình: ${tb.toFixed(2)}`;
}

function render() {
  tbody.innerHTML = '';
  ds.forEach((sv, i) => {
    const tr = document.createElement('tr');
    if (sv.diem < 5) tr.className = 'yeu';
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${sv.hoTen}</td>
      <td>${sv.diem.toFixed(1)}</td>
      <td>${xepLoai(sv.diem)}</td>
      <td><button class="xoa" data-i="${i}">Xóa</button></td>
    `;
    tbody.appendChild(tr);
  });
  capNhatThongKe();
}

function them() {
  const ten = hoTen.value.trim();
  const dStr = diem.value.trim();
  const d = Number(dStr);

  if (!ten) {
    alert('Họ tên không được trống');
    hoTen.focus();
    return;
  }
  if (dStr === '' || isNaN(d) || d < 0 || d > 10) {
    alert('Điểm phải từ 0 đến 10');
    diem.focus();
    return;
  }

  ds.push({ hoTen: ten, diem: d });
  render();

  hoTen.value = '';
  diem.value = '';
  hoTen.focus();
}

btnThem.addEventListener('click', them);

diem.addEventListener('keydown', e => {
  if (e.key === 'Enter') them();
});

tbody.addEventListener('click', e => {
  if (e.target.classList.contains('xoa')) {
    const i = Number(e.target.dataset.i);
    ds.splice(i, 1);
    render();
  }
});