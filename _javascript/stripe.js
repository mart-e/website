import createPayment from "./stripe/payment";
import redirect from "./stripe/redirect";

(function() {
  if (window.location.hash === "#success") {
    document.getElementById("donation-result-success").style.display = "";
    document.getElementById("donation-result-success").scrollIntoView();
  } else if (window.location.hash === "#cancel") {
    document.getElementById("donation-result-cancel").style.display = "";
    document.getElementById("donation-result-cancel").scrollIntoView();
  }

  // Recurring donation
  document.querySelectorAll(".donation-btn[data-plan-id]").forEach(element => {
    element.addEventListener("click", event => {
      const plan = event.target.dataset.planId;

      redirect({
        plan,
        lang: window.app.lang || "en",
        url: window.app.url || "https://openstreetmap.be"
      });
    });
  });

  // Single donation (predefined amount)
  document.querySelectorAll(".donation-btn[data-amount]").forEach(element => {
    element.addEventListener("click", event => {
      const amount = parseInt(event.target.dataset.amount);

      createPayment(amount);
    });
  });

  // Single donation (custom amount)
  ["change", "blur", "keyup"].forEach(type => {
    document.getElementById("donation-amount").addEventListener(type, event => {
      const amount = parseInt(event.target.value);

      if (amount > 0) {
        document.getElementById("donation-submit").removeAttribute("disabled");
      } else {
        document.getElementById("donation-submit").setAttribute("disabled", "");
      }
    });
  });

  document
    .getElementById("donation-submit")
    .addEventListener("click", event => {
      const amount = parseInt(document.getElementById("donation-amount").value);

      event.preventDefault();

      createPayment(amount);
    });
})();
