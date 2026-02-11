/**
 * Result Helper - Shared utility for showing pass/fail banners
 * Usage in simulation scripts:
 * 
 * // When test passes (perimeter blocked)
 * showResult('pass');
 * 
 * // When test fails (perimeter allowed)
 * showResult('fail');
 * 
 * // Hide both
 * hideResults();
 */

function showResult(outcome) {
  const passEl = document.getElementById('result-pass');
  const failEl = document.getElementById('result-fail');
  
  if (!passEl || !failEl) {
    console.warn('Result banners not found in DOM');
    return;
  }
  
  // Hide both first
  passEl.classList.remove('show');
  failEl.classList.remove('show');
  
  // Show the appropriate one
  if (outcome === 'pass') {
    passEl.classList.add('show');
    passEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else if (outcome === 'fail') {
    failEl.classList.add('show');
    failEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function hideResults() {
  const passEl = document.getElementById('result-pass');
  const failEl = document.getElementById('result-fail');
  
  if (passEl) passEl.classList.remove('show');
  if (failEl) failEl.classList.remove('show');
}

// Auto-detect link clicks and show fail banner (user clicked = link worked = fail)
// Call this in your simulation script to enable auto-detection
function enableAutoDetection(linkSelector) {
  const link = document.querySelector(linkSelector);
  if (!link) {
    console.warn('Link not found for auto-detection:', linkSelector);
    return;
  }
  
  link.addEventListener('click', function(e) {
    // If link opens (target=_blank), assume it worked (FAIL)
    // User needs to manually check if it was blocked
    setTimeout(function() {
      showResult('fail');
    }, 500);
  });
}
