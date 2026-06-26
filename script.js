// ===========================================================
// Jerish John — People. AI. Leadership.
// Theme toggle, scroll reveal, animated counters,
// timeline scroll progress, mobile nav, parallax orbs
// ===========================================================

(function () {
  "use strict";

  /* ---------- THEME TOGGLE ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const STORAGE_KEY = "jj-portfolio-theme";

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- HEADER SHADOW ON SCROLL ---------- */
  const header = document.getElementById("siteHeader");
  function handleHeaderScroll() {
    header.style.boxShadow = window.scrollY > 8 ? "0 1px 0 rgba(0,0,0,0.04)" : "none";
  }
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ---------- SCROLL-TRIGGERED FADE ANIMATIONS ---------- */
  const animatedEls = document.querySelectorAll(".fade-in, .fade-up");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    animatedEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    animatedEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll(".counter-number");

  function animateCounter(el) {
    const target = el.getAttribute("data-target");
    const display = el.getAttribute("data-display");
    const suffix = el.getAttribute("data-suffix") || "";

    if (display) {
      // Non-numeric "counter" — fade/type-in feel via simple reveal
      el.textContent = display;
      return;
    }

    const end = parseInt(target, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * end);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (c) { counterObserver.observe(c); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- TIMELINE SCROLL PROGRESS ---------- */
  const timeline = document.querySelector(".timeline");
  const timelineProgress = document.getElementById("timelineProgress");

  function updateTimelineProgress() {
    if (!timeline || !timelineProgress) return;
    const rect = timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const total = rect.height;
    const visible = Math.min(Math.max(viewportH - rect.top, 0), total);
    const pct = total > 0 ? (visible / total) * 100 : 0;
    timelineProgress.style.height = Math.min(pct, 100) + "%";
  }

  window.addEventListener("scroll", updateTimelineProgress, { passive: true });
  window.addEventListener("resize", updateTimelineProgress);
  updateTimelineProgress();

  // Ambient background orbs use pure CSS keyframe animation (see .orb in
  // style.css) for a subtle, GPU-friendly float — no JS parallax needed.

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- PORTRAIT IMAGE SWAP (when available) ---------- */
  // If a real portrait image is placed at ./portrait.jpg (or .png/.webp),
  // it will automatically replace the placeholder initials.
  const portraitImg = document.getElementById("portraitImg");
  const portraitPlaceholder = document.getElementById("portraitPlaceholder");

  function tryLoadPortrait(src) {
    const testImg = new Image();
    testImg.onload = function () {
      portraitImg.src = src;
      portraitImg.style.display = "block";
      if (portraitPlaceholder) portraitPlaceholder.style.display = "none";
    };
    testImg.onerror = function () {
      /* keep placeholder */
    };
    testImg.src = src;
  }

  if (portraitImg) {
    tryLoadPortrait("portrait.jpg");
  }
})();
