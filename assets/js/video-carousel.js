(function () {
  const widget = document.getElementById('gl-vc-widget');
  if (!widget) return;

  const VC = {
    jsonPath: widget.dataset.jsonPath || '/data/videos.json',
    maxPick: 30,
    /** Desktop: 3 video per pagina; mobile (≤650px): 1 solo video */
    visDesktop: 3,
    visMobile: 1,
    autoSec: 7,
    openModal: false
  };

  const MOBILE_MQ = window.matchMedia('(max-width: 650px)');

  let all = [],
    set = [],
    page = 0,
    timer = null,
    playing = true;

  function getVis() {
    return MOBILE_MQ.matches ? VC.visMobile : VC.visDesktop;
  }

  function getId(item) {
    const r = (item.id || '').toString().trim();
    if (!r) return '';
    if (r.includes('youtube.com') || r.includes('youtu.be')) {
      try {
        const u = new URL(r);
        if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).trim();
        return (u.searchParams.get('v') || '').trim();
      } catch (e) {
        return r.trim();
      }
    }
    return r;
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function load() {
    try {
      const res = await fetch(VC.jsonPath, { cache: 'no-cache' });
      if (!res.ok) throw new Error('videos.json not found');
      const json = await res.json();
      all = (json.items || [])
        .map((it) => ({ ...it, id: getId(it) }))
        .filter((it) => it.id);
      if (!all.length) throw new Error('No valid videos');
      init();
    } catch (err) {
      widget.innerHTML = `<div style="padding:24px;color:#39ff8c;font-family:Rajdhani,sans-serif;font-size:14px;letter-spacing:1px;background:rgba(57,255,140,.04);border:1px solid rgba(57,255,140,.12);border-radius:12px">Unable to load videos.<br><small style="opacity:.6">${err.message}</small></div>`;
    }
  }

  function init() {
    set = shuffle(all.slice()).slice(0, Math.min(VC.maxPick, all.length));
    page = 0;
    widget.classList.toggle('gl-vc--mobile', MOBILE_MQ.matches);
    render();
    buildPager();
    updateCount();
    startAuto();
  }

  function render() {
    const vis = getVis();
    const slots = document.querySelectorAll('.gl-slot');
    const start = page * vis;

    slots.forEach((slot, i) => {
      slot.innerHTML = '';
      if (i >= vis) {
        slot.hidden = true;
        return;
      }
      slot.hidden = false;

      const item = set[start + i];
      if (!item) {
        slot.innerHTML =
          '<div style="aspect-ratio:16/9;background:rgba(57,255,140,.03);border:1px solid rgba(57,255,140,.07);border-radius:12px"></div>';
        return;
      }

      const vidUrl = 'https://www.youtube.com/watch?v=' + encodeURIComponent(item.id);

      const thumb = document.createElement('a');
      thumb.className = 'gl-thumb';
      thumb.href = vidUrl;
      thumb.target = '_blank';
      thumb.rel = 'noopener noreferrer';
      thumb.setAttribute('aria-label', (item.title || 'Video') + ' - watch on YouTube');

      const img = document.createElement('img');
      img.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(item.id) + '/hqdefault.jpg';
      img.alt = item.title || '';
      img.loading = 'lazy';
      thumb.appendChild(img);

      const ov = document.createElement('div');
      ov.className = 'gl-thumb-overlay';
      thumb.appendChild(ov);
      ['tl', 'tr', 'bl', 'br'].forEach((p) => {
        const c = document.createElement('div');
        c.className = 'gl-corner gl-corner--' + p;
        thumb.appendChild(c);
      });

      const tl = document.createElement('div');
      tl.className = 'gl-thumb-title';
      tl.textContent = item.title || '';
      thumb.appendChild(tl);

      const pw = document.createElement('div');
      pw.className = 'gl-playwrap';
      const pl = document.createElement('div');
      pl.className = 'gl-play';
      pl.setAttribute('aria-hidden', 'true');
      pl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      pw.appendChild(pl);
      thumb.appendChild(pw);

      if (VC.openModal) {
        thumb.addEventListener('click', (e) => {
          e.preventDefault();
          openModal(item.id, item.title);
        });
      }
      slot.appendChild(thumb);

      if (item.publishedAt) {
        const meta = document.createElement('div');
        meta.className = 'gl-slot-meta';
        const sub = document.createElement('div');
        sub.className = 'gl-slot-sub';
        sub.textContent = '◆ ' + item.publishedAt;
        meta.appendChild(sub);
        const wl = document.createElement('a');
        wl.className = 'gl-watch-link';
        wl.href = vidUrl;
        wl.target = '_blank';
        wl.rel = 'noopener noreferrer';
        wl.innerHTML =
          'WATCH <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
        meta.appendChild(wl);
        slot.appendChild(meta);
      }
    });
  }

  function buildPager() {
    const pager = document.getElementById('gl-pager');
    if (!pager) return;
    const vis = getVis();
    const pages = Math.max(1, Math.ceil(set.length / vis));
    pager.innerHTML = '';
    const show = Math.min(pages, 12);
    for (let i = 0; i < show; i++) {
      const d = document.createElement('button');
      d.className = 'gl-dot' + (i === page ? ' active' : '');
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Page ' + (i + 1));
      d.setAttribute('aria-selected', i === page ? 'true' : 'false');
      d.addEventListener('click', () => {
        page = i;
        render();
        syncPager();
        updateCount();
        resetAuto();
      });
      pager.appendChild(d);
    }
  }

  function syncPager() {
    document.querySelectorAll('.gl-dot').forEach((d, i) => {
      d.classList.toggle('active', i === page);
      d.setAttribute('aria-selected', i === page ? 'true' : 'false');
    });
  }

  function updateCount() {
    const el = document.getElementById('gl-count');
    if (!el) return;
    const vis = getVis();
    const s = page * vis + 1;
    const e = Math.min(s + vis - 1, set.length);
    el.textContent = s + '-' + e + ' / ' + set.length;
  }

  function startProgress() {
    const b = document.getElementById('gl-progress');
    if (!b) return;
    b.style.transition = 'none';
    b.style.width = '0%';
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        b.style.transition = `width ${VC.autoSec}s linear`;
        b.style.width = '100%';
      })
    );
  }

  function stopProgress() {
    const b = document.getElementById('gl-progress');
    if (!b) return;
    b.style.transition = 'none';
    b.style.width = '0%';
  }

  function next() {
    const vis = getVis();
    const p = Math.ceil(set.length / vis) || 1;
    page = (page + 1) % p;
    render();
    syncPager();
    updateCount();
  }

  function prev() {
    const vis = getVis();
    const p = Math.ceil(set.length / vis) || 1;
    page = (page - 1 + p) % p;
    render();
    syncPager();
    updateCount();
  }

  function startAuto() {
    stopAuto();
    if (!playing) return;
    startProgress();
    timer = setInterval(() => {
      next();
      startProgress();
    }, VC.autoSec * 1000);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    stopProgress();
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  /** Mantiene il primo video visibile coerente quando si passa desktop ↔ mobile */
  function reanchorPage(oldVis, newVis) {
    if (!set.length) return;
    const firstIndex = page * oldVis;
    let newPage = Math.floor(firstIndex / newVis);
    const maxP = Math.max(0, Math.ceil(set.length / newVis) - 1);
    newPage = Math.min(Math.max(0, newPage), maxP);
    page = newPage;
  }

  function onViewportModeChange(e) {
    if (!set.length) return;
    const newVis = e.matches ? VC.visMobile : VC.visDesktop;
    const oldVis = e.matches ? VC.visDesktop : VC.visMobile;
    reanchorPage(oldVis, newVis);
    widget.classList.toggle('gl-vc--mobile', e.matches);
    render();
    buildPager();
    syncPager();
    updateCount();
    resetAuto();
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('#gl-next')) {
      next();
      resetAuto();
    }
    if (e.target.closest('#gl-prev')) {
      prev();
      resetAuto();
    }
    if (e.target.closest('#gl-playpause')) {
      playing = !playing;
      const btn = document.getElementById('gl-playpause');
      btn.querySelector('.gl-icon-pause').style.display = playing ? '' : 'none';
      btn.querySelector('.gl-icon-play').style.display = playing ? 'none' : '';
      btn.querySelector('.gl-btn-label').textContent = playing ? 'PAUSE' : 'PLAY';
      btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (playing) startAuto();
      else stopAuto();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      next();
      resetAuto();
    }
    if (e.key === 'ArrowLeft') {
      prev();
      resetAuto();
    }
  });

  widget.addEventListener('mouseenter', () => stopAuto());
  widget.addEventListener('mouseleave', () => {
    if (playing) startAuto();
  });

  let touchStartX = 0;
  widget.addEventListener(
    'touchstart',
    (e) => {
      if (!MOBILE_MQ.matches || !e.changedTouches[0]) return;
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  widget.addEventListener(
    'touchend',
    (e) => {
      if (!MOBILE_MQ.matches || !set.length || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) < 56) return;
      if (dx < 0) {
        next();
        resetAuto();
      } else {
        prev();
        resetAuto();
      }
    },
    { passive: true }
  );

  if (typeof MOBILE_MQ.addEventListener === 'function') {
    MOBILE_MQ.addEventListener('change', onViewportModeChange);
  } else if (typeof MOBILE_MQ.addListener === 'function') {
    MOBILE_MQ.addListener(onViewportModeChange);
  }

  function openModal(id, title) {
    const ov = document.createElement('div');
    ov.style.cssText =
      'position:fixed;inset:0;background:rgba(2,8,4,.92);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;z-index:9999;';
    const box = document.createElement('div');
    box.style.cssText =
      'width:92%;max-width:1080px;aspect-ratio:16/9;position:relative;border-radius:14px;overflow:hidden;border:1px solid rgba(57,255,140,.35);box-shadow:0 0 80px rgba(57,255,140,.18),0 32px 80px rgba(0,0,0,.8);';
    const cb = document.createElement('button');
    cb.style.cssText =
      'position:absolute;top:-44px;right:0;background:rgba(57,255,140,.08);border:1px solid rgba(57,255,140,.25);color:#39ff8c;font-family:Rajdhani,sans-serif;font-weight:700;font-size:13px;letter-spacing:1px;padding:8px 16px;border-radius:8px;cursor:pointer;';
    cb.textContent = 'X CLOSE';
    const fr = document.createElement('iframe');
    fr.src = 'https://www.youtube.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
    fr.style.cssText = 'width:100%;height:100%;border:0;';
    fr.title = title || 'Video';
    fr.allow = 'autoplay; encrypted-media; picture-in-picture';
    box.appendChild(cb);
    box.appendChild(fr);
    ov.appendChild(box);
    document.body.appendChild(ov);
    const close = () => {
      document.body.removeChild(ov);
      window.removeEventListener('keydown', onK);
    };
    cb.addEventListener('click', close);
    ov.addEventListener('click', (e) => {
      if (e.target === ov) close();
    });
    function onK(e) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onK);
  }

  load();
})();
