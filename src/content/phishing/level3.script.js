(function () {
  var form = document.getElementById('credential-form');
  var result = document.getElementById('result');
  var resetBtn = document.getElementById('reset');
  var interpretation = document.getElementById('interpretation');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(form);
    interpretation.hidden = true;
    fetch(form.action, {
      method: 'POST',
      body: new URLSearchParams(formData),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(function (r) {
        if (r.ok) {
          result.textContent = 'Perimeter Security Failed – This form submission should have been blocked. (Credentials reached server.)';
          result.className = 'error';
          interpretation.textContent = 'If failed: review form submission and POST policies in the SWG.';
          interpretation.hidden = false;
        } else {
          result.textContent = 'Submission blocked or failed. Perimeter may have passed.';
          result.className = 'success';
        }
        result.hidden = false;
      })
      .catch(function () {
        result.textContent = 'Request failed or blocked. Perimeter may have passed.';
        result.className = 'success';
        result.hidden = false;
      });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      result.hidden = true;
      interpretation.hidden = true;
      form.reset();
    });
  }
})();
