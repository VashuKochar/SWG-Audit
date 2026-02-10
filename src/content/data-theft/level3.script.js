(function () {
  var exfilBtn = document.getElementById('exfil-btn');
  var exfilResult = document.getElementById('exfil-result');

  if (!exfilBtn) return;

  exfilBtn.addEventListener('click', function () {
    var payload = btoa('test-exfil-' + Date.now());
    exfilResult.hidden = true;
    fetch('/data-theft/exfil?data=' + encodeURIComponent(payload))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        exfilResult.textContent = 'Perimeter Security Failed – ' + (data.message || 'Exfil request reached server.');
        exfilResult.className = 'error';
        exfilResult.hidden = false;
      })
      .catch(function () {
        exfilResult.textContent = 'Request blocked or failed. Perimeter may have passed.';
        exfilResult.className = 'success';
        exfilResult.hidden = false;
      });
  });
})();
