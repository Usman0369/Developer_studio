/* ============================================================
   portfolio.js — Portfolio page behaviour
   - Category filtering with an animated grid + empty state
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var filterButtons = document.querySelectorAll(".filter-btn");
    var items = document.querySelectorAll(".portfolio-item");
    var emptyMsg = document.getElementById("portfolioEmpty");

    if (!filterButtons.length || !items.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");

        // Toggle the active button
        filterButtons.forEach(function (other) {
          var active = other === btn;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", String(active));
        });

        // Show or hide the matching cards
        var visible = 0;
        items.forEach(function (item) {
          var match = filter === "all" || item.getAttribute("data-category") === filter;
          item.style.display = match ? "" : "none";
          if (match) {
            visible++;
            // Re-trigger the reveal animation for a pleasant fade-in
            item.classList.remove("in");
            void item.offsetWidth;
            item.classList.add("in");
          }
        });

        if (emptyMsg) emptyMsg.hidden = visible !== 0;
      });
    });
  });
})();
