#!/usr/bin/env node
// Generates the static rune pages: runes/<id>.html (one per rune) and
// runes/index.html (all 24), plus sitemap.xml and robots.txt.
//
//   node scripts/build-rune-pages.js
//
// Rune data comes from js/runes-data.js (the same file the app uses) and the
// longer texts from scripts/rune-extra.js. The pages are plain HTML so search
// engines can read them without running any JavaScript; re-run the script
// after editing either file, and commit the generated files.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const SITE = "https://evoluteur.github.io/rune-reading/";
const TODAY = new Date().toISOString().slice(0, 10);

const { runesData, AETTIR } = vm.runInNewContext(
  fs.readFileSync(path.join(root, "js/runes-data.js"), "utf8") + ";({ runesData, AETTIR })",
);
const EXTRA = require("./rune-extra.js");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const firstSentence = (s) => s.split(/(?<=\.)\s/)[0];
const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);

// the GitHub link markup is taken from index.html so the two stay identical
// (\s tolerates the line breaks a code formatter may add inside the tag)
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const GITHUB_LINK = indexHtml.match(/<a\s[^>]*id="omg-github"[\s\S]*?<\/a>/)?.[0];
if (!GITHUB_LINK) throw new Error('index.html has no <a id="omg-github"> link to copy');

const glyph = (r, cls = "glyph") =>
  `<svg class="${cls}" viewBox="0 0 40 64" role="img" aria-label="${r.name}"><path d="${r.path}"/></svg>`;
const runeFigure = (r) =>
  `<svg class="rune-svg sz-hero" viewBox="0 0 40 64" role="img" aria-label="The rune ${r.name}"><g><path d="${r.path}" /></g></svg>`;
const sayButton = (r) =>
  `<button type="button" class="detail-say" title="Hear the name" aria-label="Hear the name of ${r.name}" onclick="speakRune('${r.id}', event)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg></button>`;

const head = ({ title, description, url, ogType = "article", jsonld }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="author" content="Olivier Giulieri" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/png" href="../favicon.png" />
    <meta name="theme-color" content="#1a212d" />
    <meta property="og:site_name" content="Rune Reading" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}rune-reading.png" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${SITE}rune-reading.png" />
    <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
    </script>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Overpass" />
    <link id="omg-core-css" rel="stylesheet" href="../css/core.css" />
    <script>
      // Themes (dark, light, evol-blue) are copies of omg-themes; the base is "../" because this page is in runes/.
      window.OMG_THEMES_BASE = "../";
      window.OMG_DEFAULT_THEME = "dark";
      (function () {
        var t = window.OMG_DEFAULT_THEME;
        try {
          t = localStorage.getItem("omg-theme") || t;
        } catch (e) {}
        if (t !== "dark" && t !== "light" && t !== "evol-blue") t = window.OMG_DEFAULT_THEME;
        document.documentElement.setAttribute("data-theme", t);
        // written here (not in the markup) so the saved theme loads before first paint
        document.write(
          '<link id="omg-theme-css" rel="stylesheet" href="' + window.OMG_THEMES_BASE + "css/themes/" + t + "/" + t + '.css" />',
        );
      })();
    </script>
    <link id="omg-density-css" rel="stylesheet" href="../css/densities.css" />
    <link rel="stylesheet" href="../css/runes.css" />
    <link rel="stylesheet" href="../css/about.css" />
    <link rel="stylesheet" href="../css/rune-page.css" />

    <script src="../js/omg.js"></script>
    <script src="../js/speech.js"></script>
    <script>
      // no speech support: hide the speaker buttons
      addEventListener("DOMContentLoaded", () => {
        if (!canSpeak) document.querySelectorAll(".detail-say").forEach((b) => b.remove());
      });
    </script>
  </head>
`;

const header = () => `
  <body onload="setupPage('rune');" id="omg-body">
    <div id="omg-header">
      <h1><a href="../index.html">Rune Reading</a></h1>
      <div id="omg-theme-picker"></div>
      ${GITHUB_LINK}
    </div>`;

const footer = () => `
      <div class="footer">
        <p><a href="../index.html">Draw a rune reading</a> · <a href="index.html">All 24 runes</a> · <a href="../about.html">About runes</a></p>
        <p>Rune names, sounds and the three aettir follow the traditional Elder Futhark; meanings and advice were written for this app.</p>
        <p>
          Rune Reading is open source on
          <a href="https://github.com/evoluteur/rune-reading">GitHub</a>
          with an MIT license. Had fun browsing the app?
          <a href="https://github.com/sponsors/evoluteur">Buy me a coffee by becoming a sponsor</a>.
        </p>
        <p>
          You may also like <a href="https://evoluteur.github.io/motivational-numerology/">Motivational Numerology</a>. For more mystic arts as small web apps, see
          <a href="https://evoluteur.github.io/esoterica.html">Esoterica</a>.
        </p>
        <p class="copyright">
          &#169; 2026
          <a href="https://evoluteur.github.io/">Olivier Giulieri</a>
        </p>
      </div>
    </div>
  </body>
