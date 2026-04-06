// netlify/functions/youtube-random.js
const MAX_PAGES = 50;
const MAX_PER_PAGE = 50;
const MAX_COUNT = 20;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Simple in-memory cache (lives while the function instance is warm)
let _cache = { ts: 0, items: null };

function pickRandom(arr, n) {
  const copy = arr.slice();
  const out = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

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

exports.handler = async function (event) {
  const API_KEY = process.env.YT_API_KEY;
  const CHANNEL_ID = process.env.YT_CHANNEL_ID || "UCo_22HGU2y0F06am8OjeXwg";

  // Parse and clamp count
  const rawCount = (event.queryStringParameters && event.queryStringParameters.count) || "15";
  let parsed = parseInt(rawCount, 10);
  if (Number.isNaN(parsed)) parsed = 15;
  const count = Math.max(1, Math.min(parsed, MAX_COUNT));

  if (!API_KEY) {
    console.error("YT_API_KEY not configured");
    return jsonResponse(500, { error: "YT_API_KEY not configured" });
  }

  try {
    // Serve from in-memory cache if fresh
    if (_cache.items && Date.now() - _cache.ts < CACHE_TTL) {
      console.log("Serving from in-memory cache");
      const sampled = pickRandom(_cache.items, Math.min(count, _cache.items.length));
      const outCached = sampled.map(item => ({
        videoId: (item.contentDetails && item.contentDetails.videoId) || (item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId),
        title: item.snippet && item.snippet.title,
        thumbnails: item.snippet && item.snippet.thumbnails
      }));
      return jsonResponse(200, { items: outCached }, { "Cache-Control": "no-cache, no-store, must-revalidate" });
    }

    // Get uploads playlist ID for the channel
    const chUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;
    const chRes = await fetch(chUrl);
    if (!chRes.ok) {
      const txt = await chRes.text();
      console.error("YouTube channels API error", chRes.status, txt);
      return jsonResponse(chRes.status, { error: txt });
    }
    const chData = await chRes.json();
    const uploadsPlaylistId = chData.items && chData.items[0] && chData.items[0].contentDetails && chData.items[0].contentDetails.relatedPlaylists && chData.items[0].contentDetails.relatedPlaylists.uploads;
    if (!uploadsPlaylistId) {
      console.error("Uploads playlist not found for channel", CHANNEL_ID);
      return jsonResponse(500, { error: "Uploads playlist not found" });
    }

    // Fetch playlist items (paginated)
    let videos = [];
    let pageToken = "";
    let pages = 0;
    do {
      const plUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${MAX_PER_PAGE}${pageToken ? `&pageToken=${pageToken}` : ""}&key=${API_KEY}`;
      const plRes = await fetch(plUrl);
      if (!plRes.ok) {
        const txt = await plRes.text();
        console.error("YouTube playlistItems API error", plRes.status, txt);
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
      return jsonResponse(200, { items: [] }, { "Cache-Control": "no-cache, no-store, must-revalidate" });
    }

    // Update cache
    _cache = { ts: Date.now(), items: videos };

    // Pick random videos and shape output
    const chosen = pickRandom(videos, Math.min(count, videos.length));
    const out = chosen.map(item => {
      const vidId = (item.contentDetails && item.contentDetails.videoId) || (item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId);
      return {
        videoId: vidId,
        title: item.snippet && item.snippet.title,
        thumbnails: item.snippet && item.snippet.thumbnails
      };
    });

    return jsonResponse(200, { items: out }, { "Cache-Control": "no-cache, no-store, must-revalidate" });

  } catch (err) {
    console.error("Unhandled error in youtube-random function:", err && err.stack ? err.stack : err);
    return jsonResponse(500, { error: err && err.message ? err.message : String(err) });
  }
};
