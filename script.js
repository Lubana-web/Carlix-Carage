let currentUserId = null;
let currentUserName = null;
let currentCarId = null;  // إضافة متغير لتخزين ID السيارة الحالية

const carsData = [
  {
    brand: "Toyota",
    logo: "images/toyota-420x230.jpg",
    models: [
      { id: 1, name: "Camry", color: "White", price: 25000, specs: "4-cylinder engine, gasoline, 2024", image: "images/camry.webp" },
      { id: 2, name: "Corolla", color: "Red", price: 22000, specs: "4-cylinder engine, gasoline, 2023", image: "images/corola.jpg" },
      { id: 3, name: "RAV4", color: "Black", price: 28000, specs: "4-cylinder engine, gasoline, 2025", image: "images/rv4.jpg" },
      { id: 4, name: "Highlander", color: "Blue", price: 35000, specs: "6-cylinder engine, gasoline, 2024", image: "images/hig.jpg" }
    ]
  },
  {
    brand: "Hyundai",
    logo: "images/hondai.jpg",
    models: [
      { id: 5, name: "Sonata", color: "Black", price: 27000, specs: "4-cylinder engine, gasoline, 2025", image: "images/sonata.png" },
      { id: 6, name: "Tucson", color: "Gray", price: 30000, specs: "4-cylinder engine, gasoline, 2024", image: "images/tuc.png" },
      { id: 7, name: "Elantra", color: "Blue", price: 23000, specs: "4-cylinder engine, gasoline, 2023", image: "images/hy.png" }
    ]
  },
  {
    brand: "Nissan",
    logo: "images/nissan.webp",
    models: [
      { id: 8, name: "Altima", color: "Blue", price: 26000, specs: "6-cylinder engine, gasoline, 2024", image: "images/nisan-altima.jpg" },
      { id: 9, name: "Sentra", color: "White", price: 21000, specs: "4-cylinder engine, gasoline, 2023", image: "images/nisan-sentra.jpg" },
      { id: 10, name: "Rogue", color: "Black", price: 29000, specs: "4-cylinder engine, gasoline, 2025", image: "images/nisan-rogue.jpg" }
    ]
  },
  {
    brand: "Ford",
    logo: "images/ford.webp",
    models: [
      { id: 11, name: "Mustang", color: "Red", price: 40000, specs: "8-cylinder engine, gasoline, 2024", image: "images/ford-mustang.jpg" },
      { id: 12, name: "Explorer", color: "Black", price: 35000, specs: "6-cylinder engine, gasoline, 2023", image: "images/explorer.jpg" },
      { id: 13, name: "F-150", color: "Blue", price: 45000, specs: "8-cylinder engine, gasoline, 2025", image: "images/f-150.jpg" }
    ]
  },
  {
    brand: "BMW",
    logo: "images/bmw.webp",
    models: [
      { id: 14, name: "3 Series", color: "White", price: 42000, specs: "4-cylinder engine, gasoline, 2024", image: "images/Series.jpg" },
      { id: 15, name: "X5", color: "Black", price: 60000, specs: "6-cylinder engine, gasoline, 2023", image: "images/x5.jpg" },
      { id: 16, name: "7 Series", color: "Gray", price: 85000, specs: "8-cylinder engine, gasoline, 2025", image: "images/7.jpg" }
    ]
  },
  {
    brand: "Cadillac",
    logo: "images/cadilac.jpg",
    models: [
      { id: 17, name: "CT5", color: "Black", price: 48000, specs: "4-cylinder engine, gasoline, 2024", image: "images/cadillac-ct5.jpg" },
      { id: 18, name: "Escalade", color: "White", price: 90000, specs: "8-cylinder engine, gasoline, 2025", image: "images/cadillac-escalade.jpg" },
      { id: 19, name: "XT5", color: "Silver", price: 52000, specs: "6-cylinder engine, gasoline, 2023", image: "images/cadillac-xt5.jpg" }
    ]
  }
];

// دالة لتحويل أول حرف من كل كلمة إلى حرف كبير
function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

// دالة لتسجيل الدخول
async function login() {
  const firstNameInput = document.getElementById("firstName").value.trim();
  const lastNameInput = document.getElementById("lastName").value.trim();
  const mobileInput = document.getElementById("mobileNumber").value.trim();

  if (firstNameInput === "" || lastNameInput === "" || mobileInput === "") {
    alert("Please fill all the required fields.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/enter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: firstNameInput, lastName: lastNameInput, mobileNumber: mobileInput })
    });

    const data = await response.json();

    if (response.ok) {
      currentUserId = data.customerId;
      currentUserName = toTitleCase(firstNameInput + " " + lastNameInput);

      document.getElementById("userName").textContent = currentUserName;
      document.getElementById("userId").textContent = currentUserId;

      document.getElementById("loginPage").classList.add("hidden");
      document.getElementById("welcomePage").classList.remove("hidden");
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    alert('Network error: ' + error.message);
  }
}

// دالة لعرض الماركات
function goToBrands() {
  document.getElementById("welcomePage").classList.add("hidden");
  document.getElementById("brandsPage").classList.remove("hidden");
  renderBrandsList();
}

// دالة لعرض الماركات في القائمة
function renderBrandsList() {
  const listDiv = document.getElementById("brandsList");
  listDiv.innerHTML = "";

  carsData.forEach((brandObj, index) => {
    const div = document.createElement("div");
    div.classList.add("brand-item");

    // إضافة صورة الشعار
    const img = document.createElement("img");
    img.src = brandObj.logo;
    img.alt = brandObj.brand + " logo";
    div.appendChild(img);

    // إضافة اسم الماركة
    const span = document.createElement("span");
    span.textContent = brandObj.brand;
    div.appendChild(span);

    div.onclick = () => showModels(index);
    listDiv.appendChild(div);
  });
}

