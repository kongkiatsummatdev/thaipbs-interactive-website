

/* ======================================================
   ICONS & GSAP SETUP
====================================================== */
lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);

/* ======================================================
   HERO HEADER FADE-IN
====================================================== */
gsap.to(".header-content", {
  opacity: 1,
  y: 0,
  duration: 1.5,
  ease: "power3.out",
  delay: 0.2
});

/* ======================================================
   GOLDEN TIMELINE LINE
====================================================== */
gsap.to(".golden-line", {
  scaleY: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".timeline-container",
    start: "top center",
    end: "bottom center",
    scrub: true
  }
});

/* ======================================================
   TIMELINE CARDS FADE UP
====================================================== */
document.querySelectorAll('.card').forEach(card => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});

/* ======================================================
   PARALLAX INGREDIENT BLOBS
====================================================== */
document.querySelectorAll('.ingredient').forEach(item => {
  const speed = item.getAttribute('data-speed');
  gsap.to(item, {
    y: -300 * speed,
    rotation: 360,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });
});

/* ======================================================
   MAP JOURNEY CONFIG
====================================================== */
const locations = {
  intro: { scale: 1.5, x: 55, y: 45 },
  jp: { scale: 2.2, x: 70.1, y: 33.5 },
  cn: { scale: 2.2, x: 65.7, y: 31.0 },
  au: { scale: 2.2, x: 75.7, y: 71.0 },
  fr: { scale: 2.2, x: 60.2, y: 30.0 },
  us: { scale: 2.2, x: 35.9, y: 33.0 },
  overview: { scale: 1.5, x: 55, y: 45 }
};

function calculateTransform(loc) {
  return {
    scale: loc.scale,
    xPercent: (50 - loc.x) * loc.scale,
    yPercent: (50 - loc.y) * loc.scale
  };
}

/* ======================================================
   MAP INITIAL POSITION
====================================================== */
const initialPos = calculateTransform(locations.intro);
gsap.set(".map-inner", {
  scale: initialPos.scale,
  xPercent: initialPos.xPercent,
  yPercent: initialPos.yPercent
});

/* ======================================================
   ROUTE PATH DRAWING
====================================================== */
document.querySelectorAll('.route-path').forEach(path => {
  const len = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: len,
    strokeDashoffset: len
  });
});

/* ======================================================
   MAP SCENE CREATOR
====================================================== */
function createScene(targetId, locKey, pathId, flagId) {
  const targetPos = calculateTransform(locations[locKey]);

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: targetId,
      start: "top bottom",
      end: "center center",
      scrub: 1
    }
  });

  tl.to(".map-inner", {
    scale: targetPos.scale,
    xPercent: targetPos.xPercent,
    yPercent: targetPos.yPercent,
    ease: "power1.inOut",
    duration: 1
  });

  if (pathId) {
    tl.to(pathId, {
      strokeDashoffset: 0,
      ease: "power1.out",
      duration: 0.6
    }, "<");
  }

  ScrollTrigger.create({
    trigger: targetId,
    start: "top center",
    end: "bottom center",

    onEnter: () => {
      if (!flagId) return;
      const flagEl = document.querySelector(flagId);
      flagEl.innerHTML = `<img src="${flagEl.dataset.flag}" alt="">`;
      gsap.to(flagId, {
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)"
      });
    },

    onLeave: () => {
      if (!flagId) return;
      const flagEl = document.querySelector(flagId);
      gsap.to(flagId, {
        scale: 0,
        duration: 0.1,
        onComplete: () => {
          flagEl.innerHTML = '<img src="assets/images/flags/th.svg" alt="">';
          gsap.to(flagId, { scale: 1, duration: 0.1 });
        }
      });
    },

    onEnterBack: () => {
      if (!flagId) return;
      const flagEl = document.querySelector(flagId);
      gsap.to(flagId, {
        scale: 0,
        duration: 0.2,
        onComplete: () => {
          flagEl.innerHTML = `<img src="${flagEl.dataset.flag}" alt="">`;
          gsap.to(flagId, { scale: 1, duration: 0.3 });
        }
      });
    },

    onLeaveBack: () => {
      if (flagId) gsap.to(flagId, { scale: 0, duration: 0.3 });
    }
  });
}

