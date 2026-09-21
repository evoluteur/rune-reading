// Rune Reading app logic -- rune and spread data live in js/runes-data.js

const STATE_STORAGE_KEY = "rune-reading-state";
const DRAW_MS = 700;

const runeById = Object.fromEntries(runesData.map((r) => [r.id, r]));

let spreadKey = "three";
let allowReversed = false;
let draws = []; // one { id, rev } per position, in drawing order
let drawing = false;
let interpretMode = false;
let activeDetail = -1; // index into draws, or -1
let drawnNow = false; // true right after a draw, so only new tiles animate
let newFrom = 0; // index of the first tile drawn in the last draw action

const spread = () => SPREADS[spreadKey];
const isComplete = () => draws.length === spread().positions.length;
const runeAt = (i) => runeById[draws[i].id];
const meaningOf = (rune, rev) => (rev && rune.reversed ? rune.reversed : rune.upright);

// ---------------------------------------------------------------- drawing

// A rune as SVG strokes. Reversed runes are turned upside down (a half turn
// about the middle of the drawing).
const runeSvg = (rune, { rev = false, size = "tile" } = {}) =>
  `<svg class="rune-svg sz-${size}" viewBox="0 0 40 64" role="img" aria-label="${rune.name}${rev ? ", reversed" : ""}">
    <g${rev ? ' transform="rotate(180 20 32)"' : ""}><path d="${rune.path}" /></g>
  </svg>`;

const keywordsMarkup = (rune) =>
  `<div class="keywords">${rune.keywords.map((k) => `<span class="keyword">${k}</span>`).join("")}</div>`;

const bagSvg = () => `
  <svg class="bag-svg" viewBox="0 0 80 90" aria-hidden="true">
    <path d="M28 12 Q40 2 52 12 L48 22 Q40 27 32 22 Z" />
    <path d="M32 22 C8 34 2 62 12 78 Q40 90 68 78 C78 62 72 34 48 22" />
    <path class="bag-rune" d="M36 46V70M36 46L50 56L36 66" />
  </svg>`;

// ---------------------------------------------------------------- controls

const renderSpreadPicker = () => {
  const elem = document.getElementById("spread-picker");
  if (!elem) return;
  elem.innerHTML = Object.entries(SPREADS)
    .map(
      ([key, s]) => `
      <button type="button" class="spread-btn${key === spreadKey ? " selected" : ""}"
        aria-pressed="${key === spreadKey}" onclick="setSpread('${key}')">
        ${s.name}<span class="spread-count">${s.short}</span>
      </button>`,
    )
    .join("");
  const title = document.getElementById("spread-title");
  if (title) title.textContent = spread().name;
  const tagline = document.getElementById("spread-tagline");
  if (tagline) tagline.textContent = spread().tagline;
};

const renderOptions = () => {
  const elem = document.getElementById("options");
  if (!elem) return;
  elem.innerHTML = `
    <label class="opt">
      <input type="checkbox" id="reversed-opt" ${allowReversed ? "checked" : ""}
        onchange="setAllowReversed(this.checked)" />
      Include reversed runes
    </label>`;
};

const renderDrawArea = () => {
  const elem = document.getElementById("draw-area");
  if (!elem) return;
  if (isComplete()) {
    elem.innerHTML = "";
    elem.style.display = "none";
    return;
  }
  elem.style.display = "";
  const total = spread().positions.length;
  const next = draws.length;
  const pos = spread().positions[next];
  elem.innerHTML = `
    <div class="bag${drawing ? " shaking" : ""}">${bagSvg()}</div>
    <div class="draw-controls">
      <div class="draw-progress">${
        total > 1 ? `Rune ${next + 1} of ${total} · ` : ""
      }${pos.name}</div>
      <div class="draw-question">${pos.q}</div>
      <div class="draw-buttons">
        <button type="button" class="draw-btn" onclick="drawRuneClick()"${drawing ? " disabled" : ""}>
          ${next === 0 ? "Draw a Rune" : "Draw Next Rune"}
        </button>
        ${
          total - next > 1
            ? `<button type="button" class="draw-btn secondary" onclick="drawAllClick()"${drawing ? " disabled" : ""}>Draw All</button>`
            : ""
        }
      </div>
    </div>`;
};

