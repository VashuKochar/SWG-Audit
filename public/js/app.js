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
  
  // ========== Initialize on DOM ready ==========
  function init() {
    initDarkMode();
    initMobileMenu();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
