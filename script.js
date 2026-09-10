/* =========================================================
   1. Falling Flowers Background
   ========================================================= */
(function initFallingBackground() {
  const layer = document.getElementById("falling-layer");
  if (!layer) return;
  
  const ITEM_COUNT = window.innerWidth < 600 ? 12 : 22;

  const flowerSVG = `
  <svg viewBox="0 0 64 64" width="100%" height="100%">
    <g fill="#F2A6B4">
      <ellipse cx="32" cy="18" rx="9" ry="14"/>
      <ellipse cx="32" cy="18" rx="9" ry="14" transform="rotate(72 32 32)"/>
      <ellipse cx="32" cy="18" rx="9" ry="14" transform="rotate(144 32 32)"/>
      <ellipse cx="32" cy="18" rx="9" ry="14" transform="rotate(216 32 32)"/>
      <ellipse cx="32" cy="18" rx="9" ry="14" transform="rotate(288 32 32)"/>
    </g>
    <circle cx="32" cy="32" r="7" fill="#C4536B"/>
  </svg>`;

  for (let i = 0; i < ITEM_COUNT; i++) {
    const el = document.createElement("div");
    el.className = "falling-item";
    el.innerHTML = flowerSVG;

    const size = 18 + Math.random() * 24;
    const duration = 12 + Math.random() * 14;
    const delay = -(Math.random() * duration);
    const left = Math.random() * 100;

    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.left = left + "vw";
    el.style.animationDuration = duration + "s";
    el.style.animationDelay = delay + "s";

    layer.appendChild(el);
  }
})();

/* =========================================================
   2. Live Time-Together Counter (Start Date: 15-09-2025)
   ========================================================= */
const ANNIVERSARY_DATE = new Date("2025-09-15T00:00:00");

