---
layout: legal
title: About – GameLeaf
permalink: /about/
---

# About GameLeaf

## Welcome

GameLeaf: Your ultimate hub for mobile gaming news. Delivering the latest updates since March 2026.

<div class="about-grid">

  <nav class="about-links" aria-label="About pages">
    <a href="{{ '/about/who-we-are/' | relative_url }}">Who We Are</a>
    <a href="{{ '/about/support/' | relative_url }}">Support</a>
    <a href="{{ '/about/terms-of-service/' | relative_url }}">Terms of Service</a>
    <a href="{{ '/about/privacy-policy/' | relative_url }}">Privacy Policy</a>
    <a href="{{ '/about/disclaimer/' | relative_url }}">Disclaimer</a>
  </nav>

  <div class="about-socials">
    <h3>Find Us Online</h3>
    <div class="about-socials-grid">

      <a href="https://www.youtube.com/@Gryvery" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <i class="fab fa-youtube" aria-hidden="true"></i>
        <span>YouTube</span>
      </a>

      <a href="https://www.tiktok.com/@grivery" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
        <i class="fab fa-tiktok" aria-hidden="true"></i>
        <span>TikTok</span>
      </a>

      <a href="https://x.com/Gryvery" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
        <i class="fab fa-x-twitter" aria-hidden="true"></i>
        <span>X</span>
      </a>

      <a href="https://www.reddit.com/user/gryvery" target="_blank" rel="noopener noreferrer" aria-label="Reddit">
        <i class="fab fa-reddit" aria-hidden="true"></i>
        <span>Reddit</span>
      </a>

      <a href="https://www.threads.net/@gryver3" target="_blank" rel="noopener noreferrer" aria-label="Threads">
        <i class="fab fa-threads" aria-hidden="true"></i>
        <span>Threads</span>
      </a>

      <a href="https://www.instagram.com/gryver3" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <i class="fab fa-instagram" aria-hidden="true"></i>
        <span>Instagram</span>
      </a>

      <a href="https://www.taptap.io/user/76235513" target="_blank" rel="noopener noreferrer" aria-label="TapTap">
        <i class="fas fa-gamepad" aria-hidden="true"></i>
        <span>TapTap</span>
      </a>

      <a href="https://user.qoo-app.com/en/23249923" target="_blank" rel="noopener noreferrer" aria-label="QooApp">
        <i class="fas fa-mobile-screen" aria-hidden="true"></i>
        <span>QooApp</span>
      </a>

    </div>
  </div>

</div>

<style>
.about-grid {
  display: flex;
  gap: 48px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.about-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 180px;
}

.about-links a {
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #c8e8c0;
  padding: 8px 14px;
  border: 1px solid #1d3a20;
  border-radius: 4px;
  transition: all 0.2s;
}

.about-links a:hover {
  color: #1dbb6c;
  border-color: #1dbb6c;
}

.about-socials {
  flex: 1;
}

.about-socials h3 {
  font-family: 'Rajdhani', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #1dbb6c;
  margin-bottom: 16px;
}

.about-socials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}

.about-socials-grid a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 10px;
  background: #0d1f10;
  border: 1px solid #1d3a20;
  border-radius: 6px;
  color: #c8e8c0;
  font-family: 'Rajdhani', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.2s;
}

.about-socials-grid a:hover {
  color: #1dbb6c;
  border-color: #1dbb6c;
  box-shadow: 0 0 12px rgba(29, 187, 108, 0.15);
}

.about-socials-grid i {
  font-size: 22px;
}

@media (max-width: 600px) {
  .about-grid { flex-direction: column; gap: 32px; }
}
</style>