const renderInterpretBar = () => {
  const elem = document.getElementById("interpret-bar");
  if (!elem) return;
  if (!draws.length) {
    elem.innerHTML = "";
    return;
  }
  elem.innerHTML = `
    ${
      isComplete()
        ? `<button type="button" class="interpret-btn" onclick="toggleInterpretation()">${
            interpretMode ? "Back to Reading" : "Interpret Reading"
          }</button>`
        : ""
    }
    <button type="button" class="interpret-btn" onclick="newReading()">New Reading</button>`;
};

// ---------------------------------------------------------------- audio

// Rune names are spoken with the browser's built-in speech voice (no audio
// files). Speech engines guess at unfamiliar names, so each one is respelled
// the way it is pronounced; edit a value here to change how a rune is said.
const SAY = {
  fehu: "Fayhoo",
  uruz: "Oorooz",
  thurisaz: "Thoorisahz",
  ansuz: "Ahnsooz",
  raidho: "Rythoh",
  kaunan: "KowNahn",
  gebo: "Gayboh",
  wunjo: "Woonyoh",
  hagalaz: "Hahgahlahz",
  nauthiz: "Nowtheez",
  isa: "Eesah",
  jera: "Yayrah",
  eihwaz: "Ayewahz",
  perthro: "Pairthroh",
  algiz: "Ahlgeez",
  sowilo: "Sohweeloh",
  tiwaz: "Teewahz",
  berkano: "Bairkahnoh",
  ehwaz: "Ehwahz",
  mannaz: "Mahnahz",
  laguz: "Lahgooz",
  ingwaz: "Ingwahz",
  dagaz: "Dahgahz",
  othala: "Ohthahlah",
};

const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

const speakRune = (id, e) => {
  if (e) e.stopPropagation(); // do not open the rune panel
  if (!canSpeak || !runeById[id]) return;
  const u = new SpeechSynthesisUtterance(SAY[id] || runeById[id].name);
  u.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

const sayKey = (id, e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    speakRune(id, e);
  }
};

const sayButton = (rune) =>
  canSpeak
    ? `<span class="rune-say" role="button" tabindex="0" title="Hear the name" aria-label="Hear the name of ${rune.name}"
        onclick="speakRune('${rune.id}', event)" onkeydown="sayKey('${rune.id}', event)"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg></span>`
    : "";

// ---------------------------------------------------------------- board

const slotMarkup = (i) => {
  const pos = spread().positions[i];
  const place = `style="grid-column:${pos.col};grid-row:${pos.row}"`;
  const d = draws[i];
  if (!d) {
    return `
      <div class="rune-slot empty" ${place}>
        <div class="slot-label">${pos.name}</div>
        <div class="slot-num">${i + 1}</div>
      </div>`;
  }
  const rune = runeById[d.id];
  const isNew = drawnNow && i >= newFrom ? " rune-new" : "";
  return `
    <div role="button" tabindex="0" class="rune-slot rune-tile${d.rev ? " reversed" : ""}${
      i === activeDetail ? " active" : ""
    }${isNew}" ${place} data-i="${i}"
      onclick="showRuneDetail(${i})"
      onkeydown="if (event.target === this && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); showRuneDetail(${i}); }"
      aria-label="${pos.name}: ${rune.name}${d.rev ? ", reversed" : ""}">
      ${sayButton(rune)}
      <div class="slot-label">${pos.name}</div>
      ${runeSvg(rune, { rev: d.rev, size: "tile" })}
      <div class="tile-name">${rune.name}</div>
      <div class="tile-sub">${d.rev ? "Reversed" : rune.lore}</div>
    </div>`;
};


const renderBoard = () => {
  const elem = document.getElementById("rune-board");
  if (!elem) return;
  const n = spread().positions.length;
  elem.style.setProperty("--cols", spread().cols);
  elem.className = `rune-board spread-${spreadKey}${interpretMode ? " hidden" : ""}`;
  elem.innerHTML = Array.from({ length: n }, (_, i) => slotMarkup(i)).join("");
  drawnNow = false;
};

const renderAll = () => {
  renderSpreadPicker();
  renderOptions();
  renderDrawArea();
  renderBoard();
  renderInterpretBar();
};

// ---------------------------------------------------------------- drawing runes

