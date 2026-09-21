// Rune data -- the 24 runes of the Elder Futhark, in traditional order.
//
// The names, sounds and division into three aettir (families of eight) are
// the traditional ones. The keywords, meanings and advice below are original,
// concise wording written for this app.
//
// `path` draws the rune as SVG strokes in a 40 x 64 box (so the drawing does
// not depend on the visitor's fonts having a Runic glyph set). `reversed` is
// null for the nine runes that look the same upside down -- they cannot be
// drawn reversed.

const AETTIR = [
  { name: "Freyr's aett", theme: "Life, resources and human nature" },
  { name: "Heimdall's aett", theme: "Forces of fate, change and the natural world" },
  { name: "Tyr's aett", theme: "Society, spirit and the wider cycle" },
];

const runesData = [
  {
    id: "fehu",
    name: "Fehu",
    char: "ᚠ",
    sound: "f",
    aett: 0,
    lore: "Cattle, wealth",
    path: "M12 4V60M12 22L32 8M12 40L32 26",
    keywords: ["wealth", "energy", "reward", "new start"],
    upright:
      "Wealth in motion: income, energy and opportunity are flowing toward you. Resources are meant to be used and shared, so put what you have to work.",
    reversed:
      "Loss, stagnation or greed. Money or energy is leaking away, or is being hoarded until it goes stale. Look at what you are holding too tightly.",
    advice: "Circulate what you have; generosity keeps it alive.",
  },
  {
    id: "uruz",
    name: "Uruz",
    char: "ᚢ",
    sound: "u",
    aett: 0,
    lore: "Aurochs, the wild ox",
    path: "M10 60V4L30 22V60",
    keywords: ["strength", "health", "vitality", "raw will"],
    upright:
      "Raw strength and good health. A surge of vitality carries you through a hard task, and untamed potential is ready to be shaped into something.",
    reversed:
      "Weakness, missed chances or force misapplied. Energy is low, or is being spent in bursts with no direction. Rest and rebuild before you push.",
    advice: "Trust your stamina, then aim it.",
  },
  {
    id: "thurisaz",
    name: "Thurisaz",
    char: "ᚦ",
    sound: "th",
    aett: 0,
    lore: "Giant, thorn",
    path: "M12 4V60M12 16L30 32L12 48",
    keywords: ["defense", "conflict", "catalyst", "boundaries"],
    upright:
      "A thorn at the gate: a necessary conflict, a test, or a defensive boundary. Something forces you to stop and decide before you go further.",
    reversed:
      "Danger from acting rashly, or from a threat you have ignored. Anger or spite may be driving; guard against hasty decisions and needless fights.",
    advice: "Pause at the threshold and choose on purpose.",
  },
  {
    id: "ansuz",
    name: "Ansuz",
    char: "ᚨ",
    sound: "a",
    aett: 0,
    lore: "A god, the mouth",
    path: "M12 4V60M12 10L30 24M12 28L30 42",
    keywords: ["message", "wisdom", "speech", "inspiration"],
    upright:
      "A message arrives: advice, a teacher, a sudden insight or the right words at the right time. Listen carefully, and speak clearly.",
    reversed:
      "Miscommunication, bad advice or manipulation. Words are misheard, twisted or held back. Check the source before you act on what you are told.",
    advice: "Listen for the signal inside the noise.",
  },
  {
    id: "raidho",
    name: "Raidho",
    char: "ᚱ",
    sound: "r",
    aett: 0,
    lore: "Ride, journey",
    path: "M12 4V60M12 4L30 20L12 36M12 36L30 60",
    keywords: ["journey", "rhythm", "progress", "right action"],
    upright:
      "A journey, literal or inner, moving at the right pace. Plans, travel and decisions fall into a healthy rhythm when you keep to the road.",
    reversed:
      "Delays, disruption and a plan that will not hold. You may be stuck, or heading the wrong way at speed. Re-check the route.",
    advice: "Set your pace and keep moving.",
  },
  {
    id: "kaunan",
    name: "Kaunan",
    char: "ᚲ",
    sound: "k",
    aett: 0,
    lore: "Torch, also ulcer",
    path: "M28 12L12 32L28 52",
    keywords: ["light", "skill", "creativity", "fire"],
    upright:
      "A torch in the dark: knowledge, skill and creative fire. Something becomes clear, and you can see well enough to make or mend it.",
    reversed:
      "Darkness, fading energy or a creative block. A fire has burnt down, or an old wound is flaring up. Tend the source before you try to make more.",
    advice: "Carry the light to where it is needed.",
  },
  {
    id: "gebo",
    name: "Gebo",
    char: "ᚷ",
    sound: "g",
    aett: 0,
    lore: "Gift",
    path: "M8 12L32 52M32 12L8 52",
    keywords: ["gift", "partnership", "balance", "exchange"],
    upright:
      "A gift given and received in balance: partnership, generosity, a fair exchange. Bonds are strengthened both by giving and by accepting.",
    reversed: null,
    advice: "Give freely, and let yourself receive.",
  },
  {
    id: "wunjo",
    name: "Wunjo",
    char: "ᚹ",
    sound: "w",
    aett: 0,
    lore: "Joy",
    path: "M12 4V60M12 4L30 16L12 28",
    keywords: ["joy", "harmony", "belonging", "fulfilment"],
    upright:
      "Joy and harmony. You are at ease with the people around you and with your circumstances, and a long effort starts to pay off in contentment.",
    reversed:
      "Sorrow, alienation or strained ties. Something is out of tune with a group or with yourself, and you may be reaching for an easy pleasure to cover it.",
    advice: "Notice what is already going well.",
  },
  {
    id: "hagalaz",
    name: "Hagalaz",
    char: "ᚺ",
    sound: "h",
    aett: 1,
    lore: "Hail",
    path: "M10 4V60M30 4V60M10 24L30 40",
    keywords: ["disruption", "crisis", "loss of control", "clearing"],
    upright:
      "A sudden storm: an upheaval outside your control that clears the ground. It hurts, but what it destroys was not going to last.",
    reversed: null,
    advice: "Shelter, wait it out, and plan what to rebuild.",
  },
  {
    id: "nauthiz",
    name: "Nauthiz",
    char: "ᚾ",
    sound: "n",
    aett: 1,
    lore: "Need",
    path: "M20 4V60M11 24L29 40",
    keywords: ["need", "constraint", "endurance", "resourcefulness"],
    upright:
      "Need and constraint. A limit or a lack is pressing on you, and it also makes you resourceful. Patient friction is how a fire gets started.",
    reversed: null,
    advice: "Meet the real need first; the rest can wait.",
  },
  {
    id: "isa",
    name: "Isa",
    char: "ᛁ",
    sound: "i",
    aett: 1,
    lore: "Ice",
    path: "M20 4V60",
    keywords: ["stillness", "delay", "patience", "clarity"],
    upright:
      "Ice: a freeze, a pause or a standstill. Things are held in place, but the stillness keeps you clear-headed and lets you conserve your strength.",
    reversed: null,
    advice: "Do not force a thaw; use the pause.",
  },
  {
    id: "jera",
    name: "Jera",
    char: "ᛃ",
    sound: "j",
    aett: 1,
    lore: "Year, harvest",
    path: "M22 6L10 18L22 30M18 34L30 46L18 58",
    keywords: ["harvest", "cycles", "reward", "patience"],
    upright:
      "The turning of the year. What you planted earlier now ripens, and results arrive on nature's schedule, not on yours.",
    reversed: null,
    advice: "Trust the season you are in.",
  },
  {
    id: "eihwaz",
    name: "Eihwaz",
    char: "ᛇ",
    sound: "ei",
    aett: 1,
    lore: "Yew tree",
    path: "M20 4V60M20 4L32 16M20 60L8 48",
    keywords: ["endurance", "protection", "rebirth", "the axis"],
    upright:
      "The yew: endurance, protection, and the link between endings and rebirth. You are asked to stay steadfast through a hard passage.",
    reversed: null,
    advice: "Stand firm; deep roots make a long life.",
  },
  {
    id: "perthro",
    name: "Perthro",
    char: "ᛈ",
    sound: "p",
    aett: 1,
    lore: "Dice cup, the lot",
    path: "M12 4V60M12 4L30 12V52L12 60",
    keywords: ["fate", "mystery", "chance", "the hidden"],
    upright:
      "The cast of the lot: hidden matters, chance and fate come into play. Something not yet revealed may turn out to be a pleasant surprise.",
    reversed:
      "Stagnation or disappointment. Hidden things stay hidden, luck sours, or you are gambling on a hope. Avoid leaving the matter to chance.",
    advice: "Some things cannot be known; act on what you do know.",
  },
  {
    id: "algiz",
    name: "Algiz",
    char: "ᛉ",
    sound: "z",
    aett: 1,
    lore: "Elk, protection",
    path: "M20 4V60M20 34L6 12M20 34L34 12",
    keywords: ["protection", "guardian", "instinct", "connection"],
    upright:
      "Protection and connection: a guardian, a safe boundary, an alert instinct. You are shielded as long as you stay awake to danger and to opportunity.",
    reversed:
      "Vulnerability or a hidden danger. A defense is down, or a warning sign is being ignored. Beware of a false sense of safety.",
    advice: "Reach upward and stay alert.",
  },
  {
    id: "sowilo",
    name: "Sowilo",
    char: "ᛊ",
    sound: "s",
    aett: 1,
    lore: "Sun",
    path: "M28 4L12 22L28 38L12 58",
    keywords: ["success", "vitality", "victory", "guidance"],
    upright:
      "The sun: success, clarity and good energy. A path forward is lit, and effort turns into visible achievement.",
    reversed: null,
    advice: "Step into the light and follow it through.",
  },
  {
    id: "tiwaz",
    name: "Tiwaz",
    char: "ᛏ",
    sound: "t",
    aett: 2,
    lore: "Tyr, the warrior",
    path: "M20 60V4M6 22L20 4L34 22",
    keywords: ["justice", "courage", "sacrifice", "leadership"],
    upright:
      "Courage and justice. Stand for what is right, even at a personal cost. Leadership and a clear sense of purpose win the day.",
    reversed:
      "Failure of nerve or a lost cause. Injustice, bad-faith conflict, or a fight that has lost its purpose. Check that you are acting for the right reasons.",
    advice: "Choose the honorable course and follow it.",
  },
  {
    id: "berkano",
    name: "Berkano",
    char: "ᛒ",
    sound: "b",
    aett: 2,
    lore: "Birch",
    path: "M12 4V60M12 4L30 18L12 32L30 46L12 60",
    keywords: ["growth", "birth", "renewal", "nurture"],
    upright:
      "The birch: new growth, fertility and nurture. A project, a family or your own health can begin again, gently and with care.",
    reversed:
      "Stalled growth or trouble at home. Something needs tending and is not getting it. Anxiety or neglect stunts a fresh start.",
    advice: "Tend it patiently.",
  },
  {
    id: "ehwaz",
    name: "Ehwaz",
    char: "ᛖ",
    sound: "e",
    aett: 2,
    lore: "Horse",
    path: "M8 60V4L20 22L32 4V60",
    keywords: ["movement", "trust", "partnership", "progress"],
    upright:
      "The horse: steady progress made through trust and teamwork. A change of place or situation goes well when partners move in step.",
    reversed:
      "Restlessness, mistrust or a poor fit. A partnership is out of step, or you are in a hurry to leave before you are ready.",
    advice: "Move together with those you trust.",
  },
  {
    id: "mannaz",
    name: "Mannaz",
    char: "ᛗ",
    sound: "m",
    aett: 2,
    lore: "Human being",
    path: "M10 4V60M30 4V60M10 4L30 28M30 4L10 28",
    keywords: ["self", "community", "cooperation", "intellect"],
    upright:
      "The human being and your place among others. Cooperation, self-knowledge and a helpful community support you. Ask for help, and offer it.",
    reversed:
      "Isolation, or being at odds with others. Self-deceit, rivalry or cynicism cut you off, and you may expect help without offering any.",
    advice: "You are one of many; cooperate.",
  },
  {
    id: "laguz",
    name: "Laguz",
    char: "ᛚ",
    sound: "l",
    aett: 2,
    lore: "Water, lake",
    path: "M12 4V60M12 4L30 22",
    keywords: ["flow", "intuition", "dreams", "the unconscious"],
    upright:
      "Water: intuition, dreams and emotion. Go with the flow and trust what you feel, while staying aware of what lies beneath the surface.",
    reversed:
      "Confusion, fear or stagnant emotion. Judgment is clouded, and you may be swept along or avoiding something. Check your intuition against the facts.",
    advice: "Follow the current, but know where the banks are.",
  },
  {
    id: "ingwaz",
    name: "Ingwaz",
    char: "ᛜ",
    sound: "ng",
    aett: 2,
    lore: "Ing, the seed",
    path: "M20 12L34 32L20 52L6 32Z",
    keywords: ["potential", "gestation", "completion", "rest"],
    upright:
      "A seed at rest: gestation, inner growth and a phase coming to completion. Energy gathers quietly before it is released. Let it build.",
    reversed: null,
    advice: "Let it ripen before you act.",
  },
  {
    id: "dagaz",
    name: "Dagaz",
    char: "ᛞ",
    sound: "d",
    aett: 2,
    lore: "Day",
    path: "M8 12V52L32 12V52Z",
    keywords: ["breakthrough", "awakening", "transformation", "hope"],
    upright:
      "Daybreak: a breakthrough, a change of perspective and a sense of hope. What was hidden is seen in the light.",
    reversed: null,
    advice: "Take the clarity and act on it.",
  },
  {
    id: "othala",
    name: "Othala",
    char: "ᛟ",
    sound: "o",
    aett: 2,
    lore: "Heritage, estate",
    path: "M20 4L32 20L20 36L8 20ZM14 28L6 58M26 28L34 58",
    keywords: ["home", "heritage", "ancestors", "roots"],
    upright:
      "Heritage: home, family, property and what has come down to you. Roots and shared values give you a base to stand on.",
    reversed:
      "Loss of home or roots. Inherited habits, prejudices or family quarrels hold you back. It may be time to let go of a tradition that no longer serves you.",
    advice: "Honor your roots without being bound by them.",
  },
];

