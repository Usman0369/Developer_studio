/* ============================================================
   contact.js — Contact page behaviour
   - Client-side form validation with inline, accessible errors
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var successMsg = document.getElementById("formSuccess");

    var rules = {
      name: function (v) {
        if (!v) return "Please enter your name.";
        if (v.length < 2) return "Your name looks a little short.";
        return "";
      },
      email: function (v) {
        if (!v) return "Please enter your email address.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
        return "";
      },
      subject: function (v) {
        if (!v) return "Please add a subject.";
        if (v.length < 3) return "Please make the subject a little longer.";
        return "";
      },
      message: function (v) {
        if (!v) return "Please write a short message.";
        if (v.length < 10) return "Please give us a few more details (at least 10 characters).";
        return "";
      }
    };

    function validateField(input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var message = rule(input.value.trim());
      var field = input.closest(".field");
      var errorEl = document.querySelector('[data-error-for="' + input.name + '"]');
      if (field) {
        field.classList.toggle("has-error", !!message);
        field.classList.toggle("is-valid", !message && input.value.trim() !== "");
      }
      if (errorEl) errorEl.textContent = message;
      return !message;
    }

    var inputs = form.querySelectorAll("input, textarea");

    inputs.forEach(function (input) {
      input.addEventListener("blur", function () { validateField(input); });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("has-error")) {
          validateField(input);
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;
      var firstInvalid = null;

      inputs.forEach(function (input) {
        if (!validateField(input)) {
          valid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        if (successMsg) successMsg.hidden = true;
        return;
      }

      // Simulate a successful send (no backend in this static build)
      form.reset();
      inputs.forEach(function (input) {
        var field = input.closest(".field");
        if (field) field.classList.remove("has-error", "is-valid");
      });

      if (successMsg) {
        successMsg.textContent =
          "Thank you! Your message has been sent — we will be in touch within one business day.";
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
})();