/* ======================================================
   CREATE MAP SCENES
====================================================== */
createScene("#sec-jp", "jp", "#path-jp", "#flag-jp");
createScene("#sec-cn", "cn", "#path-cn", "#flag-cn");
createScene("#sec-au", "au", "#path-au", "#flag-au");
createScene("#sec-fr", "fr", "#path-fr", "#flag-fr");
createScene("#sec-us", "us", "#path-us", "#flag-us");

/* ======================================================
   MAP OVERVIEW
====================================================== */
const overviewPos = calculateTransform(locations.overview);

gsap.to(".map-inner", {
  scale: overviewPos.scale,
  xPercent: overviewPos.xPercent,
  yPercent: overviewPos.yPercent,
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: "#sec-outro",
    start: "top 85%",
    end: "center center",
    scrub: 1.5
  }
});

/* ======================================================
   CONTENT CARD FADE
====================================================== */
document.querySelectorAll('.content-card').forEach(card => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: card,
      start: "top 45%",
      end: "bottom top",
      toggleActions: "play reverse play reverse"
    }
  });
});

/* ======================================================
   MAP / PARALLAX VISIBILITY CONTROL
====================================================== */
const mapLayers = gsap.utils.toArray([
  ".map-fixed-container",
  ".map-texture-overlay",
  ".map-vignette-overlay"
]);

const parallax = document.querySelector(".parallax-container");

gsap.set(mapLayers, { opacity: 0, pointerEvents: "none" });

ScrollTrigger.create({
  trigger: "#sec-intro",
  start: "top center",
  end: "top top",

  onEnter: () => {
    mapLayers.forEach(el => el.style.pointerEvents = "auto");
    gsap.to(mapLayers, { opacity: 1, duration: 0.5 });
    gsap.to(parallax, { opacity: 0, duration: 0.5 });
  },

  onLeaveBack: () => {
    gsap.to(mapLayers, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        mapLayers.forEach(el => el.style.pointerEvents = "none");
      }
    });
    gsap.to(parallax, { opacity: 1, duration: 0.5 });
  }
});

/* ======================================================
   REVEAL SECTIONS
====================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealEls.forEach(el => revealObserver.observe(el));

/* ======================================================
   BAR CHART ANIMATION
====================================================== */
const chartInner = document.getElementById('chart-inner');
const barEls = document.querySelectorAll('.bar');

if (chartInner) {
  const chartObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        barEls.forEach(bar => {
          const h = bar.dataset.height;
          if (h) bar.style.height = h + 'px';
        });
        chartObserver.unobserve(chartInner);
      }
    });
  }, { threshold: 0.5 });

  chartObserver.observe(chartInner);
}

/* ======================================================
   DONUT SPIN
====================================================== */
const exportSection = document.querySelector('.export-section');
const donuts = document.querySelectorAll('.donut');

if (exportSection && donuts.length) {
  const donutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        donuts.forEach(d => d.classList.add('spin'));
        donutObserver.unobserve(exportSection);
      }
    });
  }, { threshold: 0.4 });

  donutObserver.observe(exportSection);
}

/* ======================================================
   TOOLTIP
====================================================== */
const tooltip = document.getElementById('tooltip');

function attachTooltip(selectors) {
  document.querySelectorAll(selectors).forEach(el => {
    const text = el.dataset.tooltip;
    if (!text) return;

    el.addEventListener('mousemove', e => {
      tooltip.textContent = text;
      tooltip.style.left = e.clientX + 12 + 'px';
      tooltip.style.top = e.clientY + 12 + 'px';
      tooltip.classList.add('visible');
    });

    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
}

attachTooltip('.bar-group');
attachTooltip('.donut-card');





// ------------------------------
// Export Growth Chart Animation (Improved Version)
// ------------------------------

// ------------------------------
// Export Growth Chart: init with zeros, then animate bars on scroll
// ------------------------------

const canvas = document.getElementById("exportChart"); // canvas element
let exportChart = null;

const exportYears = ["2015","2016","2017","2018","2019","2020","2021","2022","2023","2024"];
const exportValues = [4.1, 3.5, 5.2, 6.8, 4.9, -2.1, 7.4, 8.2, 5.7, 6.9];

// create an array of zeros same length as exportValues
const zeroValues = exportValues.map(() => 0);

function initChartWithZeros() {
    exportChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: exportYears,
            datasets: [{
                label: "อัตราการเติบโต (%)",
                data: zeroValues.slice(), // start all bars at 0
                backgroundColor: "#f4b350",
                borderColor: "#d98c00",
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: "#ffcf7a",
                hoverBorderColor: "#ffdca6",
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    backgroundColor: "rgba(0,0,0,0.85)",
                    titleColor: "#fff",
                    bodyColor: "#ffe5b0",
                    padding: 10
                },
                legend: { display: false }
            },
            scales: {
                x: { ticks: { color: "#333" }, grid: { display: false } },
                y: { ticks: { color: "#333" }, grid: { color: "rgba(0,0,0,0.06)" }, beginAtZero: true }
            },
            animation: {
                // delay per data item (staggered). Chart.js passes context where context.type === 'data'
                delay: function(context) {
                    if (context.type === 'data' && typeof context.dataIndex !== 'undefined') {
                        return context.dataIndex * 120; // 120ms stagger between bars
                    }
                    return 0;
                },
                duration: 800,
                easing: 'easeOutQuart'
            }
        }
    });
}

