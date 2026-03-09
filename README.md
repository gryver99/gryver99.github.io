<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Timeline Uscite</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
  }

  .timeline {
    position: relative;
    margin: 0 auto;
    padding-left: 20px;
    border-left: 3px solid #4CAF50;
  }

  .entry {
    margin-bottom: 30px;
    position: relative;
  }

  .entry::before {
    content: "";
    width: 14px;
    height: 14px;
    background: #4CAF50;
    border-radius: 50%;
    position: absolute;
    left: -10px;
    top: 5px;
  }

  .entry img {
    width: 100%;
    max-width: 420px;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .entry-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .entry-date {
    font-size: 14px;
    color: #777;
    margin-bottom: 10px;
  }

  .entry-desc {
    font-size: 15px;
    margin-bottom: 10px;
  }

  .entry a {
    color: #4CAF50;
    font-weight: bold;
    text-decoration: none;
  }
</style>
</head>
<body>

<h2>Nuove Uscite – Timeline</h2>
<div class="timeline" id="timeline"></div>

<script>
const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS6qbDeXYiws1fG8LR30qmPQX50zqfrY1xW540_BRw-jkEJYFLfraVBJZ_VzRjofvjPgIOss4DlQR10/pub?gid=0&single=true&output=csv";

async function loadData() {
  const res = await fetch(DATA_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));
  const headers = rows[0];
  const items = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  // Ordina per data (più recente in alto)
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  const container = document.getElementById("timeline");
  container.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "entry";

    div.innerHTML = `
      <img src="${item.cover_image}" alt="">
      <div class="entry-title">${item.title}</div>
      <div class="entry-date">${item.date}</div>
      <div class="entry-desc">${item.description}</div>
      <a href="${item.url}" target="_blank">Vai alla pagina</a>
    `;

    container.appendChild(div);
  });
}

loadData();
</script>

</body>
</html>
