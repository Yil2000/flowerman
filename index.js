document.addEventListener('DOMContentLoaded', () => {
  // ===== Scrollable Cards Animation =====
  const track = document.querySelector(".massages-wall-track");
  const container = document.querySelector(".massages-wall-cards");
  const colors = ["#FF6B6B", "#fbbc04", "#34a853", "#4285f4", "#9B59B6", "#6a59b6ff"];
  let posX = 0, speed = 0.5;

  if (track && container) {
    track.innerHTML += track.innerHTML;
    const cards = track.querySelectorAll(".massages-wall-card");

    function getRandomColor(excludeColor) {
      const available = colors.filter(c => c !== excludeColor);
      return available[Math.floor(Math.random() * available.length)];
    }

    cards.forEach(card => {
      const randomColor = getRandomColor(null);
      card.style.borderTop = `3px solid ${randomColor}`;
    });

    function scrollCards() {
      posX -= speed;
      track.style.transform = `translateX(${posX}px)`;
      if (Math.abs(posX) >= track.scrollWidth / 2) {
        posX = 0;
        track.style.transform = `translateX(0px)`;
        cards.forEach(card => {
          const currentColor = card.style.borderTop.split(" ")[2];
          card.style.borderTop = `3px solid ${getRandomColor(currentColor)}`;
        });
      }
      requestAnimationFrame(scrollCards);
    }
    scrollCards();

    // גרירה עם עכבר
    let isDown = false, startX, scrollLeft;
    track.addEventListener("mousedown", e => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    track.addEventListener("mouseleave", () => isDown = false);
    track.addEventListener("mouseup", () => isDown = false);
    track.addEventListener("mousemove", e => {
      if (!isDown) return;
      e.preventDefault();
      container.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX);
    });

    // גרירה במגע
    track.addEventListener("touchstart", e => {
      startX = e.touches[0].pageX - track.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    track.addEventListener("touchmove", e => {
      const walk = e.touches[0].pageX - track.offsetLeft - startX;
      container.scrollLeft = scrollLeft - walk;
    });
  }

  // ===== Right Sliders =====
  function initRightSlider(trackSelector, interval = 1500, duration = 600) {
    const track = document.querySelector(trackSelector);
    if (!track) return;

    const viewport = track.parentElement;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const items = track.children;

    function getItemWidth() {
      if (!items.length) return 0;
      return items[0].offsetWidth + gap;
    }

    function slide() {
      const step = getItemWidth();
      if (!step) return;

      track.style.transition = `transform ${duration}ms ease`;
      track.style.transform = `translateX(${step}px)`;

      setTimeout(() => {
        track.style.transition = "none";
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transform = "translateX(0)";
      }, duration);
    }

    let timer = setInterval(slide, interval);

    viewport.addEventListener("mouseenter", () => { clearInterval(timer); timer = null; });
    viewport.addEventListener("mouseleave", () => { if (!timer) timer = setInterval(slide, interval); });
  }

  initRightSlider(".weekly-activity-content-sliding-imgs");
  initRightSlider(".special-activity-content-sliding-img");
// ===== Gallery Checkbox Filter with Special First Click =====
const checkboxes = document.querySelectorAll('.gallery-page-head-btns input');
const images = document.querySelectorAll('.gallery-page-main-content img');

// 1. ניצור "דגל" שיעקוב אם זו הלחיצה הראשונה
let isFirstClick = true;

function updateGallery() {
  // נבדוק אילו תיבות מסומנות
  const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);

  // אם אף תיבה לא מסומנת, נציג את כל התמונות
  if (checkedBoxes.length === 0) {
    images.forEach(img => img.style.display = 'block');
    return; // נסיים את ריצת הפונקציה כאן
  }

  // אם יש תיבות מסומנות, קודם כל נסתיר את כל התמונות
  images.forEach(img => img.style.display = 'none');

  // ואז נעבור על התיבות המסומנות ונציג את התמונות שלהן
  checkedBoxes.forEach(cb => {
    const imagesToShow = document.querySelectorAll(`.gallery-page-main-content img.${cb.id}`);
    imagesToShow.forEach(img => img.style.display = 'block');
  });
}

// 2. נוסיף את הלוגיקה החדשה לתוך ה-event listener
checkboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    // אם זו הלחיצה הראשונה, והמשתמש סימן תיבה (ולא ביטל סימון)
    if (isFirstClick && cb.checked) {
      // נעבור על כל שאר התיבות ונבטל את הסימון שלהן
      checkboxes.forEach(otherCb => {
        if (otherCb !== cb) {
          otherCb.checked = false;
        }
      });
      // נשנה את הדגל כדי שהתנאי הזה לא יתקיים יותר
      isFirstClick = false;
    }

    // 3. נקרא לפונקציית התצוגה שתמיד עובדת אותו הדבר
    updateGallery();
  });
});

// קריאה ראשונית כדי להציג הכל בהתחלה
updateGallery();
});