function updateTimeCounter() {
  const el = document.getElementById("time-counter");
  if (!el) return;

  const now = new Date();
  let diff = Math.max(0, now - ANNIVERSARY_DATE);

  const secondMs = 1000, minuteMs = secondMs * 60, hourMs = minuteMs * 60, dayMs = hourMs * 24;

  const days = Math.floor(diff / dayMs); diff -= days * dayMs;
  const hours = Math.floor(diff / hourMs); diff -= hours * hourMs;
  const minutes = Math.floor(diff / minuteMs); diff -= minutes * minuteMs;
  const seconds = Math.floor(diff / secondMs);

  el.textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds together`;
}

updateTimeCounter();
setInterval(updateTimeCounter, 1000);

/* =========================================================
   3. Heart Cursor Trail
   ========================================================= */
(function initHeartTrail() {
  if ("ontouchstart" in window) return;

  let lastSpawn = 0;
  const MIN_INTERVAL = 80;

  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastSpawn < MIN_INTERVAL) return;
    lastSpawn = now;

    const heart = document.createElement("div");
    heart.className = "cursor-heart";
    heart.textContent = "♥";
    heart.style.left = e.clientX + "px";
    heart.style.top = e.clientY + "px";
    heart.style.fontSize = (10 + Math.random() * 8) + "px";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 900);
  });
})();

/* =========================================================
   4. Music Toggle Controls
   ========================================================= */
(function initMusicToggle() {
  const btn = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-music");
  if (!btn || !audio) return;

  audio.volume = 0.35;

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      btn.classList.add("playing");
      btn.setAttribute("aria-pressed", "true");
    } else {
      audio.pause();
      btn.classList.remove("playing");
      btn.setAttribute("aria-pressed", "false");
    }
  });
})();

/* =========================================================
   5. Scene Navigation & Transitions
   ========================================================= */
const scenes = {
  landing: document.getElementById("scene-landing"),
  letter: document.getElementById("scene-letter"),
  album: document.getElementById("scene-album"),
};

function goToScene(fromEl, toEl, exitDuration = 400) {
  fromEl.classList.add("exiting");
  setTimeout(() => {
    fromEl.classList.remove("active", "exiting");
    toEl.classList.add("active");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, exitDuration);
}

// Scene 1 -> Scene 2
const trigger = document.getElementById("landing-trigger");
if (trigger) {
  trigger.addEventListener("click", () => {
    goToScene(scenes.landing, scenes.letter);
  });
}

// Scene 2 -> Scene 3 (Flower Button)
const flowerBtn = document.getElementById("flower-button");
if (flowerBtn) {
  flowerBtn.addEventListener("click", () => {
    flowerBtn.classList.add("blooming");
    setTimeout(() => {
      goToScene(scenes.letter, scenes.album);
      flowerBtn.classList.remove("blooming");
      buildBook('us');
    }, 700);
  });
}

// Scene 3 -> Scene 2 (Back Button)
const backBtn = document.getElementById("back-to-letter");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    goToScene(scenes.album, scenes.letter);
  });
}

/* =========================================================
   6. Album Flip-Book Logic
   ========================================================= */
const categories = {
  us: [
    "https://i.ibb.co/RG6fBhSb/IMG-20260629-WA0043.jpg",
    "https://i.ibb.co/zVTC1GdM/IMG-20260416-230439.jpg",
    "https://i.ibb.co/ZztWMHS9/IMG-20260118-180150.jpg",
    "https://i.ibb.co/XfmZH7h1/IMG-20251214-WA0045.jpg",
  ],
  dates: [
    "https://i.ibb.co/WNkKHRxR/IMG-20260425-WA0048.jpg",
    "https://i.ibb.co/twKh34YC/IMG-20260110-WA0009.jpg",
    "https://i.ibb.co/zhYsz6QQ/IMG-20260207-WA0018.jpg",
  ],
  silly: [
    "https://i.ibb.co/G4PhcL1b/IMG-20260418-WA0008.jpg",
    "https://i.ibb.co/s9LMrwXb/IMG-20251215-WA0022.jpg",
    "https://i.ibb.co/9HTzbsRh/IMG-20260118-180306.jpg",
  ],
};

const bookEl = document.getElementById("book");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const indicatorEl = document.getElementById("page-indicator");
const tabBtns = document.querySelectorAll(".tab-btn");

let leaves = [];
let currentIndex = 0;

function buildBook(categoryKey) {
  if (!bookEl) return;
  bookEl.innerHTML = "";
  leaves = [];
  currentIndex = 0;

  const images = categories[categoryKey] || [];

  images.forEach((src, i) => {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.zIndex = images.length - i;
    leaf.innerHTML = `
      <div class="page-face front">
        <img src="${src}" alt="Memory ${i + 1}">
      </div>
      <div class="page-face back"></div>
    `;

    leaf.addEventListener("click", () => {
      if (leaf === leaves[currentIndex]) flipNext();
    });

    bookEl.appendChild(leaf);
    leaves.push(leaf);
  });

  updateIndicator();
  updateNavButtons();
}

function flipNext() {
  if (currentIndex >= leaves.length) return;
  const leaf = leaves[currentIndex];
  
  leaf.classList.add("flipped");
  
  setTimeout(() => {
    leaf.style.zIndex = currentIndex;
  }, 300);

  currentIndex++;
  updateIndicator();
  updateNavButtons();
}

function flipPrev() {
  if (currentIndex <= 0) return;
  currentIndex--;
  const leaf = leaves[currentIndex];
  
  leaf.style.zIndex = leaves.length - currentIndex;
  leaf.classList.remove("flipped");
  
  updateIndicator();
  updateNavButtons();
}

function updateIndicator() {
  if (!indicatorEl) return;
  const total = leaves.length;
  if (!total) {
    indicatorEl.textContent = "";
    return;
  }
  
  const displayIndex = Math.min(currentIndex + 1, total);
  indicatorEl.textContent = `${displayIndex} / ${total}`;
}

function updateNavButtons() {
  if (prevBtn) prevBtn.disabled = currentIndex <= 0;
  if (nextBtn) nextBtn.disabled = currentIndex >= leaves.length - 1;
}

if (prevBtn) prevBtn.addEventListener("click", flipPrev);
if (nextBtn) nextBtn.addEventListener("click", flipNext);

tabBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    buildBook(e.target.dataset.category);
  });
});