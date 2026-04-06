<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GameLeaf – Level up your mobile news</title>
  <meta name="description" content="GameLeaf – Le ultime notizie sui giochi mobile: RPG, Action, Coming Soon e molto altro." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Rajdhani:wght@600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

  <style>
    /* ══ TOKENS ══ */
    :root {
      --bg:        #0a0c10;
      --surface:   #0f1318;
      --surface2:  #141820;
      --border:    rgba(57,255,20,0.18);
      --neon:      #39FF14;
      --neon-glow: rgba(57,255,20,0.4);
      --neon-dim:  rgba(57,255,20,0.12);
      --gold:      #c8a84b;
      --gold-glow: rgba(200,168,75,0.45);
      --gold-dim:  rgba(200,168,75,0.18);
      --teal:      #00ddb4;
      --teal-dim:  rgba(0,221,180,0.55);
      --teal-glow: rgba(0,221,180,0.18);
      --text:      #c8d0da;
      --bright:    #eef2f7;
      --muted:     #4e5a6a;
      --max-w:     1280px;
      --r:         4px;
    }

    /* ══ RESET ══ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Rajdhani', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
    a { text-decoration: none; color: inherit; }
    img { display: block; max-width: 100%; }

    /* ── Scanlines overlay ── */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px);
      pointer-events: none; z-index: 9999;
    }

    /* ── Top progress bar (loading) ── */
    #top-bar {
      position: fixed; top: 0; left: 0; height: 2px; width: 0%;
      background: linear-gradient(to right, var(--neon), var(--teal));
      box-shadow: 0 0 10px var(--neon-glow);
      z-index: 10000; transition: width .4s ease, opacity .5s ease;
    }

    /* ── Scroll-to-top button ── */
    #scroll-top {
      position: fixed; bottom: 28px; right: 24px; width: 44px; height: 44px;
      background: rgba(10,12,16,.92); border: 1px solid rgba(57,255,20,.45);
      color: var(--neon); cursor: pointer; z-index: 500;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; opacity: 0; pointer-events: none;
      clip-path: polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));
      transition: opacity .3s, box-shadow .2s, background .2s;
      backdrop-filter: blur(10px);
    }
    #scroll-top.visible { opacity: 1; pointer-events: auto; }
    #scroll-top:hover { background: var(--neon); color: #000; box-shadow: 0 0 20px var(--neon-glow); }

    /* ══ NAVBAR ══ */
    .navbar {
      background: rgba(10,12,16,0.96);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid var(--border);
      padding: 0 2.5rem;
      display: flex; align-items: center; justify-content: space-between;
      height: 68px; position: sticky; top: 0; z-index: 1000;
      box-shadow: 0 2px 32px rgba(0,0,0,.6), 0 1px 0 rgba(57,255,20,0.07);
    }
    .nav-brand {
      display: flex; align-items: center; gap: .65rem;
      font-family: 'Cinzel', serif; font-size: 1.35rem;
      color: var(--bright); letter-spacing: .07em; transition: color .2s;
    }
    .nav-brand:hover { color: var(--neon); }
    .nav-brand img { height: 42px; width: 42px; object-fit: contain; }

    .nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; }
    .nav-links a {
      font-family: 'Rajdhani', sans-serif; font-size: .95rem; font-weight: 700;
      letter-spacing: .14em; text-transform: uppercase;
      color: var(--muted); transition: color .2s;
    }
    .nav-links a:hover, .nav-links a.active { color: var(--neon); }
    .nav-links a.active { text-shadow: 0 0 12px var(--neon-glow); }

    /* Hamburger (mobile) */
    .nav-hamburger {
      display: none; flex-direction: column; gap: 5px; cursor: pointer;
      background: none; border: none; padding: 6px;
    }
    .nav-hamburger span {
      display: block; width: 24px; height: 2px;
      background: var(--text); transition: all .3s; border-radius: 2px;
    }
    .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-hamburger.open span:nth-child(2) { opacity: 0; }
    .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* Mobile drawer */
    .nav-drawer {
      display: none; position: fixed; top: 68px; left: 0; right: 0;
      background: rgba(10,12,16,.97); border-bottom: 1px solid var(--border);
      backdrop-filter: blur(20px); z-index: 999; padding: 1.5rem 2rem;
      flex-direction: column; gap: 1.2rem;
    }
    .nav-drawer.open { display: flex; }
    .nav-drawer a {
      font-family: 'Rajdhani', sans-serif; font-size: 1.1rem; font-weight: 700;
      letter-spacing: .14em; text-transform: uppercase; color: var(--text);
      padding: .5rem 0; border-bottom: 1px solid rgba(57,255,20,.08);
    }
    .nav-drawer a:hover { color: var(--neon); }

    .dropdown { position: relative; }
    .dropdown-menu {
      display: none; position: absolute; top: 46px; left: 50%; transform: translateX(-50%);
      background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r);
      min-width: 170px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,.8);
    }
    .dropdown:hover .dropdown-menu { display: block; }
    .dropdown-menu a { display: block; padding: .75rem 1.2rem; font-size: .9rem; color: var(--text); }
    .dropdown-menu a:hover { background: var(--surface); color: var(--neon); }

    .nav-yt {
      display: flex; align-items: center; gap: .45rem;
      background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.3);
      border-radius: var(--r); padding: .38rem .9rem;
      color: #ff4444 !important; font-size: .9rem !important;
      transition: all .2s !important;
    }
    .nav-yt:hover { background: rgba(255,0,0,0.22) !important; border-color: rgba(255,0,0,0.6) !important; box-shadow: 0 0 16px rgba(255,0,0,0.25) !important; }
    .nav-yt svg { width: 16px; height: 16px; fill: currentColor; }

    .nav-search {
      background: none; border: 1px solid transparent; cursor: pointer;
      color: var(--muted); padding: .38rem; border-radius: var(--r);
      transition: all .2s; display: flex; align-items: center;
    }
    .nav-search:hover { color: var(--neon); border-color: var(--border); }
    .nav-search svg { width: 22px; height: 22px; stroke: currentColor; fill: none; stroke-width: 2; }

    /* ══ HERO ══ */
    .hero {
      position: relative; min-height: 320px; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      text-align: center; padding: 4.5rem 1.5rem 4rem;
      border-bottom: 1px solid var(--border);
    }
    .hero-bg {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 70% 65% at 50% 50%, rgba(57,255,20,0.08) 0%, transparent 70%),
                  linear-gradient(180deg, #0f1318 0%, #0a0c10 100%);
    }
    .hero-grid {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(57,255,20,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(57,255,20,0.06) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%);
    }
    /* Animated corner accents */
    .hero::after {
      content: '';
      position: absolute; top: 20px; right: 20px;
      width: 60px; height: 60px;
      border-top: 1px solid rgba(57,255,20,.3);
      border-right: 1px solid rgba(57,255,20,.3);
      pointer-events: none;
    }
    .hero::before {
      content: '';
      position: absolute; bottom: 20px; left: 20px;
      width: 60px; height: 60px;
      border-bottom: 1px solid rgba(57,255,20,.3);
      border-left: 1px solid rgba(57,255,20,.3);
      pointer-events: none;
      z-index: 1;
    }
    .hero-content { position: relative; z-index: 2; }
    .hero-logo {
      height: 96px; width: 96px; object-fit: contain;
      margin: 0 auto 1rem;
      filter: drop-shadow(0 0 22px var(--neon-glow));
      animation: float 4s ease-in-out infinite;
    }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .hero-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(2.8rem, 7vw, 5rem);
      color: var(--bright); letter-spacing: .08em;
      text-shadow: 0 0 60px rgba(57,255,20,0.2);
      line-height: 1.1;
    }
    .hero-title span { color: var(--neon); }
    .hero-sub {
      margin-top: .75rem; font-family: 'Space Mono', monospace;
      font-size: 1rem; color: var(--muted); letter-spacing: .14em;
    }
    .hero-sub::before { content: '// '; color: var(--neon); }

    /* Hero stat pills */
    .hero-pills {
      display: flex; justify-content: center; gap: .75rem;
      margin-top: 1.5rem; flex-wrap: wrap;
    }
    .hero-pill {
      font-family: 'Space Mono', monospace; font-size: .7rem;
      letter-spacing: .1em; color: var(--muted);
      padding: .35rem .85rem; border: 1px solid rgba(57,255,20,.15);
      border-radius: 2px; background: rgba(57,255,20,.04);
    }
    .hero-pill span { color: var(--neon); font-weight: 700; }

    /* ══ SECTION LABEL ══ */
    .section-label {
      display: flex; align-items: center; gap: .7rem;
      font-family: 'Space Mono', monospace; font-size: .75rem;
      font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
      color: var(--neon); margin-bottom: 1.25rem;
    }
    .section-label::after { content:''; flex:1; height:1px; background:linear-gradient(to right, var(--border), transparent); }

    .section-wrap { max-width: var(--max-w); margin: 0 auto; padding: 0 2rem; }

    /* ══ CAROUSEL ══ */
    .carousel-section { padding: 2.8rem 0; border-bottom: 1px solid var(--border); }

    .carousel-outer {
      position: relative; border: 1px solid var(--border); border-radius: var(--r);
      overflow: hidden; background: var(--surface);
      box-shadow: 0 0 0 1px rgba(57,255,20,0.05), 0 12px 40px rgba(0,0,0,.6);
    }
    .carousel-track { display: flex; transition: transform .5s cubic-bezier(.4,0,.2,1); }

    .c-slide {
      flex: 0 0 calc(100% / 3); position: relative; overflow: hidden;
      cursor: pointer; border-right: 1px solid var(--border);
    }
    .c-slide:last-child { border-right: none; }
    .c-slide img { width:100%; height:210px; object-fit:cover; transition:transform .5s,opacity .3s; opacity:0; }
    .c-slide img.loaded { opacity:1; }
    .c-slide:hover img { transform:scale(1.06); }
    .c-overlay { position:absolute;inset:0; background:linear-gradient(to top,rgba(0,0,0,.9),rgba(0,0,0,.2) 55%,transparent); }
    .c-label {
      position:absolute; bottom:0;left:0;right:0;
      padding:.85rem 1rem; font-size:.92rem; font-weight:700;
      color:#fff; line-height:1.35; z-index:2; text-shadow:0 1px 6px rgba(0,0,0,.95);
    }
    .c-btn {
      position:absolute; top:50%; transform:translateY(-50%);
      background:rgba(0,0,0,.8); border:1px solid rgba(57,255,20,0.45); color:var(--neon);
      width:38px; height:38px; cursor:pointer; z-index:10;
      display:flex; align-items:center; justify-content:center; font-size:1rem;
      clip-path:polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px));
      transition:all .2s;
    }
    .c-btn:hover { background:var(--neon); color:#000; box-shadow:0 0 18px var(--neon-glow); }
    .c-btn.prev { left:10px; } .c-btn.next { right:10px; }
    .c-dots { display:flex; justify-content:center; gap:7px; margin-top:.9rem; }
    .c-dot {
      width:9px; height:9px; border-radius:50%; border:none; cursor:pointer;
      background:rgba(57,255,20,0.2); border:1px solid rgba(57,255,20,0.3); transition:all .25s;
    }
    .c-dot.active { background:var(--neon); box-shadow:0 0 10px var(--neon-glow); transform:scale(1.3); }

    /* ══ YOUTUBE WIDGET ══ */
    .yt-section { padding: 3rem 0; border-bottom: 1px solid var(--border); }
    .gl-yt-widget { position:relative; width:100%; padding:0 52px; }
    .gl-video-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }

    .gl-video-card {
      text-decoration:none; display:block; position:relative; border-radius:var(--r);
      overflow:hidden; border:1px solid rgba(57,255,20,0.18); background:var(--surface);
      cursor:pointer;
      transition:transform .35s ease, border-color .35s ease, box-shadow .35s ease;
    }
    .gl-video-card:hover { transform:translateY(-6px); border-color:var(--neon); box-shadow:0 0 0 1px var(--neon),0 16px 36px rgba(57,255,20,0.22); }
    .gl-video-card:active { transform:scale(0.97); }

    .gl-thumb-w { position:relative; width:100%; padding-top:56.25%; background:var(--surface); overflow:hidden; }
    .gl-thumb-w::before {
      content:''; position:absolute;inset:0;
      background:linear-gradient(90deg,#111 25%,#1c1c1c 50%,#111 75%);
      background-size:200% 100%; animation:shimmer 1.5s infinite;
    }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .gl-thumb-w img { position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover; opacity:0;z-index:1; transition:transform .5s,opacity .4s; }
    .gl-thumb-w img.loaded { opacity:1; }
    .gl-video-card:hover .gl-thumb-w img { transform:scale(1.07); }
    .gl-grad { position:absolute;bottom:0;left:0;width:100%;height:75%; background:linear-gradient(to top,rgba(0,0,0,.92),rgba(0,0,0,.5) 50%,transparent); z-index:2; }
    .gl-ov   { position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .3s;z-index:2; }
    .gl-video-card:hover .gl-ov { background:rgba(0,0,0,.1); }
    .gl-play {
      position:absolute; top:38%;left:50%; transform:translate(-50%,-50%);
      width:46px; height:46px; background:rgba(0,0,0,.4); border-radius:50%;
      border:1.5px solid rgba(57,255,20,0.55); display:flex;align-items:center;justify-content:center;
      z-index:4; transition:all .3s; box-shadow:0 0 10px rgba(57,255,20,0.22); backdrop-filter:blur(3px);
    }
    .gl-video-card:hover .gl-play { transform:translate(-50%,-50%) scale(1.15); background:rgba(57,255,20,0.88); border-color:var(--neon); box-shadow:0 0 24px var(--neon-glow); }
    .gl-play::before { content:''; width:0;height:0; border-style:solid; border-width:7px 0 7px 13px; border-color:transparent transparent transparent rgba(57,255,20,0.85); margin-left:4px; transition:border-color .3s; }
    .gl-video-card:hover .gl-play::before { border-color:transparent transparent transparent #000; }
    .gl-vbody { position:absolute;bottom:0;left:0;right:0;padding:10px 10px 12px;z-index:4; }
    .gl-vtitle { margin:0; font-family:'Rajdhani',sans-serif; font-size:1rem;font-weight:700; color:#fff;line-height:1.25;letter-spacing:.02em; text-shadow:0 1px 6px rgba(0,0,0,.8); display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }

    .gl-nav-btn { position:absolute; top:50%;transform:translateY(-50%); background:rgba(0,0,0,.88); border:1px solid rgba(57,255,20,0.5); color:var(--neon); width:40px;height:40px; cursor:pointer;z-index:10; display:flex;align-items:center;justify-content:center; font-size:14px; transition:all .25s; clip-path:polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px)); }
    .gl-nav-btn:hover { background:var(--neon);color:#000;box-shadow:0 0 18px var(--neon-glow); }
    .gl-prev { left:2px; } .gl-next { right:2px; }
    .gl-nav-btn.disabled { opacity:.15;pointer-events:none; }
    .gl-dots { display:flex;justify-content:center;gap:7px;margin-top:12px; }
    .gl-dot { width:7px;height:7px;border-radius:50%;background:rgba(57,255,20,.2);border:1px solid rgba(57,255,20,.3);transition:all .3s;cursor:pointer; }
    .gl-dot.active { background:var(--neon);box-shadow:0 0 8px var(--neon-glow);transform:scale(1.3); }
    .gl-slide-in-right { animation:glR .5s cubic-bezier(.23,1,.32,1) forwards; }
    .gl-slide-in-left  { animation:glL .5s cubic-bezier(.23,1,.32,1) forwards; }
    @keyframes glR { from{transform:translateX(28px);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes glL { from{transform:translateX(-28px);opacity:0} to{transform:translateX(0);opacity:1} }

    /* ══ NEWS GRID ══ */
    .news-section { padding: 3rem 0 4rem; }

    .gl-search-wrap { position:relative; margin-bottom:1.1rem; }
    .gl-search-icon { position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--neon);font-size:1.05rem;pointer-events:none; }
    .gl-search-input {
      width:100%; padding:12px 20px 12px 44px;
      background:rgba(0,0,0,.7); border:1px solid rgba(57,255,20,.4); border-radius:var(--r);
      color:#fff; font-size:1rem; font-family:'Space Mono',monospace; letter-spacing:.04em;
      outline:none; transition:all .3s;
      clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
    }
    .gl-search-input::placeholder { color:rgba(57,255,20,.3); }
    .gl-search-input:focus { border-color:var(--neon); box-shadow:0 0 22px var(--neon-glow),inset 0 0 10px rgba(57,255,20,.04); }

    .gl-filter-bar { display:flex;align-items:center;gap:6px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin-bottom:1.25rem;padding-bottom:4px; }
    .gl-filter-bar::-webkit-scrollbar { display:none; }
    .gl-filter-label { font-family:'Space Mono',monospace;font-size:.65rem;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap;margin-right:4px; }
    .gl-filter-btn {
      font-family:'Rajdhani',sans-serif;font-size:.78rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;
      padding:5px 14px;border-radius:2px;cursor:pointer;white-space:nowrap;flex-shrink:0;
      background:rgba(0,0,0,.5);color:var(--muted);border:1px solid rgba(255,255,255,.1);transition:all .2s;
      clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px));
    }
    .gl-filter-btn:hover { color:rgba(255,255,255,.75);border-color:rgba(255,255,255,.28); }
    .gl-filter-btn.all.active   { background:var(--neon-dim);color:var(--neon);border-color:rgba(57,255,20,.5);box-shadow:0 0 10px var(--neon-glow); }
    .gl-filter-btn.f-new.active { background:var(--gold-dim);color:var(--gold);border-color:var(--gold-glow); }
    .gl-filter-btn.f-news.active    { background:rgba(0,221,180,.1);color:var(--teal);border-color:rgba(0,221,180,.5); }
    .gl-filter-btn.f-coming.active  { background:rgba(100,160,255,.12);color:#64a0ff;border-color:rgba(100,160,255,.5); }
    .gl-filter-btn.f-beta.active    { background:rgba(255,140,50,.14);color:#ff9a3c;border-color:rgba(255,140,50,.5); }
    .gl-filter-btn.f-patch.active   { background:rgba(160,100,220,.14);color:#b478e0;border-color:rgba(160,100,220,.5); }
    .gl-filter-btn.f-redeem.active  { background:rgba(100,200,120,.13);color:#64c878;border-color:rgba(100,200,120,.5); }

    .gl-news-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:14px; }
    .gl-link-w { text-decoration:none;color:inherit;display:block;height:340px;opacity:0;animation:fadeIn .5s ease forwards; }
    @keyframes fadeIn { to{opacity:1} }
    .gl-card {
      background:var(--surface);border-radius:var(--r);overflow:hidden;
      border:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;
      height:100%;position:relative;transition:transform .3s,border-color .3s,box-shadow .3s;
    }
    .gl-link-w:hover .gl-card { transform:translateY(-6px);border-color:var(--neon);box-shadow:0 0 0 1px var(--neon),0 16px 36px rgba(57,255,20,.2); }

    .gl-thumb { position:relative;width:100%;height:100%;background:var(--surface);overflow:hidden;flex-shrink:0; }
    .gl-thumb::before { content:'';position:absolute;inset:0;background:linear-gradient(90deg,#111 25%,#1c1c1c 50%,#111 75%);background-size:200% 100%;animation:shimmer 1.5s infinite; }
    .gl-thumb img { position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0;z-index:1;transition:transform .5s,opacity .3s; }
    .gl-thumb img.loaded { opacity:1; }
    .gl-link-w:hover .gl-thumb img { transform:scale(1.07); }
    .gl-thumb::after { content:'';position:absolute;bottom:0;left:0;width:100%;height:70%;background:linear-gradient(to top,rgba(0,0,0,.94),rgba(0,0,0,.5) 50%,transparent);z-index:2; }

    .gl-category { position:absolute;top:9px;left:9px;padding:3px 9px;font-size:.68rem;font-weight:700;font-family:'Rajdhani',sans-serif;text-transform:uppercase;letter-spacing:1.2px;border-radius:2px;z-index:3;backdrop-filter:blur(4px);background:rgba(0,221,180,.12);color:var(--teal);border:1px solid rgba(0,221,180,.45); }
    .gl-category[data-cat="rpg"],.gl-category[data-cat="mmorpg"],.gl-category[data-cat="action rpg"] { background:rgba(180,120,224,.15);color:#b478e0;border-color:rgba(160,100,220,.45); }
    .gl-category[data-cat="strategy"],.gl-category[data-cat="open-world"],.gl-category[data-cat="survival"] { background:rgba(255,160,50,.13);color:#ffa032;border-color:rgba(255,160,50,.45); }
    .gl-category[data-cat="action"] { background:rgba(255,80,80,.13);color:#ff6464;border-color:rgba(255,80,80,.45); }
    .gl-category[data-cat="technology"],.gl-category[data-cat="report"] { background:rgba(100,160,255,.12);color:#64a0ff;border-color:rgba(100,160,255,.45); }

    .gl-body { position:absolute;bottom:0;left:0;right:0;padding:10px 10px 30px 10px;z-index:3; }
    .gl-date { color:var(--neon);font-size:.7rem;font-weight:700;font-family:'Space Mono',monospace;display:block;margin-bottom:4px;letter-spacing:.04em;opacity:.85; }
    .gl-title { margin:0;font-family:'Rajdhani',sans-serif;font-size:1.12rem;font-weight:700;line-height:1.2;color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.9);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden; }

    .gl-badge { position:absolute;bottom:7px;right:7px;padding:3px 8px;font-size:.62rem;font-weight:700;font-family:'Rajdhani',sans-serif;text-transform:uppercase;letter-spacing:1.2px;z-index:4;border-radius:2px;clip-path:polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px)); }
    .gl-badge[data-badge="new"],.gl-badge[data-badge="news"] { background:var(--gold-dim);color:var(--gold);border:1px solid var(--gold-glow);box-shadow:0 0 8px var(--gold-glow);animation:goldF 3s infinite alternate; }
    .gl-badge[data-badge="coming soon"] { background:rgba(100,160,255,.14);color:#64a0ff;border:1px solid rgba(100,160,255,.5);box-shadow:0 0 8px rgba(100,160,255,.3); }
    .gl-badge[data-badge="beta"] { background:rgba(255,140,50,.15);color:#ff9a3c;border:1px solid rgba(255,140,50,.5);box-shadow:0 0 8px rgba(255,140,50,.3);animation:betaP 2s infinite alternate; }
    .gl-badge[data-badge="patch notes"],.gl-badge[data-badge="patch"] { background:rgba(160,100,220,.15);color:#b478e0;border:1px solid rgba(160,100,220,.5);box-shadow:0 0 8px rgba(160,100,220,.3); }
    .gl-badge[data-badge="redeem code"],.gl-badge[data-badge="gift code"] { background:rgba(100,200,120,.14);color:#64c878;border:1px solid rgba(100,200,120,.5);box-shadow:0 0 8px rgba(100,200,120,.3); }
    @keyframes goldF { 0%,80%,100%{box-shadow:0 0 8px var(--gold-glow);opacity:1} 85%,95%{box-shadow:none;opacity:.7} }
    @keyframes betaP { 0%{box-shadow:0 0 6px rgba(255,140,50,.3)} 100%{box-shadow:0 0 16px rgba(255,140,50,.6)} }

    .gl-no-results { grid-column:1/-1;text-align:center;color:rgba(57,255,20,.35);font-family:'Space Mono',monospace;padding:70px;font-size:.9rem;letter-spacing:3px; }

    /* Result count */
    .gl-result-count { font-family:'Space Mono',monospace;font-size:.68rem;color:var(--muted);letter-spacing:.05em;margin-bottom:.8rem; }
    .gl-result-count strong { color:var(--neon); }

    .gl-pagination { display:flex;justify-content:center;align-items:center;gap:6px;margin-top:1.8rem;flex-wrap:wrap; }
    .gl-page-btn { background:rgba(0,0,0,.6);color:var(--muted);border:1px solid rgba(255,255,255,.1);padding:6px 13px;min-width:38px;font-size:.88rem;font-weight:700;font-family:'Rajdhani',sans-serif;letter-spacing:1px;cursor:pointer;border-radius:3px;transition:all .2s; }
    .gl-page-btn:hover:not(:disabled) { background:var(--gold-dim);color:var(--gold);border-color:rgba(200,168,75,.4);box-shadow:0 0 10px rgba(200,168,75,.2); }
    .gl-page-btn:disabled { opacity:.2;cursor:not-allowed; }
    .gl-page-btn.active { background:var(--gold-dim);color:var(--gold);border-color:var(--gold);box-shadow:0 0 14px rgba(200,168,75,.3); }
    .gl-page-btn.arrow { font-size:1.1rem;padding:5px 11px; }

    /* ══ FOOTER ══ */
    footer.gl-footer {
      width:100%; background:#0d0f14;
      border-top:1px solid var(--border);
      box-shadow:0 -1px 0 0 rgba(0,221,180,.08),inset 0 1px 0 0 rgba(0,221,180,.06);
      position:relative; overflow:hidden;
    }
    footer.gl-footer::before { content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px);pointer-events:none; }
    .gl-ft-inner { position:relative;z-index:1;max-width:var(--max-w);margin:0 auto;padding:38px 56px;display:flex;align-items:center;justify-content:space-between;gap:28px; }

    .gl-ft-brand { display:flex;flex-direction:column;align-items:flex-start;gap:10px;flex:1; }
    .gl-ft-brand img { height:72px;width:auto;object-fit:contain; }
    .gl-ft-copy { font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);line-height:1.7; }

    .gl-ft-nav { display:flex;flex-direction:column;align-items:center;gap:10px;flex:1; }
    .gl-ft-nav a { font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--text);padding:4px 12px;border:1px solid transparent;border-radius:3px;transition:color .2s,border-color .2s,text-shadow .2s; }
    .gl-ft-nav a:hover { color:var(--teal);border-color:rgba(0,221,180,.25);text-shadow:0 0 10px var(--teal-dim); }

    .gl-ft-right { display:flex;flex-direction:column;align-items:flex-end;gap:12px;flex:1; }
    .gl-status { display:flex;align-items:center;gap:7px;background:rgba(0,221,180,.07);border:1px solid rgba(0,221,180,.25);border-radius:20px;padding:5px 14px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--teal); }
    .gl-status-dot { width:7px;height:7px;border-radius:50%;background:var(--teal);animation:glpulse 2s ease-in-out infinite; }
    @keyframes glpulse { 0%,100%{opacity:1} 50%{opacity:.3} }
    .gl-social { display:flex;gap:10px; }
    .gl-social a { display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--border);border-radius:var(--r);background:rgba(255,255,255,.04);color:var(--text);transition:color .2s,border-color .2s,box-shadow .2s; }
    .gl-social a:hover { color:var(--teal);border-color:var(--teal-dim);box-shadow:0 0 20px var(--teal-glow); }
    .gl-social svg { width:16px;height:16px;fill:currentColor; }
    .gl-legal { display:flex;gap:16px;font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--muted); }
    .gl-legal a { color:inherit;transition:color .2s; }
    .gl-legal a:hover { color:var(--text); }

    /* ══ REDUCED MOTION ══ */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important; }
    }

    /* ══ RESPONSIVE ══ */
    @media(max-width:1024px){
      .gl-news-grid { grid-template-columns:repeat(2,1fr); }
      .gl-link-w { height:300px; }
    }
    @media(max-width:900px){
      .gl-video-grid { grid-template-columns:repeat(2,1fr); }
      .gl-link-w { height:260px; }
      .gl-title { font-size:.98rem;-webkit-line-clamp:2; }
      .c-slide { flex: 0 0 50%; }
    }
    @media(max-width:700px){
      .navbar { padding:0 1.2rem; height:60px; }
      .nav-links { display: none; }
      .nav-hamburger { display: flex; }
      .nav-brand { font-size:1.1rem; }
      .nav-brand img { height:36px; width:36px; }
      .section-wrap { padding: 0 1.2rem; }
      .gl-video-grid { grid-template-columns:1fr; }
      .gl-news-grid { grid-template-columns:1fr; }
      .gl-link-w { height:220px; }
      .gl-yt-widget { padding:0 38px; }
      .c-slide { flex:0 0 100%; }
      .c-slide img { height:180px; }
      .gl-ft-inner { padding:20px 24px; flex-direction:column; align-items:flex-start; gap:20px; }
      .gl-ft-nav { align-items:flex-start; }
      .gl-ft-right { align-items:flex-start; flex-direction:row; flex-wrap:wrap; gap:12px; }
      .gl-ft-brand img { height:48px; }
      .hero-logo { height:72px; width:72px; }
      .hero { min-height:240px; }
    }
    @media(max-width:480px){
      .hero-title { font-size:2.2rem; }
      .hero-pills { display:none; }
      .gl-link-w { height:190px; }
    }
  </style>
</head>
<body>

<!-- Top loading bar -->
<div id="top-bar"></div>

<!-- Scroll to top -->
<button id="scroll-top" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Torna su">↑</button>

<!-- NAVBAR -->
<nav class="navbar">
  <a class="nav-brand" href="index.html">
    <img src="https://i.ibb.co/WNVG4yC6/Copilot-20260309-190533.png" alt="GL" onerror="this.style.display='none'">
    GameLeaf
  </a>
  <ul class="nav-links">
    <li><a href="index.html" class="active">Home</a></li>
    <li class="dropdown">
      <a href="#">Info ▾</a>
      <div class="dropdown-menu">
        <a href="https://www.gameleaf.space/info/privacy-policy" target="_blank">Privacy Policy</a>
        <a href="https://www.gameleaf.space/info/disclaimer" target="_blank">Disclaimer</a>
      </div>
    </li>
    <li>
      <a href="https://www.youtube.com/@Gryvery" target="_blank" class="nav-yt">
        <svg viewBox="0 0 24 24"><path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.54 3.6 12 3.6 12 3.6s-7.54 0-9.38.47A3.01 3.01 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.01 3.01 0 0 0 2.12 2.13C4.46 20.4 12 20.4 12 20.4s7.54 0 9.38-.47a3.01 3.01 0 0 0 2.12-2.13A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.27 3.6-6.27 3.6z"/></svg>
        YouTube
      </a>
    </li>
    <li>
      <button class="nav-search" onclick="document.getElementById('gl-search').focus();document.querySelector('.news-section').scrollIntoView({behavior:'smooth'})" aria-label="Cerca">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
    </li>
  </ul>
  <!-- Hamburger mobile -->
  <button class="nav-hamburger" id="navHamburger" aria-label="Menu" onclick="toggleDrawer()">
    <span></span><span></span><span></span>
  </button>
</nav>

<!-- Mobile drawer -->
<div class="nav-drawer" id="navDrawer">
  <a href="index.html">🏠 Home</a>
  <a href="https://www.gameleaf.space/info/privacy-policy" target="_blank">Privacy Policy</a>
  <a href="https://www.gameleaf.space/info/disclaimer" target="_blank">Disclaimer</a>
  <a href="https://www.youtube.com/@Gryvery" target="_blank">▶ YouTube</a>
</div>

<!-- HERO -->
<header class="hero">
  <div class="hero-bg"></div>
  <div class="hero-grid"></div>
  <div class="hero-content">
    <img class="hero-logo" src="https://i.ibb.co/WNVG4yC6/Copilot-20260309-190533.png" alt="GameLeaf" onerror="this.style.display='none'">
    <h1 class="hero-title">Game<span>Leaf</span></h1>
    <p class="hero-sub">Level up your mobile news.</p>
    <div class="hero-pills">
      <div class="hero-pill">Mobile <span>Gaming</span></div>
      <div class="hero-pill">RPG · Action · Strategy</div>
      <div class="hero-pill">Updated <span>Daily</span></div>
    </div>
  </div>
</header>

<!-- CAROUSEL -->
<section class="carousel-section">
  <div class="section-wrap">
    <div class="section-label">📡 &nbsp;In evidenza</div>
    <div class="carousel-outer">
      <div class="carousel-track" id="cTrack">
        <div class="c-slide"><img data-src="https://img.youtube.com/vi/placeholder1/mqdefault.jpg" alt="Slide 1"><div class="c-overlay"></div><div class="c-label">Best Mobile Games of March 2026 | Top 10 + SECRET BONUS! 🎮</div></div>
        <div class="c-slide"><img data-src="https://img.youtube.com/vi/placeholder2/mqdefault.jpg" alt="Slide 2"><div class="c-overlay"></div><div class="c-label">Urban Heat gameplay (Beta)</div></div>
        <div class="c-slide"><img data-src="https://img.youtube.com/vi/placeholder3/mqdefault.jpg" alt="Slide 3"><div class="c-overlay"></div><div class="c-label">Metropolis: Rule The Streets – Gameplay Reveal</div></div>
        <div class="c-slide"><img data-src="https://img.youtube.com/vi/placeholder4/mqdefault.jpg" alt="Slide 4"><div class="c-overlay"></div><div class="c-label">Might &amp; Magic: Fates – The Legendary RPG Franchise Returns</div></div>
        <div class="c-slide"><img data-src="https://img.youtube.com/vi/placeholder5/mqdefault.jpg" alt="Slide 5"><div class="c-overlay"></div><div class="c-label">Top 5 Strategy Games to Watch in 2026</div></div>
      </div>
      <button class="c-btn prev" id="cPrev">&#10094;</button>
      <button class="c-btn next" id="cNext">&#10095;</button>
    </div>
    <div class="c-dots" id="cDots"></div>
  </div>
</section>

<!-- YOUTUBE WIDGET -->
<section class="yt-section">
  <div class="section-wrap">
    <div class="section-label">▶ &nbsp;Video recenti</div>
    <div class="gl-yt-widget" id="gl-yt-widget">
      <button class="gl-nav-btn gl-prev disabled" id="gl-prev-btn" aria-label="Precedente">&#10094;</button>
      <button class="gl-nav-btn gl-next" id="gl-next-btn" aria-label="Successivo">&#10095;</button>
      <div class="gl-video-grid" id="gl-video-container"></div>
      <div class="gl-dots" id="gl-dots"></div>
    </div>
  </div>
</section>

<!-- NEWS GRID -->
<section class="news-section">
  <div class="section-wrap">
    <div class="section-label">📰 &nbsp;Recent News</div>
    <div class="gl-search-wrap">
      <span class="gl-search-icon">⌕</span>
      <input type="text" id="gl-search" class="gl-search-input" placeholder="Search news..." oninput="handleSearch()">
    </div>
    <div class="gl-filter-bar">
      <span class="gl-filter-label">Filter:</span>
      <button class="gl-filter-btn all active"   onclick="setFilter('all',this)">All</button>
      <button class="gl-filter-btn f-new"         onclick="setFilter('new',this)">New</button>
      <button class="gl-filter-btn f-news"        onclick="setFilter('news',this)">News</button>
      <button class="gl-filter-btn f-coming"      onclick="setFilter('coming soon',this)">Coming Soon</button>
      <button class="gl-filter-btn f-beta"        onclick="setFilter('beta',this)">Beta</button>
      <button class="gl-filter-btn f-patch"       onclick="setFilter('patch notes',this)">Patch Notes</button>
      <button class="gl-filter-btn f-redeem"      onclick="setFilter('redeem code',this)">Redeem Code</button>
    </div>
    <div class="gl-result-count" id="result-count"></div>
    <div class="gl-news-grid" id="news-container"></div>
    <div class="gl-pagination" id="pagination-controls"></div>
  </div>
</section>

<!-- FOOTER -->
<footer class="gl-footer" role="contentinfo">
  <div class="gl-ft-inner">
    <div class="gl-ft-brand">
      <img src="https://i.ibb.co/WNVG4yC6/Copilot-20260309-190533.png" alt="GameLeaf Logo" width="72" height="72" loading="lazy" onerror="this.style.display='none'">
      <p class="gl-ft-copy">© 2026 GameLeaf HQ<br>Pure Gaming Experience.</p>
    </div>
    <nav class="gl-ft-nav" aria-label="Footer navigation">
      <a href="https://www.gameleaf.space/home">Home Base</a>
      <a href="https://www.gameleaf.space/new-releases">Upcoming Releases</a>
      <a href="https://www.gameleaf.space/patch-note">Patch Notes</a>
    </nav>
    <div class="gl-ft-right">
      <div class="gl-status"><span class="gl-status-dot"></span>Servers Online</div>
      <div class="gl-social">
        <a href="https://www.youtube.com/@Gryvery" target="_blank" rel="noopener" aria-label="YouTube">
          <svg viewBox="0 0 24 24"><path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.54 3.6 12 3.6 12 3.6s-7.54 0-9.38.47A3.01 3.01 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.01 3.01 0 0 0 2.12 2.13C4.46 20.4 12 20.4 12 20.4s7.54 0 9.38-.47a3.01 3.01 0 0 0 2.12-2.13A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.27 3.6-6.27 3.6z"/></svg>
        </a>
      </div>
      <div class="gl-legal">
        <a href="https://www.gameleaf.space/info/privacy-policy" target="_blank">Privacy Policy</a>
        <a href="https://www.gameleaf.space/info/disclaimer" target="_blank">Disclaimer</a>
      </div>
    </div>
  </div>
</footer>

<script>
/* ── Mobile drawer ── */
function toggleDrawer(){
  const btn=document.getElementById('navHamburger');
  const drawer=document.getElementById('navDrawer');
  btn.classList.toggle('open');
  drawer.classList.toggle('open');
}
document.addEventListener('click',function(e){
  const btn=document.getElementById('navHamburger');
  const drawer=document.getElementById('navDrawer');
  if(!btn.contains(e.target)&&!drawer.contains(e.target)){
    btn.classList.remove('open');drawer.classList.remove('open');
  }
});

/* ── Scroll to top visibility + top bar ── */
(function(){
  const st=document.getElementById('scroll-top');
  const bar=document.getElementById('top-bar');
  window.addEventListener('scroll',function(){
    st.classList.toggle('visible',window.scrollY>400);
    // Top progress bar
    const docH=document.documentElement.scrollHeight-window.innerHeight;
    const pct=docH>0?Math.round((window.scrollY/docH)*100):0;
    bar.style.width=pct+'%';
    bar.style.opacity=window.scrollY>50?'1':'0';
  });
})();

/* ══ CAROUSEL ══ */
(function(){
  const track  = document.getElementById('cTrack');
  const dotsW  = document.getElementById('cDots');
  const slides = Array.from(track.querySelectorAll('.c-slide'));
  function getPerV(){ return window.innerWidth<601?1:window.innerWidth<901?2:3; }
  let pos=0;

  slides.forEach(s=>{
    const img=s.querySelector('img');
    img.src=img.dataset.src||'';
    img.addEventListener('load',()=>img.classList.add('loaded'));
    img.addEventListener('error',()=>img.classList.add('loaded'));
  });

  slides.forEach((_,i)=>{
    const d=document.createElement('button');
    d.className='c-dot'+(i===0?' active':'');
    d.addEventListener('click',()=>{pos=i;move();});
    dotsW.appendChild(d);
  });

  function move(){
    const pv=getPerV();
    track.style.transform=`translateX(-${pos*(100/pv)}%)`;
    dotsW.querySelectorAll('.c-dot').forEach((d,i)=>d.classList.toggle('active',i===pos));
  }
  document.getElementById('cPrev').addEventListener('click',()=>{pos=pos<=0?slides.length-1:pos-1;move();});
  document.getElementById('cNext').addEventListener('click',()=>{pos=pos>=slides.length-1?0:pos+1;move();});
  setInterval(()=>{pos=pos>=slides.length-1?0:pos+1;move();},5000);
  window.addEventListener('resize',move);
  move();
})();

/* ══ YOUTUBE WIDGET ══ */
(function(){
  const CSV='https://docs.google.com/spreadsheets/d/e/2PACX-1vQk0EwcsgLGnFCW2C0hkVbgoVpkrvWITwqNoxYkdUevQ6qrC12ePPkOqHe2GbiYDpi98H-TnSx_LuIZ/pub?gid=0&single=true&output=csv';
  let all=[],cur=0,loading=false,paused=false,timer;
  const BS=3;
  const cont=document.getElementById('gl-video-container');
  const prev=document.getElementById('gl-prev-btn');
  const next=document.getElementById('gl-next-btn');
  const dotsEl=document.getElementById('gl-dots');
  const widget=document.getElementById('gl-yt-widget');

  widget.addEventListener('mouseenter',()=>paused=true);
  widget.addEventListener('mouseleave',()=>paused=false);

  function parseRow(row){
    const r=[];let c='',q=false;
    for(let i=0;i<row.length;i++){
      const ch=row[i];
      if(ch==='"'){if(q&&row[i+1]==='"'){c+='"';i++;}else q=!q;}
      else if(ch===','&&!q){r.push(c.trim());c='';}
      else c+=ch;
    }
    r.push(c.trim());return r;
  }

  async function init(){
    try{
      const t=await(await fetch(CSV)).text();
      const rows=t.split(/\r?\n/).filter(r=>r.trim()).slice(1);
      all=rows.map(r=>{const c=parseRow(r);return c&&c.length>=2?{title:c[0].replace(/^"|"$/g,'').trim(),id:c[1].replace(/^"|"$/g,'').trim()}:null;}).filter(Boolean);
      if(!all.length)return;
      shuffle(all);render(0,'init');buildDots();startAuto();
    }catch(e){console.error('YT:',e);}
  }

  function render(s,dir){
    if(loading)return;loading=true;
    if(s>=all.length)s=0;
    const batch=all.slice(s,s+BS);
    if(!batch.length){loading=false;return;}
    cont.innerHTML='';
    const anim=dir==='next'?'gl-slide-in-right':dir==='prev'?'gl-slide-in-left':'';
    batch.forEach((v,i)=>{
      const a=document.createElement('a');
      a.href=`https://www.youtube.com/watch?v=${v.id}`;
      a.target='_blank';a.rel='noopener noreferrer';
      a.className=`gl-video-card ${anim}`;a.style.animationDelay=`${i*.08}s`;
      const img=new Image();img.alt=v.title;img.loading='lazy';
      img.src=`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`;
      img.addEventListener('load',()=>img.classList.add('loaded'));
      img.addEventListener('error',()=>img.classList.add('loaded'));
      const tw=document.createElement('div');tw.className='gl-thumb-w';
      tw.innerHTML='<div class="gl-ov"></div><div class="gl-grad"></div><div class="gl-play"></div>';
      tw.prepend(img);
      const bd=document.createElement('div');bd.className='gl-vbody';
      bd.innerHTML=`<h3 class="gl-vtitle">${v.title}</h3>`;
      a.appendChild(tw);a.appendChild(bd);cont.appendChild(a);
    });
    updNav();updDots();setTimeout(()=>loading=false,500);
  }

  function buildDots(){
    dotsEl.innerHTML='';
    const tot=Math.ceil(all.length/BS);
    for(let i=0;i<tot;i++){
      const d=document.createElement('div');d.className='gl-dot'+(i===0?' active':'');
      d.addEventListener('click',()=>{if(loading)return;const dir=i*BS>cur?'next':'prev';cur=i*BS;render(cur,dir);startAuto();});
      dotsEl.appendChild(d);
    }
  }
  function updDots(){const idx=Math.floor(cur/BS);dotsEl.querySelectorAll('.gl-dot').forEach((d,i)=>d.classList.toggle('active',i===idx));}
  function updNav(){prev.classList.toggle('disabled',cur===0);next.classList.toggle('disabled',cur+BS>=all.length);}
  function startAuto(){clearInterval(timer);timer=setInterval(()=>{if(paused)return;cur=cur+BS>=all.length?0:cur+BS;render(cur,'next');updNav();},7000);}

  prev.addEventListener('click',()=>{if(loading||cur===0)return;cur-=BS;render(cur,'prev');startAuto();});
  next.addEventListener('click',()=>{if(loading||cur+BS>=all.length)return;cur+=BS;render(cur,'next');startAuto();});
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}}
  init();
})();

/* ══ NEWS GRID ══ */
(function(){
  const CSV='https://docs.google.com/spreadsheets/d/e/2PACX-1vTLdiAyAgHlwVDgZ9uu0Ht1P7_Vep4reiIeGeXumFiyNPpu2aO0RNe1gYwjswLTlMV55GgpfB88ZNxr/pub?gid=0&single=true&output=csv';
  const FB='https://placehold.co/400x300/0f1318/39FF14?text=N%2FA';
  let all=[],filtered=[],page=1,filter='all',stimer=null;

  window.setFilter=function(f,btn){
    filter=f;
    document.querySelectorAll('.gl-filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('gl-search').value='';
    applyFilter();
  };
  window.handleSearch=function(){clearTimeout(stimer);stimer=setTimeout(applyFilter,250);};

  function ipp(){return window.innerWidth<540?6:window.innerWidth<900?12:15;}

  function parseRow(row){
    const r=[];let c='',q=false;
    for(let i=0;i<row.length;i++){
      const ch=row[i];
      if(ch==='"'){if(q&&row[i+1]==='"'){c+='"';i++;}else q=!q;}
      else if(ch===','&&!q){r.push(c.trim());c='';}
      else c+=ch;
    }
    r.push(c.trim());return r;
  }

  function cleanUrl(u){
    if(!u||!u.trim())return null;
    u=u.trim();
    if(u.startsWith('//'))u='https:'+u;
    else if(!u.startsWith('http'))u='https://'+u;
    return u.replace('http://','https://');
  }

  function relDate(ts){
    if(!ts)return'';
    const d=Math.floor((Date.now()-ts)/86400000);
    if(d===0)return'oggi';if(d===1)return'ieri';
    if(d<7)return`${d} giorni fa`;if(d<14)return'1 settimana fa';
    if(d<30)return`${Math.floor(d/7)} settimane fa`;if(d<60)return'1 mese fa';
    if(d<365)return`${Math.floor(d/30)} mesi fa`;return`${Math.floor(d/365)} anno fa`;
  }

  function applyFilter(){
    filtered=filter==='all'?[...all]:all.filter(a=>{
      const b=(a.etichetta||'').toLowerCase().trim();
      const c=(a.categoria||'').toLowerCase().trim();
      return b===filter||c===filter;
    });
    const q=document.getElementById('gl-search')?.value.toLowerCase().trim();
    if(q)filtered=filtered.filter(a=>a.titolo.toLowerCase().includes(q)||a.categoria.toLowerCase().includes(q)||(a.etichetta&&a.etichetta.toLowerCase().includes(q)));
    renderPage(1);
  }

  function updateCount(){
    const el=document.getElementById('result-count');
    if(!el)return;
    const n=ipp();
    const tot=filtered.length;
    const s=(page-1)*n+1;
    const e=Math.min(page*n,tot);
    el.innerHTML=tot>0?`Mostrando <strong>${s}–${e}</strong> di <strong>${tot}</strong> articoli`:'';
  }

  function renderPage(p){
    page=p;
    const cont=document.getElementById('news-container');
    cont.innerHTML='';
    if(!filtered.length){
      cont.innerHTML='<div class="gl-no-results">// no results found</div>';
      document.getElementById('pagination-controls').innerHTML='';
      document.getElementById('result-count').innerHTML='';
      return;
    }
    const n=ipp();
    const slice=filtered.slice((p-1)*n,p*n);
    slice.forEach((art,i)=>{
      const a=document.createElement('a');
      const href=cleanUrl(art.link);
      a.href=href||'#';if(href){a.target='_blank';a.rel='noopener noreferrer';}
      a.className='gl-link-w';a.style.animationDelay=(i*.04)+'s';
      const ck=(art.categoria||'').toLowerCase().trim();
      const bk=(art.etichetta||'').toLowerCase().trim();
      const img=new Image();img.alt=art.titolo;img.loading='lazy';img.decoding='async';
      img.src=cleanUrl(art.immagine)||FB;
      img.addEventListener('load',()=>img.classList.add('loaded'));
      img.addEventListener('error',()=>{img.src=FB;img.classList.add('loaded');});
      a.innerHTML=`<div class="gl-card"><div class="gl-thumb">${art.categoria?`<div class="gl-category" data-cat="${ck}">${art.categoria}</div>`:''}</div><div class="gl-body">${art.ts?`<span class="gl-date">${relDate(art.ts)}</span>`:''}<h2 class="gl-title" title="${art.titolo}">${art.titolo}</h2></div>${art.etichetta?`<div class="gl-badge" data-badge="${bk}">${art.etichetta}</div>`:''}</div>`;
      a.querySelector('.gl-thumb').prepend(img);
      cont.appendChild(a);
    });
    updateCount();
    buildPag();
    if(p>1)window.scrollTo({top:document.querySelector('.news-section').offsetTop-80,behavior:'smooth'});
  }

  function buildPag(){
    const ctrl=document.getElementById('pagination-controls');ctrl.innerHTML='';
    const tot=Math.ceil(filtered.length/ipp());if(tot<=1)return;
    const max=5;let s=Math.max(1,page-Math.floor(max/2)),e=Math.min(tot,s+max-1);
    if(e-s<max-1)s=Math.max(1,e-max+1);
    ctrl.appendChild(mkB('‹',page===1,()=>renderPage(page-1),true));
    if(s>1){addP(ctrl,1);if(s>2)ctrl.appendChild(dts());}
    for(let i=s;i<=e;i++)addP(ctrl,i);
    if(e<tot){if(e<tot-1)ctrl.appendChild(dts());addP(ctrl,tot);}
    ctrl.appendChild(mkB('›',page===tot,()=>renderPage(page+1),true));
  }
  function mkB(t,dis,fn,arr){const b=document.createElement('button');b.className='gl-page-btn'+(arr?' arrow':'');b.textContent=t;b.disabled=dis;b.onclick=fn;return b;}
  function addP(ctrl,i){const b=mkB(i,false,()=>renderPage(i));if(i===page)b.classList.add('active');ctrl.appendChild(b);}
  function dts(){const s=document.createElement('span');s.style.cssText='color:#4e5a6a;font-family:Rajdhani,sans-serif;padding:0 3px;font-weight:700;';s.textContent='…';return s;}

  async function loadNews(){
    try{
      const txt=await(await fetch(CSV)).text();
      const rows=txt.split(/\r?\n/).filter(r=>r.trim().length>10).slice(1);
      all=rows.map(row=>{
        const c=parseRow(row);if(!c||c.length<5)return null;
        const[titolo,immagine,link,categoria,dataNotizia,etichetta]=c;
        let ts=0;
        if(dataNotizia){const p=dataNotizia.split('/');ts=p.length===3?new Date(`${p[2]}-${p[1]}-${p[0]}`).getTime():new Date(dataNotizia).getTime();}
        return{titolo,immagine,link,categoria,dataNotizia,etichetta,ts};
      }).filter(Boolean);
      all.sort((a,b)=>b.ts-a.ts);filtered=[...all];renderPage(1);
    }catch(e){
      console.error('News:',e);
      document.getElementById('news-container').innerHTML='<div class="gl-no-results">// loading error</div>';
    }
  }
  loadNews();
})();
</script>
</body>
</html>
