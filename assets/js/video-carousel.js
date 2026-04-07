// assets/js/video-carousel.js
const VISIBLE = { desktop: 3, tablet: 2, mobile: 1 };
const AUTOPLAY_MS = 7000;
const FETCH_COUNT = 15; // server returns 15 random videos

function getVisibleCount() {
  const w = window.innerWidth;
  if (w <= 600) return VISIBLE.mobile;
  if (w <= 1000) return VISIBLE.tablet;
  return VISIBLE.desktop;
}

async function fetchRandomVideos() {
  const res = await fetch('/data/videos.json');
  if (!res.ok) throw new Error('Errore fetch videos');
  const data = await res.json();
  return data.items || data || [];
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function buildSlides(videos) {
  const track = document.getElementById('gl-video-track');
  track.innerHTML = '';
  videos.forEach((v) => {
    const slide = document.createElement('div');
    slide.className = 'gl-slide';
    slide.innerHTML = `
      <div class="video-wrap">
        <iframe loading="lazy" src="https://www.youtube.com/embed/${v.videoId}?rel=0&modestbranding=1" title="${escapeHtml(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="video-caption"><h4>${escapeHtml(v.title)}</h4></div>`;
    track.appendChild(slide);
  });
}

function createIndicators(totalGroups) {
  const container = document.getElementById('gl-indicators');
  container.innerHTML = '';
  for (let i = 0; i < totalGroups; i++) {
    const btn = document.createElement('button');
    btn.dataset.index = i;
    if (i === 0) btn.classList.add('active');
    container.appendChild(btn);
  }
  container.addEventListener('click', (e) => {
    if (e.target && e.target.dataset.index !== undefined) {
      goToGroup(parseInt(e.target.dataset.index, 10));
      resetAutoplay();
    }
  });
}

let currentGroup = 0;
let groupCount = 0;
let autoplayTimer = null;

function updateTrackPosition() {
  const track = document.getElementById('gl-video-track');
  const visible = getVisibleCount();
  const slide = track.querySelector('.gl-slide');
  if (!slide) return;
  const slideWidth = slide.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
  const offset = currentGroup * visible * slideWidth;
  track.style.transform = `translateX(-${offset}px)`;
  // update indicators
  const indicators = document.querySelectorAll('.carousel-indicators button');
  indicators.forEach((b, i) => b.classList.toggle('active', i === currentGroup));
}

function goToGroup(index) {
  currentGroup = Math.max(0, Math.min(index, groupCount - 1));
  updateTrackPosition();
}

function nextGroup() { goToGroup(currentGroup + 1); }
function prevGroup() { goToGroup(currentGroup - 1); }

function resetAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => {
    if (currentGroup + 1 >= groupCount) goToGroup(0); else nextGroup();
  }, AUTOPLAY_MS);
}

function setupControls() {
  document.getElementById('gl-next').addEventListener('click', () => { nextGroup(); resetAutoplay(); });
  document.getElementById('gl-prev').addEventListener('click', () => { prevGroup(); resetAutoplay(); });
  window.addEventListener('resize', () => {
    // recalc groupCount and reposition
    const visible = getVisibleCount();
    const totalSlides = document.querySelectorAll('.gl-slide').length;
    groupCount = Math.ceil(totalSlides / visible);
    if (currentGroup >= groupCount) currentGroup = groupCount - 1;
    updateTrackPosition();
  });
}

async function initCarousel() {
  try {
    const videos = await fetchRandomVideos();
    if (!videos.length) return;
    buildSlides(videos);
    const visible = getVisibleCount();
    const totalSlides = videos.length;
    groupCount = Math.ceil(totalSlides / visible);
    createIndicators(groupCount);
    setupControls();
    updateTrackPosition();
    resetAutoplay();
  } catch (err) {
    console.error('Carosello video errore:', err);
  }
}

document.addEventListener('DOMContentLoaded', initCarousel);
