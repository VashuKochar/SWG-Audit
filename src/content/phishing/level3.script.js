// Load shared result helper
(function() {
  var script = document.createElement('script');
  script.src = '/js/shared/result-helper.js';
  script.onload = function() {
    initFormTest();
  };
  document.head.appendChild(script);
})();

function initFormTest() {
  var form = document.getElementById('credential-form');
  var resetBtn = document.getElementById('reset');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Hide any previous results
    hideResults();
    
    var formData = new FormData(form);
    
    fetch(form.action, {
      method: 'POST',
      body: new URLSearchParams(formData),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(function (r) {
        if (r.ok) {
          // Submission succeeded = perimeter failed to block
          showResult('fail');
        } else {
          // Submission blocked or failed = perimeter passed
          showResult('pass');
        }
      })
      .catch(function (err) {
        // Network error or blocked = perimeter passed
        showResult('pass');
      });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      hideResults();
      form.reset();
    });
  }
}
