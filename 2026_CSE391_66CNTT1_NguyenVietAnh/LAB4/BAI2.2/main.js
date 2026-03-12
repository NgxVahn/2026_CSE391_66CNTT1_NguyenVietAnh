const getById = (id) => document.getElementById(id);

const prices = {Ao: 150000,Quan: 200000,Giay: 300000,};

function showError(fieldId, message) {
  const field = getById(fieldId);
  const span = getById(fieldId + "Error");
  if (span) {
    span.textContent = message;
    span.style.display = "block";
  }
  if (field) field.classList.add("invalid");
}

function clearError(fieldId) {
  const field = getById(fieldId);
  const span = getById(fieldId + "Error");
  if (span) {
    span.textContent = "";
    span.style.display = "none";
  }
  if (field) field.classList.remove("invalid");
}

function validateProduct() {
  const value = getById("product").value;
  if (!value) {
    showError("product", "Vui lòng chọn sản phẩm.");
    return false;
  }
  clearError("product");
  return true;
}

function validateQuantity() {
  const value = Number(getById("quantity").value);
  if (!value) {
    showError("quantity", "Vui lòng nhập số lượng.");
    return false;
  }
  if (!Number.isInteger(value) || value < 1 || value > 99) {
    showError("quantity", "Số lượng từ 1 đến 99.");
    return false;
  }
  clearError("quantity");
  return true;
}

function validateDeliveryDate() {
  const value = getById("deliveryDate").value;
  if (!value) {
    showError("deliveryDate", "Vui lòng chọn ngày giao.");
    return false;
  }
  const selected = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const max = new Date();
  max.setDate(max.getDate() + 30);
  max.setHours(0, 0, 0, 0);

  if (selected < today) {
    showError("deliveryDate", "Không được chọn ngày trong quá khứ.");
    return false;
  }
  if (selected > max) {
    showError("deliveryDate", "Không quá 30 ngày từ hôm nay.");
    return false;
  }
  clearError("deliveryDate");
  return true;
}

function validateAddress() {
  const value = getById("address").value.trim();
  if (!value) {
    showError("address", "Địa chỉ không được trống.");
    return false;
  }
  if (value.length < 10) {
    showError("address", "Địa chỉ ít nhất 10 ký tự.");
    return false;
  }
  clearError("address");
  return true;
}

function validateNote() {
  const value = getById("note").value;
  const length = value.length;
  const counter = getById("noteCounter");
  counter.textContent = `${length}/200`;
  counter.classList.toggle("too-long", length > 200);

  if (length > 200) {
    showError("note", "Ghi chú không quá 200 ký tự.");
    return false;
  }
  clearError("note");
  return true;
}

function validatePayment() {
  const checked = document.querySelector('input[name="payment"]:checked');
  if (!checked) {
    showError("paymentGroup", "Vui lòng chọn phương thức thanh toán.");
    return false;
  }
  clearError("paymentGroup");
  return true;
}

function updateUnitPrice() {
  const product = getById("product").value;
  const price = prices[product];
  const text = price
    ? price.toLocaleString("vi-VN") + " ₫"
    : "0 ₫";
  getById("unitPrice").textContent = "Giá: " + text;
}

function updateTotal() {
  const product = getById("product").value;
  const qty = Number(getById("quantity").value);
  const price = prices[product];
  if (!price || !qty || qty < 1 || qty > 99) {
    getById("totalPrice").textContent = "0 ₫";
    return;
  }
  const total = price * qty;
  getById("totalPrice").textContent =
    total.toLocaleString("vi-VN") + " ₫";
}

// submit: validate + hiện div xác nhận
getById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  ok = validateProduct() & ok;
  ok = validateQuantity() & ok;
  ok = validateDeliveryDate() & ok;
  ok = validateAddress() & ok;
  ok = validateNote() & ok;
  ok = validatePayment() & ok;
  if (!ok) return;

  const productOption = document.querySelector("#product option:checked");
  const productName = productOption ? productOption.textContent : "";
  const qty = Number(getById("quantity").value);
  const totalText = getById("totalPrice").textContent;
  const date = getById("deliveryDate").value;

  getById("orderSummary").innerHTML = `
    <p><b>Sản phẩm:</b> ${productName}</p>
    <p><b>Số lượng:</b> ${qty}</p>
    <p><b>Tổng tiền:</b> ${totalText}</p>
    <p><b>Ngày giao:</b> ${date}</p>
  `;
  getById("confirmBox").classList.remove("hidden");
});

// xác nhận / hủy
getById("confirmBtn").addEventListener("click", () => {
  getById("confirmBox").classList.add("hidden");
  getById("orderForm").classList.add("hidden");
  getById("successMessage").classList.remove("hidden");
  getById("successMessage").textContent =
    "Đặt hàng thành công! Cảm ơn bạn.";
});

getById("cancelBtn").addEventListener("click", () => {
  getById("confirmBox").classList.add("hidden");
});

// blur: validate từng trường
getById("product").addEventListener("blur", validateProduct);
getById("quantity").addEventListener("blur", validateQuantity);
getById("deliveryDate").addEventListener("blur", validateDeliveryDate);
getById("address").addEventListener("blur", validateAddress);
getById("note").addEventListener("blur", validateNote);
document
  .querySelectorAll('input[name="payment"]')
  .forEach((radio) =>
    radio.addEventListener("change", validatePayment)
  );

// input/change: xóa lỗi + cập nhật realtime
getById("product").addEventListener("change", () => {
  clearError("product");
  updateUnitPrice();
  updateTotal();
});
getById("quantity").addEventListener("input", () => {
  clearError("quantity");
  updateTotal();
});
getById("deliveryDate").addEventListener("input", () =>
  clearError("deliveryDate")
);
getById("address").addEventListener("input", () =>
  clearError("address")
);
getById("note").addEventListener("input", validateNote);
document
  .querySelectorAll('input[name="payment"]')
  .forEach((radio) =>
    radio.addEventListener("input", () =>
      clearError("paymentGroup")
    )
  );

// khởi tạo ban đầu
updateUnitPrice();
updateTotal();
validateNote();