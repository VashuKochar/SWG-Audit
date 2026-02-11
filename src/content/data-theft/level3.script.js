// Load shared result helper
(function() {
  var script = document.createElement('script');
  script.src = '/js/shared/result-helper.js';
  script.onload = function() {
    initDNSExfilTest();
  };
  document.head.appendChild(script);
})();

function initDNSExfilTest() {
  var btn = document.getElementById('exfil-btn');

  if (!btn) return;

  btn.addEventListener('click', function() {
    hideResults(); // Clear any previous results
    
    // Simulate exfil payload (Base64-encoded test data)
    var payload = btoa('SENSITIVE_DATA_TEST_PAYLOAD_' + Date.now());
    
    // Send to server via query parameter
    fetch('/data-theft/exfil?data=' + encodeURIComponent(payload))
      .then(function(r) {
        if (r.ok) {
          // Request succeeded = server received data = FAIL
          showResult('fail');
        } else {
          // Request blocked or failed = PASS
          showResult('pass');
        }
      })
      .catch(function(err) {
        // Network error or blocked = PASS
        showResult('pass');
      });
  });
}
