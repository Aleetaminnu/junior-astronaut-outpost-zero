const STAGES = [
  {
    name: "Landing Camp",
    power: 6, maxDays: 5,
    goal: "Keep air above 40 and shield above 50 for 3 days in a row.",
    ok: s => s.air > 40 && s.shield > 50,
    done: s => s.streak >= 3,
    unlocked: "Greenhouse",
    learn: "Real crews always protect air and radiation shielding before anything else."
  },
  {
    name: "Base Camp",
    power: 8, maxDays: 6,
    goal: "Keep air and food above 40 and shield above 50 for 3 days in a row.",
    ok: s => s.air > 40 && s.food > 40 && s.shield > 50,
    done: s => s.streak >= 3,
    unlocked: "Science Lab",
    learn: "Growing food uses power and water, so planners think about it years ahead."
  },
  {
    name: "Science Outpost",
    power: 10, maxDays: 9,
    goal: "Collect 60 science points, and also keep air and food above 40 and shield above 50 for 3 days in a row.",
    ok: s => s.air > 40 && s.food > 40 && s.shield > 50,
    done: s => s.science >= 60 && s.streak >= 3 && s.health >= 60,
    scienceGoal: 60,
    unlocked: "Mars Outpost (Mars days are called sols)",
    learn: "Real crews have to balance life support and science every single day."
  },
  {
    name: "Mars Outpost",
    power: 10, maxDays: 10,
    goal: "Collect 70 science points, and also keep air and food above 40 and shield above 50 for 3 days in a row.",
    ok: s => s.air > 40 && s.food > 40 && s.shield > 50,
    done: s => s.science >= 70 && s.streak >= 3 && s.health >= 60,
    scienceGoal: 70,
    unlocked: "",
    learn: ""
  }
];

function dayWord() {
  return state.stage >= 3 ? "Sol" : "Day";
}

function currentSite() {
  return state.stage >= 3 ? "mars" : "moon";
}

const EVENT_POOL = [
  {
    title: "Big solar flare", minStage: 0,
    text: "A flare is on its way. Fast particles can reach the base.",
    source: "NASA DONKI / NOAA: X9.0 flare on 3 Oct 2024, the strongest of Solar Cycle 25 at that time.",
    a: { label: "Everyone shelters inside", note: "Safe, but lab work stops.", fx: { science: -10, shield: -6 } },
    b: { label: "Keep working", note: "More science, but the crew gets dosed.", fx: { storm: 40, science: 10 } }
  },
  {
    title: "Radio blackout", minStage: 0,
    text: "A geomagnetic storm is scrambling the radio.",
    source: "NASA DONKI archive: G5 storm, 10-11 May 2024.",
    a: { label: "Use the backup radio", note: "Costs 2 power today.", fx: { power: -2 } },
    b: { label: "Wait it out", note: "Saves power, but the stale air builds up.", fx: { science: -8, air: -5 } }
  },
  {
    title: "Radiation spike", minStage: 0,
    text: "The radiation monitor is reading higher than normal.",
    source: "NASA JPL: a Sept 2017 solar storm gave Mars surface radiation more than double anything Curiosity's RAD had measured before.",
    a: { label: "Boost the shield", note: "Costs 1 power today.", fx: { shield: 15, power: -1 } },
    b: { label: "Risk it", note: "1 extra power, but radiation gets through.", fx: { storm: 30, power: 1 } }
  },
  {
    title: "Lunar night is coming", minStage: 0, site: "moon",
    text: "The Sun is setting. Solar panels make less power in the dark.",
    source: "Real fact: much of the Moon has about 14 Earth days of night at a time.",
    a: { label: "Run on batteries", note: "Lose 3 power today.", fx: { power: -3, shield: 5 } },
    b: { label: "Dim the lights", note: "Lose 1 power, air gets stale.", fx: { power: -1, air: -6, science: -8 } }
  },
  {
    title: "Computer glitch", minStage: 0,
    text: "The base computer froze.",
    source: "",
    a: { label: "Ask Earth for help", note: "The radio delay is about 1.3 seconds, but you lose some time.", fx: { science: -5 },
         noteMars: "The radio delay is 4 to 24 minutes each way. You lose a lot of time!", fxMars: { science: -20, food: -3 } },
    b: { label: "Fix it yourself", note: "Faster, but you might break something.", fx: { air: -8, food: -5 } }
  },
  {
    title: "Plants are blooming", minStage: 1,
    text: "The greenhouse crop is ready early.",
    source: "",
    a: { label: "Harvest now", note: "Dinner sorted.", fx: { food: 18 } },
    b: { label: "Study the plants", note: "Good science, not much food.", fx: { science: 20, food: 5 } }
  },
  {
    title: "Dust storm on Mars", minStage: 3, site: "mars",
    text: "Dust in the sky is blocking the Sun. Solar panels make much less power.",
    source: "Real fact: Opportunity fell silent in June 2018 when a global dust storm blocked its solar power.",
    a: { label: "Sweep the panels", note: "Costs 2 power today and some lab time.", fx: { power: -2, science: -10 } },
    b: { label: "Hunker down", note: "Lose 3 power, and the plants get less light.", fx: { power: -3, food: -5 } }
  },
  {
    title: "Airlock leak", minStage: 0,
    text: "A small crack is letting air out.",
    source: "",
    a: { label: "Patch it", note: "Costs 1 power and a little air.", fx: { power: -1, air: -3 } },
    b: { label: "Ignore it", note: "Saves power, but air escapes.", fx: { air: -16 } }
  }
];