// helper: is canvas in viewport (trigger a bit earlier)
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight - 120;
}

let chartAnimated = false;

// init chart as zero immediately (so canvas is present)
document.addEventListener("DOMContentLoaded", () => {
    if (!canvas) return;
    initChartWithZeros();

    // if already visible on load, animate right away
    if (!chartAnimated && isInViewport(canvas)) {
        chartAnimated = true;
        // set real data and update (Chart.js will animate from zeros to real values, respecting the delay)
        exportChart.data.datasets[0].data = exportValues.slice();
        exportChart.update();
        const wrapper = document.querySelector(".chart-animate");
        if (wrapper) wrapper.classList.add("active");
    }
});

// on scroll: when canvas enters viewport, set real data and update once
window.addEventListener("scroll", () => {
    if (chartAnimated) return;
    if (!canvas) return;

    if (isInViewport(canvas)) {
        chartAnimated = true;
        // show wrapper animation class (if you use it)
        const wrapper = document.querySelector(".chart-animate");
        if (wrapper) wrapper.classList.add("active");

        // set dataset to real values and call update -> Chart.js will animate
        exportChart.data.datasets[0].data = exportValues.slice();
        exportChart.update();
    }
});

ScrollTrigger.create({
  trigger: "#foodtype",
  start: "top bottom",
  onEnter: () =>
    gsap.to(".map-fixed-container", {
      opacity: 0,
      pointerEvents: "none"
    }),
  onLeaveBack: () =>
    gsap.to(".map-fixed-container", {
      opacity: 1,
      pointerEvents: "auto"
    })
});


// สิ่งที่โลกมาองหาและไทยตอบได้
    
// สายอาหาร

