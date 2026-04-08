# GameLeaf (`gryver99.github.io`)

Jekyll static site for GameLeaf news, posts, featured videos, and search.

## Tech Stack

- Jekyll `4.4.x`
- Liquid templates + Markdown posts
- Vanilla JavaScript
- SCSS/CSS

## Local Development

### Prerequisites

- Ruby (3.x recommended)
- Bundler (`gem install bundler`)

### Install dependencies

```bash
bundle install
```

### Run locally

```bash
bundle exec jekyll serve
```

Site will be available at `http://127.0.0.1:4000`.

### Build for production

```bash
bundle exec jekyll build
```

Generated output goes to `_site/`.

## Project Structure

- `_config.yml` - Site config, plugins, metadata
- `_layouts/` - Base page layouts
- `_includes/` - Reusable page sections (navbar, footer, carousel, etc.)
- `_posts/` - Blog/news posts
- `pages/` - Static content pages (privacy, terms, support, etc.)
- `assets/js/` - Frontend scripts
- `assets/css/` and `_sass/` - Styles
- `data/videos.json` - Featured video source data
- `search.html` + `index.json` - Client-side search page and index

## Content Workflow

1. Add a post in `_posts/` using `YYYY-MM-DD-title.md`.
2. Include front matter fields used by UI/search (`title`, `date`, `tags`, `image`, `category`, `badge` when needed).
3. Run `bundle exec jekyll serve` and verify homepage + `/search/`.
4. Commit changes.

## Quality Checks

- CI workflow (`.github/workflows/ci.yml`) runs:
  - `bundle exec jekyll build`
  - Broken-link scan on generated `_site/` HTML

## Notes

- Search input validation is centralized in `assets/js/site-utils.js`.
- Video carousel assets are split into:
  - `assets/css/video-carousel.css`
  - `assets/js/video-carousel.js`