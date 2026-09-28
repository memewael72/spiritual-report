document.addEventListener("DOMContentLoaded", () => {
    const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
    const activities = ["prayer", "bible", "mass", "book"];
    const trackerBody = document.getElementById("trackerBody");
    const userNameInput = document.getElementById("userName");
    const weekSelect = document.getElementById("weekSelect");
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");

    // 1. بناء جدول المتابعة برمجياً
    days.forEach(day => {
        const row = document.createElement("tr");
        
        // خانة اسم اليوم
        const dayCell = document.createElement("td");
        dayCell.textContent = day;
        row.appendChild(dayCell);

        // خانات الممارسات الروحية
        activities.forEach(activity => {
            const td = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "tracker-checkbox";
            checkbox.dataset.day = day;
            checkbox.dataset.activity = activity;
            
            td.appendChild(checkbox);
            row.appendChild(td);
        });

        trackerBody.appendChild(row);
    });

    const checkboxes = document.querySelectorAll(".tracker-checkbox");

    // 2. تحديث شريط التطور
    function updateProgress() {
        const total = checkboxes.length;
        let checkedCount = 0;
        
        checkboxes.forEach(box => {
            if (box.checked) checkedCount++;
        });

        const percentage = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
        progressBar.style.width = `${percentage}%`;
        progressPercent.textContent = `${percentage}%`;
    }

    // 3. الحفظ التلقائي في ذاكرة المتصفح
    function saveData() {
        localStorage.setItem("spiritual_user_name", userNameInput.value);
        localStorage.setItem("spiritual_week_select", weekSelect.value);
        
        checkboxes.forEach((box, index) => {
            localStorage.setItem(`spiritual_box_${index}`, box.checked);
        });
    }

    // 4. استعادة البيانات عند الفتح
    function loadData() {
        if(localStorage.getItem("spiritual_user_name")) {
            userNameInput.value = localStorage.getItem("spiritual_user_name");
        }
        if(localStorage.getItem("spiritual_week_select")) {
            weekSelect.value = localStorage.getItem("spiritual_week_select");
        }

        checkboxes.forEach((box, index) => {
            const saved = localStorage.getItem(`spiritual_box_${index}`);
            if (saved === "true") box.checked = true;
        });

        updateProgress();
    }

    // الاستماع للتغييرات لحفظها فوراً
    userNameInput.addEventListener("input", saveData);
    weekSelect.addEventListener("change", saveData);
    checkboxes.forEach(box => {
        box.addEventListener("change", () => {
            updateProgress();
            saveData();
        });
    });

    // 5. وظيفة إرسال التقرير عبر الواتساب
    document.getElementById("shareBtn").addEventListener("click", () => {
        const name = userNameInput.value.trim() || "غير مسجل";
        const week = weekSelect.value;
        const percent = progressPercent.textContent;

        if(name === "غير مسجل") {
            alert("من فضلك اكتب اسمك أولاً قبل إرسال التقرير الروحي.");
            return;
        }

        // صياغة نص الرسالة بشكل روحي أنيق
        const message = `⛪ *تقرير المفكرة الروحية الأسبوعية* ⛪\n` +
                        `*كنيسة الملاك ميخائيل*\n\n` +
                        `👤 *الإسم:* ${name}\n` +
                        `📅 *الفترة:* ${week}\n` +
                        `📊 *نسبة الإنجاز الروحي الإجمالية:* ${percent}\n\n` +
                        `_نسألكم الصلاة من أجل نمونا الروحي!_ 🙏✨`;

        // تحويل النص لرابط واتساب
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // 6. زر تصفير الأسبوع
    document.getElementById("resetBtn").addEventListener("click", () => {
        if (confirm("هل أنت متأكد من رغبتك في تصفير جدول الأسبوع لبدء أسبوع روحي جديد؟")) {
            checkboxes.forEach(box => box.checked = false);
            updateProgress();
            saveData();
        }
    });

    loadData();
});