// دالة لعرض النماذج الخاصة بكل ماركة
function showModels(brandIndex) {
  const brandObj = carsData[brandIndex];
  document.getElementById("selectedBrand").textContent = brandObj.brand;

  document.getElementById("brandsPage").classList.add("hidden");
  document.getElementById("modelsPage").classList.remove("hidden");

  renderModelsList(brandObj.models);
}

// دالة للرجوع إلى صفحة الماركات
function backToBrands() {
  document.getElementById("modelsPage").classList.add("hidden");
  document.getElementById("brandsPage").classList.remove("hidden");
  document.getElementById("carDetails").classList.add("hidden");
}

// دالة لعرض النماذج الخاصة بالموديل
function renderModelsList(models) {
  const listDiv = document.getElementById("modelsList");
  listDiv.innerHTML = "";
  models.forEach(model => {
    const div = document.createElement("div");
    div.classList.add("model-item");
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "10px";
    div.style.cursor = "pointer";

    // إضافة صورة السيارة
    const img = document.createElement("img");
    img.src = model.image;
    img.alt = model.name;
    img.style.width = "100px";
    img.style.height = "60px";
    img.style.objectFit = "cover";
    div.appendChild(img);

    // إضافة اسم الموديل
    const span = document.createElement("span");
    span.textContent = model.name;
    div.appendChild(span);

    div.onclick = () => showCarDetailsByModel(model);
    listDiv.appendChild(div);
  });
}

// دالة لعرض تفاصيل السيارة
function showCarDetailsByModel(model) {
  currentCarId = model.id; // تعيين ID السيارة الحالية

  document.getElementById("carName").textContent = model.name;
  document.getElementById("carColor").textContent = model.color;
  document.getElementById("carPrice").textContent = model.price;
  document.getElementById("carSpecs").textContent = model.specs;

  let detailsDiv = document.getElementById("carDetails");

  // إضافة صورة النموذج إذا لم تكن موجودة
  let img = detailsDiv.querySelector("img.car-image");
  if (!img) {
    img = document.createElement("img");
    img.classList.add("car-image");
    img.style.width = "300px";
    img.style.height = "180px";
    img.style.objectFit = "cover";
    img.style.display = "block";
    img.style.marginBottom = "10px";
    detailsDiv.insertBefore(img, detailsDiv.firstChild);
  }
  img.src = model.image;
  img.alt = model.name;

  document.getElementById("carDetails").classList.remove("hidden");
}

// دالة لإغلاق تفاصيل السيارة
function closeDetails() {
  document.getElementById("carDetails").classList.add("hidden");
}

// دالة للاختبار القيادة
async function testDrive() {
  try {
    // نطلب من السيرفر حالة السيارة قبل التجربة
    const checkResponse = await fetch('http://localhost:3000/check-car-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carId: currentCarId })
    });

    const checkData = await checkResponse.json();

    if (!checkResponse.ok) {
      alert('Error: ' + checkData.error);
      return;
    }

    // إذا السيارة غير متاحة
    if (!checkData.available) {
      alert("عذرًا، هذه السيارة غير متاحة حاليًا.");
      const searchAnother = confirm("هل ترغب بالبحث عن سيارة أخرى؟");
      if (searchAnother) {
        // ارجع لواجهة اختيار السيارات مثلاً
        document.getElementById("modelsPage").classList.remove("hidden");
        document.getElementById("carDetails").classList.add("hidden");
      }
      return;
    }

    // إذا السيارة متاحة: تابع تجربة القيادة
    alert(`${currentUserName}, يرجى التوجه لمنطقة تجربة القيادة.`);

    // إظهار الأزرار
    document.getElementById("buyCarBtn").classList.remove("hidden");
    document.getElementById("cancelReservationBtn").classList.remove("hidden");

    // إرسال طلب حجز السيارة مؤقتًا
    const reserveResponse = await fetch('http://localhost:3000/reserve-car', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: currentUserId, carId: currentCarId })
    });

    const reserveData = await reserveResponse.json();

    if (reserveResponse.ok) {
      alert("تم حجز السيارة لتجربة القيادة.");
    } else {
      alert('خطأ أثناء الحجز: ' + reserveData.error);
    }

  } catch (error) {
    alert('Network error: ' + error.message);
  }
}


// دالة لشراء السيارة
async function buyCar() {
  try {
    const response = await fetch('http://localhost:3000/sell-car', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: currentUserId, carId: currentCarId })
    });

    const data = await response.json();
    if (response.ok) {
      alert("Car purchased successfully!");
      // تحديث حالة السيارة وتغيير عرض الزر
      document.getElementById("buyCarBtn").classList.add("hidden");
      document.getElementById("cancelReservationBtn").classList.add("hidden");
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    alert('Network error: ' + error.message);
  }
}

// دالة لإلغاء الحجز
async function cancelReservation() {
  try {
    const response = await fetch('http://localhost:3000/cancel-reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: currentUserId, carId: currentCarId })
    });

    const data = await response.json();
    if (response.ok) {
      alert("Reservation canceled. The car is now available.");
      // تحديث حالة السيارة وتغيير عرض الزر
      document.getElementById("buyCarBtn").classList.add("hidden");
      document.getElementById("cancelReservationBtn").classList.add("hidden");
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    alert('Network error: ' + error.message);
  }
}
