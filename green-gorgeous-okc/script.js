/* ============================================
   GREEN & GORGEOUS OKC - Landing Page Scripts
   ============================================ */

(function () {
  'use strict';

  // ─── Configuration ───────────────────────────
  const CONFIG = {
    // Valid OKC-area ZIP codes (Oklahoma ZIPs start with 73/74)
    validZipPrefixes: ['73', '74'],
    // Redirect URL after successful signup (update when connecting backend)
    thankYouUrl: 'thank-you.html',
    // Simulate backend delay (ms) — remove when connecting real backend
    fakeSubmitDelay: 1200,
  };

  // ─── DOM Ready ───────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavbar();
    initForms();
    initSmoothScroll();
    initScrollAnimations();
    initZipInputs();
  }

  // ─── Navbar Scroll Effect ────────────────────
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
  }

  // ─── Smooth Scroll for Anchor Links ──────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        var offset = 80; // navbar height
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({ top: top, behavior: 'smooth' });

        // Focus the first input if scrolling to a form
        var firstInput = target.querySelector('input');
        if (firstInput) {
          setTimeout(function () { firstInput.focus(); }, 500);
        }
      });
    });
  }

  // ─── Scroll Animations (Intersection Observer) ──
  function initScrollAnimations() {
    // Add .fade-in to elements we want to animate
    var selectors = [
      '.feature-card',
      '.highlight-card',
      '.testimonial-card',
      '.preview-mockup',
      '.trust-locations',
      '.cta-content',
    ];

    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('fade-in');
      });
    });

    // Use IntersectionObserver for performant scroll detection
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      document.querySelectorAll('.fade-in').forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: just show everything
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // ─── ZIP Code Input Formatting ───────────────
  function initZipInputs() {
    document.querySelectorAll('input[name="zip"]').forEach(function (input) {
      input.addEventListener('input', function () {
        // Only allow digits
        this.value = this.value.replace(/\D/g, '').slice(0, 5);
      });
    });
  }

  // ─── Form Handling ───────────────────────────
  function initForms() {
    document.querySelectorAll('.signup-form').forEach(function (form) {
      form.addEventListener('submit', handleFormSubmit);

      // Real-time validation on blur
      form.querySelectorAll('input').forEach(function (input) {
        input.addEventListener('blur', function () {
          validateField(input);
        });

        // Clear error on input
        input.addEventListener('input', function () {
          clearFieldError(input);
        });
      });
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    var form = e.target;
    var emailInput = form.querySelector('input[name="email"]');
    var zipInput = form.querySelector('input[name="zip"]');
    var submitBtn = form.querySelector('button[type="submit"]');

    // Validate all fields
    var emailValid = validateField(emailInput);
    var zipValid = validateField(zipInput);

    if (!emailValid || !zipValid) return;

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Collect form data
    var formData = {
      email: emailInput.value.trim(),
      zip: zipInput.value.trim(),
      source: form.dataset.form || 'unknown',
      timestamp: new Date().toISOString(),
      page: window.location.href,
    };

    // Track the signup event (analytics-ready)
    trackEvent('newsletter_signup', formData);

    // Submit to backend
    submitForm(formData, form, submitBtn);
  }

  function submitForm(data, form, submitBtn) {
    /*
     * ─── BACKEND INTEGRATION POINT ─────────────
     * 
     * Replace the setTimeout below with your actual API call.
     * Examples:
     *
     * 1. Mailchimp / ConvertKit:
     *    fetch('https://your-api-endpoint.com/subscribe', {
     *      method: 'POST',
     *      headers: { 'Content-Type': 'application/json' },
     *      body: JSON.stringify(data)
     *    })
     *
     * 2. Google Sheets (via Apps Script):
     *    fetch('https://script.google.com/macros/s/YOUR_ID/exec', {
     *      method: 'POST',
     *      body: JSON.stringify(data)
     *    })
     *
     * 3. Formspree:
     *    fetch('https://formspree.io/f/YOUR_FORM_ID', {
     *      method: 'POST',
     *      headers: { 'Content-Type': 'application/json' },
     *      body: JSON.stringify(data)
     *    })
     */

    // Simulated submission — replace with real API call
    setTimeout(function () {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      // Show inline success or redirect
      showFormSuccess(form);

      // Store in localStorage as backup
      storeSignupLocally(data);

      // Optional: redirect to thank you page
      // window.location.href = CONFIG.thankYouUrl;
    }, CONFIG.fakeSubmitDelay);
  }

  // ─── Validation ──────────────────────────────
  function validateField(input) {
    var name = input.name;
    var value = input.value.trim();

    if (name === 'email') {
      return validateEmail(input, value);
    } else if (name === 'zip') {
      return validateZip(input, value);
    }
    return true;
  }

  function validateEmail(input, value) {
    var errorEl = input.parentElement.querySelector('.form-error');

    if (!value) {
      showFieldError(input, errorEl, 'Email is required');
      return false;
    }

    // Standard email regex
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(input, errorEl, 'Please enter a valid email');
      return false;
    }

    showFieldSuccess(input, errorEl);
    return true;
  }

  function validateZip(input, value) {
    var errorEl = input.parentElement.querySelector('.form-error');

    if (!value) {
      showFieldError(input, errorEl, 'ZIP code required');
      return false;
    }

    if (!/^\d{5}$/.test(value)) {
      showFieldError(input, errorEl, 'Enter 5-digit ZIP');
      return false;
    }

    // Check if it's an Oklahoma ZIP
    var prefix = value.substring(0, 2);
    var isOklahoma = CONFIG.validZipPrefixes.indexOf(prefix) !== -1;

    if (!isOklahoma) {
      showFieldError(input, errorEl, 'Oklahoma ZIP codes only');
      return false;
    }

    showFieldSuccess(input, errorEl);
    return true;
  }

  function showFieldError(input, errorEl, message) {
    input.classList.add('error');
    input.classList.remove('success');
    if (errorEl) errorEl.textContent = message;
  }

  function showFieldSuccess(input, errorEl) {
    input.classList.remove('error');
    input.classList.add('success');
    if (errorEl) errorEl.textContent = '';
  }

  function clearFieldError(input) {
    input.classList.remove('error');
    var errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = '';
  }

  // ─── Success State ───────────────────────────
  function showFormSuccess(form) {
    var successHtml =
      '<div class="form-success">' +
        '<div class="form-success-icon">🎉</div>' +
        '<h3>You\'re In!</h3>' +
        '<p>Check your inbox for your free Spring Lawn Assessment Guide. Welcome to Green & Gorgeous OKC!</p>' +
      '</div>';

    form.innerHTML = successHtml;
  }

  // ─── Local Storage Backup ────────────────────
  function storeSignupLocally(data) {
    try {
      var signups = JSON.parse(localStorage.getItem('gg_okc_signups') || '[]');
      signups.push(data);
      localStorage.setItem('gg_okc_signups', JSON.stringify(signups));
    } catch (e) {
      // localStorage not available — that's fine
    }
  }

  // ─── Analytics Tracking ──────────────────────
  function trackEvent(eventName, data) {
    /*
     * ─── ANALYTICS INTEGRATION POINT ───────────
     *
     * Uncomment and configure for your analytics platform:
     *
     * Google Analytics 4:
     *   gtag('event', eventName, data);
     *
     * Facebook Pixel:
     *   fbq('track', 'Lead', { content_name: eventName });
     *
     * Custom:
     *   fetch('/api/track', { method: 'POST', body: JSON.stringify({ event: eventName, ...data }) });
     */

    // Console log for development — remove in production
    console.log('[GG-OKC] Event:', eventName, data);
  }

  // ─── Utility: Export signups from localStorage ──
  // Usage in browser console: GG_OKC.exportSignups()
  window.GG_OKC = {
    exportSignups: function () {
      try {
        var signups = JSON.parse(localStorage.getItem('gg_okc_signups') || '[]');
        console.table(signups);
        return signups;
      } catch (e) {
        console.error('No signups found');
        return [];
      }
    },
    clearSignups: function () {
      localStorage.removeItem('gg_okc_signups');
      console.log('Signups cleared');
    },
  };
})();