</html>
`;

const author = { "@type": "Person", name: "Olivier Giulieri", url: "https://evoluteur.github.io/" };
const breadcrumb = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: url })),
});
const website = { "@type": "WebSite", name: "Rune Reading", url: SITE };

const ordinal = (i) => i + 1;

// ---------------------------------------------------------------- one rune

const runeChip = (r, current) =>
  `<li><a class="rune-pick${current ? " current" : ""}" href="${r.id}.html"${
    current ? ' aria-current="page"' : ""
  }>${glyph(r)}<span class="rn">${r.name}</span><span class="rs">${r.sound}</span></a></li>`;

const runePage = (r, i) => {
  const x = EXTRA[r.id];
  if (!x) throw new Error(`no extra text for ${r.id}`);
  const aett = AETTIR[r.aett];
  const siblings = runesData.filter((o) => o.aett === r.aett);
  const prev = runesData[i - 1];
  const next = runesData[i + 1];
  const url = `${SITE}runes/${r.id}.html`;
  const title = `${r.name} Rune Meaning (${r.char}) – Elder Futhark | Rune Reading`;
  const description = `${r.name} (${r.char}, "${r.sound}") is rune ${ordinal(i)} of 24 in the Elder Futhark: ${lc(
    r.lore,
  )}. Its ${r.reversed ? "upright and reversed meaning" : "meaning"}, history and how it reads in a rune spread.`;
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${r.name} rune meaning (${r.char})`,
        description,
        url,
        mainEntityOfPage: url,
        inLanguage: "en",
        about: `The ${r.name} rune of the Elder Futhark`,
        keywords: [r.name, `${r.name} rune`, "Elder Futhark", ...r.keywords].join(", "),
        image: `${SITE}rune-reading.png`,
        datePublished: TODAY,
        dateModified: TODAY,
        author,
        isPartOf: website,
      },
      breadcrumb([
        ["Rune Reading", SITE],
        ["The 24 runes", `${SITE}runes/`],
        [r.name, url],
      ]),
    ],
  };
  const revBlock = r.reversed
    ? `<h3>${r.name} reversed meaning</h3>
      <p>${r.reversed}</p>`
    : `<h3>${r.name} reversed</h3>
      <p>${r.name} looks the same turned upside down, so it has no reversed meaning. It is one of the nine runes that read the same either way up, and it is always read as ${lc(
        r.lore,
      )}.</p>`;
  return (
    head({ title, description, url, jsonld }) +
    header() +
    `
    <h2>${r.name} rune meaning</h2>
    <div class="content about rune-page">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Rune Reading</a> › <a href="index.html">The 24 runes</a> › ${r.name}</nav>

      <div class="rune-hero">
        <div class="rune-figure">${runeFigure(r)}</div>
        <div>
          <p class="rune-facts"><span class="rf-char" lang="non">${r.char}</span> · sound “${r.sound}” · ${r.lore}${sayButton(r)}</p>
          <div class="keywords">${r.keywords.map((k) => `<span class="keyword">${k}</span>`).join("")}</div>
        </div>
      </div>

      <p class="lede">${r.name} (${r.char}) is rune ${ordinal(i)} of the 24 runes of the Elder Futhark, in ${aett.name}. Its name means ${lc(r.lore)}.</p>

      <h3>${r.name} upright meaning</h3>
      <p>${r.upright}</p>

      ${revBlock}

      <h3>Advice from ${r.name}</h3>
      <p class="fortune">${r.advice}</p>

      <h3>Origin and history of ${r.name}</h3>
      <p>${x.history}</p>
      <dl class="anatomy">
        <dt>Rune</dt><dd>${r.char} ${r.name}</dd>
        <dt>Proto-Germanic name</dt><dd>${x.proto}</dd>
        <dt>Meaning of the name</dt><dd>${r.lore}</dd>
        <dt>Sound</dt><dd>“${r.sound}”</dd>
        <dt>Aett</dt><dd>${aett.name}: ${lc(aett.theme)}</dd>
        <dt>Place in the futhark</dt><dd>${ordinal(i)} of 24</dd>
      </dl>

      <h3>${r.name} in a rune reading</h3>
      <p>${x.practice}</p>
      <p><button type="button" class="interpret-btn" onclick="location.href='../index.html'">Draw Runes Now</button></p>

      <h3>The other runes of ${aett.name}</h3>
      <ol class="glyphs">
        ${siblings.map((s) => runeChip(s, s === r)).join("\n        ")}
      </ol>

      <nav class="rune-nav" aria-label="Previous and next rune">
        <span>${prev ? `<a href="${prev.id}.html" rel="prev">← ${prev.name} ${prev.char}</a>` : ""}</span>
        <a href="index.html">All 24 runes</a>
        <span>${next ? `<a href="${next.id}.html" rel="next">${next.name} ${next.char} →</a>` : ""}</span>
      </nav>
` +
    footer()
  );
};

