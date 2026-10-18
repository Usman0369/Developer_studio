/* ============================================================
   about.js — About page behaviour
   - Animated statistics counters
   Keep it small: the shared nav, theme toggle and reveal
   animations live in base.js.
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* Pause the story video for users who prefer reduced motion */
    var storyVideo = document.querySelector(".story-img--secondary");
    if (storyVideo && storyVideo.tagName === "VIDEO" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      storyVideo.removeAttribute("autoplay");
      storyVideo.pause();
    }

    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    function runCounter(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1600;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { observer.observe(c); });
    } else {
      counters.forEach(runCounter);
    }
  });
})();