const pickRune = () => {
  const used = new Set(draws.map((d) => d.id));
  const bag = runesData.filter((r) => !used.has(r.id));
  const rune = bag[Math.floor(Math.random() * bag.length)];
  const rev = allowReversed && !!rune.reversed && Math.random() < 0.5;
  return { id: rune.id, rev };
};

const drawOne = () => {
  draws.push(pickRune());
  drawnNow = true;
  saveState();
};

const drawRuneClick = () => {
  if (drawing || isComplete()) return;
  drawing = true;
  closeDetail();
  renderDrawArea();
  setTimeout(() => {
    drawing = false;
    newFrom = draws.length;
    drawOne();
    renderDrawArea();
    renderBoard();
    renderInterpretBar();
  }, DRAW_MS);
};

const drawAllClick = () => {
  if (drawing || isComplete()) return;
  drawing = true;
  closeDetail();
  renderDrawArea();
  setTimeout(() => {
    drawing = false;
    newFrom = draws.length;
    while (!isComplete()) drawOne();
    renderAll();
  }, DRAW_MS);
};

const resetReading = () => {
  draws = [];
  drawing = false;
  interpretMode = false;
  activeDetail = -1;
  closeDetail();
  document.getElementById("interpretation-view")?.classList.remove("open");
};

const newReading = () => {
  resetReading();
  saveState();
  renderAll();
};

const setSpread = (key) => {
  if (!SPREADS[key] || key === spreadKey) return;
  spreadKey = key;
  resetReading();
  saveState();
  renderAll();
};

const setAllowReversed = (on) => {
  allowReversed = !!on;
  resetReading();
  saveState();
  renderAll();
};

// ---------------------------------------------------------------- persistence

const saveState = () => {
  try {
    localStorage.setItem(
      STATE_STORAGE_KEY,
      JSON.stringify({ spread: spreadKey, reversed: allowReversed, draws }),
    );
  } catch {
    // storage unavailable -- not worth failing the reading over
  }
};

const restoreState = () => {
  let raw;
  try {
    raw = JSON.parse(localStorage.getItem(STATE_STORAGE_KEY) || "null");
  } catch {
    raw = null;
  }
  if (!raw || !SPREADS[raw.spread]) return;
  spreadKey = raw.spread;
  allowReversed = !!raw.reversed;
  const list = Array.isArray(raw.draws) ? raw.draws : [];
  const seen = new Set();
  const ok =
    list.length <= spread().positions.length &&
    list.every((d) => {
      const rune = d && runeById[d.id];
      if (!rune || seen.has(d.id)) return false;
      seen.add(d.id);
      return typeof d.rev === "boolean" && (!d.rev || !!rune.reversed);
    });
  if (ok) draws = list.map((d) => ({ id: d.id, rev: d.rev }));
};

// ---------------------------------------------------------------- interpretation

const runeCardMarkup = (i, { clickable = false } = {}) => {
  const d = draws[i];
  const rune = runeById[d.id];
  const pos = spread().positions[i];
  return `
    <div class="rune-card${clickable ? " clickable" : ""}${d.rev ? " reversed" : ""}">
      <div class="rune-figure">${runeSvg(rune, { rev: d.rev, size: "card" })}</div>
      <div class="rune-info">
        <div class="rune-role">${pos.name}</div>
        <div class="rune-name">${rune.name} · ${rune.sound}${d.rev ? '<span class="rev-tag">Reversed</span>' : ""}</div>
        <div class="rune-sub">${rune.lore}</div>
        ${keywordsMarkup(rune)}
        <p class="rune-question">${pos.q}</p>
        <p class="rune-line">${meaningOf(rune, d.rev)}</p>
        <p class="rune-advice"><strong>Advice:</strong> ${rune.advice}</p>
      </div>
    </div>`;
};