let lastEvent = null;

function optionFx(o) { return (currentSite() === "mars" && o.fxMars) ? o.fxMars : o.fx; }
function optionNote(o) { return (currentSite() === "mars" && o.noteMars) ? o.noteMars : o.note; }

function pickEvent() {
  if (state.day < 2 || Math.random() > DIFFICULTY[state.difficulty].event) return null;
  const pool = EVENT_POOL.filter(e => e.minStage <= state.stage && (!e.site || e.site === currentSite()) && e !== lastEvent);
  lastEvent = pool[Math.floor(Math.random() * pool.length)];
  return lastEvent;
}

function earthAdvice() {
  const meters = [["air", "Habitat"], ["shield", "Supply Depot"]];
  if (state.stage >= 1) meters.push(["food", "Greenhouse"]);
  meters.sort((a, b) => state[a[0]] - state[b[0]]);
  const low = meters[0];
  return "Earth says: your " + low[0] + " is lowest, so try the " + low[1] + "." +
    (currentSite() === "mars" ? "" : " On Mars this reply could take 8 to 48 minutes!");
}

let dayStart = { science: 0, health: 100 };

function dayComment(report) {
  const st = STAGES[state.stage];
  const gained = state.science - dayStart.science;
  const lines = [];

  if (state.health >= 90 && state.air >= 40) {
    lines.push("Great work! The crew is healthy and safe.");
  } else if (state.health >= 60) {
    lines.push("The crew is okay, but watch the low meters.");
  } else {
    lines.push("The crew is struggling. Look after them first tomorrow.");
  }

  if (st.scienceGoal) {
    lines.push("Science today: +" + gained + " (" + state.science + " / " + st.scienceGoal + " for this stage).");
    lines.push(st.ok(state) ? "Good day for the crew: " + state.streak + " / 3 in a row." : "The crew's needs weren't all met today, so the streak starts again.");
    if (gained === 0) lines.push("Tip: once the crew is safe, use spare power in the Science Lab.");
  } else {
    lines.push(st.ok(state)
      ? "Good day! Objective progress: " + state.streak + " / 3 days in a row."
      : "Objective not met today, so the streak starts again. " + st.goal);
  }

  const low = [["air", "Habitat"], ["food", "Greenhouse"], ["shield", "Supply Depot"]]
    .filter(m => (m[0] !== "food" || state.stage >= 1) && state[m[0]] < 35)
    .sort((a, b) => state[a[0]] - state[b[0]])[0];
  if (low) lines.push("Your " + low[0] + " is low. Visit the " + low[1] + " early tomorrow.");

  lines.push(report);
  return lines.join("\n");
}

const CAUSES = {
  radiation: ["Radiation did the most damage. A stronger shield on more days would have helped.",
              "Real agencies track each astronaut's radiation dose and set career limits."],
  storm: ["Space storms did the most damage. Sheltering during a flare, or having a strong shield, protects the crew.",
          "Real crews move to the most shielded part of their ship when a flare is expected."],
  air: ["The air ran low. Life support has to come first.",
        "On a real mission, science only starts after the crew's air and water are safe."],
  food: ["Food ran low. Plants can't be rushed, so the greenhouse needs steady power.",
         "Growing food in space takes power, water and lots of patience."]
};

function explainFailure(dead) {
  let top = "radiation";
  for (const k in state.damage) {
    if (state.damage[k] > state.damage[top]) top = k;
  }
  const intro = dead
    ? "The crew got too weak and needed a rescue."
    : "You ran out of days before reaching the goal.";
  const pick = state.damage[top] === 0
    ? ["Try giving the goal more of your power each day.", ""]
    : CAUSES[top];
  return intro + "\n\n" + pick[0] + "\n\n" + pick[1] + "\n\nNobody gets this right the first time. NASA practices on the ground too!";
}

