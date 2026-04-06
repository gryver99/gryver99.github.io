// netlify/functions/youtube-random.js
const MAX_PAGES = 50;
const MAX_PER_PAGE = 50;

function pickRandom(arr, n) {
  const copy = arr.slice();
  const out = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx,1)[0]);
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

exports.handler = async function(event) {
  const API_KEY = process.env.YT_API_KEY;
  const CHANNEL_ID = process.env.YT_CHANNEL_ID || 'UCo_22HGU2y0F06am8OjeXwg';
  const COUNT = parseInt((event.queryStringParameters && event.queryStringParameters.count) || '15', 10);

  if (!API_KEY) {
    return jsonResponse(500, { error: 'YT_API_KEY not configured' });
  }

  try {
    const chUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;
    const chRes = await fetch(chUrl);
    if (!chRes.ok) {
      const txt = await chRes.text();
      // preserve status code from YouTube and return JSON with message
      return jsonResponse(chRes.status, { error: txt });
    }
    const chData = await chRes.json();
    const uploadsPlaylistId = chData.items && chData.items[0] && chData.items[0].contentDetails.relatedPlaylists.uploads;
    if (!uploadsPlaylistId) {
      return jsonResponse(500, { error: 'Uploads playlist not found' });
    }

    let videos = [];
    let pageToken = '';
    let pages = 0;
    do {
      const plUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${MAX_PER_PAGE}${pageToken ? `&pageToken=${pageToken}` : ''}&key=${API_KEY}`;
      const plRes = await fetch(plUrl);
      if (!plRes.ok) {
        const txt = await plRes.text();
        return jsonResponse(plRes.status, { error: txt });
      }
      const plData = await plRes.json();
      if (plData.items && plData.items.length) {
        videos = videos.concat(plData.items);
      }
      pageToken = plData.nextPageToken || '';
      pages++;
    } while (pageToken && pages < MAX_PAGES);

    if (!videos.length) {
      return jsonResponse(200, { items: [] }, { "Cache-Control": "no-cache, no-store, must-revalidate" });
    }

    const chosen = pickRandom(videos, Math.min(COUNT, videos.length));

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
    return jsonResponse(500, { error: err && err.message ? err.message : String(err) });
  }
};