const foodTypeData = {
    spicy: {
        title: "สายจัดจ้าน 🔥",
        img: "images/spicy.jpg",
        desc: "เผ็ด เปรี้ยว เค็มเข้มข้น เหมาะสำหรับคนรักความท้าทาย",
        blocks: [
            {
                color: "#ff3b30",
                icon: "🔥",     
                title: "รสชาติประจำสายนี้",
                desc: [
                    "ชอบรสจัด เด็ดทุกสัมผัส",
                    "เป็นคนชอบลองของใหม่ อยู่ไม่อยู่นิ่ง"
                ]
            },
            {
                color: "#ff3b30",
                icon: "🍜",
                title: "เมนูที่ใช่",
                desc: [
                    "ต้มยำทะเล",
                    "ยำแซ่บ",
                    "แกงเผ็ด"
                ]
            }
        ]
    },

    soft: {
        title: "สายนุ่มละมุน 🧡",
        img: "images/soft.jpg",
        desc: "สายหวานนุ่ม ไม่เผ็ด ไม่จัด อารมณ์ละมุนๆ",
        blocks: [
            {
                color: "#ff9f0a",
                icon: "🧡",
                title: "รสชาติประจำสายนี้",
                desc: [
                    "อบอุ่น อ่อนโยน",
                    "ไม่เน้นจัดจ้าน"
                ]
            },
            {
                color: "#ff9f0a",
                icon: "🍲",
                title: "เมนูที่ใช่",
                desc: [
                    "แกงเขียวหวาน",
                    "ต้มจืดเต้าหู้"
                ]
            }
        ]
    },

    healthy: {
        title: "สายสุขภาพ 💚",
        img: "images/healthy.jpg",
        desc: "เน้นกินดี อยู่ดี สายคลีนตัวจริง",
        blocks: [
            {
                color: "#34c759",
                icon: "💚",
                title: "บุคลิกของสายนี้",
                desc: [
                    "มีวินัย ชอบวางแผน",
                    "ใส่ใจสุขภาพตัวเอง"
                ]
            },
            {
                color: "#34c759",
                icon: "🥗",
                title: "เมนูที่ใช่",
                desc: [
                    "สลัดอกไก่",
                    "ปลาย่าง",
                    "เมนูคลีนๆ"
                ]
            }
        ]
    },

    modern: {
        title: "สายทันสมัย ✨",
        img: "images/healthy.jpg",
        desc: "เน้นกินดี อยู่ดี สายคลีนตัวจริง",
        blocks: [
            {
                color: "#a734c7ff",
                icon: "💜",
                title: "บุคลิกของสายนี้",
                desc: [
                    "ครีเอทีฟ ไอเดียเยอะ ชอบของใหม่ไม่จำเจ"

                ]
            },
            {
                color: "#34c759",
                icon: "🥗",
                title: "เมนูที่ใช่",
                desc: [
                    "ผัดไทยฟิวชัน, เบอร์เกอร์ไทยสไตล์, ข้าวหน้าหมูไทย-เกาหลี"


                ]
            },
                        {
                color: "#34c759",
                icon: "🥗",
                title: "เทรนด์อาหารโลกที่เข้ากับสายนี้:",
                desc: [
                    "Low carbon, fusion, sustainable"


                ]
            }
        ]
    }



};

function showFoodTypeDetail(type) {
    const data = foodTypeData[type];

    // ซ่อนหน้าเลือกสายอาหาร
    document.getElementById("foodTypeSelect").classList.add("hidden");

    // ใส่ข้อมูล
    document.getElementById("foodTypeTitle").innerHTML = data.title;
    document.getElementById("foodTypeDesc").innerHTML = data.desc;

    const img = document.getElementById("foodTypeImg");
    img.src = data.img;
    img.style.display = "block";

    const container = document.getElementById("foodDetailContainer");
    container.innerHTML = "";

    data.blocks.forEach(b => {
        container.innerHTML += `
            <div class="detail-box" style="border-left-color:${b.color}">
                <h3><span class="detail-icon">${b.icon}</span>${b.title}</h3>
                ${b.desc.map(text => `<p>${text}</p>`).join("")}
            </div>
        `;
    });

    // แสดงหน้ารายละเอียด
    document.getElementById("foodTypeDetail").classList.remove("hidden");
}

function backToFoodType() {
    // ซ่อนหน้ารายละเอียด
    document.getElementById("foodTypeDetail").classList.add("hidden");

    // แสดงหน้าเลือกสายอาหาร
    document.getElementById("foodTypeSelect").classList.remove("hidden");
}





// เมนูโปรด