// ---------------------------------------------------------------- hub

const hubPage = () => {
  const url = `${SITE}runes/`;
  const title = "Elder Futhark Runes: Meaning of All 24 Runes | Rune Reading";
  const description =
    "The 24 runes of the Elder Futhark with their names, sounds and meanings, from Fehu to Othala, split into the three aettir, with upright and reversed readings.";
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "The 24 runes of the Elder Futhark",
        description,
        url,
        inLanguage: "en",
        author,
        isPartOf: website,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: runesData.map((r, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${r.name} (${r.char})`,
            url: `${SITE}runes/${r.id}.html`,
          })),
        },
      },
      breadcrumb([
        ["Rune Reading", SITE],
        ["The 24 runes", url],
      ]),
    ],
  };
  const sections = AETTIR.map((a, ai) => {
    const list = runesData
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => r.aett === ai)
      .map(
        ({ r, i }) => `
        <li><a class="rune-row" href="${r.id}.html">
          ${glyph(r)}
          <span class="rr-text">
            <span class="rr-name">${r.name} ${r.char}</span> <span class="rr-sub">· “${r.sound}” · ${r.lore}</span>
            <span class="rr-line">${firstSentence(r.upright)}</span>
          </span>
        </a></li>`,
      )
      .join("");
    return `
      <h3>${a.name}</h3>
      <p class="note">${a.theme}.</p>
      <ol class="rune-list">${list}
      </ol>`;
  }).join("\n");
  return (
    head({ title, description, url, ogType: "website", jsonld }) +
    header() +
    `
    <h2>The 24 runes of the Elder Futhark</h2>
    <div class="content about rune-page">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Rune Reading</a> › The 24 runes</nav>
      <p class="lede">The Elder Futhark is the oldest runic alphabet, used in Germanic lands from about the 2nd century CE. Each of its 24 runes stands for a sound and is named for a word, such as cattle, sun or ice, and readers have long drawn meaning from those names.</p>
      <p>The runes are grouped in three families of eight called <em class="accent">aettir</em>. Choose a rune for its upright and reversed meaning, its history, and how it reads in a spread. For a personal reading, <a href="../index.html">draw runes from the bag</a> and let the app interpret them; to learn how the runes began, see <a href="../about.html">about runes</a>.</p>
      ${sections}
      <p><button type="button" class="interpret-btn" onclick="location.href='../index.html'">Draw Runes Now</button></p>
` +
    footer()
  );
};

// ---------------------------------------------------------------- write

const outDir = path.join(root, "runes");
fs.mkdirSync(outDir, { recursive: true });

const titles = new Set();
const descriptions = new Set();
runesData.forEach((r, i) => {
  const html = runePage(r, i);
  fs.writeFileSync(path.join(outDir, `${r.id}.html`), html);
  const t = html.match(/<title>(.*?)<\/title>/)[1];
  const d = html.match(/name="description" content="(.*?)"/)[1];
  if (titles.has(t) || descriptions.has(d)) throw new Error(`duplicate title/description for ${r.id}`);
  titles.add(t);
  descriptions.add(d);
});
fs.writeFileSync(path.join(outDir, "index.html"), hubPage());

const urls = [
  ["", "1.0"],
  ["runes/", "0.9"],
  ["about.html", "0.7"],
  ...runesData.map((r) => [`runes/${r.id}.html`, "0.8"]),
];
fs.writeFileSync(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ([u, p]) => `  <url>
    <loc>${SITE}${u}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>${p}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
);
fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);

const lens = [...descriptions].map((d) => d.length);
console.log(
  `${runesData.length} rune pages + hub + sitemap.xml + robots.txt; description length ${Math.min(...lens)}-${Math.max(...lens)}`,
);
