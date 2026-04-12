(function () {
  const PER_PAGE = 12;
  let allCards = [];
  let filtered = [];
  let currentPage = 1;
  let activeFilter = 'all';
  let timer = null;
  let sortOrder = 'desc';
  let sortBy = 'post';

  function init() {
    allCards = Array.from(document.querySelectorAll('#ag-grid .ag-card-link'));
    allCards.forEach(function (c) {
      const img = c.querySelector('img');
      if (!img) return;
      function reveal() { img.classList.add('ag-loaded'); }
      if (img.complete) { reveal(); }
      else {
        img.addEventListener('load', reveal);
        img.addEventListener('error', reveal);
      }
    });
    filtered = allCards.slice();
    applyFilter();
  }

  window.agToggleSort = function () {
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    const label = document.getElementById('ag-sort-label');
    if (label) label.textContent = sortOrder === 'desc' ? 'Newest' : 'Oldest';
    applyFilter();
  };

  window.agToggleSortBy = function () {
    sortBy = sortBy === 'post' ? 'release' : 'post';
    const label = document.getElementById('ag-sortby-label');
    if (label) label.textContent = sortBy === 'post' ? 'Post' : 'Release';
    applyFilter();
  };

  window.agFilter = function (f, btn) {
    activeFilter = f;
    document.querySelectorAll('.ag-filter').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    applyFilter();
  };

  window.agSearch = function () {
    clearTimeout(timer);
    timer = setTimeout(applyFilter, 200);
  };

  function getTimestamp(card) {
    if (sortBy === 'release') {
      const rd = card.dataset.releaseDate || '';
      if (rd) {
        const t = new Date(rd).getTime();
        if (!isNaN(t)) return t;
      }
    }
    return parseInt(card.dataset.date || '0', 10) * 1000;
  }

  function applyFilter() {
    const input = document.getElementById('ag-search');
    const q = (input && input.value ? input.value : '').toLowerCase().trim();
    filtered = allCards.filter(function (c) {
      const title = c.dataset.title || '';
      const cat = c.dataset.cat || '';
      const badge = c.dataset.badge || '';
      const matchFilter = activeFilter === 'all' || badge === activeFilter || cat === activeFilter;
      const matchSearch = !q || title.indexOf(q) !== -1 || cat.indexOf(q) !== -1 || badge.indexOf(q) !== -1;
      return matchFilter && matchSearch;
    });

    filtered.sort(function (a, b) {
      const da = getTimestamp(a);
      const db = getTimestamp(b);
      return sortOrder === 'desc' ? db - da : da - db;
    });

    renderPage(1);
  }

  function renderPage(page) {
    currentPage = page;
    const grid = document.getElementById('ag-grid');

    allCards.forEach(function (c) { c.classList.remove('ag-visible'); });

    const empty = document.getElementById('ag-empty');
    const pagEl = document.getElementById('ag-pagination');
    if (!filtered.length) {
      if (empty) empty.style.display = 'flex';
      if (pagEl) pagEl.innerHTML = '';
      return;
    }
    if (empty) empty.style.display = 'none';

    filtered.forEach(function (c) { grid.appendChild(c); });

    const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    slice.forEach(function (c, i) {
      c.style.animationDelay = (i * 0.045) + 's';
      c.classList.add('ag-visible');
    });

    buildPagination();
  }

  function buildPagination() {
    const pag = document.getElementById('ag-pagination');
    if (!pag) return;
    pag.innerHTML = '';
    const total = Math.ceil(filtered.length / PER_PAGE);
    if (total <= 1) return;

    const max = 5;
    let s = Math.max(1, currentPage - 2);
    let e = Math.min(total, s + max - 1);
    if (e - s < max - 1) s = Math.max(1, e - max + 1);

    addBtn(pag, '‹', currentPage === 1, function () { go(currentPage - 1); });
    if (s > 1) {
      addBtn(pag, '1', false, function () { go(1); });
      if (s > 2) addDots(pag);
    }
    for (let i = s; i <= e; i++) {
      addBtn(pag, String(i), false, function () { go(i); }, i === currentPage);
    }
    if (e < total) {
      if (e < total - 1) addDots(pag);
      addBtn(pag, String(total), false, function () { go(total); });
    }
    addBtn(pag, '›', currentPage === total, function () { go(currentPage + 1); });
  }

  function go(p) {
    renderPage(p);
    const section = document.querySelector('.ag-section');
    if (section && section.scrollIntoView) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function addBtn(p, txt, disabled, fn, active) {
    const b = document.createElement('button');
    b.className = 'ag-page-btn' + (active ? ' active' : '');
    b.textContent = txt;
    b.disabled = disabled;
    b.onclick = fn;
    p.appendChild(b);
  }

  function addDots(p) {
    const s = document.createElement('span');
    s.className = 'ag-page-dots';
    s.textContent = '…';
    p.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
