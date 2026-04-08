(async function () {
  const params = new URLSearchParams(location.search);
  const qParam = params.get('q') || '';
  const input = document.getElementById('q');
  const resultsEl = document.getElementById('searchResults');
  const metaEl = document.getElementById('searchMeta');

  if (!input || !resultsEl || !metaEl) return;

  input.value = qParam;

  const sanitizeQuery = window.FormValidation
    ? window.FormValidation.sanitizeQuery
    : function (rawQuery) { return (rawQuery || '').replace(/\s+/g, ' ').trim(); };
  const validateSearchQuery = window.FormValidation
    ? window.FormValidation.validateSearchQuery
    : function (rawQuery) {
        const value = sanitizeQuery(rawQuery);
        return { valid: value.length >= 2 && value.length <= 80, value, message: '' };
      };
  const searchResultsPath = window.FormValidation
    ? window.FormValidation.SEARCH_RESULTS_PATH
    : '/search/';
  const searchIndexPath = window.FormValidation
    ? window.FormValidation.SEARCH_INDEX_PATH
    : '/index.json';

  // Load index.json
  let index = [];
  try {
    const res = await fetch(searchIndexPath);
    index = await res.json();
  } catch (e) {
    metaEl.textContent = 'Search index not available.';
    return;
  }

  function normalize(s) { return (s || '').toLowerCase(); }
  function tokenize(query) {
    return normalize(query).split(/\s+/).filter(Boolean);
  }

  function appendHighlightedText(target, sourceText, tokens) {
    const text = String(sourceText || '');
    if (!tokens.length) {
      target.textContent = text;
      return;
    }
    const escaped = tokens
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .filter(Boolean);
    if (!escaped.length) {
      target.textContent = text;
      return;
    }
    const matcher = new RegExp(`(${escaped.join('|')})`, 'ig');
    const parts = text.split(matcher);
    parts.forEach((part) => {
      if (!part) return;
      const isMatch = tokens.some((token) => token && normalize(part) === token);
      if (isMatch) {
        const mark = document.createElement('mark');
        mark.textContent = part;
        target.appendChild(mark);
      } else {
        target.appendChild(document.createTextNode(part));
      }
    });
  }

  function scoreItem(item, tokens) {
    const title = normalize(item.title);
    const tags = normalize((Array.isArray(item.tags) ? item.tags.join(' ') : ''));
    const excerpt = normalize(item.excerpt);

    let score = 0;
    for (const token of tokens) {
      if (title.includes(token)) score += 5;
      if (tags.includes(token)) score += 3;
      if (excerpt.includes(token)) score += 1;
    }
    return score;
  }

  function renderResults(items, query) {
    resultsEl.innerHTML = '';
    const tokens = tokenize(query);
    if (!items.length) {
      metaEl.textContent = query
        ? `No results for "${query}". Try broader keywords or fewer words.`
        : 'Enter at least 2 characters to search.';
      return;
    }
    metaEl.textContent = `${items.length} result${items.length > 1 ? 's' : ''} for "${query}"`;
    const frag = document.createDocumentFragment();
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'search-item';

      const link = document.createElement('a');
      link.href = item.url || '#';

      const title = document.createElement('h2');
      appendHighlightedText(title, item.title || '', tokens);
      link.appendChild(title);

      const excerpt = document.createElement('p');
      excerpt.className = 'excerpt';
      appendHighlightedText(excerpt, item.excerpt || '', tokens);
      link.appendChild(excerpt);

      const meta = document.createElement('p');
      meta.className = 'meta';
      const tagsText = Array.isArray(item.tags) ? item.tags.join(', ') : '';
      meta.textContent = `${item.date || ''} • ${tagsText}`;
      link.appendChild(meta);

      li.appendChild(link);
      frag.appendChild(li);
    });
    resultsEl.appendChild(frag);
  }

  function search(query) {
    const tokens = tokenize(query);
    if (!tokens.length) return [];
    const ranked = index
      .map((item) => {
        const hay = normalize(`${item.title} ${item.excerpt || ''} ${(item.tags || []).join(' ')}`);
        const matchesAllTokens = tokens.every((token) => hay.includes(token));
        if (!matchesAllTokens) return null;
        return { item, score: scoreItem(item, tokens) };
      })
      .filter(Boolean);

    ranked.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const at = Number(a.item.timestamp || 0);
      const bt = Number(b.item.timestamp || 0);
      return bt - at;
    });
    return ranked.map((entry) => entry.item);
  }

  // Initial render if q present
  if (qParam) {
    const initialValidation = validateSearchQuery(qParam);
    if (initialValidation.valid) {
      const initialQuery = initialValidation.value;
      input.value = initialQuery;
      renderResults(search(initialQuery), initialQuery);
    } else {
      metaEl.textContent = 'Enter at least 2 characters.';
    }
  }

  // Handle form submit (keeps URL in sync)
  const form = document.getElementById('searchForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const queryValidation = validateSearchQuery(input.value);
    if (!queryValidation.valid) {
      input.setCustomValidity(queryValidation.message || 'Invalid search query.');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    const q = queryValidation.value;
    input.value = q;
    history.replaceState({}, '', q ? `?q=${encodeURIComponent(q)}` : searchResultsPath);
    renderResults(search(q), q);
  });
})();