const renderInterpretation = () => {
  const elem = document.getElementById("interpretation-view");
  if (!elem) return;
  const reversedCount = draws.filter((d) => d.rev).length;
  const note = !allowReversed
    ? ""
    : reversedCount === 0
      ? "All the runes fell upright."
      : `${reversedCount} of ${draws.length} ${reversedCount === 1 ? "rune fell" : "runes fell"} reversed. A reversed rune points to the shadow side of its meaning: a block, a delay or a lesson still to learn.`;

  elem.innerHTML =
    spread()
      .groups.map(
        (g) => `
    <div class="interpret-section">
      <h3>${g.title}</h3>
      <div class="interpret-row">${g.positions.map((i) => runeCardMarkup(i)).join("")}</div>
    </div>`,
      )
      .join("") +
    (note ? `<p class="interpret-note">${note}</p>` : "") +
    `<p class="interpret-note">Read the runes as a story in the order they were drawn, and let the position of each rune shape what it says to you. The reading is a mirror for your own judgment, not a verdict.</p>
    <p class="interpret-credit">${CREDIT_HTML}</p>`;
};

const toggleInterpretation = () => {
  if (!isComplete()) return;
  const view = document.getElementById("interpretation-view");
  if (!view) return;
  closeDetail();
  interpretMode = !interpretMode;
  if (interpretMode) {
    renderInterpretation();
    view.classList.add("open");
  } else {
    view.classList.remove("open");
  }
  renderBoard();
  renderInterpretBar();
};

// ---------------------------------------------------------------- detail panel

const CREDIT_HTML =
  "Rune names, sounds and the three aettir follow the traditional Elder Futhark. Meanings and advice were written for this app.";

const runeDetailMarkup = (i) => {
  const d = draws[i];
  const rune = runeById[d.id];
  const pos = spread().positions[i];
  const other = rune.reversed
    ? `<h4>${d.rev ? "When upright" : "When reversed"}</h4>
       <p class="position-meaning">${d.rev ? rune.upright : rune.reversed}</p>`
    : `<p class="detail-note">This rune looks the same upside down, so it has no reversed meaning.</p>`;
  return `
    <button type="button" class="detail-close" onclick="closeDetail()" aria-label="Close">&times;</button>
    <div class="detail-header">
      <div class="rune-figure">${runeSvg(rune, { rev: d.rev, size: "detail" })}</div>
      <div>
        <h3>${rune.name}${d.rev ? '<span class="rev-tag">Reversed</span>' : ""}</h3>
        <div class="detail-position">${rune.char} · “${rune.sound}” · ${rune.lore}</div>
        ${keywordsMarkup(rune)}
      </div>
    </div>
    <h4>${pos.name}</h4>
    <p class="position-meaning rune-question">${pos.q}</p>
    <h4>Meaning${d.rev ? " (reversed)" : rune.reversed ? " (upright)" : ""}</h4>
    <p class="position-meaning">${meaningOf(rune, d.rev)}</p>
    ${other}
    <h4>Advice</h4>
    <p class="fortune">${rune.advice}</p>
    <h4>Aett</h4>
    <p class="position-meaning">${AETTIR[rune.aett].name}: ${AETTIR[rune.aett].theme.toLowerCase()}.</p>
    <p class="detail-credit">${CREDIT_HTML}</p>`;
};

const showRuneDetail = (i) => {
  const panel = document.getElementById("card-detail");
  if (!panel || !draws[i]) return;
  if (window.event?.target?.closest?.(".rune-say")) return; // speaker, not the tile
  activeDetail = i;
  panel.innerHTML = runeDetailMarkup(i);
  document
    .querySelectorAll(".rune-tile.active")
    .forEach((el) => el.classList.remove("active"));
  document
    .querySelectorAll(`.rune-tile[data-i="${i}"]`)
    .forEach((el) => el.classList.add("active"));
  panel.classList.add("open");
  document.getElementById("detail-overlay")?.classList.add("open");
};

const closeDetail = () => {
  document.getElementById("card-detail")?.classList.remove("open");
  document.getElementById("detail-overlay")?.classList.remove("open");
  activeDetail = -1;
  document
    .querySelectorAll(".rune-tile.active")
    .forEach((el) => el.classList.remove("active"));
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDetail();
});

// Any click outside a rune tile or the panel dismisses the panel.
document.addEventListener("click", (e) => {
  if (!document.getElementById("card-detail")?.classList.contains("open"))
    return;
  if (e.target.closest(".rune-tile") || e.target.closest(".card-detail")) return;
  closeDetail();
});

// ---------------------------------------------------------------- init

const initRunes = () => {
  restoreState();
  renderAll();
};