const HELP_SHORT =
  "Run a Moon and Mars outpost with only a little power each day.\n\n" +
  "1. Move with the joystick or keys, or tap a building.\n" +
  "2. Press USE next to it. Every building costs power.\n" +
  "3. Press END DAY. Keep the crew alive and finish each stage's goal!";

const HELP_TEXT =
  "Goal: finish three stages. Each stage opens a new part of the base.\n\n" +
  "1. Move with the joystick, arrow keys or WASD. Or tap a building and the astronaut walks there (you still press USE yourself).\n" +
  "   The MAP button (or the M key) shows the whole base.\n" +
  "2. Next to a building, press E, Space or the big USE button.\n" +
  "3. Power is limited each day. Every building uses some, so you can't do everything!\n" +
  "4. Press END DAY when you're done. Overnight, air, food and shield go down.\n\n" +
  "Habitat = air. Greenhouse = food. Supply Depot = shield (blocks radiation). " +
  "Science Lab = points. Power Array = call Earth for advice (the radio has a delay).\n\n" +
  "Dark areas are locked until you finish the stage.\n\n" +
  "Buttons at the top turn sound on or off and make the text bigger.\n\n" +
  "Data: the storm events are based on real flares and storms in NASA's DONKI archive. " +
  "Radiation: the Moon's surface is about 1.37 mSv a day (Chang'e 4 lander) and Mars' is about 0.67 mSv a day (Curiosity's RAD). " +
  "Power, air and food are simplified.";

function saveProgress(i) {
  try { localStorage.setItem("outpostStage", String(i)); } catch (e) { }
}
function loadProgress() {
  try { return parseInt(localStorage.getItem("outpostStage"), 10) || 0; } catch (e) { return 0; }
}
function clearProgress() {
  try { localStorage.removeItem("outpostStage"); } catch (e) { }
}

const FACTS = {
  HABITAT: "On the ISS, air and water are recycled as much as possible because resupply is expensive.",
  GREENHOUSE: "Astronauts on the ISS have already grown lettuce and chili peppers.",
  "SUPPLY DEPOT": "Piling moon soil (regolith) over a habitat is one idea for blocking radiation.",
  "SCIENCE LAB": "Real experiments share power with life support, so science has to wait its turn."
};

function saveDifficulty(d) {
  try { localStorage.setItem("outpostDifficulty", d); } catch (e) { }
}
function loadDifficulty() {
  try {
    const d = localStorage.getItem("outpostDifficulty");
    return DIFFICULTY[d] ? d : "normal";
  } catch (e) { return "normal"; }
}

const BADGES = [
  { id: "air", name: "Air Keeper", text: "Air never dropped below 25.", test: s => s.minAir >= 25 },
  { id: "food", name: "Green Thumb", text: "Food never dropped below 25.", test: s => s.minFood >= 25 },
  { id: "shield", name: "Shield Master", text: "Shield never dropped below 30.", test: s => s.minShield >= 30 },
  { id: "shelter", name: "Storm Shelter", text: "You sheltered from a solar flare.", test: s => s.sheltered > 0 },
  { id: "radio", name: "Radio Operator", text: "You called Earth 3 times.", test: s => s.calls >= 3 },
  { id: "scientist", name: "Scientist", text: "You earned 200 science points in total.", test: s => s.scienceEarned >= 200 },
  { id: "firsttry", name: "First Try", text: "You finished every stage without a retry.", test: s => s.retries === 0 },
  { id: "hero", name: "Mission Hero", text: "You finished on Hard.", test: s => state.difficulty === "hard" }
];

function savedBadges() {
  try { return (localStorage.getItem("outpostBadges") || "").split(",").filter(x => x); } catch (e) { return []; }
}

function missionReportHtml() {
  const s = state.stats;
  const before = savedBadges();
  const earned = BADGES.filter(b => b.test(s));
  try { localStorage.setItem("outpostBadges", Array.from(new Set(before.concat(earned.map(b => b.id)))).join(",")); } catch (e) { }

  let h = '<div class="legend-row">You played <b style="width:auto;padding:0 6px;border-radius:10px">' + s.days + '</b> days on ' +
    DIFFICULTY[state.difficulty].label + '.</div>' +
    '<div class="legend-row">Power spent on staying alive: <b style="width:auto;padding:0 6px;border-radius:10px">' + s.spentLife +
    '</b> and on science: <b style="width:auto;padding:0 6px;border-radius:10px">' + s.spentScience + '</b>. That is the trade-off real planners face!</div>';
  h += earned.length ? '<p><b>Badges earned</b></p>' : '<p>No badges this time. Try again and aim for a few!</p>';
  earned.forEach(b => {
    h += '<div class="badge"><b>' + b.name + '</b>' + (before.indexOf(b.id) < 0 ? ' (NEW)' : '') + ': ' + b.text + '</div>';
  });
  return h;
}