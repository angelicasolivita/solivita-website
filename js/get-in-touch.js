// Solivita Assisted Living — Get in Touch form submission.
// Posts to /api/submit-inquiry (Vercel serverless function), which
// writes the row to Google Sheets. See api/submit-inquiry.js and
// GOOGLE-SHEETS-API-SETUP.md for backend setup.

(function () {
  function initReferralOther() {
    var referral = document.getElementById('referral');
    var otherField = document.getElementById('referral-other-field');
    var otherInput = document.getElementById('referral-other');
    if (!referral || !otherField || !otherInput) return;

    referral.addEventListener('change', function () {
      var isOther = referral.value === 'Other';
      otherField.hidden = !isOther;
      if (!isOther) otherInput.value = '';
    });
  }

  function init() {
    initReferralOther();

    var form = document.getElementById('get-in-touch-form');
    var status = document.getElementById('gform-status');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('.cs-gform-submit');
      var data = Object.fromEntries(new FormData(form).entries());

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      status.textContent = '';
      status.className = 'cs-gform-status';

      fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Submission failed');
          return res.json();
        })
        .then(function () {
          form.reset();
          status.textContent = "Thank you — we'll be in touch soon.";
          status.className = 'cs-gform-status cs-gform-status-success';
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please try again or email us directly.';
          status.className = 'cs-gform-status cs-gform-status-error';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
