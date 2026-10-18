/* ============================================================
   base.js — shared behaviour across every page
   - Responsive navigation toggle
   - Dark mode toggle (persisted in localStorage)
   - Scroll-to-top button
   - Header shadow on scroll
   - Reveal-on-scroll animations
   - Active nav link highlighting
   - Footer year
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Dark mode ---------- */
  var STORAGE_KEY = "dunecrest-theme";
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  // Restore saved choice or respect the OS preference
  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    saved = null;
  }
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      function syncLabel() {
        var isDark = root.getAttribute("data-theme") === "dark";
        toggle.setAttribute("aria-pressed", String(isDark));
        toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      }
      syncLabel();
      toggle.addEventListener("click", function () {
        var isDark = root.getAttribute("data-theme") === "dark";
        var next = isDark ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) { /* storage blocked — ignore */ }
        syncLabel();
      });
    }

    /* ---------- Responsive navigation ---------- */
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    var body = document.body;

    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        var open = body.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(open));
      });

      // Close the panel when a link is chosen
      navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          body.classList.remove("nav-open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });

      // Close when clicking outside
      document.addEventListener("click", function (e) {
        if (!body.classList.contains("nav-open")) return;
        if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });

      // Reset when resizing back to desktop
      window.addEventListener("resize", function () {
        if (window.innerWidth > 780) {
          body.classList.remove("nav-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* ---------- Highlight the current page link ---------- */
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var target = link.getAttribute("href");
      if (!target) return;
      if (target === here || (here === "" && target === "index.html")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    /* ---------- Header shadow + scroll-to-top ---------- */
    var header = document.querySelector(".site-header");
    var toTop = document.querySelector(".to-top");

    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle("scrolled", y > 12);
      if (toTop) toTop.classList.toggle("show", y > 420);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length) {
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.14 });
        revealEls.forEach(function (el) { io.observe(el); });
      } else {
        revealEls.forEach(function (el) { el.classList.add("in"); });
      }
    }

    /* ---------- Footer year ---------- */
    var year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
  });
})();
