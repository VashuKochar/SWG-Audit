// Load shared result helper
(function() {
  var script = document.createElement('script');
  script.src = '/js/shared/result-helper.js';
  script.onload = function() {
    // Enable auto-detection: clicking link = it opened = FAIL
    enableAutoDetection('#phishing-test-link');
  };
  document.head.appendChild(script);
})();

// Alternative: Manual result reporting
// Users can call these from browser console if needed
window.reportPass = function() {
  showResult('pass');
};

window.reportFail = function() {
  showResult('fail');
};