// Spreads. `positions` are listed in drawing order; `col` / `row` place each
// position on the board grid (1-based). `groups` lists which positions are
// read together in the interpretation view.
const SPREADS = {
  single: {
    name: "Odin's Rune",
    short: "1 rune",
    tagline:
      "Draw one rune from the bag for a quick answer, or a theme for the day. Odin gave up an eye for the runes, and a single one is often enough.",
    cols: 1,
    positions: [
      { name: "The message", q: "What do you most need to know right now?", col: 1, row: 1 },
    ],
    groups: [{ title: "Your Rune", positions: [0] }],
  },
  three: {
    name: "The Three Norns",
    short: "3 runes",
    tagline:
      "Three runes for the three Norns who tend the well of fate: Urd (what has been), Verdandi (what is) and Skuld (what is becoming).",
    cols: 3,
    positions: [
      { name: "Past · Urd", q: "What has led up to this?", col: 1, row: 1 },
      { name: "Present · Verdandi", q: "What is the heart of the matter now?", col: 2, row: 1 },
      { name: "Future · Skuld", q: "What is taking shape?", col: 3, row: 1 },
    ],
    groups: [{ title: "Past, Present and Future", positions: [0, 1, 2] }],
  },
  cross: {
    name: "The Five-Rune Cross",
    short: "5 runes",
    tagline:
      "Five runes laid out as a cross: the situation at the center, what lies behind and ahead of it, guidance from above and the hidden influence below.",
    cols: 3,
    positions: [
      { name: "The situation", q: "What is the matter at hand?", col: 2, row: 2 },
      { name: "Behind you", q: "What influence is fading or has shaped this?", col: 1, row: 2 },
      { name: "Ahead of you", q: "What is coming toward you?", col: 3, row: 2 },
      { name: "Guidance", q: "What counsel is offered?", col: 2, row: 1 },
      { name: "The hidden", q: "What lies beneath, unseen or unspoken?", col: 2, row: 3 },
    ],
    groups: [{ title: "Reading the Cross", positions: [0, 1, 2, 3, 4] }],
  },
  nine: {
    name: "Odin's Nine",
    short: "9 runes",
    tagline:
      "Nine runes, for the nine worlds: three rows of three for the past, the present and the future, from deep roots to the likely outcome.",
    cols: 3,
    positions: [
      { name: "The root", q: "Where does this begin?", col: 1, row: 1 },
      { name: "Fading influence", q: "What is passing away?", col: 2, row: 1 },
      { name: "Recent event", q: "What has just happened?", col: 3, row: 1 },
      { name: "The situation", q: "What is the matter now?", col: 1, row: 2 },
      { name: "The challenge", q: "What stands in the way?", col: 2, row: 2 },
      { name: "The hidden", q: "What is not yet seen?", col: 3, row: 2 },
      { name: "Near future", q: "What is approaching?", col: 1, row: 3 },
      { name: "Guidance", q: "How best to act?", col: 2, row: 3 },
      { name: "Outcome", q: "Where does this lead?", col: 3, row: 3 },
    ],
    groups: [
      { title: "The Past", positions: [0, 1, 2] },
      { title: "The Present", positions: [3, 4, 5] },
      { title: "The Future", positions: [6, 7, 8] },
    ],
  },
};
