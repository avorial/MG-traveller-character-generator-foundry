const A = ["STR", "DEX", "END", "INT", "EDU", "SOC"], F = [
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
function R() {
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
    good_fortune_benefit_dm: 0,
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
    auto_entry_career_id: null,
    auto_qualify_career_ids: [],
    starts_commissioned_career_id: null,
    starts_commissioned_rank: null,
    academy_commission_career_id: null,
    academy_commission_dm: 0,
    permanent_advancement_dm_by_career: {},
    permanent_qualification_dm_by_career: {},
    banned_career_ids: [],
    forced_next_career_id: null,
    pending_transfer_career_id: null,
    pending_transfer_rank: null,
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
function f(o) {
  return structuredClone(o);
}
function h(o, e) {
  return e in o.characteristics ? Number(o.characteristics[e] ?? 0) : Number(o.extra_characteristics[e] ?? 0);
}
function g(o, e, s) {
  const t = Math.max(0, Math.trunc(s));
  e in o.characteristics ? o.characteristics[e] = t : o.extra_characteristics[e] = t;
}
function k(o, e, s = 0, t = null, r = !1) {
  if (o.forbidden_skills.includes(e) || t && o.forbidden_skills.includes(`${e} (${t})`))
    return `Skipped ${D(e, t)} (forbidden by species)`;
  const i = o.skills.find((a) => a.name === e && (a.speciality ?? null) === t);
  if (i)
    return s === 0 ? `Already has ${D(e, t)} ${i.level}` : r ? s > i.level ? (i.level = Math.min(s, 4), M(o.skills), `Increased ${D(e, t)} to ${i.level}`) : `${D(e, t)} unchanged (already ${i.level})` : (i.level = Math.min(i.level + s, 4), M(o.skills), `Increased ${D(e, t)} to ${i.level}`);
  const n = Math.max(0, s);
  return o.skills.push({ name: e, level: n, speciality: t }), t && n >= 1 && !o.skills.some((a) => a.name === e && !a.speciality) && o.skills.push({ name: e, level: 0, speciality: null }), M(o.skills), `Gained ${D(e, t)} ${n}`;
}
function D(o, e) {
  return `${o}${e ? ` (${e})` : ""}`;
}
function M(o) {
  o.sort((e, s) => `${e.name.toLowerCase()}\0${e.speciality ?? ""}`.localeCompare(`${s.name.toLowerCase()}\0${s.speciality ?? ""}`));
}
class z {
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
    return this.forced.length ? this.forced.shift() ?? 1 : this.rollDie(6);
  }
  rollD(e) {
    const s = this.forced.length ? this.forced.shift() ?? 1 : this.rollDie(e);
    return { dice: [], natural: s, total: s, dm: 0 };
  }
  d3() {
    return Math.ceil(this.d6() / 2);
  }
  roll2D(e = 0) {
    if (this.forced.length) {
      const r = this.forced.shift() ?? 0;
      return { dice: [], natural: r, total: r + e, dm: e };
    }
    const s = [this.d6(), this.d6()], t = s[0] + s[1];
    return { dice: s, natural: t, total: t + e, dm: e };
  }
  rollCharacteristic(e = !1) {
    if (!e) return this.roll2D();
    if (this.forced.length) return this.roll2D();
    const s = [this.d6(), this.d6(), this.d6()].sort((r, i) => i - r), t = s.slice(0, 2);
    return { dice: s, natural: t[0] + t[1], total: t[0] + t[1], dm: 0 };
  }
  rollDie(e) {
    return Math.floor(Math.random() * e) + 1;
  }
}
function N(o) {
  return o <= 0 ? -3 : o <= 2 ? -2 : Math.floor(o / 3) - 2;
}
class H {
  constructor(e, s = new z()) {
    this.rules = e, this.roller = s;
  }
  freshCharacter() {
    return R();
  }
  rollInitialCharacteristics(e, s = !1) {
    const t = f(e), r = {}, i = /* @__PURE__ */ new Set();
    if (s) {
      const n = A.map((a) => ({ stat: a, roll: this.roller.roll2D() }));
      n.sort((a, l) => l.roll.total - a.roll.total), i.add(n[0].stat), i.add(n[1].stat);
    }
    for (const n of A) {
      const a = this.roller.rollCharacteristic(s && i.has(n));
      t.characteristics[n] = a.total, r[n] = a;
    }
    return t.phase = "society", t.notes.push("Rolled initial characteristics."), { rolls: r, character: t };
  }
  rollExtraCharacteristics(e, s, t = !1) {
    const r = f(e), i = {};
    for (const n of s) {
      const a = this.roller.rollCharacteristic(t);
      g(r, n, a.total), n === "PSI" && (r.psi = a.total), i[n] = a;
    }
    return r.notes.push(`Rolled extra characteristics: ${s.join(", ")}.`), { rolls: i, character: r };
  }
  chooseSociety(e, s) {
    const t = f(e);
    return t.society_id = s, t.phase = "species", t.notes.push(`Society of origin: ${s}.`), { character: t };
  }
  applySpecies(e, s) {
    var i, n, a;
    const t = this.rules.species(s);
    if (!t) throw new Error(`Unknown species: ${s}`);
    const r = f(e);
    r.species_id = s;
    for (const [l, c] of Object.entries(t.characteristic_modifiers ?? {}))
      g(r, l, h(r, l) + Number(c));
    if (t.starting_age && (r.age = Number(t.starting_age)), t.uses_cha) {
      const l = this.roller.d6() + 2;
      g(r, "CHA", l), r.characteristics.SOC = 0;
    }
    if (t.extra_characteristics_required)
      for (const l of t.extra_characteristics_required)
        h(r, l) || g(r, l, this.roller.roll2D().total);
    if (t.hiver_species) {
      const l = this.roller.roll2D(), c = ((i = t.hiver_nest_table) == null ? void 0 : i[String(Math.max(2, Math.min(12, l.total)))]) ?? "generalist";
      r.hiver_nest_type = c;
      const u = (a = (n = t.hiver_nest_benefits) == null ? void 0 : n[c]) == null ? void 0 : a.background;
      if (u)
        for (const d of String(u).split(",")) this.applySkillOrStat(r, d.trim(), 0);
      r.notes.push(`Hiver nest type: ${c}.`);
    }
    return r.forbidden_skills = [...t.forbidden_skills ?? []], r.traits = [...t.traits ?? []], s.includes("aslan") ? (r.phase = "aslan_setup", r.aslan_setup_status = { phase: "gender" }) : t.psionic_training_at_start || s.includes("zhodani") && r.characteristics.SOC >= 10 ? r.phase = "zhodani_training" : r.phase = "background", r.notes.push(`Applied species: ${t.name ?? s}.`), { species: t, character: r };
  }
  applyBackgroundSkills(e, s) {
    const t = f(e), r = Math.max(0, 3 + N(t.characteristics.EDU));
    for (const i of s.slice(0, r)) {
      const [n, a] = O(i);
      k(t, n, 0, a);
    }
    return t.phase = "pre_career", t.notes.push(`Chose ${Math.min(s.length, r)} background skills.`), { allowed: r, chosen: s.slice(0, r), character: t };
  }
  applyBackgroundPackage(e, s, t = {}) {
    const i = (this.rules.table("background_packages").packages ?? this.rules.table("background_packages"))[s];
    if (!i) throw new Error(`Unknown background package: ${s}`);
    const n = f(e);
    for (const [a, l] of Object.entries(i.characteristic_modifiers ?? i.stat_mods ?? {}))
      g(n, a, h(n, a) + Number(l));
    for (const a of i.skills ?? []) {
      const l = typeof a == "string" ? a : `${a.name}${a.speciality ? ` (${a.speciality})` : ""}`, c = t[l] ?? a;
      if (typeof c == "string") {
        const [u, d, _] = C(c);
        k(n, u, _ === 1 && !/\d+$/.test(c.trim()) ? 0 : _, d);
      } else
        k(n, c.name, Number(c.level ?? 0), c.speciality ?? null);
    }
    n.credits += Number(i.credits ?? 0);
    for (const a of i.equipment ?? []) n.equipment.push({ name: String(a), quantity: 1, notes: null });
    return n.age = Math.max(n.age, 22), n.phase = "career", n.notes.push(`Applied background package: ${i.name ?? s}.`), { package: i, character: n };
  }
  applyCareerPackage(e, s) {
    const t = this.rules.table("career_packages"), i = (Array.isArray(t == null ? void 0 : t.packages) ? t.packages : Array.isArray(t) ? t : Object.values(t.packages ?? t)).find((a) => a.id === s);
    if (!i) throw new Error(`Unknown career package: ${s}`);
    const n = f(e);
    for (const [a, l] of Object.entries(i.characteristic_modifiers ?? i.characteristics ?? i.stat_mods ?? {}))
      g(n, a, h(n, a) + Number(l));
    for (const a of i.skills ?? [])
      if (typeof a == "string") {
        const [l, c, u] = C(a);
        k(n, l, u, c);
      } else
        k(n, a.name, Number(a.level ?? 0), a.speciality ?? null, !0);
    n.credits += Number(i.credits ?? 0);
    for (const a of i.equipment ?? []) n.equipment.push({ name: String(a), quantity: 1, notes: null });
    for (let a = 0; a < Number(i.contacts ?? 0); a++) n.associates.push({ kind: "contact", description: i.contact_description ?? "career package contact" });
    for (let a = 0; a < Number(i.allies ?? 0); a++) n.associates.push({ kind: "ally", description: i.ally_description ?? "career package ally" });
    return n.age += this.roller.d3(), n.career_package_id = s, n.career_package_taken = !0, n.completed_careers.push({
      career_id: s,
      assignment_id: "career_package",
      terms_served: 1,
      final_rank: Number(i.rank ?? 0),
      final_rank_title: i.rank_title ?? null,
      commissioned: !1,
      left_due_to: "career_package",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 0
    }), n.phase = "skill_package", n.notes.push(`Applied career package: ${i.name ?? s}.`), { package: i, character: n };
  }
  applySkillPackage(e, s) {
    const r = (this.rules.table("skill_packages").packages ?? this.rules.table("skill_packages"))[s];
    if (!r) throw new Error(`Unknown skill package: ${s}`);
    const i = f(e);
    for (const n of r.skills ?? []) {
      const [a, l] = O(n);
      k(i, a, 1, l);
    }
    return i.phase = "done", i.notes.push(`Applied skill package: ${r.name ?? s}.`), { package: r, character: i };
  }
  skipPreCareer(e) {
    const s = f(e);
    return s.phase = "career", s.notes.push("Skipped pre-career education."), { character: s };
  }
  beginAslanSetup(e) {
    const s = f(e);
    return s.phase = "aslan_setup", s.aslan_setup_status = {
      phase: "gender",
      clan_type: null,
      clan_dm_ancestral_deeds: 0,
      ancestral_territory: 0,
      family_position: null,
      inherits_territory: !1,
      rite_score: 0
    }, h(s, "TER") || g(s, "TER", 0), s.notes.push("Aslan background setup started."), { phase: "gender", character: s };
  }
  chooseAslanGender(e, s) {
    const t = f(e);
    return t.gender = s, t.aslan_setup_status = { ...t.aslan_setup_status ?? {}, phase: "clan" }, t.notes.push(`Aslan gender chosen: ${s}.`), { phase: "clan", gender: s, character: t };
  }
  rollAslanClan(e) {
    var a;
    const s = f(e), t = this.rules.species(s.species_id) ?? {}, r = ((a = this.rules.table("aslan_background").clan) == null ? void 0 : a.results) ?? {}, i = t.clan_determination === "fixed" ? null : this.roller.rollD(6), n = i ? r[String(i.total)] : { label: t.fixed_clan_name ?? "Tokouea'we", dm_ancestral_deeds: Number(t.fixed_clan_dm ?? 0) };
    return s.aslan_setup_status = {
      ...s.aslan_setup_status ?? {},
      phase: "ancestry",
      clan_type: n.label,
      clan_dm_ancestral_deeds: Number(n.dm_ancestral_deeds ?? 0)
    }, s.notes.push(`Aslan clan: ${n.label}.`), { roll: i, result: n, character: s };
  }
  rollAslanAncestry(e) {
    var u, d, _, m, p;
    const s = f(e), t = this.rules.table("aslan_background"), r = Number(((u = s.aslan_setup_status) == null ? void 0 : u.clan_dm_ancestral_deeds) ?? 0), i = this.roller.rollD(6), n = String(Math.max(1, Math.min(7, i.total + r))), a = ((_ = (d = t.ancestral_deeds) == null ? void 0 : d.results) == null ? void 0 : _[n]) ?? {};
    let l = Number(a.territory ?? 0);
    const c = [];
    for (let v = 0; v < 2; v++) {
      const b = this.roller.roll2D(), y = ((p = (m = t.past_deeds) == null ? void 0 : m.results) == null ? void 0 : p[String(Math.max(2, Math.min(12, b.total)))]) ?? {};
      c.push({ roll: b, result: y }), y.territory === "lose_all" ? l = 0 : l = Math.max(0, l + Number(y.territory ?? 0)), this.applyAslanPastDeedBonus(s, y);
    }
    return g(s, "TER", l), s.aslan_setup_status = { ...s.aslan_setup_status ?? {}, phase: "family", ancestral_territory: l }, s.notes.push(`Aslan ancestry territory: ${l}.`), { ancestralRoll: i, ancestral: a, past: c, territory: l, character: s };
  }
  rollAslanFamily(e) {
    var c;
    const s = f(e), t = ((c = this.rules.table("aslan_background").family_inheritance) == null ? void 0 : c.results) ?? {}, r = this.roller.roll2D(), i = t[String(Math.max(2, Math.min(12, r.total)))] ?? {}, n = s.gender === "female" ? "female" : "male", a = i[`label_${n}`] ?? "Family Member", l = !!i.inherits_territory;
    return l || g(s, "TER", 0), s.aslan_setup_status = { ...s.aslan_setup_status ?? {}, phase: "rite", family_position: a, inherits_territory: l }, s.notes.push(`Aslan family position: ${a}.`), { roll: r, position: a, inherits: l, character: s };
  }
  rollAslanRite(e) {
    var l, c;
    const s = f(e), t = this.roller.roll2D(), r = s.gender === "female" ? "female" : "male";
    let i = t.total;
    r === "male" ? i += A.filter((u) => h(s, u) > t.total).length : i += ["INT", "EDU", "SOC"].filter((u) => h(s, u) > t.total).length * 2;
    const n = t.dice.length >= 2 && t.dice[0] === t.dice[1];
    let a = null;
    if (n) {
      const u = `${t.dice[0]}+${t.dice[1]}`;
      a = ((c = (l = this.rules.table("aslan_background").rite_of_passage_events) == null ? void 0 : l.results) == null ? void 0 : c[u]) ?? null, a != null && a.bonus && this.applySingleMusterBenefit(s, String(a.bonus));
    }
    return s.aslan_setup_status = { ...s.aslan_setup_status ?? {}, phase: "done", rite_roll: t, rite_score: i, rite_doubles: n }, s.phase = "background", s.notes.push(`Aslan rite score: ${i}.`), { roll: t, score: i, doubles: n, doublesResult: a, character: s };
  }
  qualifyForPreCareer(e, s, t = {}) {
    var p, v, b;
    const r = (p = this.rules.table("education").tracks) == null ? void 0 : p[s];
    if (!r) throw new Error(`Unknown pre-career track: ${s}`);
    const i = f(e), n = t.service ? (v = r.services) == null ? void 0 : v[t.service] : null, a = t.curriculum ? (b = r.curricula) == null ? void 0 : b[t.curriculum] : null, l = (n == null ? void 0 : n.qualification) ?? r.qualification ?? {}, c = this.checkDm(i, l), u = l.automatic ? null : this.roller.roll2D(c), d = l.automatic || !!(u && u.total >= Number(l.target ?? 0));
    if (!d)
      return i.phase = "career", i.notes.push(`Failed ${r.name ?? s} qualification${u ? ` (${u.total})` : ""}.`), { track: r, roll: u, qualified: d, character: i };
    this.applyStatBlock(i, r.enrollment_bonus ?? {}), this.applySkillResults(i, r.enrollment_auto_skills ?? [], 0);
    const _ = this.preCareerSkillPool(r, n, a), m = this.applyChosenSkills(i, t.skills, _, Number(r.enrollment_skill_picks ?? 0), Number(r.enrollment_pick_level ?? 0));
    if (a != null && a.enrollment_skill_table) {
      const y = this.rollOnExternalSkillTable(i, a.enrollment_skill_table.career, a.enrollment_skill_table.table);
      y && m.push(y);
    }
    for (let y = 0; y < Number(r.enrollment_service_skill_random ?? 0); y++) {
      const w = this.rollOnExternalSkillTable(i, (n == null ? void 0 : n.career_id) ?? "merchant", "service_skills");
      w && m.push(w);
    }
    if (l.requires_psi_test && !i.psi_tested) {
      const y = this.roller.roll2D();
      i.psi = y.total, g(i, "PSI", y.total), i.psi_tested = !0;
    }
    return i.pre_career_status = {
      track_id: s,
      service_id: (n == null ? void 0 : n.id) ?? t.service ?? null,
      career_id: (n == null ? void 0 : n.career_id) ?? null,
      curriculum_id: (a == null ? void 0 : a.id) ?? t.curriculum ?? null,
      enrolled: !0,
      skill_pool: _,
      enrollment_skills: m
    }, i.phase = "pre_career", i.notes.push(`Qualified for ${r.name ?? s}.`), { track: r, roll: u, qualified: d, character: i };
  }
  graduatePreCareer(e, s = []) {
    var m, p;
    const t = e.pre_career_status ?? {}, r = String(t.track_id ?? ""), i = (m = this.rules.table("education").tracks) == null ? void 0 : m[r];
    if (!i) throw new Error("No active pre-career track to graduate.");
    const n = f(e), a = i.graduation ?? {};
    if (t.forced_graduation_failure)
      return n.pre_career_status = { ...t, graduated: !1, honours: !1, graduation_roll: null, outcome_note: ((p = a.on_failure) == null ? void 0 : p.note) ?? "Failed to graduate." }, n.age += Number(i.age_cost ?? 0), n.pre_career_terms += Number(i.age_cost ?? 0) > 0 ? 1 : 0, n.phase = "career", n.notes.push(`Failed to graduate from ${i.name ?? r} due to pre-career event.`), { track: i, roll: null, graduated: !1, honours: !1, character: n };
    const l = this.checkDm(n, a), c = this.roller.roll2D(l), u = c.total >= Number(a.honours_target ?? 1 / 0), d = u || c.total >= Number(a.target ?? 0), _ = d ? (u ? a.on_honours : a.on_graduation) ?? {} : a.on_failure ?? {};
    return d && this.applyPreCareerOutcome(n, i, _, s), n.age = Math.max(n.age + Number(i.age_cost ?? 0), this.rollAgeOverride(_.age_override) ?? 0), n.pre_career_terms += Number(i.age_cost ?? 0) > 0 ? 1 : 0, n.pre_career_status = { ...t, graduated: d, honours: u, graduation_roll: c.total, outcome_note: _.note ?? null }, n.phase = "career", n.notes.push(`${d ? u ? "Graduated with honours from" : "Graduated from" : "Failed to graduate from"} ${i.name ?? r}.`), { track: i, roll: c, graduated: d, honours: u, character: n };
  }
  preCareerEventRoll(e, s = !1) {
    const t = f(e), r = this.rules.table("education"), i = s ? r.aslan_pre_career_events : r.pre_career_events, n = this.roller.roll2D(), a = String(Math.max(2, Math.min(12, n.total))), l = String((i == null ? void 0 : i[a]) ?? "No event.");
    return this.applyPreCareerEventEffects(t, n.total, l, s), t.pre_career_status = { ...t.pre_career_status ?? {}, last_event_roll: n.total, last_event: l }, t.notes.push(`Pre-career event: ${l}`), { roll: n, event: l, character: t };
  }
  qualifyForCareer(e, s) {
    var d, _, m;
    const t = this.rules.career(s);
    if (!t) throw new Error(`Unknown career: ${s}`);
    const r = f(e), i = this.careerBlocked(r, t);
    if (i)
      return r.notes.push(`Cannot qualify for ${t.name ?? s}: ${i}.`), { career: t, qualified: !1, blockedReason: i, character: r };
    const n = r.pending_transfer_career_id === "any" || r.pending_transfer_career_id === s, a = n || r.auto_entry_career_id === s || r.auto_qualify_career_ids.includes(s), l = this.checkDm(r, t.qualification ?? {}) + r.dm_next_qualification + Number(r.permanent_qualification_dm_by_career[s] ?? 0) - r.failed_qualifications_this_term, c = a || (d = t.qualification) != null && d.automatic ? null : this.roller.roll2D(l), u = a || ((_ = t.qualification) == null ? void 0 : _.automatic) || !!(c && c.total >= Number(((m = t.qualification) == null ? void 0 : m.target) ?? 0));
    return r.dm_next_qualification = 0, u ? (r.failed_qualifications_this_term = 0, n && (r.pending_transfer_career_id = null), r.auto_qualify_career_ids = r.auto_qualify_career_ids.filter((p) => p !== s), r.notes.push(`Qualified for ${t.name ?? s}.`)) : (r.failed_qualifications_this_term += 1, r.notes.push(`Failed qualification for ${t.name ?? s}${c ? ` (${c.total})` : ""}.`)), { career: t, roll: c, qualified: u, character: r };
  }
  startTerm(e, s, t) {
    var m;
    const r = this.rules.career(s);
    if (!r) throw new Error(`Unknown career: ${s}`);
    const i = this.assignmentIds(r), n = t ?? i[0];
    if (!this.assignmentData(r, n)) throw new Error(`Unknown assignment ${n} for ${s}`);
    const a = f(e), l = a.term_history.filter((p) => p.career_id === s).length, c = !!r.all_commissioned || a.starts_commissioned_career_id === s || !!a.completed_careers.find((p) => p.career_id === s && p.commissioned), u = a.pending_transfer_career_id === s || a.pending_transfer_career_id === "any" ? a.pending_transfer_rank : null, d = u != null ? Number(u) : c ? Number(a.starts_commissioned_rank ?? 1) : 0, _ = {
      career_id: s,
      assignment_id: n,
      term_number: l + 1,
      overall_term_number: a.total_terms + a.pre_career_terms + 1,
      rank: d,
      rank_title: this.rankTitle(r, c, d),
      commissioned: c,
      events: [],
      skills_gained: [],
      survived: null,
      advanced: null,
      mishap: null,
      basic_training: l === 0 && !r.hiver_no_basic_training,
      benefit_forfeited: !1,
      survival_roll_total: null,
      advancement_roll_total: null,
      cover_career_id: null,
      frozen_watch: !1
    };
    if (a.current_term = _, a.pending_transfer_career_id = null, a.pending_transfer_rank = null, _.basic_training) {
      for (const p of Object.values(((m = r.skill_tables) == null ? void 0 : m.service_skills) ?? {}).filter((v) => typeof v == "string")) {
        const v = this.applySkillOrStat(a, p, 0);
        v && _.skills_gained.push(v);
      }
      this.applyRankBonus(a, r, _);
    }
    for (const p of r.career_start_skills ?? []) {
      const v = this.applySkillOrStat(a, String(p), 0);
      v && _.skills_gained.push(v);
    }
    return a.phase = "career", a.notes.push(`Started ${r.name ?? s} term ${_.term_number}.`), { career: r, term: _, character: a };
  }
  rollOnSkillTable(e, s) {
    const t = f(e), r = this.requireCurrentTerm(t), i = this.rules.career(r.career_id), n = this.rollOnCareerSkillTable(t, i, s);
    return n.note && r.skills_gained.push(n.note), { career: i, tableId: s, roll: n.roll, result: n.entry, character: t };
  }
  survivalRoll(e) {
    const s = f(e), t = this.requireCurrentTerm(s), r = this.rules.career(t.career_id);
    if (r.no_survival)
      return t.survived = !0, t.survival_roll_total = null, s.notes.push(`${r.name ?? t.career_id} has no survival roll.`), { career: r, roll: null, survived: !0, character: s };
    const i = this.assignmentData(r, t.assignment_id), n = r.survival ?? i.survival ?? {}, a = this.checkDm(s, n) + s.dm_next_survival, l = this.roller.roll2D(a), c = l.natural !== 2 && l.total >= Number(n.target ?? 0);
    return t.survived = c, t.survival_roll_total = l.total, s.dm_next_survival = 0, c || t.events.push("Failed survival roll; roll on the Mishap table."), s.notes.push(`${c ? "Passed" : "Failed"} survival in ${r.name ?? t.career_id}.`), { career: r, roll: l, survived: c, character: s };
  }
  eventRoll(e) {
    var l;
    const s = f(e), t = this.requireCurrentTerm(s), r = this.rules.career(t.career_id), i = this.roller.roll2D(s.dm_next_events), n = String(((l = r.events) == null ? void 0 : l[String(Math.max(2, Math.min(12, i.total)))]) ?? "No event.");
    t.events.push(n), this.applyInlineEventEffects(s, t, n), this.applyCareerTextEffects(s, t, n, !1);
    let a = null;
    if (/Life Event|Life event|Life Events Table/i.test(n)) {
      const c = this.lifeEventRoll(s, this.isAslanLifeEventCharacter(s));
      a = { roll: c.roll, event: c.event, subEvent: c.subEvent ?? null }, Object.assign(s, c.character);
    }
    return s.dm_next_events = 0, s.notes.push(`Career event: ${n}`), { career: r, roll: i, event: n, lifeEvent: a, character: s };
  }
  lifeEventRoll(e, s = !1) {
    var d;
    const t = f(e), r = s ? (d = this.rules.table("aslan_life_events").aslan_life_events) == null ? void 0 : d.results : this.rules.table("life_events").entries, i = this.roller.roll2D(), n = String(Math.max(2, Math.min(12, i.total))), a = r == null ? void 0 : r[n], l = typeof a == "string" ? a.split(":")[0] : (a == null ? void 0 : a.title) ?? "Life Event", c = typeof a == "string" ? a : (a == null ? void 0 : a.text) ?? "Life Event.";
    let u = null;
    if (!s && (a != null && a.sub_table)) {
      const _ = this.roller.rollD(6);
      return u = String(a.sub_table[String(_.total)] ?? ""), this.applyLifeEventEffects(t, l, `${c} ${u}`, s), t.notes.push(`Life event: ${l}; ${u}`), { roll: i, event: { title: l, text: c }, subEvent: u, character: t };
    }
    return this.applyLifeEventEffects(t, l, c, s), t.notes.push(`Life event: ${l}.`), { roll: i, event: { title: l, text: c }, character: t };
  }
  resolveLifeEventChoice(e, s) {
    const t = f(e), r = t.pending_life_event_choice;
    if (!r) throw new Error("No pending life event choice.");
    const i = String(r.kind ?? "");
    if (i === "relationship_end" || i === "betrayal") {
      const n = s === "enemy" ? "enemy" : "rival", a = t.associates.findIndex((l) => ["ally", "contact"].includes(l.kind));
      a >= 0 && i === "betrayal" ? t.associates[a] = { kind: n, description: `Former ${t.associates[a].kind} betrayed you` } : t.associates.push({ kind: n, description: `${n} from life event` });
    } else if (i === "crime")
      if (s === "prisoner") t.forced_next_career_id = "prisoner";
      else {
        const n = t.current_term;
        n ? n.benefit_forfeited = !0 : t.pending_benefit_rolls = Math.max(0, t.pending_benefit_rolls - 1);
      }
    else if (i === "pre_career_any_skill") {
      const n = Number(r.level ?? 0), [a, l, c] = C(/\d+$/.test(s) ? s : `${s} ${n}`);
      String(r.excluded ?? "").includes(a) || k(t, a, c, l, !0);
    } else i === "pre_career_war_choice" && (s === "drifter" ? t.forced_next_career_id = "drifter" : s === "draft" && (t.pending_life_event_choice = { kind: "draft", options: ["army", "marine", "navy"] }));
    return t.pending_life_event_choice = null, t.notes.push(`Resolved life event choice: ${s}.`), { choice: s, character: t };
  }
  resolveCareerEventChoice(e, s) {
    return this.resolveCareerChoice(e, "event", s);
  }
  resolveCareerMishapChoice(e, s) {
    return this.resolveCareerChoice(e, "mishap", s);
  }
  mishapRoll(e) {
    var l;
    const s = f(e), t = this.requireCurrentTerm(s), r = this.rules.career(t.career_id), i = this.roller.rollD(6), n = String(((l = r.mishaps) == null ? void 0 : l[String(Math.max(1, Math.min(6, i.total)))]) ?? "Mishap.");
    t.mishap = n;
    const a = !!r.mishap_no_eject || /not ejected|not have to leave|stay (?:in|on) (?:this )?career|remain in (?:the|this) career/i.test(n);
    return t.survived = !!a, t.events.push(n), this.applyInlineEventEffects(s, t, n), this.applyCareerTextEffects(s, t, n, !0), s.force_career_end = !a, s.notes.push(`Career mishap: ${n}`), { career: r, roll: i, mishap: n, character: s };
  }
  advancementRoll(e) {
    const s = f(e), t = this.requireCurrentTerm(s), r = this.rules.career(t.career_id);
    if (r.hiver_career) return this.hiverAdvancementRoll(s, r, t);
    const i = this.assignmentData(r, t.assignment_id), n = r.advancement ?? i.advancement ?? {}, a = this.checkDm(s, n) + s.dm_next_advancement + s.dm_permanent_advancement + Number(s.permanent_advancement_dm_by_career[t.career_id] ?? 0), l = this.roller.roll2D(a), c = l.total >= Number(n.target ?? 0);
    return t.advanced = c, t.advancement_roll_total = l.total, s.dm_next_advancement = 0, c && (t.rank = Math.min(6, t.rank + 1), t.rank_title = this.rankTitle(r, t.commissioned, t.rank), this.applyRankBonus(s, r, t)), s.notes.push(`${c ? "Advanced" : "Did not advance"} in ${r.name ?? t.career_id}.`), { career: r, roll: l, advanced: c, character: s };
  }
  commissionRoll(e) {
    const s = f(e), t = this.requireCurrentTerm(s), r = this.rules.career(t.career_id), i = r.commission;
    if (!i) throw new Error(`${r.name ?? t.career_id} does not have commission rolls.`);
    if (t.commissioned || s.term_history.some((_) => _.career_id === t.career_id && _.commissioned))
      throw new Error("Already commissioned in this career.");
    if (t.term_number > 1 && h(s, "SOC") < 9) throw new Error("Commission after the first term requires SOC 9+.");
    const n = -(t.term_number - 1), a = s.academy_commission_career_id === t.career_id ? s.academy_commission_dm : 0, l = s.completed_careers.length === 0 ? Number(s.pre_career_permanent_dms.first_career_commission_dm ?? 0) : 0, c = this.checkDm(s, i) + n + a + l + s.dm_next_advancement + s.dm_permanent_advancement, u = this.roller.roll2D(c), d = u.total >= Number(i.target ?? 8);
    return d && (t.commissioned = !0, t.rank = 1, t.rank_title = this.rankTitle(r, !0, 1), this.applyRankBonus(s, r, t), t.advanced = !1), s.dm_next_advancement = 0, s.academy_commission_career_id = null, s.academy_commission_dm = 0, s.notes.push(`${d ? "Commissioned" : "Failed commission"} in ${r.name ?? t.career_id}.`), { career: r, roll: u, commissioned: d, character: s };
  }
  endTerm(e, s = !1, t = "voluntary") {
    const r = f(e), i = this.requireCurrentTerm(r), n = this.rules.career(i.career_id);
    r.term_history.push(i), r.total_terms += 1, r.age += 4;
    const a = this.applyAgingIfNeeded(r);
    if (r.current_term = null, r.failed_qualifications_this_term = 0, s || r.force_career_end || i.survived === !1) {
      const c = r.term_history.filter((d) => d.career_id === i.career_id).length, u = n.mustering_out === null ? 0 : this.benefitRollsEarned(c * Number(n.mustering_out_rolls_per_term ?? 1), i.rank, i.benefit_forfeited);
      r.pending_benefit_rolls += u, r.completed_careers.push({
        career_id: i.career_id,
        assignment_id: i.assignment_id,
        terms_served: c,
        final_rank: i.rank,
        final_rank_title: i.rank_title ?? null,
        commissioned: i.commissioned,
        left_due_to: t,
        benefit_rolls_used: 0,
        benefit_rolls_earned: u
      }), r.force_career_end = !1, r.phase = r.pending_benefit_rolls > 0 ? "mustering" : "career";
    }
    return r.notes.push(`Ended ${n.name ?? i.career_id} term ${i.term_number}.`), { career: n, term: i, aging: a, character: r };
  }
  musterOutRoll(e, s, t = "benefit") {
    var B;
    const r = f(e), i = s ? [...r.completed_careers].reverse().find((E) => E.career_id === s) : r.completed_careers[r.completed_careers.length - 1];
    if (!i) throw new Error("No completed career to muster out from.");
    if (r.pending_benefit_rolls <= 0) throw new Error("No pending benefit rolls.");
    const n = this.rules.career(i.career_id);
    if (n.mustering_out === null) throw new Error(`${n.name ?? i.career_id} grants no mustering-out benefits.`);
    const a = i.final_rank >= 5 ? 1 : 0, l = t === "cash" && r.skills.some((E) => E.name.toLowerCase() === "gambler") ? 1 : 0, c = n.mustering_out_dm_characteristic ? N(h(r, n.mustering_out_dm_characteristic)) : 0, u = r.dm_next_benefit + a + l + c, d = n.hiver_career ? this.roller.roll2D(u) : this.roller.rollD(6), _ = Object.keys(n.mustering_out ?? {}).filter((E) => /^\d+$/.test(E)).map(Number), m = Math.min(..._, n.hiver_career ? 2 : 1), p = Math.max(..._, 7), v = Math.max(m, Math.min(p, d.total + (n.hiver_career ? 0 : u))), b = ((B = n.mustering_out) == null ? void 0 : B[String(v)]) ?? {}, y = t === "cash" && r.cash_rolls_used < 3 && b.cash != null ? "cash" : "benefit", w = b[y];
    if (y === "cash") {
      const E = Number(w ?? 0);
      if (E < 0)
        r.medical_debt = Math.max(0, r.medical_debt + E);
      else {
        const I = Math.min(r.medical_debt, E);
        r.medical_debt -= I, r.credits += E - I;
      }
      r.cash_rolls_used += 1;
    } else
      this.applyMusterBenefit(r, String(w ?? "Benefit"));
    return r.pending_benefit_rolls -= 1, i.benefit_rolls_used += 1, r.dm_next_benefit = 0, r.pending_benefit_rolls <= 0 && (r.phase = "skill_package"), r.notes.push(`Mustering out ${y}: ${w}.`), { career: n, roll: d, tableRoll: v, column: y, result: w, character: r };
  }
  applyInjury(e, s) {
    var l;
    const t = f(e), r = s ? { dice: [], natural: s, total: s, dm: 0 } : this.roller.rollD(6), n = ((l = this.rules.table("injury").entries) == null ? void 0 : l[String(Math.max(1, Math.min(6, r.total)))]) ?? {}, a = this.injuryPending(n, r.total);
    return a ? (t.pending_injury_choice = a, t.notes.push(`Injury: ${n.title ?? "Injury"}; characteristic choice pending.`)) : t.notes.push(`Injury: ${n.title ?? "Lightly Injured"}; no permanent effect.`), { roll: r, entry: n, pendingChoice: a, character: t };
  }
  resolveInjuryChoice(e, s) {
    const t = f(e), r = t.pending_injury_choice;
    if (!r) throw new Error("No pending injury choice.");
    const i = r.choices;
    if (i != null && i.length && !i.includes(s)) throw new Error(`${s} is not a valid injury choice.`);
    const n = Number(r.damage_to_chosen ?? 0), a = Number(r.auto_reduce_others ?? 0), l = ["STR", "DEX", "END"].filter((m) => m !== s), c = Math.min(h(t, s), n), u = l.map((m) => ({ stat: m, loss: Math.min(h(t, m), a) })).filter((m) => m.loss > 0), d = c + u.reduce((m, p) => m + p.loss, 0), _ = d * 5e3;
    return t.pending_injury_treatment_choice = {
      chosen_stat: s,
      damage_to_chosen: n,
      auto_reduce_others: a,
      secondary_losses: u,
      total_loss: d,
      gross_debt: _,
      net_debt: _,
      title: r.title ?? "Injury"
    }, t.pending_injury_choice = null, { chosenStat: s, totalLoss: d, grossDebt: _, character: t };
  }
  resolveInjuryPayment(e, s) {
    const t = f(e), r = t.pending_injury_treatment_choice;
    if (!r) throw new Error("No pending injury treatment choice.");
    if (s)
      t.medical_debt += Number(r.net_debt ?? r.gross_debt ?? 0);
    else {
      const i = String(r.chosen_stat);
      g(t, i, h(t, i) - Number(r.damage_to_chosen ?? 0));
      for (const n of r.secondary_losses ?? [])
        g(t, n.stat, h(t, n.stat) - n.loss);
    }
    return t.pending_injury_treatment_choice = null, t.notes.push(s ? "Paid for injury treatment." : "Accepted injury characteristic loss."), { paid: s, character: t };
  }
  checkDm(e, s) {
    let t = N(h(e, s == null ? void 0 : s.characteristic));
    for (const r of (s == null ? void 0 : s.modifiers) ?? [])
      r.type === "per_previous_term" && (t += Number(r.dm ?? 0) * e.total_terms), r.type === "per_previous_career" && (t += Number(r.dm ?? 0) * e.completed_careers.length), r.type === "characteristic_threshold" && h(e, r.characteristic) >= Number(r.threshold ?? 0) && (t += Number(r.dm ?? 0));
    return t;
  }
  applyStatBlock(e, s) {
    for (const [t, r] of Object.entries(s))
      (A.includes(t) || t === "PSI" || t === "CHA") && (g(e, t, h(e, t) + Number(r)), t === "PSI" && (e.psi = h(e, "PSI")));
  }
  applyPreCareerOutcome(e, s, t, r) {
    var l, c, u, d, _, m;
    this.applyStatBlock(e, t), t.EDU_penalty_dice === "D3" && g(e, "EDU", h(e, "EDU") - this.roller.d3()), t.jack_of_all_trades && k(e, "Jack-of-All-Trades", Number(t.jack_of_all_trades), null, !0), this.applySkillResults(e, t.fixed_skills ?? [], 1);
    const i = ((l = e.pre_career_status) == null ? void 0 : l.skill_pool) ?? this.preCareerSkillPool(s, null, null), n = Number(t.skills_at_level_1 ?? 0) + Number(t.skills_upgrade_from_enrollment ?? 0) + Number(t.skills_from_enrollment_1 ?? 0);
    this.applyChosenSkills(e, r, i, n, 1), this.applyChosenSkills(e, r.slice(n), i, Number(t.additional_skills_from_enrollment_0 ?? 0), 0);
    for (const p of t.associates ?? [])
      e.associates.push({ kind: p.kind ?? "contact", description: p.description ?? `${s.name} associate` });
    const a = t.permanent ?? {};
    for (const p of a.advancement_dm_careers ?? [])
      e.permanent_advancement_dm_by_career[p] = Number(a.advancement_dm ?? 0);
    if (a.qualification_dm) {
      for (const p of this.rules.careerList()) e.permanent_qualification_dm_by_career[p.id] = Number(a.qualification_dm);
      for (const p of a.bonus_qualify_careers ?? []) e.permanent_qualification_dm_by_career[p] = Number(a.bonus_qualify_dm ?? 0);
    }
    a.psion_career_auto_entry && e.auto_qualify_career_ids.push("psion"), t.auto_entry && ((c = e.pre_career_status) != null && c.career_id) && (e.auto_entry_career_id = String(e.pre_career_status.career_id)), t.commission_dm && ((u = e.pre_career_status) != null && u.career_id) && (e.academy_commission_career_id = String(e.pre_career_status.career_id), e.academy_commission_dm = Number(t.commission_dm)), t.starts_commissioned_rank && ((d = e.pre_career_status) != null && d.career_id) && (e.starts_commissioned_career_id = String(e.pre_career_status.career_id), e.starts_commissioned_rank = Number(t.starts_commissioned_rank)), (_ = t.permanent) != null && _.auto_rank && ((m = e.pre_career_status) != null && m.career_id) && (e.starts_commissioned_career_id = String(e.pre_career_status.career_id), e.starts_commissioned_rank = Number(t.permanent.auto_rank), e.auto_entry_career_id = String(e.pre_career_status.career_id));
  }
  preCareerSkillPool(e, s, t) {
    const r = G(e);
    return [
      ...e.skill_list ?? [],
      ...r,
      ...e.enrollment_skill_pool ?? [],
      ...(s == null ? void 0 : s.skill_list) ?? [],
      ...(t == null ? void 0 : t.skill_list) ?? []
    ].map(String);
  }
  applyChosenSkills(e, s, t, r, i) {
    const n = Array.isArray(s) ? s.map(String) : typeof s == "string" ? s.split(",").map((c) => c.trim()).filter(Boolean) : [], a = n.length ? n : t, l = [];
    for (const c of a.slice(0, Math.max(0, r))) {
      const u = t.find((p) => p.toLowerCase() === c.toLowerCase()) ?? c, [d, _, m] = C(/\d+$/.test(u.trim()) ? u : `${u} ${i}`);
      l.push(k(e, d, m, _, !0));
    }
    return l;
  }
  applyAslanPastDeedBonus(e, s) {
    const t = s[`bonus_${e.gender === "female" ? "female" : "male"}`] ?? s.bonus;
    if (!t) return;
    /Enemy/i.test(t) && e.associates.push({ kind: "enemy", description: "Enemy from Aslan past deeds" }), /Ally/i.test(t) && e.associates.push({ kind: "ally", description: "Ally from Aslan past deeds" }), /Contact/i.test(t) && e.associates.push({ kind: "contact", description: "Contact from Aslan past deeds" });
    const r = String(t).split(/\s+or\s+|and/i).map((i) => i.trim()).filter((i) => /\d$/.test(i));
    r.length === 1 && this.applySkillOrStat(e, r[0], 0), r.length > 1 && (e.pending_life_event_choice = { kind: "pre_career_any_skill", options: r, level: 0, prompt: s.label });
  }
  applySkillResults(e, s, t) {
    return s.map((r) => this.applySkillOrStat(e, r, t)).filter(Boolean);
  }
  rollAgeOverride(e) {
    return e === "22+2D3" ? 22 + this.roller.d3() + this.roller.d3() : null;
  }
  careerBlocked(e, s) {
    var r, i, n, a, l, c;
    if (e.banned_career_ids.includes(s.id)) return "career is banned by a prior result";
    if (e.forced_next_career_id && e.forced_next_career_id !== s.id) return `must enter ${e.forced_next_career_id}`;
    if ((r = s.blocked_societies) != null && r.includes(e.society_id)) return `blocked for ${e.society_id}`;
    if ((i = s.allowed_societies) != null && i.length && !s.allowed_societies.includes(e.society_id)) return `not available for ${e.society_id}`;
    if ((n = s.blocked_species) != null && n.includes(e.species_id)) return `blocked for ${e.species_id}`;
    if ((a = s.allowed_species) != null && a.length && !s.allowed_species.includes(e.species_id)) return `not available for ${e.species_id}`;
    const t = this.rules.species(e.species_id);
    return (l = t == null ? void 0 : t.blocked_careers) != null && l.includes(s.id) ? `blocked for ${t.name ?? e.species_id}` : (c = t == null ? void 0 : t.allowed_species_careers) != null && c.length && !t.allowed_species_careers.includes(s.id) ? "not in species career list" : null;
  }
  requireCurrentTerm(e) {
    if (!e.current_term) throw new Error("No active career term.");
    return e.current_term;
  }
  assignmentIds(e) {
    return Array.isArray(e.assignments) ? e.assignments.map((s) => String(s.id)) : Object.keys(e.assignments ?? {});
  }
  assignmentData(e, s) {
    var t, r, i;
    if (Array.isArray(e.assignments)) {
      const n = e.assignments.find((a) => a.id === s) ?? null;
      return {
        ...n ?? {},
        survival: ((t = e.survival) == null ? void 0 : t[s]) ?? (n == null ? void 0 : n.survival),
        advancement: ((r = e.advancement) == null ? void 0 : r[s]) ?? (n == null ? void 0 : n.advancement)
      };
    }
    return ((i = e.assignments) == null ? void 0 : i[s]) ?? null;
  }
  rankTrack(e, s) {
    var t, r, i, n, a, l;
    return s && ((t = e.ranks) != null && t.officer) ? e.ranks.officer : !s && ((r = e.ranks) != null && r.enlisted) ? e.ranks.enlisted : ((i = e.ranks) == null ? void 0 : i.default) ?? ((n = e.ranks) == null ? void 0 : n.all) ?? ((a = e.ranks) == null ? void 0 : a.enlisted) ?? ((l = e.ranks) == null ? void 0 : l.officer) ?? {};
  }
  rankTitle(e, s, t) {
    var r, i;
    return ((i = (r = this.rankTrack(e, s)) == null ? void 0 : r[String(t)]) == null ? void 0 : i.title) ?? null;
  }
  applyRankBonus(e, s, t) {
    var n, a;
    const r = (a = (n = this.rankTrack(s, t.commissioned)) == null ? void 0 : n[String(t.rank)]) == null ? void 0 : a.bonus;
    if (!r) return;
    const i = this.applySkillOrStat(e, String(r), 1);
    i && t.skills_gained.push(i);
  }
  rollOnExternalSkillTable(e, s, t) {
    const r = this.rules.career(s);
    return r ? this.rollOnCareerSkillTable(e, r, t).note : null;
  }
  hiverAdvancementRoll(e, s, t) {
    var _, m, p, v;
    const r = this.rules.species(e.species_id) ?? this.rules.species("hiver") ?? {}, i = s.hiver_advancement_table ?? r.hiver_advancement_table ?? {}, n = N(h(e, "SOC")) + e.dm_next_advancement + e.dm_permanent_advancement, a = this.roller.roll2D(n), l = Number(i.senior_min ?? 10), c = Number(i.manipulator_min ?? 15), u = t.rank;
    let d = u;
    if (a.total >= c && u < 2 ? d = 2 : a.total >= l && u < 1 && (d = 1), t.advanced = d > u, t.advancement_roll_total = a.total, e.dm_next_advancement = 0, d > u) {
      if (t.rank = d, t.rank_title = this.rankTitle(s, t.commissioned, d) ?? { 1: "Senior", 2: "Manipulator" }[d] ?? null, d === 1 && !e.hiver_senior_bonus_awarded) {
        e.hiver_senior_bonus_awarded = !0;
        const b = s.hiver_senior_bonus ?? ((m = (_ = r.hiver_nest_benefits) == null ? void 0 : _[e.hiver_nest_type ?? "generalist"]) == null ? void 0 : m.senior_bonus);
        b && this.applySkillOrStat(e, String(b), 1);
      }
      if (d === 2 && !e.hiver_manipulator_bonus_awarded) {
        e.hiver_manipulator_bonus_awarded = !0;
        const b = s.hiver_manipulator_bonus ?? ((v = (p = r.hiver_nest_benefits) == null ? void 0 : p[e.hiver_nest_type ?? "generalist"]) == null ? void 0 : v.manipulator_bonus);
        if (b) for (const y of String(b).split(",")) this.applySkillOrStat(e, y.trim(), 1);
      }
    }
    return e.notes.push(`Hiver advancement total ${a.total}; rank ${t.rank}.`), { career: s, roll: a, advanced: t.advanced, character: e };
  }
  rollOnCareerSkillTable(e, s, t) {
    var l;
    const r = (l = s.skill_tables) == null ? void 0 : l[t];
    if (!r) throw new Error(`Unknown skill table ${t} for ${s.id}`);
    if (r.requires_edu && h(e, "EDU") < Number(r.requires_edu)) throw new Error(`${r.name ?? t} requires EDU ${r.requires_edu}+.`);
    const i = this.roller.rollD(6), n = String(r[String(Math.max(1, Math.min(6, i.total)))] ?? ""), a = this.applySkillOrStat(e, n, 1);
    return { roll: i, entry: n, note: a };
  }
  applySkillOrStat(e, s, t) {
    const r = s.split(/\s+or\s+/i)[0].replace(/\b(any|one of)\b/gi, "").trim(), i = r.match(/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+(\d+)/);
    if (i) {
      const d = i[1];
      return g(e, d, h(e, d) + Number(i[2])), d === "PSI" && (e.psi = h(e, "PSI")), `${d} +${i[2]}`;
    }
    const n = r.replace(/\s*\((?:any|Small Craft or Spacecraft|riding or Training)\)\s*/i, "").trim();
    if (!n) return null;
    const [a, l, c] = C(/\d+$/.test(n) ? n : `${n} ${t}`), u = typeof l == "string" && l.toLowerCase() === "any" ? null : l;
    return k(e, X(a), c, u, !0);
  }
  applyInlineEventEffects(e, s, t) {
    const r = t.match(/DM\+(\d+) to (?:any one |your next )Benefit/i);
    r && (e.dm_next_benefit += Number(r[1]));
    const i = t.match(/DM\+(\d+) to your next Advancement/i);
    if (i && (e.dm_next_advancement += Number(i[1])), /automatically promoted/i.test(t)) {
      const c = this.rules.career(s.career_id);
      s.rank = Math.min(6, s.rank + 1), s.advanced = !0, s.rank_title = this.rankTitle(c, s.commissioned, s.rank), this.applyRankBonus(e, c, s);
    }
    const n = [...t.matchAll(/\b([A-Z][A-Za-z-]+(?:\s+[A-Z][A-Za-z-]+)?(?:\s+\([^)]+\))?)\s+(\d)\b/g)];
    for (const c of n.slice(0, 2)) {
      const [u, d, _] = C(`${c[1]} ${c[2]}`);
      if (["Roll", "Gain", "Table", "DM"].includes(u)) continue;
      const m = k(e, u, _, d, !0);
      s.skills_gained.push(m);
    }
    /Gain (?:a|one) Contact/i.test(t) && e.associates.push({ kind: "contact", description: `Contact from ${s.career_id} event` }), /Gain (?:an|one) Ally/i.test(t) && e.associates.push({ kind: "ally", description: `Ally from ${s.career_id} event` }), /Gain (?:an|one) Enemy/i.test(t) && e.associates.push({ kind: "enemy", description: `Enemy from ${s.career_id} event` }), /Gain (?:a|one) Rival/i.test(t) && e.associates.push({ kind: "rival", description: `Rival from ${s.career_id} event` });
    const a = j(t);
    a.length && (e.pending_career_event_choice = { kind: "skill_choice", options: a, level: 1, prompt: t });
    const l = Z(t);
    l && (e.pending_career_event_choice = { kind: "skill_check", ...l, prompt: t }), /transfer to (?:the )?Marines/i.test(t) && (e.pending_transfer_career_id = "marine"), /transfer to (?:the )?Army/i.test(t) && (e.pending_transfer_career_id = "army"), /transfer to (?:the )?Confederation Army/i.test(t) && (e.pending_transfer_career_id = "confederation_army"), /transfer to any other non-military career|transfer to any other career|transfer to any career/i.test(t) && (e.pending_transfer_career_id = "any"), /you are ejected from this career|losing your place|forced out of the career/i.test(t) && (e.ejected_by_event = !0), /lose (?:one|1) Benefit roll|Lose one benefit roll|Lose one Benefit roll/i.test(t) && (s.benefit_forfeited = !0);
  }
  applyCareerTextEffects(e, s, t, r) {
    var c;
    if (/Frozen Watch|cold sleep|cryoberth/i.test(t) && (s.frozen_watch = !0, e.age = Math.max(0, e.age - 4), s.advanced = !1, s.skills_gained.push("Frozen Watch: no skill or advancement roll this term")), /Severely injured|seriously injured|Injured|suffer injuries|Injury Table|Injury table|injure you/i.test(t)) {
      const u = /result of 2|roll of 2/i.test(t) ? 2 : void 0, d = this.applyInjury(e, u);
      Object.assign(e, d.character);
    }
    const i = [...t.matchAll(/\b(STR|DEX|END|INT|EDU|SOC|PSI|CHA|TER|RES|REP)\s*(?:−|-)\s*(\d+)/gi)];
    for (const u of i) {
      const d = u[1].toUpperCase(), _ = Number(u[2]);
      d === "REP" ? e.reputation = Math.max(0, e.reputation - _) : d === "RES" ? g(e, "SOC", h(e, "SOC") - _) : g(e, d, h(e, d) - _);
    }
    const n = t.match(/Reduce (?:your )?(STR|DEX|END|INT|EDU|SOC|PSI|CHA|TER|RES|REP)(?: or (STR|DEX|END|INT|EDU|SOC|PSI|CHA|TER|RES|REP))? by (\d+)/i);
    if (n) {
      const u = r ? "pending_career_mishap_choice" : "pending_career_event_choice";
      e[u] = {
        kind: "stat_choice",
        choices: [n[1], n[2]].filter(Boolean),
        amount: Number(n[3]),
        prompt: t
      };
    }
    const a = j(t);
    if (a.length) {
      const u = r ? "pending_career_mishap_choice" : "pending_career_event_choice";
      ((c = e[u]) == null ? void 0 : c.kind) !== "skill_check" && (e[u] = { kind: "skill_choice", options: a, level: 1, prompt: t });
    }
    const l = t.match(/rank (?:is )?reduced by (?:−|-)(\d+)|lose one level of rank|demoted one Rank/i);
    if (l) {
      const u = l[1] ? Number(l[1]) : 1;
      s.rank = Math.max(0, s.rank - u);
      const d = this.rules.career(s.career_id);
      s.rank_title = this.rankTitle(d, s.commissioned, s.rank), s.rank === 0 && /below zero|takes it below zero/i.test(t) && (e.force_career_end = !0);
    }
    if (/lose (?:all|any) Benefit rolls|no Benefit rolls/i.test(t) && (s.benefit_forfeited = !0), /must take (?:the )?Prisoner/i.test(t) && (e.forced_next_career_id = "prisoner"), /may not re-enlist|may not re-enter/i.test(t) && e.banned_career_ids.push(s.career_id), r && /gain (?:D3|1D|D6) Contacts/i.test(t)) {
      const u = /D3/i.test(t) ? this.roller.d3() : this.roller.d6();
      for (let d = 0; d < u; d++) e.associates.push({ kind: "contact", description: `Contact from ${s.career_id} mishap` });
    }
  }
  applyLifeEventEffects(e, s, t, r) {
    if (/Sickness or Injury/i.test(s) || /Roll on the Injury/i.test(t)) {
      const i = this.applyInjury(e);
      Object.assign(e, i.character);
      return;
    }
    /Ending of Relationship/i.test(s) ? e.pending_life_event_choice = { kind: "relationship_end", options: ["rival", "enemy"], prompt: t } : /Improved Relationship|New Relationship/i.test(s) ? e.associates.push({ kind: "ally", description: "Ally from life event" }) : /New Contact/i.test(s) ? e.associates.push({ kind: "contact", description: "Contact from life event" }) : /Betrayal/i.test(s) ? e.pending_life_event_choice = { kind: "betrayal", options: ["rival", "enemy"], prompt: t } : /Travel/i.test(s) ? e.dm_next_qualification += 2 : /Good Fortune/i.test(s) ? (e.good_fortune_benefit_dm += 2, e.dm_next_benefit += 2) : /Crime|Dishonoured/i.test(s) ? e.pending_life_event_choice = { kind: "crime", options: ["lose_benefit", "prisoner"], prompt: t } : /Aliens/i.test(t) ? (k(e, r ? "Tolerance" : "Science", 1, null, !0), e.associates.push({ kind: "contact", description: "Alien contact from life event" })) : /Psionics|Psionic/i.test(t) ? (e.pending_life_event_choice = { kind: "psionic_institute", options: ["test_psi", "ignore"], prompt: t }, e.auto_qualify_career_ids.push("psion")) : /Alien Artefact|Ancient Technology/i.test(t) ? e.equipment.push({ name: /Ancient Technology/i.test(t) ? "Ancient Technology" : "Alien Artefact", quantity: 1, notes: "Life event" }) : /Contact with Government|Contact with Clan Leaders/i.test(t) ? e.associates.push({ kind: "contact", description: "High-level contact from life event" }) : r && /Territory Challenge/i.test(s) ? e.pending_life_event_choice = { kind: "aslan_territory_challenge", options: ["increase", "decrease"], prompt: t } : r && /Clan Event/i.test(s) ? this.applyAslanClanEvent(e) : r && /Duel/i.test(s) && (e.pending_life_event_choice = { kind: "aslan_duel", options: ["accept", "refuse"], prompt: t });
  }
  applyAslanClanEvent(e) {
    var i;
    const s = ((i = this.rules.table("aslan_life_events").clan_events) == null ? void 0 : i.results) ?? {}, t = this.roller.rollD(6), r = String(s[String(t.total)] ?? "");
    /extra Benefit roll/i.test(r) && (e.pending_benefit_rolls += 1), /DM\+2 to your next advancement/i.test(r) && (e.dm_next_advancement += 2), /SOC \+1/i.test(r) && g(e, "SOC", h(e, "SOC") + 1), /Ally/i.test(r) && e.associates.push({ kind: "ally", description: "Ally from clan event" }), /Enemy/i.test(r) && e.associates.push({ kind: "enemy", description: "Enemy family from clan event" }), /DM-2 to survival/i.test(r) && (e.dm_next_survival -= 2), /lose one Benefit roll|no Benefit rolls/i.test(r) && e.current_term && (e.current_term.benefit_forfeited = !0), /DM-4 to advancement/i.test(r) && (e.dm_next_advancement -= 4), e.notes.push(`Aslan clan event: ${r}`);
  }
  isAslanLifeEventCharacter(e) {
    var s;
    return e.species_id.includes("aslan") && ((s = e.current_term) == null ? void 0 : s.career_id) !== "aslan_outcast";
  }
  resolveCareerChoice(e, s, t) {
    const r = f(e), i = s === "event" ? "pending_career_event_choice" : "pending_career_mishap_choice", n = r[i];
    if (!n) throw new Error(`No pending career ${s} choice.`);
    const a = String(n.kind ?? "");
    if (a === "skill_choice" || a === "free_skill_choice") {
      if (Array.isArray(n.options) && n.options.length && !n.options.includes(t)) throw new Error(`${t} is not a valid choice.`);
      const l = Number(n.level ?? 1), [c, u, d] = C(/\d+$/.test(t) ? t : `${t} ${l}`);
      k(r, c, d, u, !0);
    } else if (a === "stat_choice") {
      if (Array.isArray(n.choices) && n.choices.length && !n.choices.includes(t)) throw new Error(`${t} is not a valid choice.`);
      const l = t;
      g(r, l, h(r, l) - Number(n.amount ?? 1));
    } else if (a === "skill_check") {
      if (Array.isArray(n.skills) && n.skills.length && !n.skills.includes(t)) throw new Error(`${t} is not a valid skill check.`);
      const l = this.roller.roll2D(this.skillDm(r, t)), c = l.total >= Number(n.target ?? 8);
      r.notes.push(`${t} check ${c ? "succeeded" : "failed"} (${l.total}).`);
      const u = Array.isArray(n.successSkillOptions) ? n.successSkillOptions : [];
      if (c && u.length)
        return r.pending_career_event_choice = { kind: "skill_choice", options: u, level: 1, prompt: n.prompt }, { roll: l, succeeded: c, character: r };
      if (!c && /Mishap/i.test(String(n.prompt ?? "")) && r.current_term) {
        const d = this.mishapRoll(r);
        Object.assign(r, d.character);
      }
    } else a === "transfer" && (r.pending_transfer_career_id = t);
    return r[i] = null, { choice: t, character: r };
  }
  skillDm(e, s) {
    const [t, r] = O(s), i = e.skills.find((a) => a.name === t && (a.speciality ?? null) === r), n = e.skills.find((a) => a.name === t && !a.speciality);
    return (i == null ? void 0 : i.level) ?? (n == null ? void 0 : n.level) ?? -3;
  }
  applyPreCareerEventEffects(e, s, t, r) {
    if (/Carouse 1/i.test(t) && k(e, "Carouse", 1, null, !0), /Increase your SOC by \+1/i.test(t) && g(e, "SOC", h(e, "SOC") + 1), /Gain D3 Allies/i.test(t)) {
      const i = this.roller.d3();
      for (let n = 0; n < i; n++) e.associates.push({ kind: "ally", description: "Ally from pre-career education" });
    }
    /Gain a Rival/i.test(t) && e.associates.push({ kind: "rival", description: "Rival from pre-career education" }), /Gain an Enemy/i.test(t) && e.associates.push({ kind: "enemy", description: "Enemy from pre-career education" }), /Gain one Ally/i.test(t) && e.associates.push({ kind: "ally", description: "Ally from pre-career education" }), /gain an Enemy in a rival clan/i.test(t) && e.associates.push({ kind: "enemy", description: "Enemy in a rival clan" }), (/any one skill at level 0/i.test(t) || /any skill of your choice/i.test(t)) && (e.pending_life_event_choice = { kind: "pre_career_any_skill", level: 0, excluded: ["Jack-of-All-Trades"], prompt: t }), /crash and fail to graduate|cannot redeem yourself in time to graduate/i.test(t) && (e.pre_career_status = { ...e.pre_career_status ?? {}, forced_graduation_failure: !0 }), /Prisoner career in your next term/i.test(t) && s === 4 && (e.forced_next_career_id = "prisoner"), /join the Drifter career next term/i.test(t) && (e.pending_life_event_choice = { kind: "pre_career_war_choice", options: ["drifter", "draft", "avoid"], prompt: t }), r && /become Outcast|must become Outcast/i.test(t) && (e.forced_next_career_id = "aslan_outcast"), r && /Outlaw or Wanderer career without a qualification roll/i.test(t) && e.auto_qualify_career_ids.push("aslan_outlaw", "aslan_wanderer");
  }
  benefitRollsEarned(e, s, t) {
    let r = Math.max(0, e);
    return s >= 1 && (r += 1), s >= 3 && (r += 1), s >= 5 && (r += 1), t && (r = Math.max(0, r - 1)), r;
  }
  applyMusterBenefit(e, s) {
    const t = V(s);
    if (t.length) {
      e.pending_muster_benefit_choice = { options: t, raw: s };
      return;
    }
    for (const r of Y(s)) this.applySingleMusterBenefit(e, r);
  }
  applySingleMusterBenefit(e, s) {
    var c;
    const t = s.trim(), r = t.match(/^(D3|D6)\s+(Contact|Ally|Rival|Enemy)s?$/i);
    if (r) {
      const u = r[1].toUpperCase() === "D3" ? this.roller.d3() : this.roller.d6();
      for (let d = 0; d < u; d++) e.associates.push({ kind: r[2].toLowerCase(), description: `${r[2]} from mustering-out benefit` });
      return;
    }
    const i = t.match(/^(\d+)?\s*(Contact|Ally|Rival|Enemy)s?$/i);
    if (i) {
      const u = Number(i[1] ?? 1);
      for (let d = 0; d < u; d++) e.associates.push({ kind: i[2].toLowerCase(), description: `${i[2]} from mustering-out benefit` });
      return;
    }
    const n = t.match(/^(\d+|D3|D6)?\s*Ship Shares?$/i);
    if (n || /^Ship Share$/i.test(t)) {
      const u = (n == null ? void 0 : n[1]) ?? "1";
      e.ship_shares += u === "D3" ? this.roller.d3() : u === "D6" ? this.roller.d6() : Number(u);
      return;
    }
    const a = t.match(/^(\d+|D3|D6)?\s*Clan Shares?$/i);
    if (a || /^Clan Share$/i.test(t)) {
      const u = (a == null ? void 0 : a[1]) ?? "1";
      e.clan_shares += u === "D3" ? this.roller.d3() : u === "D6" ? this.roller.d6() : Number(u);
      return;
    }
    const l = t.match(/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+(\d+)/i);
    if (l) {
      const u = l[1].toUpperCase();
      u === "REP" ? e.reputation += Number(l[2]) : u === "RES" ? g(e, "SOC", h(e, "SOC") + Number(l[2])) : g(e, u, h(e, u) + Number(l[2])), u === "PSI" && (e.psi = h(e, "PSI"));
      return;
    }
    if (/TAS Membership/i.test(t))
      e.tas_member ? e.ship_shares += 2 : e.tas_member = !0;
    else if (/Reduce Large Debt/i.test(t))
      e.medical_debt = Math.max(0, e.medical_debt - 7e5);
    else if (/Reduce Small Debt/i.test(t))
      e.medical_debt = Math.max(0, e.medical_debt - 7e4);
    else if (/Scout Ship/i.test(t))
      e.equipment.some((u) => u.name === "Scout Ship") ? e.pending_benefit_rolls += 1 : e.equipment.push({ name: "Scout Ship", quantity: 1, notes: "Detached duty; service obligation" });
    else if (/Free Trader|Lab Ship|Yacht/i.test(t)) {
      const u = ((c = t.match(/Free Trader|Lab Ship|Yacht/i)) == null ? void 0 : c[0]) ?? t, d = e.equipment.find((_) => _.name === u);
      d ? d.notes = "Mortgage: additional benefit roll applied" : e.equipment.push({ name: u, quantity: 1, notes: "Mortgage: 1 of 4 benefit rolls paid" });
    } else if (/Weapon|Armou?r|Blade|Gun|Combat Implant|Scientific Equipment|Personal Vehicle|Ship's Boat/i.test(t))
      e.equipment.push({ name: t, quantity: 1, notes: "Mustering-out benefit; player selects exact item within source limits" });
    else {
      const [u, d, _] = C(t);
      _ > 0 && u !== t ? k(e, u, _, d, !0) : e.equipment.push({ name: t, quantity: 1, notes: "Mustering-out benefit" });
    }
  }
  injuryPending(e, s) {
    const t = e.effects ?? [];
    if (!t.length) return null;
    const r = ["STR", "DEX", "END"], i = t.find((l) => l.type === "reduce_physical_random"), n = t.find((l) => l.type === "reduce_choice"), a = t.find((l) => l.type === "reduce_physical_other");
    return i ? {
      roll: s,
      title: e.title ?? "Injury",
      damage_to_chosen: i.amount === "1D" ? this.roller.d6() : Number(i.amount ?? 0),
      auto_reduce_others: Number((a == null ? void 0 : a.amount) ?? 0),
      choices: r,
      prompt: e.text ?? "Choose which physical characteristic takes the damage."
    } : n ? {
      roll: s,
      title: e.title ?? "Injury",
      damage_to_chosen: Number(n.amount ?? 0),
      auto_reduce_others: 0,
      choices: n.characteristics ?? r,
      prompt: e.text ?? "Choose which characteristic takes the damage."
    } : null;
  }
  applyAgingIfNeeded(e) {
    const s = this.rules.species(e.species_id) ?? {}, t = Number(s.aging_starts_term ?? this.rules.table("aging").triggers_at_term ?? 4);
    if (e.total_terms < t) return null;
    const r = this.roller.roll2D(-e.total_terms), i = this.rules.table("aging"), n = this.agingEntry(i, r.total), a = this.applyAgingEffects(e, n.effects ?? []), l = a.some((c) => h(e, c.stat) <= 0);
    if (l) {
      const c = this.roller.d6() * 1e4;
      e.pending_injury_treatment_choice = {
        kind: "aging_crisis",
        gross_debt: c,
        net_debt: c,
        title: "Aging crisis"
      }, e.notes.push("Aging crisis: medical care needed to keep reduced characteristics at 1.");
    }
    return e.notes.push(`Aging roll ${r.total}: ${n.title ?? "Aging"}.`), { roll: r, entry: n, reductions: a, crisis: l };
  }
  agingEntry(e, s) {
    var t, r, i;
    return s <= -6 ? ((t = e.entries) == null ? void 0 : t["-6_or_less"]) ?? {} : s >= 1 ? ((r = e.entries) == null ? void 0 : r["1_or_more"]) ?? {} : ((i = e.entries) == null ? void 0 : i[String(s)]) ?? {};
  }
  applyAgingEffects(e, s) {
    const t = [], r = ["STR", "DEX", "END"], i = ["INT", "EDU", "SOC"];
    for (const n of s) {
      const a = n.type === "reduce_mental" ? i : r, l = Math.min(Number(n.count ?? 1), a.length), c = Number(n.amount ?? 0);
      for (const u of a.slice(0, l))
        g(e, u, h(e, u) - c), t.push({ stat: u, amount: c });
    }
    return t;
  }
  finalizeRobot(e) {
    const s = R();
    return s.character_type = "robot", s.robot_config = e, s.name = String(e.name ?? "Traveller Robot"), s.age = 0, s.characteristics = {
      STR: Number(e.STR ?? 0),
      DEX: Number(e.DEX ?? 0),
      END: Number(e.END ?? 0),
      INT: Number(e.INT ?? 0),
      EDU: Number(e.EDU ?? 0),
      SOC: 0
    }, s.phase = "done", s.notes.push("Created robot placeholder from supplied robot configuration."), { character: s };
  }
  generateNpc() {
    let e = R();
    return e.name = "Generated Traveller", e = this.rollInitialCharacteristics(e).character, e = this.chooseSociety(e, "third_imperium").character, e = this.applySpecies(e, "imperial_human").character, e = this.applyBackgroundSkills(e, ["Admin", "Streetwise", "Vacc Suit"]).character, e = this.applyCareerPackage(e, "scout").character, e.phase = "done", { character: e };
  }
}
function O(o) {
  const e = o.match(/^(.+?)\s*\((.+)\)\s*$/);
  return e ? [e[1].trim(), e[2].trim()] : [o.trim(), null];
}
function C(o) {
  const e = o.trim(), s = e.match(/\s+(\d+)$/), t = s ? Number(s[1]) : 1, r = s ? e.slice(0, s.index).trim() : e, [i, n] = O(r);
  return [i, n, t];
}
function G(o) {
  return [...o.skill_list_male ?? [], ...o.skill_list_female ?? []].map(String);
}
function X(o) {
  return o === "Jack-of-all-Trades" || o === "Jack-of-all-trades" ? "Jack-of-All-Trades" : o.trim();
}
function Y(o) {
  return /\s+and\s+/i.test(o) && !/\s+or\s+/i.test(o) ? o.split(/\s+and\s+/i).map((e) => e.trim()).filter(Boolean) : [o.trim()];
}
function V(o) {
  if (!/\s+or\s+/i.test(o)) return [];
  if (/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+\d+\s+or\s+\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+\d+/i.test(o))
    return o.split(/\s+or\s+/i).map((s) => s.trim()).filter(Boolean);
  if (/Ship's Boat|Air\/Raft|Personal Vehicle|Weapon|Gun|Blade|Armou?r|Combat Implant|Scientific Equipment/i.test(o))
    return o.split(/\s+or\s+/i).map((s) => s.trim()).filter(Boolean);
  const e = o.split(/\s+or\s+/i).map((s) => s.trim()).filter(Boolean);
  return e.every((s) => /\d$/.test(s) || /^[A-Z][A-Za-z -]+(?:\s+\([^)]+\))?$/.test(s)) ? e : [];
}
function j(o) {
  const e = o.match(/Gain (?:one of |one level of |a level of )(.+?)(?:\.|, or transfer| or transfer|$)/i);
  if (!e) return [];
  const s = e[1].replace(/^these skills by one level:\s*/i, "").replace(/^any of:\s*/i, "").replace(/\bat level 1\b/i, "").split(/\s+and\s+DM|\s+and\s+gain|\s+on failure/i)[0].trim();
  return /Benefit|Contact|Ally|Enemy|Rival|DM\+/i.test(s) ? [] : s.split(/,\s*|\s+or\s+/i).map((t) => t.replace(/\bone level in\b/i, "").trim()).filter((t) => /^[A-Z][A-Za-z -]+(?:\s+\([^)]+\))?(?:\s+1)?$/.test(t)).map((t) => /\d$/.test(t) ? t : `${t} 1`);
}
function Z(o) {
  const e = o.match(/Roll\s+([A-Z][A-Za-z -]+?(?:\s+\([^)]+\))?)\s+(\d+)\+(?:\s+or\s+([A-Z][A-Za-z -]+?(?:\s+\([^)]+\))?)\s+(\d+)\+)?/);
  if (!e) return null;
  const s = Number(e[2] ?? e[4] ?? 8), t = [e[1], e[3]].filter(Boolean).map((i) => String(i).trim()), r = j(o);
  return { skills: t, target: s, successSkillOptions: r };
}
const K = [
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
class W {
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
    return Object.values(this.bundle.species).sort((e, s) => String(e.name).localeCompare(String(s.name)));
  }
  career(e) {
    return this.bundle.careers[e];
  }
  careerList() {
    return Object.values(this.bundle.careers).sort((e, s) => String(e.name).localeCompare(String(s.name)));
  }
  table(e) {
    return this.bundle.tables[e];
  }
  speciesForSociety(e) {
    var t;
    const s = new Set(((t = this.catalog.speciesBySociety[e]) == null ? void 0 : t.map((r) => r.id)) ?? []);
    return this.speciesList().filter((r) => s.has(r.id));
  }
  careersForSociety(e) {
    const s = /* @__PURE__ */ new Set([
      ...(this.catalog.careersBySociety.any ?? []).map((t) => t.id),
      ...(this.catalog.careersBySociety[e] ?? []).map((t) => t.id)
    ]);
    return this.careerList().filter((t) => s.has(t.id));
  }
}
async function J(o) {
  const e = o.replace(/\/$/, ""), [s, t, r, i] = await Promise.all([
    U(`${e}/species/index.json`, `${e}/species`),
    U(`${e}/careers/index.json`, `${e}/careers`),
    Q(e),
    x(`${e}/catalog.json`)
  ]);
  return new W({ species: s, careers: t, tables: r, catalog: i });
}
async function Q(o) {
  const e = await Promise.all(K.map(async (s) => [s, await x(`${o}/tables/${s}.json`)]));
  return Object.fromEntries(e);
}
async function U(o, e) {
  const s = await x(o), t = [];
  for (const r of s) {
    const i = await x(`${e}/${r}`), n = Array.isArray(i) ? i : [i];
    for (const a of n)
      a != null && a.deprecated || a != null && a.id && t.push([a.id, a]);
  }
  return Object.fromEntries(t);
}
async function x(o) {
  const e = await fetch(o);
  if (!e.ok) throw new Error(`Failed to load ${o}: ${e.status} ${e.statusText}`);
  return e.json();
}
const ee = {
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
}, te = {
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
function se(o) {
  return ee[L(o)];
}
function re(o) {
  if (o)
    return te[L(o)] ?? L(o).replace(/[^a-z0-9]/g, "");
}
function L(o) {
  return o.trim().toLowerCase();
}
function ne(o, e = {}) {
  const s = e.entryYear ?? 1105, t = ie(o), r = Object.fromEntries(F.map((l) => {
    const c = l === "PSI" && o.psi || h(o, l);
    return [l, { value: c, current: c, show: ce(l, c), default: !1 }];
  })), i = o.characteristics.STR + o.characteristics.DEX + o.characteristics.END, n = [
    ...ae(o),
    ...le(o),
    ...oe(o)
  ], a = o.name || "Unnamed Traveller";
  return {
    name: a,
    type: "traveller",
    img: "systems/mgt2e/icons/actors/traveller.svg",
    system: {
      speed: { base: 6, value: 6 },
      initiative: { base: 0, value: 0 },
      size: 0,
      rads: 0,
      weightCarried: 0,
      heavyLoad: o.characteristics.STR * 10,
      maxLoad: o.characteristics.STR * 20,
      modifiers: {},
      hits: { value: i, max: i, damage: 0, tmpDamage: 0 },
      description: o.capsule_description ? de(o.capsule_description) : "",
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
      characteristics: r,
      skills: t,
      damage: { STR: { value: 0 }, DEX: { value: 0 }, END: { value: 0, tmp: 0 } },
      sophont: {
        age: String(o.age),
        species: $(o.species_id.replaceAll("_", " ")),
        speciesTraits: o.traits.map((l) => l.name ?? l.id ?? "").filter(Boolean).join(", "),
        gender: o.gender || "Unknown",
        weight: 0,
        height: 0,
        profession: ue(o),
        homeworld: o.homeworld
      },
      finance: {
        cash: String(o.credits),
        pension: String(o.pension_per_year),
        medicalDebt: String(o.medical_debt),
        mortgage: "0",
        livingCosts: "0",
        otherIncome: "0",
        shipShares: o.ship_shares,
        description: o.ship_shares ? `Ship Shares: ${o.ship_shares}` : ""
      },
      terms: o.total_terms || o.completed_careers.reduce((l, c) => l + c.terms_served, 0),
      startAge: o.character_type === "robot" ? 0 : 18,
      termLength: o.character_type === "robot" ? 0 : 4,
      entryYear: s,
      entryAge: o.age,
      currentYear: s,
      birthYear: s - o.age
    },
    items: n,
    effects: [],
    folder: null,
    flags: {
      travellerCreator: {
        sourceVersion: e.sourceVersion ?? "unknown",
        creationState: o,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      mgt2e: {}
    },
    prototypeToken: {
      name: a,
      displayName: 0,
      actorLink: !0,
      width: 1,
      height: 1
    }
  };
}
function ie(o) {
  const e = {};
  for (const s of o.skills) {
    const t = se(s.name);
    if (t)
      if (e[t] ?? (e[t] = { base: -1, specs: {} }), !s.speciality || s.speciality.toLowerCase() === "any")
        e[t].base = Math.max(e[t].base, s.level);
      else {
        const r = re(s.speciality);
        r && (e[t].specs[r] = Math.max(e[t].specs[r] ?? -1, s.level));
      }
  }
  return Object.fromEntries(Object.entries(e).map(([s, t]) => {
    const r = { id: s, value: t.base > 0 ? String(t.base) : Math.max(t.base, 0), trained: !0 };
    return Object.keys(t.specs).length && (r.specialities = Object.fromEntries(Object.entries(t.specs).map(([i, n]) => [i, { id: i, value: String(n) }]))), [s, r];
  }));
}
function ae(o) {
  const e = {
    ally: { affinity: 3, enmity: 0, power: 2, influence: 2 },
    contact: { affinity: 3, enmity: 0, power: 0, influence: 4 },
    rival: { affinity: 1, enmity: 0, power: 2, influence: 1 },
    enemy: { affinity: 0, enmity: -3, power: 3, influence: 1 }
  };
  return o.associates.map((s) => {
    const t = String(s.kind || "contact").toLowerCase(), r = e[t] ?? e.contact;
    return P(s.description || `Unnamed ${$(t)}`, "associate", {
      associate: { relationship: t, ...r },
      relation: t,
      description: s.description
    });
  });
}
function le(o) {
  return o.term_history.map((e, s) => {
    const t = $(e.career_id.replaceAll("_", " ")), r = $(e.assignment_id.replaceAll("_", " ")), i = `${t}${r ? `: ${r}` : ""}${e.rank_title ? ` (${e.rank_title})` : ""}`, n = [i, ...e.events.map((a) => `* ${a}`)].join(`
`);
    return P(`Term ${s + 1}: ${i}`, "term", {
      term: { number: s + 1, termLength: 4, assignment: i, randomTerm: !1, randomLength: "" },
      name: "Term",
      description: n
    }, "systems/mgt2e/icons/misc/career.svg");
  });
}
function oe(o) {
  return o.equipment.map((e) => P(e.name, "item", {
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
function P(o, e, s, t = "systems/mgt2e/icons/items/item.svg") {
  const r = Date.now();
  return {
    name: o,
    type: e,
    system: s,
    _id: pe(),
    img: t,
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
      createdTime: r,
      modifiedTime: r
    },
    ownership: { default: 0 }
  };
}
function ce(o, e) {
  return ["STR", "DEX", "END", "INT", "EDU", "SOC"].includes(o) || o === "PSI" && e > 0;
}
function ue(o) {
  const e = o.completed_careers.at(-1);
  if (!e) return "";
  const s = $(e.career_id.replaceAll("_", " ")), t = e.assignment_id && e.assignment_id !== "career_package" ? $(e.assignment_id.replaceAll("_", " ")) : "";
  return t ? `${s}: ${t}` : s;
}
function de(o) {
  return `<p>${_e(o).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`;
}
function _e(o) {
  return o.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function $(o) {
  return o.replace(/\w\S*/g, (e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase());
}
function pe() {
  return crypto.getRandomValues(new Uint32Array(2)).reduce((o, e) => o + e.toString(16).padStart(8, "0"), "").slice(0, 16);
}
class me {
  constructor() {
    this.sourceVersion = "unknown";
  }
  async initialize(e) {
    this.appClass = e;
    const s = "modules/traveller-character-creator/data";
    this.rules = await J(s), this.engine = new H(this.rules);
    try {
      const t = await fetch("modules/traveller-character-creator/SOURCE_VERSION");
      t.ok && (this.sourceVersion = (await t.text()).trim());
    } catch {
      this.sourceVersion = "unknown";
    }
  }
  open(e = {}) {
    if (!this.engine || !this.appClass) throw new Error("Traveller Creator is not initialized yet.");
    const s = new this.appClass(this, e);
    return s.render(!0), s;
  }
  newCharacter() {
    return R();
  }
  exportActorData(e, s = {}) {
    const t = Number(s.entryYear ?? game.settings.get("traveller-character-creator", "defaultEntryYear"));
    return ne(e, { sourceVersion: this.sourceVersion, entryYear: t });
  }
  async createActor(e, s = {}) {
    var i, n;
    const t = this.exportActorData(e, s), r = await Actor.implementation.create(t);
    return game.settings.get("traveller-character-creator", "autoOpenCreatedActor") && ((i = r.sheet) == null || i.render(!0)), (n = ui.notifications) == null || n.info(`Created Traveller actor: ${r.name}`), r;
  }
}
function fe() {
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
const { ApplicationV2: he, HandlebarsApplicationMixin: ge } = foundry.applications.api, S = class S extends ge(he) {
  constructor(e, s = {}) {
    super(s), this.api = e, this.character = this.loadDraft() ?? e.newCharacter();
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
      skillPackages: Object.entries(e.table("skill_packages").packages ?? {}).map(([s, t]) => ({ id: s, ...t })),
      canCreate: this.character.phase === "done"
    };
  }
  static async onSubmit() {
  }
  static async roll() {
    this.character = this.api.engine.rollInitialCharacteristics(this.character).character, this.saveDraft(), this.render();
  }
  static async chooseSociety(e, s) {
    const t = s.dataset.id;
    t && (this.character = this.api.engine.chooseSociety(this.character, t).character, this.saveDraft(), this.render());
  }
  static async applySpecies(e, s) {
    const t = s.dataset.id;
    t && (this.character = this.api.engine.applySpecies(this.character, t).character, (this.character.phase === "aslan_setup" || this.character.phase === "zhodani_training") && (this.character.phase = "background", this.character.notes.push("Advanced special ancestry setup placeholder; detailed branch port remains in lifepath engine.")), this.saveDraft(), this.render());
  }
  static async applyBackgroundPackage(e, s) {
    const t = s.dataset.id;
    t && (this.character = this.api.engine.applyBackgroundPackage(this.character, t).character, this.saveDraft(), this.render());
  }
  static async applyCareerPackage(e, s) {
    const t = s.dataset.id;
    t && (this.character = this.api.engine.applyCareerPackage(this.character, t).character, this.saveDraft(), this.render());
  }
  static async applySkillPackage(e, s) {
    const t = s.dataset.id;
    t && (this.character = this.api.engine.applySkillPackage(this.character, t).character, this.saveDraft(), this.render());
  }
  static async createActor() {
    const e = this.element.querySelector("[name='name']");
    e != null && e.value && (this.character.name = e.value), await this.api.createActor(this.character), this.clearDraft(), this.close();
  }
  static async reset() {
    this.character = this.api.newCharacter(), this.clearDraft(), this.render();
  }
  saveDraft() {
    game.settings.get("traveller-character-creator", "persistDrafts") && localStorage.setItem(T(), JSON.stringify(this.character));
  }
  loadDraft() {
    var s;
    if (!game.settings.get("traveller-character-creator", "persistDrafts")) return null;
    const e = localStorage.getItem(T());
    if (!e) return null;
    try {
      return JSON.parse(e);
    } catch {
      return (s = ui.notifications) == null || s.warn("Traveller Creator draft was unreadable and has been reset."), localStorage.removeItem(T()), null;
    }
  }
  clearDraft() {
    localStorage.removeItem(T());
  }
};
S.DEFAULT_OPTIONS = {
  id: "traveller-character-creator",
  tag: "form",
  window: {
    title: "Traveller Character Creator",
    icon: "fa-solid fa-user-astronaut",
    resizable: !0
  },
  position: { width: 760, height: 720 },
  form: { handler: S.onSubmit, submitOnChange: !1, closeOnSubmit: !1 },
  actions: {
    roll: S.roll,
    chooseSociety: S.chooseSociety,
    applySpecies: S.applySpecies,
    applyBackgroundPackage: S.applyBackgroundPackage,
    applyCareerPackage: S.applyCareerPackage,
    applySkillPackage: S.applySkillPackage,
    createActor: S.createActor,
    reset: S.reset
  }
}, S.PARTS = {
  body: { template: "modules/traveller-character-creator/templates/creator.hbs" }
};
let q = S;
function T() {
  var o, e;
  return `traveller-character-creator.${((o = game.world) == null ? void 0 : o.id) ?? "world"}.${((e = game.user) == null ? void 0 : e.id) ?? "user"}.draft`;
}
Hooks.once("init", () => {
  fe(), Handlebars.registerHelper("eq", (o, e) => o === e);
});
Hooks.once("ready", async () => {
  const o = new me();
  await o.initialize(q), game.travellerCreator = o;
});
Hooks.on("renderActorDirectory", (o, e) => {
  var r;
  const s = e instanceof HTMLElement ? e : e[0];
  if (!s || s.querySelector("[data-traveller-creator-open]")) return;
  const t = document.createElement("button");
  t.type = "button", t.dataset.travellerCreatorOpen = "true", t.classList.add("traveller-creator-open"), t.innerHTML = '<i class="fa-solid fa-user-astronaut"></i> Create Traveller', t.addEventListener("click", () => {
    var i;
    return (i = game.travellerCreator) == null ? void 0 : i.open();
  }), (r = s.querySelector(".directory-header")) == null || r.append(t);
});
//# sourceMappingURL=traveller-character-creator.js.map
