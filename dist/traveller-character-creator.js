const D = ["STR", "DEX", "END", "INT", "EDU", "SOC"], O = [
  "STR",
  "DEX",
  "END",
  "INT",
  "EDU",
  "SOC",
  "CHA",
  "TER",
  "PSI",
  "WLT",
  "LCK",
  "MRL",
  "STY",
  "RES",
  "FOL",
  "REP"
];
function y() {
  return {
    name: "",
    homeworld: "",
    homeworld_uwp: "",
    species_id: "imperial_human",
    society_id: "third_imperium",
    characteristics: { STR: 0, DEX: 0, END: 0, INT: 0, EDU: 0, SOC: 0 },
    age: 18,
    skills: [],
    current_term: null,
    completed_careers: [],
    term_history: [],
    total_terms: 0,
    pre_career_terms: 0,
    credits: 0,
    medical_debt: 0,
    ship_shares: 0,
    pension_per_year: 0,
    equipment: [],
    associates: [],
    traits: [],
    pending_benefit_rolls: 0,
    cash_rolls_used: 0,
    dm_next_advancement: 0,
    dm_permanent_advancement: 0,
    dm_next_qualification: 0,
    dm_next_benefit: 0,
    dm_next_survival: 0,
    dm_next_events: 0,
    failed_qualifications_this_term: 0,
    pending_life_event_choice: null,
    pending_injury_choice: null,
    pending_injury_treatment_choice: null,
    pending_career_mishap_choice: null,
    pending_career_event_choice: null,
    pending_muster_benefit_choice: null,
    tas_member: !1,
    pre_career_status: {},
    pre_career_permanent_dms: {},
    gender: null,
    clan_shares: 0,
    aslan_setup_status: null,
    kkree_wives: 0,
    kkree_family_members: [],
    kkree_soc_rank_degree: "servant_of_rankholder",
    kkree_specialist_area: null,
    solsec_monitor: !1,
    solsec_monitor_rank: 0,
    user_notes: "",
    boon_rolls_total: 0,
    boon_rolls_remaining: 0,
    extra_characteristics: {},
    reputation: 0,
    psi: 0,
    psi_tested: !1,
    psi_trained_talents: [],
    forbidden_skills: [],
    career_package_id: null,
    career_package_taken: !1,
    droyne_caste: null,
    droyne_caste_number: 0,
    droyne_caste_mods_applied: !1,
    hiver_nest_type: null,
    hiver_senior_bonus_awarded: !1,
    hiver_manipulator_bonus_awarded: !1,
    capsule_description: "",
    pre_outcast_soc: 0,
    force_career_end: !1,
    ejected_by_event: !1,
    character_type: "biological",
    robot_config: null,
    phase: "characteristics",
    notes: [],
    dead: !1,
    death_reason: null
  };
}
function u(a) {
  return structuredClone(a);
}
function g(a, e) {
  return e in a.characteristics ? Number(a.characteristics[e] ?? 0) : Number(a.extra_characteristics[e] ?? 0);
}
function h(a, e, t) {
  const r = Math.max(0, Math.trunc(t));
  e in a.characteristics ? a.characteristics[e] = r : a.extra_characteristics[e] = r;
}
function d(a, e, t = 0, r = null, i = !1) {
  if (a.forbidden_skills.includes(e) || r && a.forbidden_skills.includes(`${e} (${r})`))
    return `Skipped ${m(e, r)} (forbidden by species)`;
  const s = a.skills.find((n) => n.name === e && (n.speciality ?? null) === r);
  if (s)
    return t === 0 ? `Already has ${m(e, r)} ${s.level}` : i ? t > s.level ? (s.level = Math.min(t, 4), b(a.skills), `Increased ${m(e, r)} to ${s.level}`) : `${m(e, r)} unchanged (already ${s.level})` : (s.level = Math.min(s.level + t, 4), b(a.skills), `Increased ${m(e, r)} to ${s.level}`);
  const c = Math.max(0, t);
  return a.skills.push({ name: e, level: c, speciality: r }), r && c >= 1 && !a.skills.some((n) => n.name === e && !n.speciality) && a.skills.push({ name: e, level: 0, speciality: null }), b(a.skills), `Gained ${m(e, r)} ${c}`;
}
function m(a, e) {
  return `${a}${e ? ` (${e})` : ""}`;
}
function b(a) {
  a.sort((e, t) => `${e.name.toLowerCase()}\0${e.speciality ?? ""}`.localeCompare(`${t.name.toLowerCase()}\0${t.speciality ?? ""}`));
}
class N {
  constructor(e = []) {
    this.forced = [...e];
  }
  setForcedRolls(e) {
    this.forced = [...e];
  }
  clearForcedRolls() {
    this.forced = [];
  }
  d6() {
    return this.rollDie(6);
  }
  d3() {
    return Math.ceil(this.d6() / 2);
  }
  roll2D(e = 0) {
    if (this.forced.length) {
      const i = this.forced.shift() ?? 0;
      return { dice: [], natural: i, total: i + e, dm: e };
    }
    const t = [this.d6(), this.d6()], r = t[0] + t[1];
    return { dice: t, natural: r, total: r + e, dm: e };
  }
  rollCharacteristic(e = !1) {
    if (!e) return this.roll2D();
    if (this.forced.length) return this.roll2D();
    const t = [this.d6(), this.d6(), this.d6()].sort((i, s) => s - i), r = t.slice(0, 2);
    return { dice: t, natural: r[0] + r[1], total: r[0] + r[1], dm: 0 };
  }
  rollDie(e) {
    return Math.floor(Math.random() * e) + 1;
  }
}
function j(a) {
  return a <= 0 ? -3 : a <= 2 ? -2 : Math.floor(a / 3) - 2;
}
class R {
  constructor(e, t = new N()) {
    this.rules = e, this.roller = t;
  }
  freshCharacter() {
    return y();
  }
  rollInitialCharacteristics(e, t = !1) {
    const r = u(e), i = {}, s = /* @__PURE__ */ new Set();
    if (t) {
      const c = D.map((n) => ({ stat: n, roll: this.roller.roll2D() }));
      c.sort((n, o) => o.roll.total - n.roll.total), s.add(c[0].stat), s.add(c[1].stat);
    }
    for (const c of D) {
      const n = this.roller.rollCharacteristic(t && s.has(c));
      r.characteristics[c] = n.total, i[c] = n;
    }
    return r.phase = "society", r.notes.push("Rolled initial characteristics."), { rolls: i, character: r };
  }
  rollExtraCharacteristics(e, t, r = !1) {
    const i = u(e), s = {};
    for (const c of t) {
      const n = this.roller.rollCharacteristic(r);
      h(i, c, n.total), c === "PSI" && (i.psi = n.total), s[c] = n;
    }
    return i.notes.push(`Rolled extra characteristics: ${t.join(", ")}.`), { rolls: s, character: i };
  }
  chooseSociety(e, t) {
    const r = u(e);
    return r.society_id = t, r.phase = "species", r.notes.push(`Society of origin: ${t}.`), { character: r };
  }
  applySpecies(e, t) {
    const r = this.rules.species(t);
    if (!r) throw new Error(`Unknown species: ${t}`);
    const i = u(e);
    i.species_id = t;
    for (const [s, c] of Object.entries(r.characteristic_modifiers ?? {}))
      h(i, s, g(i, s) + Number(c));
    if (r.starting_age && (i.age = Number(r.starting_age)), r.uses_cha) {
      const s = this.roller.d6() + 2;
      h(i, "CHA", s), i.characteristics.SOC = 0;
    }
    if (r.extra_characteristics_required)
      for (const s of r.extra_characteristics_required)
        g(i, s) || h(i, s, this.roller.roll2D().total);
    return i.forbidden_skills = [...r.forbidden_skills ?? []], i.traits = [...r.traits ?? []], t.includes("aslan") ? (i.phase = "aslan_setup", i.aslan_setup_status = { phase: "gender" }) : r.psionic_training_at_start || t.includes("zhodani") && i.characteristics.SOC >= 10 ? i.phase = "zhodani_training" : i.phase = "background", i.notes.push(`Applied species: ${r.name ?? t}.`), { species: r, character: i };
  }
  applyBackgroundSkills(e, t) {
    const r = u(e), i = Math.max(0, 3 + j(r.characteristics.EDU));
    for (const s of t.slice(0, i)) {
      const [c, n] = S(s);
      d(r, c, 0, n);
    }
    return r.phase = "pre_career", r.notes.push(`Chose ${Math.min(t.length, i)} background skills.`), { allowed: i, chosen: t.slice(0, i), character: r };
  }
  applyBackgroundPackage(e, t, r = {}) {
    const s = (this.rules.table("background_packages").packages ?? this.rules.table("background_packages"))[t];
    if (!s) throw new Error(`Unknown background package: ${t}`);
    const c = u(e);
    for (const [n, o] of Object.entries(s.characteristic_modifiers ?? s.stat_mods ?? {}))
      h(c, n, g(c, n) + Number(o));
    for (const n of s.skills ?? []) {
      const o = typeof n == "string" ? n : `${n.name}${n.speciality ? ` (${n.speciality})` : ""}`, l = r[o] ?? n;
      if (typeof l == "string") {
        const [v, T, $] = x(l);
        d(c, v, $ === 1 && !/\d+$/.test(l.trim()) ? 0 : $, T);
      } else
        d(c, l.name, Number(l.level ?? 0), l.speciality ?? null);
    }
    c.credits += Number(s.credits ?? 0);
    for (const n of s.equipment ?? []) c.equipment.push({ name: String(n), quantity: 1, notes: null });
    return c.age = Math.max(c.age, 22), c.phase = "career", c.notes.push(`Applied background package: ${s.name ?? t}.`), { package: s, character: c };
  }
  applyCareerPackage(e, t) {
    const r = this.rules.table("career_packages"), s = (Array.isArray(r == null ? void 0 : r.packages) ? r.packages : Array.isArray(r) ? r : Object.values(r.packages ?? r)).find((n) => n.id === t);
    if (!s) throw new Error(`Unknown career package: ${t}`);
    const c = u(e);
    for (const [n, o] of Object.entries(s.characteristic_modifiers ?? s.characteristics ?? s.stat_mods ?? {}))
      h(c, n, g(c, n) + Number(o));
    for (const n of s.skills ?? [])
      if (typeof n == "string") {
        const [o, l, v] = x(n);
        d(c, o, v, l);
      } else
        d(c, n.name, Number(n.level ?? 0), n.speciality ?? null, !0);
    c.credits += Number(s.credits ?? 0);
    for (const n of s.equipment ?? []) c.equipment.push({ name: String(n), quantity: 1, notes: null });
    for (let n = 0; n < Number(s.contacts ?? 0); n++) c.associates.push({ kind: "contact", description: s.contact_description ?? "career package contact" });
    for (let n = 0; n < Number(s.allies ?? 0); n++) c.associates.push({ kind: "ally", description: s.ally_description ?? "career package ally" });
    return c.age += this.roller.d3(), c.career_package_id = t, c.career_package_taken = !0, c.completed_careers.push({
      career_id: t,
      assignment_id: "career_package",
      terms_served: 1,
      final_rank: Number(s.rank ?? 0),
      final_rank_title: s.rank_title ?? null,
      commissioned: !1,
      left_due_to: "career_package",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 0
    }), c.phase = "skill_package", c.notes.push(`Applied career package: ${s.name ?? t}.`), { package: s, character: c };
  }
  applySkillPackage(e, t) {
    const i = (this.rules.table("skill_packages").packages ?? this.rules.table("skill_packages"))[t];
    if (!i) throw new Error(`Unknown skill package: ${t}`);
    const s = u(e);
    for (const c of i.skills ?? []) {
      const [n, o] = S(c);
      d(s, n, 1, o);
    }
    return s.phase = "done", s.notes.push(`Applied skill package: ${i.name ?? t}.`), { package: i, character: s };
  }
  skipPreCareer(e) {
    const t = u(e);
    return t.phase = "career", t.notes.push("Skipped pre-career education."), { character: t };
  }
  qualifyForCareer() {
    throw new Error("Full career qualification is not ported yet. Use career packages until the parity career loop is implemented.");
  }
  startTerm() {
    throw new Error("Term-by-term career creation is not ported yet. Use career packages until the parity career loop is implemented.");
  }
  survivalRoll() {
    throw new Error("Career survival rolls are not ported yet. Use career packages until the parity career loop is implemented.");
  }
  eventRoll() {
    throw new Error("Career event rolls are not ported yet. Use career packages until the parity event handlers are implemented.");
  }
  mishapRoll() {
    throw new Error("Career mishap rolls are not ported yet. Use career packages until the parity mishap handlers are implemented.");
  }
  advancementRoll() {
    throw new Error("Career advancement rolls are not ported yet. Use career packages until the parity career loop is implemented.");
  }
  musterOutRoll() {
    throw new Error("Mustering out is not ported yet. Career package cash, equipment, contacts, and allies are applied directly.");
  }
  finalizeRobot(e) {
    const t = y();
    return t.character_type = "robot", t.robot_config = e, t.name = String(e.name ?? "Traveller Robot"), t.age = 0, t.characteristics = {
      STR: Number(e.STR ?? 0),
      DEX: Number(e.DEX ?? 0),
      END: Number(e.END ?? 0),
      INT: Number(e.INT ?? 0),
      EDU: Number(e.EDU ?? 0),
      SOC: 0
    }, t.phase = "done", t.notes.push("Created robot placeholder from supplied robot configuration."), { character: t };
  }
  generateNpc() {
    let e = y();
    return e.name = "Generated Traveller", e = this.rollInitialCharacteristics(e).character, e = this.chooseSociety(e, "third_imperium").character, e = this.applySpecies(e, "imperial_human").character, e = this.applyBackgroundSkills(e, ["Admin", "Streetwise", "Vacc Suit"]).character, e = this.applyCareerPackage(e, "scout").character, e.phase = "done", { character: e };
  }
}
function S(a) {
  const e = a.match(/^(.+?)\s*\((.+)\)\s*$/);
  return e ? [e[1].trim(), e[2].trim()] : [a.trim(), null];
}
function x(a) {
  const e = a.trim(), t = e.match(/\s+(\d+)$/), r = t ? Number(t[1]) : 1, i = t ? e.slice(0, t.index).trim() : e, [s, c] = S(i);
  return [s, c, r];
}
const L = [
  "aging",
  "aslan_background",
  "aslan_life_events",
  "asim_life_events",
  "background_packages",
  "background_skills",
  "career_packages",
  "droyne_life_events",
  "drinax_palace_life_events",
  "drinax_wasteland_life_events",
  "education",
  "hiver_life_events",
  "injury",
  "kkree_life_events",
  "life_events",
  "mustering_benefits",
  "psionics",
  "skill_packages",
  "skills",
  "societies",
  "solomani_life_events",
  "vargr_extents_life_events",
  "zhodani_life_events"
];
class P {
  constructor(e) {
    this.bundle = e;
  }
  get catalog() {
    return this.bundle.catalog;
  }
  species(e) {
    return this.bundle.species[e];
  }
  speciesList() {
    return Object.values(this.bundle.species).sort((e, t) => String(e.name).localeCompare(String(t.name)));
  }
  career(e) {
    return this.bundle.careers[e];
  }
  careerList() {
    return Object.values(this.bundle.careers).sort((e, t) => String(e.name).localeCompare(String(t.name)));
  }
  table(e) {
    return this.bundle.tables[e];
  }
  speciesForSociety(e) {
    var r;
    const t = new Set(((r = this.catalog.speciesBySociety[e]) == null ? void 0 : r.map((i) => i.id)) ?? []);
    return this.speciesList().filter((i) => t.has(i.id));
  }
  careersForSociety(e) {
    const t = /* @__PURE__ */ new Set([
      ...(this.catalog.careersBySociety.any ?? []).map((r) => r.id),
      ...(this.catalog.careersBySociety[e] ?? []).map((r) => r.id)
    ]);
    return this.careerList().filter((r) => t.has(r.id));
  }
}
async function M(a) {
  const e = a.replace(/\/$/, ""), [t, r, i, s] = await Promise.all([
    A(`${e}/species/index.json`, `${e}/species`),
    A(`${e}/careers/index.json`, `${e}/careers`),
    U(e),
    k(`${e}/catalog.json`)
  ]);
  return new P({ species: t, careers: r, tables: i, catalog: s });
}
async function U(a) {
  const e = await Promise.all(L.map(async (t) => [t, await k(`${a}/tables/${t}.json`)]));
  return Object.fromEntries(e);
}
async function A(a, e) {
  const t = await k(a), r = [];
  for (const i of t) {
    const s = await k(`${e}/${i}`), c = Array.isArray(s) ? s : [s];
    for (const n of c)
      n != null && n.deprecated || n != null && n.id && r.push([n.id, n]);
  }
  return Object.fromEntries(r);
}
async function k(a) {
  const e = await fetch(a);
  if (!e.ok) throw new Error(`Failed to load ${a}: ${e.status} ${e.statusText}`);
  return e.json();
}
const q = {
  admin: "admin",
  advocate: "advocate",
  animals: "animals",
  art: "art",
  astrogation: "astrogation",
  athletics: "athletics",
  broker: "broker",
  carouse: "carouse",
  deception: "deception",
  diplomat: "diplomat",
  drive: "drive",
  electronics: "electronics",
  engineer: "engineer",
  explosives: "explosives",
  flyer: "flyer",
  gambler: "gambler",
  gunner: "gunner",
  "gun combat": "guncombat",
  guncombat: "guncombat",
  "heavy weapons": "heavyweapons",
  heavyweapons: "heavyweapons",
  independence: "independence",
  investigate: "investigate",
  "jack of all trades": "jackofalltrades",
  "jack-of-all-trades": "jackofalltrades",
  jackofalltrades: "jackofalltrades",
  language: "language",
  leadership: "leadership",
  mechanic: "mechanic",
  medic: "medic",
  melee: "melee",
  navigation: "navigation",
  persuade: "persuade",
  pilot: "pilot",
  profession: "profession",
  recon: "recon",
  science: "science",
  seafarer: "seafarer",
  stealth: "stealth",
  steward: "steward",
  streetwise: "streetwise",
  survival: "survival",
  tactics: "tactics",
  "vacc suit": "vaccsuit",
  vaccsuit: "vaccsuit",
  telepathy: "telepathy",
  clairvoyance: "clairvoyance",
  telekinesis: "telekinesis",
  awareness: "awareness",
  teleportation: "teleportation"
}, I = {
  strength: "strength",
  dexterity: "dexterity",
  endurance: "endurance",
  handling: "handling",
  vetinary: "vetinary",
  veterinary: "vetinary",
  training: "training",
  performer: "performer",
  holography: "holography",
  instrument: "instrument",
  "visual media": "visualMedia",
  write: "write",
  hovercraft: "hovercraft",
  mole: "mole",
  track: "track",
  walker: "walker",
  wheel: "wheel",
  comms: "comms",
  computers: "computers",
  "remote ops": "remoteOps",
  remoteops: "remoteOps",
  sensors: "sensors",
  "m-drive": "mDrive",
  mdrive: "mDrive",
  "j-drive": "jDrive",
  jdrive: "jDrive",
  "life support": "lifeSupport",
  lifesupport: "lifeSupport",
  power: "power",
  airship: "airship",
  grav: "grav",
  ornithopter: "ornithopter",
  rotor: "rotor",
  wing: "wing",
  turret: "turret",
  ortillery: "ortillery",
  screen: "screen",
  capital: "capital",
  archaic: "archaic",
  energy: "energy",
  slug: "slug",
  artillery: "artillery",
  portable: "portable",
  "man portable": "portable",
  vehicle: "vehicle",
  galanglic: "galanglic",
  anglic: "galanglic",
  vilani: "vilani",
  zdetl: "zdetl",
  oynprith: "oynprith",
  trokh: "trokh",
  gvegh: "gvegh",
  bilanidin: "vilani",
  unarmed: "unarmed",
  blade: "blade",
  bludgeon: "bludgeon",
  natural: "natural",
  "small craft": "smallCraft",
  smallcraft: "smallCraft",
  spacecraft: "spacecraft",
  "capital ships": "capitalShips",
  capitalships: "capitalShips",
  belter: "belter",
  biologicals: "biologicals",
  "civil engineering": "civilEngineering",
  civilengineering: "civilEngineering",
  construction: "construction",
  hydroponics: "hydroponics",
  polymers: "polymers",
  robotics: "robotics",
  farming: "biologicals",
  archaeology: "archaeology",
  astronomy: "astronomy",
  biology: "biology",
  chemistry: "chemistry",
  cosmology: "cosmology",
  cybernetics: "cybernetics",
  economics: "economics",
  genetics: "genetics",
  history: "history",
  linguistics: "linquistics",
  linquistics: "linquistics",
  philosophy: "philosophy",
  physics: "physics",
  planetology: "planetology",
  psionicology: "psionicology",
  psychology: "psychology",
  sophontology: "sophontology",
  xenology: "xenology",
  "ocean ships": "oceanShips",
  oceanships: "oceanShips",
  personal: "personal",
  sail: "sail",
  submarine: "submarine",
  military: "military",
  naval: "naval"
};
function B(a) {
  return q[w(a)];
}
function z(a) {
  if (a)
    return I[w(a)] ?? w(a).replace(/[^a-z0-9]/g, "");
}
function w(a) {
  return a.trim().toLowerCase();
}
function H(a, e = {}) {
  const t = e.entryYear ?? 1105, r = V(a), i = Object.fromEntries(O.map((o) => {
    const l = o === "PSI" && a.psi || g(a, o);
    return [o, { value: l, current: l, show: G(o, l), default: !1 }];
  })), s = a.characteristics.STR + a.characteristics.DEX + a.characteristics.END, c = [
    ...F(a),
    ...Y(a),
    ...X(a)
  ], n = a.name || "Unnamed Traveller";
  return {
    name: n,
    type: "traveller",
    img: "systems/mgt2e/icons/actors/traveller.svg",
    system: {
      speed: { base: 6, value: 6 },
      initiative: { base: 0, value: 0 },
      size: 0,
      rads: 0,
      weightCarried: 0,
      heavyLoad: a.characteristics.STR * 10,
      maxLoad: a.characteristics.STR * 20,
      modifiers: {},
      hits: { value: s, max: s, damage: 0, tmpDamage: 0 },
      description: a.capsule_description ? K(a.capsule_description) : "",
      settings: {
        hideUntrained: !1,
        onlyBackground: !1,
        resetOnRoll: !1,
        columns: "3",
        lockCharacteristics: !1,
        sortByCategory: !1,
        lockSkills: !1,
        autoAge: !0,
        autoHits: !0
      },
      characteristics: i,
      skills: r,
      damage: { STR: { value: 0 }, DEX: { value: 0 }, END: { value: 0, tmp: 0 } },
      sophont: {
        age: String(a.age),
        species: f(a.species_id.replaceAll("_", " ")),
        speciesTraits: a.traits.map((o) => o.name ?? o.id ?? "").filter(Boolean).join(", "),
        gender: a.gender || "Unknown",
        weight: 0,
        height: 0,
        profession: J(a),
        homeworld: a.homeworld
      },
      finance: {
        cash: String(a.credits),
        pension: String(a.pension_per_year),
        medicalDebt: String(a.medical_debt),
        mortgage: "0",
        livingCosts: "0",
        otherIncome: "0",
        shipShares: a.ship_shares,
        description: a.ship_shares ? `Ship Shares: ${a.ship_shares}` : ""
      },
      terms: a.total_terms || a.completed_careers.reduce((o, l) => o + l.terms_served, 0),
      startAge: a.character_type === "robot" ? 0 : 18,
      termLength: a.character_type === "robot" ? 0 : 4,
      entryYear: t,
      entryAge: a.age,
      currentYear: t,
      birthYear: t - a.age
    },
    items: c,
    effects: [],
    folder: null,
    flags: {
      travellerCreator: {
        sourceVersion: e.sourceVersion ?? "unknown",
        creationState: a,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      mgt2e: {}
    },
    prototypeToken: {
      name: n,
      displayName: 0,
      actorLink: !0,
      width: 1,
      height: 1
    }
  };
}
function V(a) {
  const e = {};
  for (const t of a.skills) {
    const r = B(t.name);
    if (r)
      if (e[r] ?? (e[r] = { base: -1, specs: {} }), !t.speciality || t.speciality.toLowerCase() === "any")
        e[r].base = Math.max(e[r].base, t.level);
      else {
        const i = z(t.speciality);
        i && (e[r].specs[i] = Math.max(e[r].specs[i] ?? -1, t.level));
      }
  }
  return Object.fromEntries(Object.entries(e).map(([t, r]) => {
    const i = { id: t, value: r.base > 0 ? String(r.base) : Math.max(r.base, 0), trained: !0 };
    return Object.keys(r.specs).length && (i.specialities = Object.fromEntries(Object.entries(r.specs).map(([s, c]) => [s, { id: s, value: String(c) }]))), [t, i];
  }));
}
function F(a) {
  const e = {
    ally: { affinity: 3, enmity: 0, power: 2, influence: 2 },
    contact: { affinity: 3, enmity: 0, power: 0, influence: 4 },
    rival: { affinity: 1, enmity: 0, power: 2, influence: 1 },
    enemy: { affinity: 0, enmity: -3, power: 3, influence: 1 }
  };
  return a.associates.map((t) => {
    const r = String(t.kind || "contact").toLowerCase(), i = e[r] ?? e.contact;
    return E(t.description || `Unnamed ${f(r)}`, "associate", {
      associate: { relationship: r, ...i },
      relation: r,
      description: t.description
    });
  });
}
function Y(a) {
  return a.term_history.map((e, t) => {
    const r = f(e.career_id.replaceAll("_", " ")), i = f(e.assignment_id.replaceAll("_", " ")), s = `${r}${i ? `: ${i}` : ""}${e.rank_title ? ` (${e.rank_title})` : ""}`, c = [s, ...e.events.map((n) => `* ${n}`)].join(`
`);
    return E(`Term ${t + 1}: ${s}`, "term", {
      term: { number: t + 1, termLength: 4, assignment: s, randomTerm: !1, randomLength: "" },
      name: "Term",
      description: c
    }, "systems/mgt2e/icons/misc/career.svg");
  });
}
function X(a) {
  return a.equipment.map((e) => E(e.name, "item", {
    tl: 0,
    weight: 0,
    cost: 0,
    notes: e.notes ?? "",
    active: !1,
    quantity: e.quantity || 1,
    status: "carried",
    legality: 9,
    description: e.notes ?? ""
  }));
}
function E(a, e, t, r = "systems/mgt2e/icons/items/item.svg") {
  const i = Date.now();
  return {
    name: a,
    type: e,
    system: t,
    _id: Q(),
    img: r,
    effects: [],
    folder: null,
    sort: 0,
    flags: {},
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      exportSource: null,
      coreVersion: "13.351",
      systemId: "mgt2e",
      systemVersion: "0.21.0.0",
      lastModifiedBy: null,
      createdTime: i,
      modifiedTime: i
    },
    ownership: { default: 0 }
  };
}
function G(a, e) {
  return ["STR", "DEX", "END", "INT", "EDU", "SOC"].includes(a) || a === "PSI" && e > 0;
}
function J(a) {
  const e = a.completed_careers.at(-1);
  if (!e) return "";
  const t = f(e.career_id.replaceAll("_", " ")), r = e.assignment_id && e.assignment_id !== "career_package" ? f(e.assignment_id.replaceAll("_", " ")) : "";
  return r ? `${t}: ${r}` : t;
}
function K(a) {
  return `<p>${W(a).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`;
}
function W(a) {
  return a.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function f(a) {
  return a.replace(/\w\S*/g, (e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase());
}
function Q() {
  return crypto.getRandomValues(new Uint32Array(2)).reduce((a, e) => a + e.toString(16).padStart(8, "0"), "").slice(0, 16);
}
class Z {
  constructor() {
    this.sourceVersion = "unknown";
  }
  async initialize(e) {
    this.appClass = e;
    const t = "modules/traveller-character-creator/data";
    this.rules = await M(t), this.engine = new R(this.rules);
    try {
      const r = await fetch("modules/traveller-character-creator/SOURCE_VERSION");
      r.ok && (this.sourceVersion = (await r.text()).trim());
    } catch {
      this.sourceVersion = "unknown";
    }
  }
  open(e = {}) {
    if (!this.engine || !this.appClass) throw new Error("Traveller Creator is not initialized yet.");
    const t = new this.appClass(this, e);
    return t.render(!0), t;
  }
  newCharacter() {
    return y();
  }
  exportActorData(e, t = {}) {
    const r = Number(t.entryYear ?? game.settings.get("traveller-character-creator", "defaultEntryYear"));
    return H(e, { sourceVersion: this.sourceVersion, entryYear: r });
  }
  async createActor(e, t = {}) {
    var s, c;
    const r = this.exportActorData(e, t), i = await Actor.implementation.create(r);
    return game.settings.get("traveller-character-creator", "autoOpenCreatedActor") && ((s = i.sheet) == null || s.render(!0)), (c = ui.notifications) == null || c.info(`Created Traveller actor: ${i.name}`), i;
  }
}
function ee() {
  game.settings.register("traveller-character-creator", "defaultEntryYear", {
    name: "Default Entry Year",
    hint: "The campaign year used for generated actor date fields.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1105
  }), game.settings.register("traveller-character-creator", "autoOpenCreatedActor", {
    name: "Open Created Actor",
    hint: "Open the Traveller sheet after creating the actor.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register("traveller-character-creator", "persistDrafts", {
    name: "Persist Character Creator Drafts",
    hint: "Save the in-progress creator state in this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0
  });
}
const { ApplicationV2: te, HandlebarsApplicationMixin: re } = foundry.applications.api, p = class p extends re(te) {
  constructor(e, t = {}) {
    super(t), this.api = e, this.character = this.loadDraft() ?? e.newCharacter();
  }
  async _prepareContext() {
    const e = this.api.rules;
    return {
      character: this.character,
      stats: Object.entries(this.character.characteristics),
      extraStats: Object.entries(this.character.extra_characteristics),
      notes: [...this.character.notes].reverse().slice(0, 12),
      societies: e.catalog.societies,
      species: e.speciesForSociety(this.character.society_id),
      backgroundPackages: Object.values(e.table("background_packages").packages ?? {}),
      careerPackages: Object.values(e.table("career_packages").packages ?? {}),
      skillPackages: Object.entries(e.table("skill_packages").packages ?? {}).map(([t, r]) => ({ id: t, ...r })),
      canCreate: this.character.phase === "done"
    };
  }
  static async onSubmit() {
  }
  static async roll() {
    this.character = this.api.engine.rollInitialCharacteristics(this.character).character, this.saveDraft(), this.render();
  }
  static async chooseSociety(e, t) {
    const r = t.dataset.id;
    r && (this.character = this.api.engine.chooseSociety(this.character, r).character, this.saveDraft(), this.render());
  }
  static async applySpecies(e, t) {
    const r = t.dataset.id;
    r && (this.character = this.api.engine.applySpecies(this.character, r).character, (this.character.phase === "aslan_setup" || this.character.phase === "zhodani_training") && (this.character.phase = "background", this.character.notes.push("Advanced special ancestry setup placeholder; detailed branch port remains in lifepath engine.")), this.saveDraft(), this.render());
  }
  static async applyBackgroundPackage(e, t) {
    const r = t.dataset.id;
    r && (this.character = this.api.engine.applyBackgroundPackage(this.character, r).character, this.saveDraft(), this.render());
  }
  static async applyCareerPackage(e, t) {
    const r = t.dataset.id;
    r && (this.character = this.api.engine.applyCareerPackage(this.character, r).character, this.saveDraft(), this.render());
  }
  static async applySkillPackage(e, t) {
    const r = t.dataset.id;
    r && (this.character = this.api.engine.applySkillPackage(this.character, r).character, this.saveDraft(), this.render());
  }
  static async createActor() {
    const e = this.element.querySelector("[name='name']");
    e != null && e.value && (this.character.name = e.value), await this.api.createActor(this.character), this.clearDraft(), this.close();
  }
  static async reset() {
    this.character = this.api.newCharacter(), this.clearDraft(), this.render();
  }
  saveDraft() {
    game.settings.get("traveller-character-creator", "persistDrafts") && localStorage.setItem(_(), JSON.stringify(this.character));
  }
  loadDraft() {
    var t;
    if (!game.settings.get("traveller-character-creator", "persistDrafts")) return null;
    const e = localStorage.getItem(_());
    if (!e) return null;
    try {
      return JSON.parse(e);
    } catch {
      return (t = ui.notifications) == null || t.warn("Traveller Creator draft was unreadable and has been reset."), localStorage.removeItem(_()), null;
    }
  }
  clearDraft() {
    localStorage.removeItem(_());
  }
};
p.DEFAULT_OPTIONS = {
  id: "traveller-character-creator",
  tag: "form",
  window: {
    title: "Traveller Character Creator",
    icon: "fa-solid fa-user-astronaut",
    resizable: !0
  },
  position: { width: 760, height: 720 },
  form: { handler: p.onSubmit, submitOnChange: !1, closeOnSubmit: !1 },
  actions: {
    roll: p.roll,
    chooseSociety: p.chooseSociety,
    applySpecies: p.applySpecies,
    applyBackgroundPackage: p.applyBackgroundPackage,
    applyCareerPackage: p.applyCareerPackage,
    applySkillPackage: p.applySkillPackage,
    createActor: p.createActor,
    reset: p.reset
  }
}, p.PARTS = {
  body: { template: "modules/traveller-character-creator/templates/creator.hbs" }
};
let C = p;
function _() {
  var a, e;
  return `traveller-character-creator.${((a = game.world) == null ? void 0 : a.id) ?? "world"}.${((e = game.user) == null ? void 0 : e.id) ?? "user"}.draft`;
}
Hooks.once("init", () => {
  ee(), Handlebars.registerHelper("eq", (a, e) => a === e);
});
Hooks.once("ready", async () => {
  const a = new Z();
  await a.initialize(C), game.travellerCreator = a;
});
Hooks.on("renderActorDirectory", (a, e) => {
  var i;
  const t = e instanceof HTMLElement ? e : e[0];
  if (!t || t.querySelector("[data-traveller-creator-open]")) return;
  const r = document.createElement("button");
  r.type = "button", r.dataset.travellerCreatorOpen = "true", r.classList.add("traveller-creator-open"), r.innerHTML = '<i class="fa-solid fa-user-astronaut"></i> Create Traveller', r.addEventListener("click", () => {
    var s;
    return (s = game.travellerCreator) == null ? void 0 : s.open();
  }), (i = t.querySelector(".directory-header")) == null || i.append(r);
});
//# sourceMappingURL=traveller-character-creator.js.map
