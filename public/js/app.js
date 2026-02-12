/**
 * SWG Audit - Global App JavaScript
 * Handles: dark mode, mobile menu, toast notifications
 */

(function() {
  'use strict';
  
  // ========== Dark Mode ==========
  function initDarkMode() {
    var toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;
    
    // Check for saved preference, otherwise use system preference
    var savedTheme = localStorage.getItem('theme');
    var systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateDarkModeIcon(currentTheme);
    
    // Toggle handler
    toggle.addEventListener('click', function() {
      var newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateDarkModeIcon(newTheme);
      
      showToast(newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled', 'success');
    });
    
    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) { // Only if user hasn't set preference
          var newTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
          updateDarkModeIcon(newTheme);
        }
      });
    }
  }
  
  function updateDarkModeIcon(theme) {
    var icon = document.querySelector('.dark-mode-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  
  // ========== Mobile Menu ==========
  function initMobileMenu() {
    var toggle = document.getElementById('mobile-menu-toggle');
    var nav = document.getElementById('main-nav');
    var overlay = document.getElementById('mobile-menu-overlay');
    
    if (!toggle || !nav || !overlay) return;
    
    function closeMenu() {
      nav.classList.remove('mobile-menu-open');
      overlay.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    
    function openMenu() {
      nav.classList.add('mobile-menu-open');
      overlay.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Prevent scroll when menu is open
    }
    
    // Toggle button
    toggle.addEventListener('click', function() {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    
    // Close on overlay click
    overlay.addEventListener('click', closeMenu);
    
    // Close on nav link click
    var navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });
  }
  
  // ========== Toast Notifications ==========
  var toastContainer = null;
  
  function createToastContainer() {
    if (toastContainer) return toastContainer;
    
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);
    return toastContainer;
  }
  
  function showToast(message, type, duration) {
    type = type || 'info'; // success, error, info, warning
    duration = duration || 5000; // 5 seconds default
    
    var container = createToastContainer();
    
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    
    var icon = '';
    switch(type) {
      case 'success': icon = '✅'; break;
      case 'error': icon = '❌'; break;
      case 'warning': icon = '⚠️'; break;
      default: icon = 'ℹ️';
    }
    
    toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-message">' + message + '</span>';
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(function() {
      toast.classList.add('toast-show');
    }, 10);
    
    // Auto-dismiss
    setTimeout(function() {
      toast.classList.remove('toast-show');
      setTimeout(function() {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
    
    // Click to dismiss
    toast.addEventListener('click', function() {
      toast.classList.remove('toast-show');
      setTimeout(function() {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    });
  }
  
  // Expose showToast globally for other scripts to use
  window.showToast = showToast;
  
  // ========== Check for verification status ==========
  function checkVerificationStatus() {
    var params = new URLSearchParams(window.location.search);
    
    if (params.has('verified')) {
      var status = params.get('verified');
      if (status === 'success') {
        showToast('✅ Verification successful! You now have 24-hour access to all simulations.', 'success');
      }
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    if (params.has('error')) {
      var error = params.get('error');
      var message = 'Verification failed. Please try again.';
      
      if (error === 'captcha') {
        message = '❌ reCAPTCHA verification failed. Please try again.';
      } else if (error === 'email_invalid') {
        message = '❌ Please enter a valid email address.';
      } else if (error === 'email_business') {
        message = '❌ Please use a company email. Free providers (Gmail, Yahoo, etc.) are not accepted.';
      } else if (error === 'session_expired') {
        message = '⚠️ Session expired. Please verify again to continue.';
      }
      
      showToast(message, 'error', 8000); // Show error longer
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }
  
  // ========== Tooltips (Mobile Touch Support) ==========
  function initTooltips() {
    // Only add touch support on touch devices
    if (!('ontouchstart' in window)) return;
    
    var tooltips = document.querySelectorAll('.tooltip-trigger');
    
    tooltips.forEach(function(trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle active class
        var wasActive = trigger.classList.contains('active');
        
        // Close all other tooltips
        document.querySelectorAll('.tooltip-trigger.active').forEach(function(other) {
          if (other !== trigger) {
            other.classList.remove('active');
          }
        });
        
        // Toggle this tooltip
        if (wasActive) {
          trigger.classList.remove('active');
        } else {
          trigger.classList.add('active');
        }
      });
    });
    
    // Close tooltips when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.tooltip-trigger')) {
        document.querySelectorAll('.tooltip-trigger.active').forEach(function(trigger) {
          trigger.classList.remove('active');
        });
      }
    });
  }
  
  // ========== Copy to Clipboard ==========
  function initCopyButtons() {
    var copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetSelector = btn.getAttribute('data-copy-target');
        var target = document.querySelector(targetSelector);
        
        if (!target) return;
        
        var text = target.value || target.textContent.trim();
        
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function() {
            showCopySuccess(btn);
          }).catch(function(err) {
            console.error('Copy failed:', err);
            fallbackCopy(target, btn);
          });
        } else {
          // Fallback for older browsers
          fallbackCopy(target, btn);
        }
      });
    });
  }
  
  function fallbackCopy(target, btn) {
    try {
      var input = target;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        // Create temporary input
        input = document.createElement('textarea');
        input.value = target.textContent.trim();
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
      }
      
      input.select();
      input.setSelectionRange(0, 99999); // For mobile
      document.execCommand('copy');
      
      if (input !== target) {
        document.body.removeChild(input);
      }
      
      showCopySuccess(btn);
    } catch (err) {
      console.error('Fallback copy failed:', err);
      showToast('Failed to copy. Please copy manually.', 'error');
    }
  }
  
  function showCopySuccess(btn) {
    var originalHTML = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">Copied!</span>';
    
    showToast('URL copied to clipboard', 'success');
    
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.innerHTML = originalHTML;
    }, 2000);
  }
  
  // ========== Mobile Swipe Gestures ==========
  function initSwipeGestures() {
    // Only enable on touch devices
    if (!('ontouchstart' in window)) return;
    
    // Only enable on simulation pages (check for level-navigation)
    var levelNav = document.querySelector('.level-navigation');
    if (!levelNav) return;
    
    var startX = 0;
    var startY = 0;
    var startTime = 0;
    var threshold = 50; // Minimum distance for swipe (pixels)
    var restraint = 100; // Maximum vertical movement allowed
    var allowedTime = 300; // Maximum time for swipe (ms)
    
    var mainContent = document.querySelector('main') || document.body;
    
    mainContent.addEventListener('touchstart', function(e) {
      var touchobj = e.changedTouches[0];
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
    }, { passive: true });
    
    mainContent.addEventListener('touchend', function(e) {
      var touchobj = e.changedTouches[0];
      var distX = touchobj.pageX - startX;
      var distY = touchobj.pageY - startY;
      var elapsedTime = new Date().getTime() - startTime;
      
      // Check if it's a valid swipe (horizontal, fast, far enough)
      if (elapsedTime <= allowedTime && Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        if (distX < 0) {
          // Swipe left = next level
          var nextLink = levelNav.querySelector('a[href*="level"]:last-of-type:not([disabled])');
          if (nextLink && nextLink.textContent.includes('Next')) {
            window.location.href = nextLink.getAttribute('href');
          }
        } else {
          // Swipe right = previous level
          var prevLink = levelNav.querySelector('a[href*="level"]:first-of-type:not([disabled])');
          if (prevLink && prevLink.textContent.includes('Previous')) {
            window.location.href = prevLink.getAttribute('href');
          }
        }
      }
    }, { passive: true });
  }
  
  // ========== Initialize on DOM ready ==========
  function init() {
    initDarkMode();
    initMobileMenu();
    initTooltips();
    initCopyButtons();
    initSwipeGestures();
    checkVerificationStatus();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
