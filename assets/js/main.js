// main.js
// Navbar, search UX, accessibility helpers, UI utilities

document.addEventListener('DOMContentLoaded', () => {
  // ── Elements ───────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.querySelector('.navbar');
  const navForm = document.getElementById('navSearchForm');
  const navInput = document.getElementById('searchInput') || document.getElementById('q');

  // Dropdown About
  const aboutToggle = document.querySelector('.navbar__dropdown-toggle');
  const aboutMenu = document.getElementById('aboutDropdown');

  // ── Helpers ────────────────────────────────────
  const OPEN_CLASS = 'is-open';

  function setAriaExpanded(button, expanded) {
    if (!button) return;
    button.setAttribute('aria-expanded', String(Boolean(expanded)));
  }

  function setAriaHidden(el, hidden) {
    if (!el) return;
    el.setAttribute('aria-hidden', String(Boolean(hidden)));
  }

  function openNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.add(OPEN_CLASS);
    setAriaExpanded(navToggle, true);
    setAriaHidden(navLinks, false);

    const first = navLinks.querySelector('a');
    if (first) first.focus();
  }

  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove(OPEN_CLASS);
    setAriaExpanded(navToggle, false);
    setAriaHidden(navLinks, true);
    navToggle.focus();
  }

  // ── Navbar toggle mobile ───────────────────────
  if (navToggle && navLinks) {
    if (!navToggle.hasAttribute('aria-expanded')) setAriaExpanded(navToggle, false);
    if (!navLinks.hasAttribute('aria-hidden')) setAriaHidden(navLinks, true);

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const opened = navLinks.classList.toggle(OPEN_CLASS);
      setAriaExpanded(navToggle, opened);
      setAriaHidden(navLinks, !opened);

      if (opened) {
        const first = navLinks.querySelector('a');
        if (first) first.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains(OPEN_CLASS)) return;
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains(OPEN_CLASS)) {
        closeNav();
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeNav());
    });
  }

  // ── Dropdown About ─────────────────────────────
  if (aboutToggle && aboutMenu) {
    // Initial ARIA state
    setAriaExpanded(aboutToggle, false);
    setAriaHidden(aboutMenu, true);

    aboutToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = aboutToggle.getAttribute('aria-expanded') === 'true';
      const newState = !expanded;

      setAriaExpanded(aboutToggle, newState);
      setAriaHidden(aboutMenu, !newState);

      if (newState) {
        const firstItem = aboutMenu.querySelector('a');
        if (firstItem) firstItem.focus();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!aboutMenu) return;
      const expanded = aboutToggle.getAttribute('aria-expanded') === 'true';

      if (expanded && !aboutMenu.contains(e.target) && !aboutToggle.contains(e.target)) {
        setAriaExpanded(aboutToggle, false);
        setAriaHidden(aboutMenu, true);
      }
    });

    // Close dropdown on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setAriaExpanded(aboutToggle, false);
        setAriaHidden(aboutMenu, true);
      }
    });
  }

  // ── Navbar scroll effect ───────────────────────
  if (navbar) {
    const CSS_VAR = '--navbar-border-color';
    const SCROLLED_COLOR = 'rgba(29,187,108,0.35)';
    const DEFAULT_COLOR = 'rgba(29,187,108,0.18)';

    function updateNavbarBorder() {
      const scrolled = window.scrollY > 20;
      const color = scrolled ? SCROLLED_COLOR : DEFAULT_COLOR;
      navbar.style.setProperty(CSS_VAR, color);
      navbar.style.borderBottomColor = color;
    }

    updateNavbarBorder();

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNavbarBorder();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Navbar search UX ──────────────────────────
  if (navForm && navInput) {
    navForm.addEventListener('submit', (e) => {
      const q = (navInput.value || '').trim();
      if (!q) {
        e.preventDefault();
        navInput.focus();
      }
    });

    navInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navInput.value = '';
        navInput.blur();
      }
    });
  }

  // ── Accessibility: focus outlines for keyboard users ──
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);

  // ── Utilities ───────────────────────────────────
  window.__debounce = function (fn, wait = 200) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  window.__safeOn = function (selector, event, handler) {
    const el = document.querySelector(selector);
    if (el) el.addEventListener(event, handler);
  };
});
