/* ============================================================
   home.js — Home page behaviour
   - Typing animation (hero headline)
   - Interactive image slider (auto-play, arrows, dots, swipe)
   - Animated statistics counters
   - FAQ accordion
   - Subtle hero parallax
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Typing animation ---------- */
    var typed = document.getElementById("typed");
    if (typed) {
      var words = ["sells.", "moves people.", "endures.", "converts."];
      var wordIndex = 0;
      var charIndex = 0;
      var deleting = false;

      function type() {
        var current = words[wordIndex];

        if (!deleting) {
          charIndex++;
          typed.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            return setTimeout(type, 1600);
          }
        } else {
          charIndex--;
          typed.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
          }
        }
        setTimeout(type, deleting ? 45 : 100);
      }
      type();
    }

    /* ---------- Image slider ---------- */
    var slider = document.getElementById("slider");
    if (slider) {
      var track = slider.querySelector(".slider-track");
      var slides = slider.querySelectorAll(".slide");
      var prevBtn = slider.querySelector(".slider-btn--prev");
      var nextBtn = slider.querySelector(".slider-btn--next");
      var dotsWrap = document.getElementById("sliderDots");
      var index = 0;
      var timer = null;

      // Build the navigation dots from the slides
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", function () { goTo(i); });
        dotsWrap.appendChild(dot);
      });
      var dots = dotsWrap.querySelectorAll("button");

      function goTo(n) {
        index = (n + slides.length) % slides.length;
        track.style.transform = "translateX(" + (-index * 100) + "%)";
        dots.forEach(function (d, i) { d.classList.toggle("active", i === index); });
        restart();
      }
      function restart() {
        clearInterval(timer);
        timer = setInterval(function () { goTo(index + 1); }, 5500);
      }

      if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
      if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });

      slider.addEventListener("mouseenter", function () { clearInterval(timer); });
      slider.addEventListener("mouseleave", restart);

      slider.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") goTo(index - 1);
        if (e.key === "ArrowRight") goTo(index + 1);
      });

      // Touch swipe
      var startX = 0;
      slider.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      slider.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 45) goTo(index + (dx < 0 ? 1 : -1));
      });

      restart();
    }

    /* ---------- Animated counters ---------- */
    var counters = document.querySelectorAll("[data-count]");
    if (counters.length) {
      function runCounter(el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1600;
        var startTime = null;

        function step(ts) {
          if (startTime === null) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }

      if ("IntersectionObserver" in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.4 });
        counters.forEach(function (c) { counterObserver.observe(c); });
      } else {
        counters.forEach(runCounter);
      }
    }

    /* ---------- FAQ accordion ---------- */
    var faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
      var btn = item.querySelector(".faq-q");
      var panel = item.querySelector(".faq-a");
      if (!btn || !panel) return;

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");

        // Close every panel first (single-open accordion)
        faqItems.forEach(function (other) {
          other.classList.remove("open");
          var p = other.querySelector(".faq-a");
          var b = other.querySelector(".faq-q");
          if (p) p.style.maxHeight = null;
          if (b) b.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("open");
          panel.style.maxHeight = panel.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    /* ---------- Hero parallax ---------- */
    var parallaxEls = document.querySelectorAll("[data-parallax]");
    if (parallaxEls.length && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      window.addEventListener("scroll", function () {
        var y = window.scrollY;
        parallaxEls.forEach(function (el) {
          var speed = parseFloat(el.getAttribute("data-parallax")) || 0.03;
          el.style.transform = "translateY(" + (y * speed) + "px)";
        });
      }, { passive: true });
    }
    /* ---------- Hero video (pause for reduced motion) ---------- */
    var heroVideo = document.querySelector(".hero-video");
    if (heroVideo && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
    }
  });
})();