// ข้อมูลเมนูทั้งหมด
// ข้อมูลเมนูทั้งหมด
const favFoodData = {
    padthai: {
        title: "ผัดไทย",
        img: "assets/images/favfooddetail/ผัดไทย_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: "ผัดไทย ยุคสมัย: ผัดไทยเกิดขึ้นในสมัย จอมพล ป. พิบูลสงคราม ดำรงตำแหน่งนายกรัฐมนตรี (ช่วงปลายทศวรรษ 2480 ถึงต้น 2490) ซึ่งเป็นช่วงที่ประเทศไทยประสบกับปัญหาเศรษฐกิจตกต่ำ และภาวะขาดแคลนข้าวจากสงครามโลกครั้งที่ 2",
        ingredients: [
            "เส้นจันท์",
            "เต้าหู้",
            "กุ้งสด",
            "หอมแดง",
            "ถั่วงอก",
            "ไข่",
            "น้ำมะขาม"
        ]
    },

    greencurry: {
        title: "แกงเขียวหวาน",
        img: "assets/images/favfooddetail/แกงเขียวหวาน_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'แกงเขียวหวาน เป็นแกงกะทิรสชาติกลมกล่อม ที่มีต้นกำเนิดจาก ภาคกลาง ของประเทศไทย เชื่อกันว่าพัฒนามาจากการปรุงอาหารประเภทแกงกะทิใน สมัยอยุธยา โดยดัดแปลงมาจากแกงเผ็ดหรือแกงแดงจุดเด่นของแกงเขียวหวานคือการใช้ พริกขี้หนูสดสีเขียว หรือ พริกชี้ฟ้าเขียว ในการทำน้ำพริกแกง ทำให้ได้สีเขียวนวลตา เมื่อผัดกับกะทิคำว่า "หวาน" ในชื่อไม่ได้หมายถึงรสหวานนำ แต่หมายถึงสีเขียวที่ดู "หวานละมุน" หรือ "นวล"',
        ingredients: [
            "กะทิ",
            "พริกแกงเขียวหวาน",
            "ไก่",
            "ใบโหระพา",
            "มะเขือเปราะ",
            "พริกชี้ฟ้า"
        ]
    },

    tomkakai: {
        title: "ต้มข่าไก่",
        img: "assets/images/favfooddetail/ต้มข่าไก่_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'ต้มข่าไก่ มีต้นกำเนิดประมาณปี พ.ศ. 2433 (ปลายรัชกาลที่ 5) และถูกบันทึกไว้ในตำราอาหารไทยยุคแรก ๆเมนูต้นฉบับ: เมนูต้มข่าดั้งเดิมที่ถูกบันทึกไว้คือ "ต้มข่าเป็ด" ซึ่งใช้เนื้อเป็ดและข่าอ่อนเป็นส่วนผสมหลักในน้ำแกงกะทิ',
        ingredients: [
            "มะละกอดิบ",
            "มะเขือเทศ",
            "พริกสด",
            "กระเทียม",
            "ถั่วฝักยาว",
            "น้ำปลา",
            "น้ำมะนาว"
        ]
    },

    tomyum: {
        title: "ต้มยำกุ้ง",
        img: "assets/images/favfooddetail/ต้มยำกุ้ง_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: "ต้มยำกุ้ง เป็นซุปสมุนไพรไทยที่มีต้นกำเนิดจาก ภาคกลาง เชื่อว่าเกิดจากวิถีชีวิตริมน้ำของคนไทยที่จับกุ้งสดจาก แม่น้ำ แล้วนำมาปรุงกับสมุนไพร พื้นบ้าน เช่น ข่า ตะไคร้ มะกรูด สืบทอดมาตั้งแต่สมัย “กรุงศรีอยุธยา” และกลายเป็นหนึ่งในอาหารประจำชาติของไทย ปัจจุบันเป็นเมนูที่สร้างอัตลักษณ์ความ “เผ็ด-เปรี้ยว-หอมสมุนไพร” ให้โลกจดจำอาหารไทย...",
        ingredients: [
            "กุ้ง",
            "ตะไคร้",
            "ใบมะกรูด",
            "พริกสด",
            "เห็ดฟาง",
            "น้ำปลา",
            "มะนาว"
        ]
    },

    taipla: {
        title: "แกงไตปลา",
        img: "assets/images/favfooddetail/แกงไตปลา_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'แกงไตปลา  มาจากส่วนผสมหลักที่ให้รสชาติและกลิ่นเฉพาะตัว คือ "ไตปลา" หรือ "พุงปลา" ซึ่งเป็นส่วนของกระเพาะและลำไส้ของปลา (เช่น ปลาทู ปลาอินทรี หรือปลาช่อน) ที่นำมาหมักกับเกลือจนกลายเป็นน้ำพริก/เครื่องปรุงรสเค็มข้นคล้ายกะปิหรือปลาร้า',
        ingredients: [
            "เส้นจันท์",
            "เต้าหู้",
            "กุ้งสด",
            "หอมแดง",
            "ถั่วงอก",
            "ไข่",
            "น้ำมะขาม"
        ]
    },

    redcurry: {
        title: "มัสมั่น",
        img: "assets/images/favfooddetail/แกงมัสมั่นไก่_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'แกงมัสมั่นไก่ มีต้นกำเนิดจาก แขกเจ้าเซ็น (มุสลิมนิกายชีอะฮ์ในประเทศไทย) สมัยกรุงศรีอยุธยา นำเครื่องเทศนานาชนิดมาผสมผสานกับวัตถุดิบไทย กลายเป็นแกงรสเข้มข้น มีกลิ่นหอมจากเครื่องเทศ เช่น ยี่หร่า, ลูกผักชี, อบเชย และกานพลู, ถูกบันทึกครั้งแรกใน "กาพย์เห่เรือชมเครื่องคาวหวาน" รัชกาลที่ 2 และได้รับยกย่องเป็นอาหารอร่อยที่สุดในโลก โดยชื่อ "มัสมั่น" มาจากคำว่า "มุสลิมาน" (ชาวมุสลิม) ในภาษาเปอร์เซีย',
        ingredients: [
            "กะทิ",
            "พริกแกงเขียวหวาน",
            "ไก่",
            "ใบโหระพา",
            "มะเขือเปราะ",
            "พริกชี้ฟ้า"
        ]
    },

    kaosoi: {
        title: "ข้าวซอย",
        img: "assets/images/favfooddetail/ข้าวซอย_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'ข้าวซอย มีรากเหง้ามาจากอาหารของ ชาวจีนมุสลิม (จีนฮ่อ/จีนยูนนาน) ที่อพยพมาค้าขายและตั้งถิ่นฐานบริเวณภาคเหนือของไทย พม่า (เมียนมา) และลาว ในช่วงศตวรรษที่ 19    สูตรดั้งเดิม (ข้าวซอยน้ำใส): ข้าวซอยแบบดั้งเดิมของชาวจีนฮ่อ ไม่มีส่วนผสมของกะทิ น้ำซุปจะใสและได้จากการเคี่ยวกระดูกสัตว์ (วัว/ไก่) และมีชื่อเรียกแตกต่างกันไป เช่น ข้าวซอยหนาก หรือ เออร์ไคว่ (Erkuai)',
        ingredients: [
            "มะละกอดิบ",
            "มะเขือเทศ",
            "พริกสด",
            "กระเทียม",
            "ถั่วฝักยาว",
            "น้ำปลา",
            "น้ำมะนาว"
        ]
    },

    stickyrice: {
        title: "ข้าวเหนียวมะม่วง",
        img: "assets/images/favfooddetail/ข้าวเหนียวมะม่วง_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'ข้าวเหนียวมะม่วง เป็นของหวานที่มีมานานในประเทศไทย คาดว่ามีมาตั้งแต่สมัยปลายอยุธยา และได้รับความนิยมต่อเนื่องมาจนถึงสมัยรัตนโกสินทร์ตอนต้น โดยมีบันทึกในบทประพันธ์ โคลงกาพย์เห่ชมเครื่องคาวหวาน ในรัชกาลที่ 2 แห่งกรุงรัตนโกสินทร์ (แต่ไม่ได้ระบุชื่อว่า "ข้าวเหนียวมะม่วง" อย่างชัดเจน)',
        ingredients: [
            "กุ้ง",
            "ตะไคร้",
            "ใบมะกรูด",
            "พริกสด",
            "เห็ดฟาง",
            "น้ำปลา",
            "มะนาว"
        ]
    }
};

// แสดงหน้า detail
function showFoodDetail(menu) {
    const selectPage = document.getElementById("favFoodSelect");
    const detailPage = document.getElementById("favFoodDetail");

    selectPage.classList.add("hidden");
    detailPage.classList.remove("hidden");

    const data = favFoodData[menu];

    document.getElementById("foodTitle").innerText = data.title;
    document.getElementById("foodImg").src = data.img;
    document.getElementById("foodHistory").innerText = data.history;

    // แหล่งอ้างอิงข้อมูลประวัติ
    const historySource = data.source
        ? '<a href="' + data.source + '" target="_blank" rel="noopener">' + data.source + '</a>'
        : "รอเพิ่มแหล่งอ้างอิง";
    document.getElementById("foodSource").innerHTML = "แหล่งที่มาข้อมูล: " + historySource;

    const ul = document.getElementById("foodIngredients");
    ul.innerHTML = "";
    data.ingredients.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}

// ปุ่มกลับ
function backToMenu() {
    document.getElementById("favFoodDetail").classList.add("hidden");
    document.getElementById("favFoodSelect").classList.remove("hidden");
}



