// main.js
// Navbar, search UX, accessibility helpers, UI utilities

document.addEventListener('DOMContentLoaded', () => {

  // ── Elements ───────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const navbar    = document.querySelector('.navbar');
  const navForm   = document.getElementById('navSearchForm');

  // Due possibili ID per il campo di ricerca in base alla pagina corrente.
  // Nota: se entrambi esistessero, verrebbe usato il primo ('searchInput').
  const navInput  = document.getElementById('searchInput') || document.getElementById('q');

  // Dropdown About
  const aboutParent = document.querySelector('.navbar__dropdown');
  const aboutLink   = document.querySelector('.navbar__dropdown-link');
  const aboutMenu   = document.getElementById('aboutDropdown');

  // ── Helpers ────────────────────────────────────
  const OPEN_CLASS = 'is-open';
  const IS_DESKTOP = () => window.innerWidth > 900;

  function setAriaExpanded(button, expanded) {
    if (!button) return;
    button.setAttribute('aria-expanded', String(Boolean(expanded)));
  }

  function setAriaHidden(el, hidden) {
    if (!el) return;
    el.setAttribute('aria-hidden', String(Boolean(hidden)));
  }

  // ── Navbar toggle (mobile) ─────────────────────
  if (navToggle && navLinks) {
    setAriaExpanded(navToggle, false);
    setAriaHidden(navLinks, true);

    function openNav() {
      navLinks.classList.add(OPEN_CLASS);
      setAriaExpanded(navToggle, true);
      setAriaHidden(navLinks, false);
      const first = navLinks.querySelector('a');
      if (first) first.focus();
    }

    function closeNav() {
      navLinks.classList.remove(OPEN_CLASS);
      setAriaExpanded(navToggle, false);
      setAriaHidden(navLinks, true);
      navToggle.focus();
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.contains(OPEN_CLASS) ? closeNav() : openNav();
    });

    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains(OPEN_CLASS) &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
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
  // Desktop: apre/chiude con hover
  // Mobile:  apre/chiude con click sul link About
  if (aboutParent && aboutMenu && aboutLink) {
    setAriaHidden(aboutMenu, true);

    function openAbout() {
      aboutParent.classList.add('open');
      setAriaHidden(aboutMenu, false);
      setAriaExpanded(aboutLink, true);
    }

    function closeAbout() {
      aboutParent.classList.remove('open');
      setAriaHidden(aboutMenu, true);
      setAriaExpanded(aboutLink, false);
    }

    // closeTimer dichiarato nel blocco dove viene usato
    let closeTimer;

    // Hover (solo desktop)
    aboutParent.addEventListener('mouseenter', () => {
      if (IS_DESKTOP()) {
        clearTimeout(closeTimer);
        openAbout();
      }
    });

    aboutParent.addEventListener('mouseleave', () => {
      if (IS_DESKTOP()) {
        closeTimer = setTimeout(closeAbout, 250);
      }
    });

    // Click (solo mobile)
    aboutLink.addEventListener('click', (e) => {
      if (!IS_DESKTOP()) {
        e.preventDefault();
        aboutParent.classList.contains('open') ? closeAbout() : openAbout();
      }
    });

    // Chiudi cliccando fuori
    document.addEventListener('click', (e) => {
      if (aboutParent.classList.contains('open') && !aboutParent.contains(e.target)) {
        closeAbout();
      }
    });

    // Chiudi con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && aboutParent.classList.contains('open')) {
        closeAbout();
      }
    });

    // ── Resize: chiude i menu se si cambia fascia (mobile ↔ desktop) ──
    // Evita stati inconsistenti dopo rotazione schermo o resize finestra.
    window.addEventListener('resize', Utils.debounce(() => {
      if (IS_DESKTOP()) {
        // Passando a desktop: chiudi il nav mobile se aperto
        if (navLinks && navLinks.classList.contains(OPEN_CLASS)) {
          navLinks.classList.remove(OPEN_CLASS);
          setAriaExpanded(navToggle, false);
          setAriaHidden(navLinks, true);
        }
      } else {
        // Passando a mobile: chiudi il dropdown About se aperto via hover
        clearTimeout(closeTimer);
        closeAbout();
      }
    }, 150));
  }

  // ── Navbar scroll effect ───────────────────────
  if (navbar) {
    const SCROLLED_COLOR = 'rgba(29,187,108,0.35)';
    const DEFAULT_COLOR  = 'rgba(29,187,108,0.18)';

    function updateNavbarBorder() {
      const color = window.scrollY > 20 ? SCROLLED_COLOR : DEFAULT_COLOR;
      navbar.style.setProperty('--navbar-border-color', color);
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
      if (!(navInput.value || '').trim()) {
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

  // ── Accessibility: outline solo per utenti da tastiera ──
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);

  // ── Utilities: raccolte in window.Utils per non inquinare il namespace globale ──
  window.Utils = {

    /**
     * Ritarda l'esecuzione di fn di `wait` ms dopo l'ultimo invocation.
     * @param {Function} fn
     * @param {number} wait
     * @returns {Function}
     */
    debounce(fn, wait = 200) {
      let t;
      return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    /**
     * Aggiunge un event listener in modo sicuro (noop se il selettore non esiste).
     * @param {string} selector
     * @param {string} event
     * @param {Function} handler
     */
    safeOn(selector, event, handler) {
      const el = document.querySelector(selector);
      if (el) el.addEventListener(event, handler);
    },

  };

});