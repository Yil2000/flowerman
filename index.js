document.addEventListener("DOMContentLoaded", () => {
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

  
  const buttons = document.querySelectorAll(".gallery-page-head-btns button");
  const images = document.querySelectorAll(".gallery-page-main-content img");

  const activeButtons = new Set();
  const transitionTime = 400; // זמן fade במילישניות

  // אתחול
  images.forEach(img => {
    img.style.opacity = 1;
    img.style.transition = `opacity ${transitionTime}ms ease`;
    img.style.position = "relative";
  });

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const targetClass = button.id;

      // Toggle לחיצה
      if (activeButtons.has(targetClass)) {
        activeButtons.delete(targetClass);
        button.style.backgroundColor = "";
        button.style.color = "";
      } else {
        activeButtons.add(targetClass);
        button.style.backgroundColor = "#FF6B6B";
        button.style.color = "white";
      }

      // קודם fade-out של כל התמונות
      images.forEach(img => {
        img.style.opacity = 0;
      });

      // אחרי שה-fade-out מסתיים, עדכון הצגת התמונות החדשות עם fade-in
      setTimeout(() => {
        images.forEach(img => {
          const matches = Array.from(activeButtons).some(cls => img.classList.contains(cls));
          if (matches || activeButtons.size === 0) {
            img.style.position = "relative";
            img.style.pointerEvents = "auto";
            img.style.opacity = 1;
          } else {
            img.style.position = "absolute";
            img.style.pointerEvents = "none";
            img.style.opacity = 0;
          }
        });
      }, transitionTime);
    });
  });
});

