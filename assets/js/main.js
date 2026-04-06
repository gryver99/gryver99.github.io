// ── Navbar toggle mobile ──────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ── Navbar scroll effect ──────────────────────────
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.borderBottomColor = 'rgba(0, 220, 180, 0.35)';
  } else {
    navbar.style.borderBottomColor = 'rgba(0, 220, 180, 0.18)';
  }
});

// ── Close menu on link click ──────────────────────
document.querySelectorAll('.navbar__links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});