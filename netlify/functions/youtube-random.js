// netlify/functions/youtube-random.js
// Improvements: JSON headers, structured logging, in-memory cache, optional persistent cache endpoint,
// count limiting, retry with exponential backoff, metrics logging, and safer error handling.

const MAX_PAGES = 50;
const MAX_PER_PAGE = 50;
const MAX_COUNT = 20;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms
const FETCH_RETRIES = 3;
const FETCH_BACKOFF_BASE = 300; // ms

// In-memory cache (valid while the function instance is warm)
let _cache = { ts: 0, items: null };

// Helper: pick n random items from array
function pickRandom(arr, n) {
  const copy = arr.slice();
  const out = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

// Helper: consistent JSON responses with headers
function jsonResponse(statusCode, payload, extraHeaders = {}) {
  return {
    statusCode,
    headers: Object.assign(
      { "Content-Type": "application/json" },
      extraHeaders
    ),
    body: JSON.stringify(payload)
  };
}

// Helper: simple structured logger
function logInfo(...args) {
  console.log(JSON.stringify({ level: "info", ts: new Date().toISOString(), msg: args }));
}
function logError(...args) {
  console.error(JSON.stringify({ level: "error", ts: new Date().toISOString(), msg: args }));
}

// Helper: fetch with retries and exponential backoff
async function fetchWithRetry(url, opts = {}, retries = FETCH_RETRIES) {
  let attempt = 0;
  while (true) {
    try {
      const start = Date.now();
      const res = await fetch(url, opts);
      const duration = Date.now() - start;
      logInfo({ event: "fetch", url, status: res.status, attempt, duration });
      return res;
    } catch (err) {
      attempt++;
      if (attempt > retries) {
        logError({ event: "fetch_failed", url, attempt, error: err && err.message ? err.message : String(err) });
        throw err;
      }
      const backoff = FETCH_BACKOFF_BASE * Math.pow(2, attempt - 1);
      logInfo({ event: "fetch_retry", url, attempt, backoff });
      await new Promise(r => setTimeout(r, backoff));
    }
  }
}

// Optional persistent cache integration (generic HTTP endpoint).
// If PERSISTENT_CACHE_ENDPOINT is set, the function will try to GET ?key=... and POST to set.
// The endpoint contract expected:
//  - GET  <PERSISTENT_CACHE_ENDPOINT>?key=<key>  -> returns JSON { found: true, value: <string> } or { found: false }
//  - POST <PERSISTENT_CACHE_ENDPOINT> with JSON { key, value, ttl } -> returns { ok: true }
// This is intentionally generic so you can plug Upstash, a small server, or any KV HTTP wrapper.
const PERSISTENT_CACHE_ENDPOINT = process.env.PERSISTENT_CACHE_ENDPOINT || "";
const PERSISTENT_CACHE_TOKEN = process.env.PERSISTENT_CACHE_TOKEN || ""; // optional bearer token

async function persistentCacheGet(key) {
  if (!PERSISTENT_CACHE_ENDPOINT) return null;
  try {
    const url = `${PERSISTENT_CACHE_ENDPOINT}?key=${encodeURIComponent(key)}`;
    const res = await fetchWithRetry(url, {
      method: "GET",
      headers: PERSISTENT_CACHE_TOKEN ? { Authorization: `Bearer ${PERSISTENT_CACHE_TOKEN}` } : {}
    });
    if (!res.ok) {
      logError("persistentCacheGet non-ok", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    if (data && data.found) {
      return data.value;
    }
    return null;
  } catch (err) {
    logError("persistentCacheGet error", err && err.message ? err.message : String(err));
    return null;
  }
}

async function persistentCacheSet(key, value, ttlSeconds = 3600) {
  if (!PERSISTENT_CACHE_ENDPOINT) return false;
  try {
    const res = await fetchWithRetry(PERSISTENT_CACHE_ENDPOINT, {
      method: "POST",
      headers: Object.assign(
        { "Content-Type": "application/json" },
        PERSISTENT_CACHE_TOKEN ? { Authorization: `Bearer ${PERSISTENT_CACHE_TOKEN}` } : {}
      ),
      body: JSON.stringify({ key, value, ttl: ttlSeconds })
    });
    if (!res.ok) {
      logError("persistentCacheSet non-ok", res.status, await res.text());
      return false;
    }
    const data = await res.json();
    return data && data.ok;
  } catch (err) {
    logError("persistentCacheSet error", err && err.message ? err.message : String(err));
    return false;
  }
}

// Utility: safe JSON parse
function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

exports.handler = async function (event) {
  const API_KEY = process.env.YT_API_KEY;
  const CHANNEL_ID = process.env.YT_CHANNEL_ID || "UCo_22HGU2y0F06am8OjeXwg";

  // Parse and clamp count
  const rawCount = (event.queryStringParameters && event.queryStringParameters.count) || "15";
  let parsed = parseInt(rawCount, 10);
  if (Number.isNaN(parsed)) parsed = 15;
  const count = Math.max(1, Math.min(parsed, MAX_COUNT));

  // Metrics
  const metrics = { requests: 1, servedFromCache: false, youtubeCalls: 0 };

  if (!API_KEY) {
    logError("YT_API_KEY not configured");
    return jsonResponse(500, { error: "YT_API_KEY not configured" });
  }

  try {
    // 1) Try in-memory cache
    if (_cache.items && Date.now() - _cache.ts < CACHE_TTL) {
      metrics.servedFromCache = true;
      logInfo({ event: "serve_in_memory_cache", countRequested: count, cachedItems: _cache.items.length });
      const sampled = pickRandom(_cache.items, Math.min(count, _cache.items.length));
      const outCached = sampled.map(item => ({
        videoId: (item.contentDetails && item.contentDetails.videoId) || (item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId),
        title: item.snippet && item.snippet.title,
        thumbnails: item.snippet && item.snippet.thumbnails
      }));
      console.log(JSON.stringify({ metrics }));
      return jsonResponse(200, { items: outCached }, { "Cache-Control": "no-cache, no-store, must-revalidate" });
    }

    // 2) Try persistent cache (optional)
    const persistentKey = `yt_uploads_${CHANNEL_ID}`;
    if (PERSISTENT_CACHE_ENDPOINT) {
      const cachedStr = await persistentCacheGet(persistentKey);
      if (cachedStr) {
        const cachedItems = safeJsonParse(cachedStr);
        if (Array.isArray(cachedItems) && cachedItems.length) {
          _cache = { ts: Date.now(), items: cachedItems };
          metrics.servedFromCache = true;
          logInfo({ event: "serve_persistent_cache", countRequested: count, cachedItems: cachedItems.length });
          const sampled = pickRandom(cachedItems, Math.min(count, cachedItems.length));
          const outCached = sampled.map(item => ({
            videoId: (item.contentDetails && item.contentDetails.videoId) || (item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId),
            title: item.snippet && item.snippet.title,
            thumbnails: item.snippet && item.snippet.thumbnails
          }));
          console.log(JSON.stringify({ metrics }));
          return jsonResponse(200, { items: outCached }, { "Cache-Control": "no-cache, no-store, must-revalidate" });
        }
      }
    }

    // 3) Fetch uploads playlist ID
    const chUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;
    const chRes = await fetchWithRetry(chUrl);
    metrics.youtubeCalls++;
    if (!chRes.ok) {
      const txt = await chRes.text();
      logError("YouTube channels API error", chRes.status, txt);
      return jsonResponse(chRes.status, { error: txt });
    }
    const chData = await chRes.json();
    const uploadsPlaylistId = chData.items && chData.items[0] && chData.items[0].contentDetails && chData.items[0].contentDetails.relatedPlaylists && chData.items[0].contentDetails.relatedPlaylists.uploads;
    if (!uploadsPlaylistId) {
      logError("Uploads playlist not found for channel", CHANNEL_ID);
      return jsonResponse(500, { error: "Uploads playlist not found" });
    }

    // 4) Paginate playlistItems
    let videos = [];
    let pageToken = "";
    let pages = 0;
    do {
      const plUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${MAX_PER_PAGE}${pageToken ? `&pageToken=${pageToken}` : ""}&key=${API_KEY}`;
      const plRes = await fetchWithRetry(plUrl);
      metrics.youtubeCalls++;
      if (!plRes.ok) {
        const txt = await plRes.text();
        logError("YouTube playlistItems API error", plRes.status, txt);
        return jsonResponse(plRes.status, { error: txt });
      }
      const plData = await plRes.json();
      if (plData.items && plData.items.length) {
        videos = videos.concat(plData.items);
      }
      pageToken = plData.nextPageToken || "";
      pages++;
    } while (pageToken && pages < MAX_PAGES);

    if (!videos.length) {
      // Cache empty result briefly to avoid repeated calls
      _cache = { ts: Date.now(), items: [] };
      if (PERSISTENT_CACHE_ENDPOINT) {
        await persistentCacheSet(persistentKey, JSON.stringify([]), Math.floor(CACHE_TTL / 1000));
      }
      logInfo("No videos found for channel", CHANNEL_ID);
      console.log(JSON.stringify({ metrics }));
      return jsonResponse(200, { items: [] }, { "Cache-Control": "no-cache, no-store, must-revalidate" });
    }

    // 5) Update in-memory cache and persistent cache (best-effort)
    _cache = { ts: Date.now(), items: videos };
    if (PERSISTENT_CACHE_ENDPOINT) {
      try {
        await persistentCacheSet(persistentKey, JSON.stringify(videos), Math.floor(CACHE_TTL / 1000));
      } catch (err) {
        logError("persistentCacheSet failed", err && err.message ? err.message : String(err));
      }
    }

    // 6) Pick random videos and return
    const chosen = pickRandom(videos, Math.min(count, videos.length));
    const out = chosen.map(item => {
      const vidId = (item.contentDetails && item.contentDetails.videoId) || (item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId);
      return {
        videoId: vidId,
        title: item.snippet && item.snippet.title,
        thumbnails: item.snippet && item.snippet.thumbnails
      };
    });

    // Log metrics and return
    metrics.youtubeCalls = metrics.youtubeCalls || 0;
    console.log(JSON.stringify({ metrics }));
    return jsonResponse(200, { items: out }, { "Cache-Control": "no-cache, no-store, must-revalidate" });

  } catch (err) {
    logError("Unhandled error in youtube-random function", err && err.stack ? err.stack : err);
    return jsonResponse(500, { error: err && err.message ? err.message : String(err) });
  }
};
