// Speaking the rune names, shared by the reading page and the about page.
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
  if (!canSpeak) return;
  const u = new SpeechSynthesisUtterance(SAY[id] || id);
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
