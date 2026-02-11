// Load shared result helper (for manual reporting buttons)
(function() {
  var script = document.createElement('script');
  script.src = '/js/shared/result-helper.js';
  document.head.appendChild(script);
})();

// No automated detection possible - users click links and manually report results
// The showResult() function is called by onclick buttons in the HTML
