/* ============================================================
   services.js — Services page behaviour
   - FAQ accordion (reusable single-open pattern)
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {
      var btn = item.querySelector(".faq-q");
      var panel = item.querySelector(".faq-a");
      if (!btn || !panel) return;

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");

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
  });
})();
