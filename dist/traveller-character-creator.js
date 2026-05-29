const O = ["STR", "DEX", "END", "INT", "EDU", "SOC"], z = [
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
function N() {
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
function h(o) {
  return structuredClone(o);
}
function f(o, e) {
  return e in o.characteristics ? Number(o.characteristics[e] ?? 0) : Number(o.extra_characteristics[e] ?? 0);
}
function g(o, e, r) {
  const t = Math.max(0, Math.trunc(r));
  e in o.characteristics ? o.characteristics[e] = t : o.extra_characteristics[e] = t;
}
function y(o, e, r = 0, t = null, s = !1) {
  if (o.forbidden_skills.includes(e) || t && o.forbidden_skills.includes(`${e} (${t})`))
    return `Skipped ${w(e, t)} (forbidden by species)`;
  const n = o.skills.find((a) => a.name === e && (a.speciality ?? null) === t);
  if (n)
    return r === 0 ? `Already has ${w(e, t)} ${n.level}` : s ? r > n.level ? (n.level = Math.min(r, 4), j(o.skills), `Increased ${w(e, t)} to ${n.level}`) : `${w(e, t)} unchanged (already ${n.level})` : (n.level = Math.min(n.level + r, 4), j(o.skills), `Increased ${w(e, t)} to ${n.level}`);
  const i = Math.max(0, r);
  return o.skills.push({ name: e, level: i, speciality: t }), t && i >= 1 && !o.skills.some((a) => a.name === e && !a.speciality) && o.skills.push({ name: e, level: 0, speciality: null }), j(o.skills), `Gained ${w(e, t)} ${i}`;
}
function w(o, e) {
  return `${o}${e ? ` (${e})` : ""}`;
}
function j(o) {
  o.sort((e, r) => `${e.name.toLowerCase()}\0${e.speciality ?? ""}`.localeCompare(`${r.name.toLowerCase()}\0${r.speciality ?? ""}`));
}
class F {
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
    const r = this.forced.length ? this.forced.shift() ?? 1 : this.rollDie(e);
    return { dice: [], natural: r, total: r, dm: 0 };
  }
  d3() {
    return Math.ceil(this.d6() / 2);
  }
  roll2D(e = 0) {
    if (this.forced.length) {
      const s = this.forced.shift() ?? 0;
      return { dice: [], natural: s, total: s + e, dm: e };
    }
    const r = [this.d6(), this.d6()], t = r[0] + r[1];
    return { dice: r, natural: t, total: t + e, dm: e };
  }
  rollCharacteristic(e = !1) {
    if (!e) return this.roll2D();
    if (this.forced.length) return this.roll2D();
    const r = [this.d6(), this.d6(), this.d6()].sort((s, n) => n - s), t = r.slice(0, 2);
    return { dice: r, natural: t[0] + t[1], total: t[0] + t[1], dm: 0 };
  }
  rollDie(e) {
    return Math.floor(Math.random() * e) + 1;
  }
}
function x(o) {
  return o <= 0 ? -3 : o <= 2 ? -2 : Math.floor(o / 3) - 2;
}
class H {
  constructor(e, r = new F()) {
    this.rules = e, this.roller = r;
  }
  freshCharacter() {
    return N();
  }
  rollInitialCharacteristics(e, r = !1) {
    const t = h(e), s = {}, n = /* @__PURE__ */ new Set();
    if (r) {
      const i = O.map((a) => ({ stat: a, roll: this.roller.roll2D() }));
      i.sort((a, l) => l.roll.total - a.roll.total), n.add(i[0].stat), n.add(i[1].stat);
    }
    for (const i of O) {
      const a = this.roller.rollCharacteristic(r && n.has(i));
      t.characteristics[i] = a.total, s[i] = a;
    }
    return t.phase = "society", t.notes.push("Rolled initial characteristics."), { rolls: s, character: t };
  }
  rollExtraCharacteristics(e, r, t = !1) {
    const s = h(e), n = {};
    for (const i of r) {
      const a = this.roller.rollCharacteristic(t);
      g(s, i, a.total), i === "PSI" && (s.psi = a.total), n[i] = a;
    }
    return s.notes.push(`Rolled extra characteristics: ${r.join(", ")}.`), { rolls: n, character: s };
  }
  chooseSociety(e, r) {
    const t = h(e);
    return t.society_id = r, t.phase = "species", t.notes.push(`Society of origin: ${r}.`), { character: t };
  }
  applySpecies(e, r) {
    const t = this.rules.species(r);
    if (!t) throw new Error(`Unknown species: ${r}`);
    const s = h(e);
    s.species_id = r;
    for (const [n, i] of Object.entries(t.characteristic_modifiers ?? {}))
      g(s, n, f(s, n) + Number(i));
    if (t.starting_age && (s.age = Number(t.starting_age)), t.uses_cha) {
      const n = this.roller.d6() + 2;
      g(s, "CHA", n), s.characteristics.SOC = 0;
    }
    if (t.extra_characteristics_required)
      for (const n of t.extra_characteristics_required)
        f(s, n) || g(s, n, this.roller.roll2D().total);
    return s.forbidden_skills = [...t.forbidden_skills ?? []], s.traits = [...t.traits ?? []], r.includes("aslan") ? (s.phase = "aslan_setup", s.aslan_setup_status = { phase: "gender" }) : t.psionic_training_at_start || r.includes("zhodani") && s.characteristics.SOC >= 10 ? s.phase = "zhodani_training" : s.phase = "background", s.notes.push(`Applied species: ${t.name ?? r}.`), { species: t, character: s };
  }
  applyBackgroundSkills(e, r) {
    const t = h(e), s = Math.max(0, 3 + x(t.characteristics.EDU));
    for (const n of r.slice(0, s)) {
      const [i, a] = T(n);
      y(t, i, 0, a);
    }
    return t.phase = "pre_career", t.notes.push(`Chose ${Math.min(r.length, s)} background skills.`), { allowed: s, chosen: r.slice(0, s), character: t };
  }
  applyBackgroundPackage(e, r, t = {}) {
    const n = (this.rules.table("background_packages").packages ?? this.rules.table("background_packages"))[r];
    if (!n) throw new Error(`Unknown background package: ${r}`);
    const i = h(e);
    for (const [a, l] of Object.entries(n.characteristic_modifiers ?? n.stat_mods ?? {}))
      g(i, a, f(i, a) + Number(l));
    for (const a of n.skills ?? []) {
      const l = typeof a == "string" ? a : `${a.name}${a.speciality ? ` (${a.speciality})` : ""}`, c = t[l] ?? a;
      if (typeof c == "string") {
        const [u, d, _] = E(c);
        y(i, u, _ === 1 && !/\d+$/.test(c.trim()) ? 0 : _, d);
      } else
        y(i, c.name, Number(c.level ?? 0), c.speciality ?? null);
    }
    i.credits += Number(n.credits ?? 0);
    for (const a of n.equipment ?? []) i.equipment.push({ name: String(a), quantity: 1, notes: null });
    return i.age = Math.max(i.age, 22), i.phase = "career", i.notes.push(`Applied background package: ${n.name ?? r}.`), { package: n, character: i };
  }
  applyCareerPackage(e, r) {
    const t = this.rules.table("career_packages"), n = (Array.isArray(t == null ? void 0 : t.packages) ? t.packages : Array.isArray(t) ? t : Object.values(t.packages ?? t)).find((a) => a.id === r);
    if (!n) throw new Error(`Unknown career package: ${r}`);
    const i = h(e);
    for (const [a, l] of Object.entries(n.characteristic_modifiers ?? n.characteristics ?? n.stat_mods ?? {}))
      g(i, a, f(i, a) + Number(l));
    for (const a of n.skills ?? [])
      if (typeof a == "string") {
        const [l, c, u] = E(a);
        y(i, l, u, c);
      } else
        y(i, a.name, Number(a.level ?? 0), a.speciality ?? null, !0);
    i.credits += Number(n.credits ?? 0);
    for (const a of n.equipment ?? []) i.equipment.push({ name: String(a), quantity: 1, notes: null });
    for (let a = 0; a < Number(n.contacts ?? 0); a++) i.associates.push({ kind: "contact", description: n.contact_description ?? "career package contact" });
    for (let a = 0; a < Number(n.allies ?? 0); a++) i.associates.push({ kind: "ally", description: n.ally_description ?? "career package ally" });
    return i.age += this.roller.d3(), i.career_package_id = r, i.career_package_taken = !0, i.completed_careers.push({
      career_id: r,
      assignment_id: "career_package",
      terms_served: 1,
      final_rank: Number(n.rank ?? 0),
      final_rank_title: n.rank_title ?? null,
      commissioned: !1,
      left_due_to: "career_package",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 0
    }), i.phase = "skill_package", i.notes.push(`Applied career package: ${n.name ?? r}.`), { package: n, character: i };
  }
  applySkillPackage(e, r) {
    const s = (this.rules.table("skill_packages").packages ?? this.rules.table("skill_packages"))[r];
    if (!s) throw new Error(`Unknown skill package: ${r}`);
    const n = h(e);
    for (const i of s.skills ?? []) {
      const [a, l] = T(i);
      y(n, a, 1, l);
    }
    return n.phase = "done", n.notes.push(`Applied skill package: ${s.name ?? r}.`), { package: s, character: n };
  }
  skipPreCareer(e) {
    const r = h(e);
    return r.phase = "career", r.notes.push("Skipped pre-career education."), { character: r };
  }
  qualifyForPreCareer(e, r, t = {}) {
    var p, v, $;
    const s = (p = this.rules.table("education").tracks) == null ? void 0 : p[r];
    if (!s) throw new Error(`Unknown pre-career track: ${r}`);
    const n = h(e), i = t.service ? (v = s.services) == null ? void 0 : v[t.service] : null, a = t.curriculum ? ($ = s.curricula) == null ? void 0 : $[t.curriculum] : null, l = (i == null ? void 0 : i.qualification) ?? s.qualification ?? {}, c = this.checkDm(n, l), u = l.automatic ? null : this.roller.roll2D(c), d = l.automatic || !!(u && u.total >= Number(l.target ?? 0));
    if (!d)
      return n.phase = "career", n.notes.push(`Failed ${s.name ?? r} qualification${u ? ` (${u.total})` : ""}.`), { track: s, roll: u, qualified: d, character: n };
    this.applyStatBlock(n, s.enrollment_bonus ?? {}), this.applySkillResults(n, s.enrollment_auto_skills ?? [], 0);
    const _ = this.preCareerSkillPool(s, i, a), m = this.applyChosenSkills(n, t.skills, _, Number(s.enrollment_skill_picks ?? 0), Number(s.enrollment_pick_level ?? 0));
    if (a != null && a.enrollment_skill_table) {
      const k = this.rollOnExternalSkillTable(n, a.enrollment_skill_table.career, a.enrollment_skill_table.table);
      k && m.push(k);
    }
    for (let k = 0; k < Number(s.enrollment_service_skill_random ?? 0); k++) {
      const C = this.rollOnExternalSkillTable(n, (i == null ? void 0 : i.career_id) ?? "merchant", "service_skills");
      C && m.push(C);
    }
    if (l.requires_psi_test && !n.psi_tested) {
      const k = this.roller.roll2D();
      n.psi = k.total, g(n, "PSI", k.total), n.psi_tested = !0;
    }
    return n.pre_career_status = {
      track_id: r,
      service_id: (i == null ? void 0 : i.id) ?? t.service ?? null,
      career_id: (i == null ? void 0 : i.career_id) ?? null,
      curriculum_id: (a == null ? void 0 : a.id) ?? t.curriculum ?? null,
      enrolled: !0,
      skill_pool: _,
      enrollment_skills: m
    }, n.phase = "pre_career", n.notes.push(`Qualified for ${s.name ?? r}.`), { track: s, roll: u, qualified: d, character: n };
  }
  graduatePreCareer(e, r = []) {
    var m, p;
    const t = e.pre_career_status ?? {}, s = String(t.track_id ?? ""), n = (m = this.rules.table("education").tracks) == null ? void 0 : m[s];
    if (!n) throw new Error("No active pre-career track to graduate.");
    const i = h(e), a = n.graduation ?? {};
    if (t.forced_graduation_failure)
      return i.pre_career_status = { ...t, graduated: !1, honours: !1, graduation_roll: null, outcome_note: ((p = a.on_failure) == null ? void 0 : p.note) ?? "Failed to graduate." }, i.age += Number(n.age_cost ?? 0), i.pre_career_terms += Number(n.age_cost ?? 0) > 0 ? 1 : 0, i.phase = "career", i.notes.push(`Failed to graduate from ${n.name ?? s} due to pre-career event.`), { track: n, roll: null, graduated: !1, honours: !1, character: i };
    const l = this.checkDm(i, a), c = this.roller.roll2D(l), u = c.total >= Number(a.honours_target ?? 1 / 0), d = u || c.total >= Number(a.target ?? 0), _ = d ? (u ? a.on_honours : a.on_graduation) ?? {} : a.on_failure ?? {};
    return d && this.applyPreCareerOutcome(i, n, _, r), i.age = Math.max(i.age + Number(n.age_cost ?? 0), this.rollAgeOverride(_.age_override) ?? 0), i.pre_career_terms += Number(n.age_cost ?? 0) > 0 ? 1 : 0, i.pre_career_status = { ...t, graduated: d, honours: u, graduation_roll: c.total, outcome_note: _.note ?? null }, i.phase = "career", i.notes.push(`${d ? u ? "Graduated with honours from" : "Graduated from" : "Failed to graduate from"} ${n.name ?? s}.`), { track: n, roll: c, graduated: d, honours: u, character: i };
  }
  preCareerEventRoll(e, r = !1) {
    const t = h(e), s = this.rules.table("education"), n = r ? s.aslan_pre_career_events : s.pre_career_events, i = this.roller.roll2D(), a = String(Math.max(2, Math.min(12, i.total))), l = String((n == null ? void 0 : n[a]) ?? "No event.");
    return this.applyPreCareerEventEffects(t, i.total, l, r), t.pre_career_status = { ...t.pre_career_status ?? {}, last_event_roll: i.total, last_event: l }, t.notes.push(`Pre-career event: ${l}`), { roll: i, event: l, character: t };
  }
  qualifyForCareer(e, r) {
    var d, _, m;
    const t = this.rules.career(r);
    if (!t) throw new Error(`Unknown career: ${r}`);
    const s = h(e), n = this.careerBlocked(s, t);
    if (n)
      return s.notes.push(`Cannot qualify for ${t.name ?? r}: ${n}.`), { career: t, qualified: !1, blockedReason: n, character: s };
    const i = s.pending_transfer_career_id === "any" || s.pending_transfer_career_id === r, a = i || s.auto_entry_career_id === r || s.auto_qualify_career_ids.includes(r), l = this.checkDm(s, t.qualification ?? {}) + s.dm_next_qualification + Number(s.permanent_qualification_dm_by_career[r] ?? 0) - s.failed_qualifications_this_term, c = a || (d = t.qualification) != null && d.automatic ? null : this.roller.roll2D(l), u = a || ((_ = t.qualification) == null ? void 0 : _.automatic) || !!(c && c.total >= Number(((m = t.qualification) == null ? void 0 : m.target) ?? 0));
    return s.dm_next_qualification = 0, u ? (s.failed_qualifications_this_term = 0, i && (s.pending_transfer_career_id = null), s.auto_qualify_career_ids = s.auto_qualify_career_ids.filter((p) => p !== r), s.notes.push(`Qualified for ${t.name ?? r}.`)) : (s.failed_qualifications_this_term += 1, s.notes.push(`Failed qualification for ${t.name ?? r}${c ? ` (${c.total})` : ""}.`)), { career: t, roll: c, qualified: u, character: s };
  }
  startTerm(e, r, t) {
    var m;
    const s = this.rules.career(r);
    if (!s) throw new Error(`Unknown career: ${r}`);
    const n = this.assignmentIds(s), i = t ?? n[0];
    if (!this.assignmentData(s, i)) throw new Error(`Unknown assignment ${i} for ${r}`);
    const a = h(e), l = a.term_history.filter((p) => p.career_id === r).length, c = !!s.all_commissioned || a.starts_commissioned_career_id === r || !!a.completed_careers.find((p) => p.career_id === r && p.commissioned), u = a.pending_transfer_career_id === r || a.pending_transfer_career_id === "any" ? a.pending_transfer_rank : null, d = u != null ? Number(u) : c ? Number(a.starts_commissioned_rank ?? 1) : 0, _ = {
      career_id: r,
      assignment_id: i,
      term_number: l + 1,
      overall_term_number: a.total_terms + a.pre_career_terms + 1,
      rank: d,
      rank_title: this.rankTitle(s, c, d),
      commissioned: c,
      events: [],
      skills_gained: [],
      survived: null,
      advanced: null,
      mishap: null,
      basic_training: l === 0 && !s.hiver_no_basic_training,
      benefit_forfeited: !1,
      survival_roll_total: null,
      advancement_roll_total: null,
      cover_career_id: null,
      frozen_watch: !1
    };
    if (a.current_term = _, a.pending_transfer_career_id = null, a.pending_transfer_rank = null, _.basic_training) {
      for (const p of Object.values(((m = s.skill_tables) == null ? void 0 : m.service_skills) ?? {}).filter((v) => typeof v == "string")) {
        const v = this.applySkillOrStat(a, p, 0);
        v && _.skills_gained.push(v);
      }
      this.applyRankBonus(a, s, _);
    }
    for (const p of s.career_start_skills ?? []) {
      const v = this.applySkillOrStat(a, String(p), 0);
      v && _.skills_gained.push(v);
    }
    return a.phase = "career", a.notes.push(`Started ${s.name ?? r} term ${_.term_number}.`), { career: s, term: _, character: a };
  }
  rollOnSkillTable(e, r) {
    const t = h(e), s = this.requireCurrentTerm(t), n = this.rules.career(s.career_id), i = this.rollOnCareerSkillTable(t, n, r);
    return i.note && s.skills_gained.push(i.note), { career: n, tableId: r, roll: i.roll, result: i.entry, character: t };
  }
  survivalRoll(e) {
    const r = h(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id);
    if (s.no_survival)
      return t.survived = !0, t.survival_roll_total = null, r.notes.push(`${s.name ?? t.career_id} has no survival roll.`), { career: s, roll: null, survived: !0, character: r };
    const n = this.assignmentData(s, t.assignment_id), i = s.survival ?? n.survival ?? {}, a = this.checkDm(r, i) + r.dm_next_survival, l = this.roller.roll2D(a), c = l.natural !== 2 && l.total >= Number(i.target ?? 0);
    return t.survived = c, t.survival_roll_total = l.total, r.dm_next_survival = 0, c || t.events.push("Failed survival roll; roll on the Mishap table."), r.notes.push(`${c ? "Passed" : "Failed"} survival in ${s.name ?? t.career_id}.`), { career: s, roll: l, survived: c, character: r };
  }
  eventRoll(e) {
    var l;
    const r = h(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), n = this.roller.roll2D(r.dm_next_events), i = String(((l = s.events) == null ? void 0 : l[String(Math.max(2, Math.min(12, n.total)))]) ?? "No event.");
    t.events.push(i), this.applyInlineEventEffects(r, t, i), this.applyCareerTextEffects(r, t, i, !1);
    let a = null;
    if (/Life Event|Life event|Life Events Table/i.test(i)) {
      const c = this.lifeEventRoll(r, this.isAslanLifeEventCharacter(r));
      a = { roll: c.roll, event: c.event, subEvent: c.subEvent ?? null }, Object.assign(r, c.character);
    }
    return r.dm_next_events = 0, r.notes.push(`Career event: ${i}`), { career: s, roll: n, event: i, lifeEvent: a, character: r };
  }
  lifeEventRoll(e, r = !1) {
    var d;
    const t = h(e), s = r ? (d = this.rules.table("aslan_life_events").aslan_life_events) == null ? void 0 : d.results : this.rules.table("life_events").entries, n = this.roller.roll2D(), i = String(Math.max(2, Math.min(12, n.total))), a = s == null ? void 0 : s[i], l = typeof a == "string" ? a.split(":")[0] : (a == null ? void 0 : a.title) ?? "Life Event", c = typeof a == "string" ? a : (a == null ? void 0 : a.text) ?? "Life Event.";
    let u = null;
    if (!r && (a != null && a.sub_table)) {
      const _ = this.roller.rollD(6);
      return u = String(a.sub_table[String(_.total)] ?? ""), this.applyLifeEventEffects(t, l, `${c} ${u}`, r), t.notes.push(`Life event: ${l}; ${u}`), { roll: n, event: { title: l, text: c }, subEvent: u, character: t };
    }
    return this.applyLifeEventEffects(t, l, c, r), t.notes.push(`Life event: ${l}.`), { roll: n, event: { title: l, text: c }, character: t };
  }
  resolveLifeEventChoice(e, r) {
    const t = h(e), s = t.pending_life_event_choice;
    if (!s) throw new Error("No pending life event choice.");
    const n = String(s.kind ?? "");
    if (n === "relationship_end" || n === "betrayal") {
      const i = r === "enemy" ? "enemy" : "rival", a = t.associates.findIndex((l) => ["ally", "contact"].includes(l.kind));
      a >= 0 && n === "betrayal" ? t.associates[a] = { kind: i, description: `Former ${t.associates[a].kind} betrayed you` } : t.associates.push({ kind: i, description: `${i} from life event` });
    } else if (n === "crime")
      if (r === "prisoner") t.forced_next_career_id = "prisoner";
      else {
        const i = t.current_term;
        i ? i.benefit_forfeited = !0 : t.pending_benefit_rolls = Math.max(0, t.pending_benefit_rolls - 1);
      }
    else if (n === "pre_career_any_skill") {
      const i = Number(s.level ?? 0), [a, l, c] = E(/\d+$/.test(r) ? r : `${r} ${i}`);
      String(s.excluded ?? "").includes(a) || y(t, a, c, l, !0);
    } else n === "pre_career_war_choice" && (r === "drifter" ? t.forced_next_career_id = "drifter" : r === "draft" && (t.pending_life_event_choice = { kind: "draft", options: ["army", "marine", "navy"] }));
    return t.pending_life_event_choice = null, t.notes.push(`Resolved life event choice: ${r}.`), { choice: r, character: t };
  }
  resolveCareerEventChoice(e, r) {
    return this.resolveCareerChoice(e, "event", r);
  }
  resolveCareerMishapChoice(e, r) {
    return this.resolveCareerChoice(e, "mishap", r);
  }
  mishapRoll(e) {
    var l;
    const r = h(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), n = this.roller.rollD(6), i = String(((l = s.mishaps) == null ? void 0 : l[String(Math.max(1, Math.min(6, n.total)))]) ?? "Mishap.");
    t.mishap = i;
    const a = !!s.mishap_no_eject || /not ejected|not have to leave|stay (?:in|on) (?:this )?career|remain in (?:the|this) career/i.test(i);
    return t.survived = !!a, t.events.push(i), this.applyInlineEventEffects(r, t, i), this.applyCareerTextEffects(r, t, i, !0), r.force_career_end = !a, r.notes.push(`Career mishap: ${i}`), { career: s, roll: n, mishap: i, character: r };
  }
  advancementRoll(e) {
    const r = h(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), n = this.assignmentData(s, t.assignment_id), i = s.advancement ?? n.advancement ?? {}, a = this.checkDm(r, i) + r.dm_next_advancement + r.dm_permanent_advancement + Number(r.permanent_advancement_dm_by_career[t.career_id] ?? 0), l = this.roller.roll2D(a), c = l.total >= Number(i.target ?? 0);
    return t.advanced = c, t.advancement_roll_total = l.total, r.dm_next_advancement = 0, c && (t.rank = Math.min(6, t.rank + 1), t.rank_title = this.rankTitle(s, t.commissioned, t.rank), this.applyRankBonus(r, s, t)), r.notes.push(`${c ? "Advanced" : "Did not advance"} in ${s.name ?? t.career_id}.`), { career: s, roll: l, advanced: c, character: r };
  }
  commissionRoll(e) {
    const r = h(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), n = s.commission;
    if (!n) throw new Error(`${s.name ?? t.career_id} does not have commission rolls.`);
    if (t.commissioned || r.term_history.some((_) => _.career_id === t.career_id && _.commissioned))
      throw new Error("Already commissioned in this career.");
    if (t.term_number > 1 && f(r, "SOC") < 9) throw new Error("Commission after the first term requires SOC 9+.");
    const i = -(t.term_number - 1), a = r.academy_commission_career_id === t.career_id ? r.academy_commission_dm : 0, l = r.completed_careers.length === 0 ? Number(r.pre_career_permanent_dms.first_career_commission_dm ?? 0) : 0, c = this.checkDm(r, n) + i + a + l + r.dm_next_advancement + r.dm_permanent_advancement, u = this.roller.roll2D(c), d = u.total >= Number(n.target ?? 8);
    return d && (t.commissioned = !0, t.rank = 1, t.rank_title = this.rankTitle(s, !0, 1), this.applyRankBonus(r, s, t), t.advanced = !1), r.dm_next_advancement = 0, r.academy_commission_career_id = null, r.academy_commission_dm = 0, r.notes.push(`${d ? "Commissioned" : "Failed commission"} in ${s.name ?? t.career_id}.`), { career: s, roll: u, commissioned: d, character: r };
  }
  endTerm(e, r = !1, t = "voluntary") {
    const s = h(e), n = this.requireCurrentTerm(s), i = this.rules.career(n.career_id);
    s.term_history.push(n), s.total_terms += 1, s.age += 4;
    const a = this.applyAgingIfNeeded(s);
    if (s.current_term = null, s.failed_qualifications_this_term = 0, r || s.force_career_end || n.survived === !1) {
      const c = s.term_history.filter((d) => d.career_id === n.career_id).length, u = i.mustering_out === null ? 0 : this.benefitRollsEarned(c * Number(i.mustering_out_rolls_per_term ?? 1), n.rank, n.benefit_forfeited);
      s.pending_benefit_rolls += u, s.completed_careers.push({
        career_id: n.career_id,
        assignment_id: n.assignment_id,
        terms_served: c,
        final_rank: n.rank,
        final_rank_title: n.rank_title ?? null,
        commissioned: n.commissioned,
        left_due_to: t,
        benefit_rolls_used: 0,
        benefit_rolls_earned: u
      }), s.force_career_end = !1, s.phase = s.pending_benefit_rolls > 0 ? "mustering" : "career";
    }
    return s.notes.push(`Ended ${i.name ?? n.career_id} term ${n.term_number}.`), { career: i, term: n, aging: a, character: s };
  }
  musterOutRoll(e, r, t = "benefit") {
    var B;
    const s = h(e), n = r ? [...s.completed_careers].reverse().find((S) => S.career_id === r) : s.completed_careers[s.completed_careers.length - 1];
    if (!n) throw new Error("No completed career to muster out from.");
    if (s.pending_benefit_rolls <= 0) throw new Error("No pending benefit rolls.");
    const i = this.rules.career(n.career_id);
    if (i.mustering_out === null) throw new Error(`${i.name ?? n.career_id} grants no mustering-out benefits.`);
    const a = n.final_rank >= 5 ? 1 : 0, l = t === "cash" && s.skills.some((S) => S.name.toLowerCase() === "gambler") ? 1 : 0, c = i.mustering_out_dm_characteristic ? x(f(s, i.mustering_out_dm_characteristic)) : 0, u = s.dm_next_benefit + a + l + c, d = i.hiver_career ? this.roller.roll2D(u) : this.roller.rollD(6), _ = Object.keys(i.mustering_out ?? {}).filter((S) => /^\d+$/.test(S)).map(Number), m = Math.min(..._, i.hiver_career ? 2 : 1), p = Math.max(..._, 7), v = Math.max(m, Math.min(p, d.total + (i.hiver_career ? 0 : u))), $ = ((B = i.mustering_out) == null ? void 0 : B[String(v)]) ?? {}, k = t === "cash" && s.cash_rolls_used < 3 && $.cash != null ? "cash" : "benefit", C = $[k];
    if (k === "cash") {
      const S = Number(C ?? 0);
      if (S < 0)
        s.medical_debt = Math.max(0, s.medical_debt + S);
      else {
        const I = Math.min(s.medical_debt, S);
        s.medical_debt -= I, s.credits += S - I;
      }
      s.cash_rolls_used += 1;
    } else
      this.applyMusterBenefit(s, String(C ?? "Benefit"));
    return s.pending_benefit_rolls -= 1, n.benefit_rolls_used += 1, s.dm_next_benefit = 0, s.pending_benefit_rolls <= 0 && (s.phase = "skill_package"), s.notes.push(`Mustering out ${k}: ${C}.`), { career: i, roll: d, tableRoll: v, column: k, result: C, character: s };
  }
  applyInjury(e, r) {
    var l;
    const t = h(e), s = r ? { dice: [], natural: r, total: r, dm: 0 } : this.roller.rollD(6), i = ((l = this.rules.table("injury").entries) == null ? void 0 : l[String(Math.max(1, Math.min(6, s.total)))]) ?? {}, a = this.injuryPending(i, s.total);
    return a ? (t.pending_injury_choice = a, t.notes.push(`Injury: ${i.title ?? "Injury"}; characteristic choice pending.`)) : t.notes.push(`Injury: ${i.title ?? "Lightly Injured"}; no permanent effect.`), { roll: s, entry: i, pendingChoice: a, character: t };
  }
  resolveInjuryChoice(e, r) {
    const t = h(e), s = t.pending_injury_choice;
    if (!s) throw new Error("No pending injury choice.");
    const n = s.choices;
    if (n != null && n.length && !n.includes(r)) throw new Error(`${r} is not a valid injury choice.`);
    const i = Number(s.damage_to_chosen ?? 0), a = Number(s.auto_reduce_others ?? 0), l = ["STR", "DEX", "END"].filter((m) => m !== r), c = Math.min(f(t, r), i), u = l.map((m) => ({ stat: m, loss: Math.min(f(t, m), a) })).filter((m) => m.loss > 0), d = c + u.reduce((m, p) => m + p.loss, 0), _ = d * 5e3;
    return t.pending_injury_treatment_choice = {
      chosen_stat: r,
      damage_to_chosen: i,
      auto_reduce_others: a,
      secondary_losses: u,
      total_loss: d,
      gross_debt: _,
      net_debt: _,
      title: s.title ?? "Injury"
    }, t.pending_injury_choice = null, { chosenStat: r, totalLoss: d, grossDebt: _, character: t };
  }
  resolveInjuryPayment(e, r) {
    const t = h(e), s = t.pending_injury_treatment_choice;
    if (!s) throw new Error("No pending injury treatment choice.");
    if (r)
      t.medical_debt += Number(s.net_debt ?? s.gross_debt ?? 0);
    else {
      const n = String(s.chosen_stat);
      g(t, n, f(t, n) - Number(s.damage_to_chosen ?? 0));
      for (const i of s.secondary_losses ?? [])
        g(t, i.stat, f(t, i.stat) - i.loss);
    }
    return t.pending_injury_treatment_choice = null, t.notes.push(r ? "Paid for injury treatment." : "Accepted injury characteristic loss."), { paid: r, character: t };
  }
  checkDm(e, r) {
    let t = x(f(e, r == null ? void 0 : r.characteristic));
    for (const s of (r == null ? void 0 : r.modifiers) ?? [])
      s.type === "per_previous_term" && (t += Number(s.dm ?? 0) * e.total_terms), s.type === "per_previous_career" && (t += Number(s.dm ?? 0) * e.completed_careers.length), s.type === "characteristic_threshold" && f(e, s.characteristic) >= Number(s.threshold ?? 0) && (t += Number(s.dm ?? 0));
    return t;
  }
  applyStatBlock(e, r) {
    for (const [t, s] of Object.entries(r))
      (O.includes(t) || t === "PSI" || t === "CHA") && (g(e, t, f(e, t) + Number(s)), t === "PSI" && (e.psi = f(e, "PSI")));
  }
  applyPreCareerOutcome(e, r, t, s) {
    var l, c, u, d, _, m;
    this.applyStatBlock(e, t), t.EDU_penalty_dice === "D3" && g(e, "EDU", f(e, "EDU") - this.roller.d3()), t.jack_of_all_trades && y(e, "Jack-of-All-Trades", Number(t.jack_of_all_trades), null, !0), this.applySkillResults(e, t.fixed_skills ?? [], 1);
    const n = ((l = e.pre_career_status) == null ? void 0 : l.skill_pool) ?? this.preCareerSkillPool(r, null, null), i = Number(t.skills_at_level_1 ?? 0) + Number(t.skills_upgrade_from_enrollment ?? 0) + Number(t.skills_from_enrollment_1 ?? 0);
    this.applyChosenSkills(e, s, n, i, 1), this.applyChosenSkills(e, s.slice(i), n, Number(t.additional_skills_from_enrollment_0 ?? 0), 0);
    for (const p of t.associates ?? [])
      e.associates.push({ kind: p.kind ?? "contact", description: p.description ?? `${r.name} associate` });
    const a = t.permanent ?? {};
    for (const p of a.advancement_dm_careers ?? [])
      e.permanent_advancement_dm_by_career[p] = Number(a.advancement_dm ?? 0);
    if (a.qualification_dm) {
      for (const p of this.rules.careerList()) e.permanent_qualification_dm_by_career[p.id] = Number(a.qualification_dm);
      for (const p of a.bonus_qualify_careers ?? []) e.permanent_qualification_dm_by_career[p] = Number(a.bonus_qualify_dm ?? 0);
    }
    a.psion_career_auto_entry && e.auto_qualify_career_ids.push("psion"), t.auto_entry && ((c = e.pre_career_status) != null && c.career_id) && (e.auto_entry_career_id = String(e.pre_career_status.career_id)), t.commission_dm && ((u = e.pre_career_status) != null && u.career_id) && (e.academy_commission_career_id = String(e.pre_career_status.career_id), e.academy_commission_dm = Number(t.commission_dm)), t.starts_commissioned_rank && ((d = e.pre_career_status) != null && d.career_id) && (e.starts_commissioned_career_id = String(e.pre_career_status.career_id), e.starts_commissioned_rank = Number(t.starts_commissioned_rank)), (_ = t.permanent) != null && _.auto_rank && ((m = e.pre_career_status) != null && m.career_id) && (e.starts_commissioned_career_id = String(e.pre_career_status.career_id), e.starts_commissioned_rank = Number(t.permanent.auto_rank), e.auto_entry_career_id = String(e.pre_career_status.career_id));
  }
  preCareerSkillPool(e, r, t) {
    const s = G(e);
    return [
      ...e.skill_list ?? [],
      ...s,
      ...e.enrollment_skill_pool ?? [],
      ...(r == null ? void 0 : r.skill_list) ?? [],
      ...(t == null ? void 0 : t.skill_list) ?? []
    ].map(String);
  }
  applyChosenSkills(e, r, t, s, n) {
    const i = Array.isArray(r) ? r.map(String) : typeof r == "string" ? r.split(",").map((c) => c.trim()).filter(Boolean) : [], a = i.length ? i : t, l = [];
    for (const c of a.slice(0, Math.max(0, s))) {
      const u = t.find((p) => p.toLowerCase() === c.toLowerCase()) ?? c, [d, _, m] = E(/\d+$/.test(u.trim()) ? u : `${u} ${n}`);
      l.push(y(e, d, m, _, !0));
    }
    return l;
  }
  applySkillResults(e, r, t) {
    return r.map((s) => this.applySkillOrStat(e, s, t)).filter(Boolean);
  }
  rollAgeOverride(e) {
    return e === "22+2D3" ? 22 + this.roller.d3() + this.roller.d3() : null;
  }
  careerBlocked(e, r) {
    var s, n, i, a, l, c;
    if (e.banned_career_ids.includes(r.id)) return "career is banned by a prior result";
    if (e.forced_next_career_id && e.forced_next_career_id !== r.id) return `must enter ${e.forced_next_career_id}`;
    if ((s = r.blocked_societies) != null && s.includes(e.society_id)) return `blocked for ${e.society_id}`;
    if ((n = r.allowed_societies) != null && n.length && !r.allowed_societies.includes(e.society_id)) return `not available for ${e.society_id}`;
    if ((i = r.blocked_species) != null && i.includes(e.species_id)) return `blocked for ${e.species_id}`;
    if ((a = r.allowed_species) != null && a.length && !r.allowed_species.includes(e.species_id)) return `not available for ${e.species_id}`;
    const t = this.rules.species(e.species_id);
    return (l = t == null ? void 0 : t.blocked_careers) != null && l.includes(r.id) ? `blocked for ${t.name ?? e.species_id}` : (c = t == null ? void 0 : t.allowed_species_careers) != null && c.length && !t.allowed_species_careers.includes(r.id) ? "not in species career list" : null;
  }
  requireCurrentTerm(e) {
    if (!e.current_term) throw new Error("No active career term.");
    return e.current_term;
  }
  assignmentIds(e) {
    return Array.isArray(e.assignments) ? e.assignments.map((r) => String(r.id)) : Object.keys(e.assignments ?? {});
  }
  assignmentData(e, r) {
    var t, s, n;
    if (Array.isArray(e.assignments)) {
      const i = e.assignments.find((a) => a.id === r) ?? null;
      return {
        ...i ?? {},
        survival: ((t = e.survival) == null ? void 0 : t[r]) ?? (i == null ? void 0 : i.survival),
        advancement: ((s = e.advancement) == null ? void 0 : s[r]) ?? (i == null ? void 0 : i.advancement)
      };
    }
    return ((n = e.assignments) == null ? void 0 : n[r]) ?? null;
  }
  rankTrack(e, r) {
    var t, s, n, i, a, l;
    return r && ((t = e.ranks) != null && t.officer) ? e.ranks.officer : !r && ((s = e.ranks) != null && s.enlisted) ? e.ranks.enlisted : ((n = e.ranks) == null ? void 0 : n.default) ?? ((i = e.ranks) == null ? void 0 : i.all) ?? ((a = e.ranks) == null ? void 0 : a.enlisted) ?? ((l = e.ranks) == null ? void 0 : l.officer) ?? {};
  }
  rankTitle(e, r, t) {
    var s, n;
    return ((n = (s = this.rankTrack(e, r)) == null ? void 0 : s[String(t)]) == null ? void 0 : n.title) ?? null;
  }
  applyRankBonus(e, r, t) {
    var i, a;
    const s = (a = (i = this.rankTrack(r, t.commissioned)) == null ? void 0 : i[String(t.rank)]) == null ? void 0 : a.bonus;
    if (!s) return;
    const n = this.applySkillOrStat(e, String(s), 1);
    n && t.skills_gained.push(n);
  }
  rollOnExternalSkillTable(e, r, t) {
    const s = this.rules.career(r);
    return s ? this.rollOnCareerSkillTable(e, s, t).note : null;
  }
  rollOnCareerSkillTable(e, r, t) {
    var l;
    const s = (l = r.skill_tables) == null ? void 0 : l[t];
    if (!s) throw new Error(`Unknown skill table ${t} for ${r.id}`);
    if (s.requires_edu && f(e, "EDU") < Number(s.requires_edu)) throw new Error(`${s.name ?? t} requires EDU ${s.requires_edu}+.`);
    const n = this.roller.rollD(6), i = String(s[String(Math.max(1, Math.min(6, n.total)))] ?? ""), a = this.applySkillOrStat(e, i, 1);
    return { roll: n, entry: i, note: a };
  }
  applySkillOrStat(e, r, t) {
    const s = r.split(/\s+or\s+/i)[0].replace(/\b(any|one of)\b/gi, "").trim(), n = s.match(/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+(\d+)/);
    if (n) {
      const d = n[1];
      return g(e, d, f(e, d) + Number(n[2])), d === "PSI" && (e.psi = f(e, "PSI")), `${d} +${n[2]}`;
    }
    const i = s.replace(/\s*\((?:any|Small Craft or Spacecraft|riding or Training)\)\s*/i, "").trim();
    if (!i) return null;
    const [a, l, c] = E(/\d+$/.test(i) ? i : `${i} ${t}`), u = typeof l == "string" && l.toLowerCase() === "any" ? null : l;
    return y(e, X(a), c, u, !0);
  }
  applyInlineEventEffects(e, r, t) {
    const s = t.match(/DM\+(\d+) to (?:any one |your next )Benefit/i);
    s && (e.dm_next_benefit += Number(s[1]));
    const n = t.match(/DM\+(\d+) to your next Advancement/i);
    if (n && (e.dm_next_advancement += Number(n[1])), /automatically promoted/i.test(t)) {
      const c = this.rules.career(r.career_id);
      r.rank = Math.min(6, r.rank + 1), r.advanced = !0, r.rank_title = this.rankTitle(c, r.commissioned, r.rank), this.applyRankBonus(e, c, r);
    }
    const i = [...t.matchAll(/\b([A-Z][A-Za-z-]+(?:\s+[A-Z][A-Za-z-]+)?(?:\s+\([^)]+\))?)\s+(\d)\b/g)];
    for (const c of i.slice(0, 2)) {
      const [u, d, _] = E(`${c[1]} ${c[2]}`);
      if (["Roll", "Gain", "Table", "DM"].includes(u)) continue;
      const m = y(e, u, _, d, !0);
      r.skills_gained.push(m);
    }
    /Gain (?:a|one) Contact/i.test(t) && e.associates.push({ kind: "contact", description: `Contact from ${r.career_id} event` }), /Gain (?:an|one) Ally/i.test(t) && e.associates.push({ kind: "ally", description: `Ally from ${r.career_id} event` }), /Gain (?:an|one) Enemy/i.test(t) && e.associates.push({ kind: "enemy", description: `Enemy from ${r.career_id} event` }), /Gain (?:a|one) Rival/i.test(t) && e.associates.push({ kind: "rival", description: `Rival from ${r.career_id} event` });
    const a = L(t);
    a.length && (e.pending_career_event_choice = { kind: "skill_choice", options: a, level: 1, prompt: t });
    const l = Z(t);
    l && (e.pending_career_event_choice = { kind: "skill_check", ...l, prompt: t }), /transfer to (?:the )?Marines/i.test(t) && (e.pending_transfer_career_id = "marine"), /transfer to (?:the )?Army/i.test(t) && (e.pending_transfer_career_id = "army"), /transfer to (?:the )?Confederation Army/i.test(t) && (e.pending_transfer_career_id = "confederation_army"), /transfer to any other non-military career|transfer to any other career|transfer to any career/i.test(t) && (e.pending_transfer_career_id = "any"), /you are ejected from this career|losing your place|forced out of the career/i.test(t) && (e.ejected_by_event = !0), /lose (?:one|1) Benefit roll|Lose one benefit roll|Lose one Benefit roll/i.test(t) && (r.benefit_forfeited = !0);
  }
  applyCareerTextEffects(e, r, t, s) {
    var c;
    if (/Frozen Watch|cold sleep|cryoberth/i.test(t) && (r.frozen_watch = !0, e.age = Math.max(0, e.age - 4), r.advanced = !1, r.skills_gained.push("Frozen Watch: no skill or advancement roll this term")), /Severely injured|seriously injured|Injured|suffer injuries|Injury Table|Injury table|injure you/i.test(t)) {
      const u = /result of 2|roll of 2/i.test(t) ? 2 : void 0, d = this.applyInjury(e, u);
      Object.assign(e, d.character);
    }
    const n = [...t.matchAll(/\b(STR|DEX|END|INT|EDU|SOC|PSI|CHA|TER|RES|REP)\s*(?:−|-)\s*(\d+)/gi)];
    for (const u of n) {
      const d = u[1].toUpperCase(), _ = Number(u[2]);
      d === "REP" ? e.reputation = Math.max(0, e.reputation - _) : d === "RES" ? g(e, "SOC", f(e, "SOC") - _) : g(e, d, f(e, d) - _);
    }
    const i = t.match(/Reduce (?:your )?(STR|DEX|END|INT|EDU|SOC|PSI|CHA|TER|RES|REP)(?: or (STR|DEX|END|INT|EDU|SOC|PSI|CHA|TER|RES|REP))? by (\d+)/i);
    if (i) {
      const u = s ? "pending_career_mishap_choice" : "pending_career_event_choice";
      e[u] = {
        kind: "stat_choice",
        choices: [i[1], i[2]].filter(Boolean),
        amount: Number(i[3]),
        prompt: t
      };
    }
    const a = L(t);
    if (a.length) {
      const u = s ? "pending_career_mishap_choice" : "pending_career_event_choice";
      ((c = e[u]) == null ? void 0 : c.kind) !== "skill_check" && (e[u] = { kind: "skill_choice", options: a, level: 1, prompt: t });
    }
    const l = t.match(/rank (?:is )?reduced by (?:−|-)(\d+)|lose one level of rank|demoted one Rank/i);
    if (l) {
      const u = l[1] ? Number(l[1]) : 1;
      r.rank = Math.max(0, r.rank - u);
      const d = this.rules.career(r.career_id);
      r.rank_title = this.rankTitle(d, r.commissioned, r.rank), r.rank === 0 && /below zero|takes it below zero/i.test(t) && (e.force_career_end = !0);
    }
    if (/lose (?:all|any) Benefit rolls|no Benefit rolls/i.test(t) && (r.benefit_forfeited = !0), /must take (?:the )?Prisoner/i.test(t) && (e.forced_next_career_id = "prisoner"), /may not re-enlist|may not re-enter/i.test(t) && e.banned_career_ids.push(r.career_id), s && /gain (?:D3|1D|D6) Contacts/i.test(t)) {
      const u = /D3/i.test(t) ? this.roller.d3() : this.roller.d6();
      for (let d = 0; d < u; d++) e.associates.push({ kind: "contact", description: `Contact from ${r.career_id} mishap` });
    }
  }
  applyLifeEventEffects(e, r, t, s) {
    if (/Sickness or Injury/i.test(r) || /Roll on the Injury/i.test(t)) {
      const n = this.applyInjury(e);
      Object.assign(e, n.character);
      return;
    }
    /Ending of Relationship/i.test(r) ? e.pending_life_event_choice = { kind: "relationship_end", options: ["rival", "enemy"], prompt: t } : /Improved Relationship|New Relationship/i.test(r) ? e.associates.push({ kind: "ally", description: "Ally from life event" }) : /New Contact/i.test(r) ? e.associates.push({ kind: "contact", description: "Contact from life event" }) : /Betrayal/i.test(r) ? e.pending_life_event_choice = { kind: "betrayal", options: ["rival", "enemy"], prompt: t } : /Travel/i.test(r) ? e.dm_next_qualification += 2 : /Good Fortune/i.test(r) ? (e.good_fortune_benefit_dm += 2, e.dm_next_benefit += 2) : /Crime|Dishonoured/i.test(r) ? e.pending_life_event_choice = { kind: "crime", options: ["lose_benefit", "prisoner"], prompt: t } : /Aliens/i.test(t) ? (y(e, s ? "Tolerance" : "Science", 1, null, !0), e.associates.push({ kind: "contact", description: "Alien contact from life event" })) : /Psionics|Psionic/i.test(t) ? (e.pending_life_event_choice = { kind: "psionic_institute", options: ["test_psi", "ignore"], prompt: t }, e.auto_qualify_career_ids.push("psion")) : /Alien Artefact|Ancient Technology/i.test(t) ? e.equipment.push({ name: /Ancient Technology/i.test(t) ? "Ancient Technology" : "Alien Artefact", quantity: 1, notes: "Life event" }) : /Contact with Government|Contact with Clan Leaders/i.test(t) ? e.associates.push({ kind: "contact", description: "High-level contact from life event" }) : s && /Territory Challenge/i.test(r) ? e.pending_life_event_choice = { kind: "aslan_territory_challenge", options: ["increase", "decrease"], prompt: t } : s && /Clan Event/i.test(r) ? this.applyAslanClanEvent(e) : s && /Duel/i.test(r) && (e.pending_life_event_choice = { kind: "aslan_duel", options: ["accept", "refuse"], prompt: t });
  }
  applyAslanClanEvent(e) {
    var n;
    const r = ((n = this.rules.table("aslan_life_events").clan_events) == null ? void 0 : n.results) ?? {}, t = this.roller.rollD(6), s = String(r[String(t.total)] ?? "");
    /extra Benefit roll/i.test(s) && (e.pending_benefit_rolls += 1), /DM\+2 to your next advancement/i.test(s) && (e.dm_next_advancement += 2), /SOC \+1/i.test(s) && g(e, "SOC", f(e, "SOC") + 1), /Ally/i.test(s) && e.associates.push({ kind: "ally", description: "Ally from clan event" }), /Enemy/i.test(s) && e.associates.push({ kind: "enemy", description: "Enemy family from clan event" }), /DM-2 to survival/i.test(s) && (e.dm_next_survival -= 2), /lose one Benefit roll|no Benefit rolls/i.test(s) && e.current_term && (e.current_term.benefit_forfeited = !0), /DM-4 to advancement/i.test(s) && (e.dm_next_advancement -= 4), e.notes.push(`Aslan clan event: ${s}`);
  }
  isAslanLifeEventCharacter(e) {
    var r;
    return e.species_id.includes("aslan") && ((r = e.current_term) == null ? void 0 : r.career_id) !== "aslan_outcast";
  }
  resolveCareerChoice(e, r, t) {
    const s = h(e), n = r === "event" ? "pending_career_event_choice" : "pending_career_mishap_choice", i = s[n];
    if (!i) throw new Error(`No pending career ${r} choice.`);
    const a = String(i.kind ?? "");
    if (a === "skill_choice" || a === "free_skill_choice") {
      if (Array.isArray(i.options) && i.options.length && !i.options.includes(t)) throw new Error(`${t} is not a valid choice.`);
      const l = Number(i.level ?? 1), [c, u, d] = E(/\d+$/.test(t) ? t : `${t} ${l}`);
      y(s, c, d, u, !0);
    } else if (a === "stat_choice") {
      if (Array.isArray(i.choices) && i.choices.length && !i.choices.includes(t)) throw new Error(`${t} is not a valid choice.`);
      const l = t;
      g(s, l, f(s, l) - Number(i.amount ?? 1));
    } else if (a === "skill_check") {
      if (Array.isArray(i.skills) && i.skills.length && !i.skills.includes(t)) throw new Error(`${t} is not a valid skill check.`);
      const l = this.roller.roll2D(this.skillDm(s, t)), c = l.total >= Number(i.target ?? 8);
      s.notes.push(`${t} check ${c ? "succeeded" : "failed"} (${l.total}).`);
      const u = Array.isArray(i.successSkillOptions) ? i.successSkillOptions : [];
      if (c && u.length)
        return s.pending_career_event_choice = { kind: "skill_choice", options: u, level: 1, prompt: i.prompt }, { roll: l, succeeded: c, character: s };
      if (!c && /Mishap/i.test(String(i.prompt ?? "")) && s.current_term) {
        const d = this.mishapRoll(s);
        Object.assign(s, d.character);
      }
    } else a === "transfer" && (s.pending_transfer_career_id = t);
    return s[n] = null, { choice: t, character: s };
  }
  skillDm(e, r) {
    const [t, s] = T(r), n = e.skills.find((a) => a.name === t && (a.speciality ?? null) === s), i = e.skills.find((a) => a.name === t && !a.speciality);
    return (n == null ? void 0 : n.level) ?? (i == null ? void 0 : i.level) ?? -3;
  }
  applyPreCareerEventEffects(e, r, t, s) {
    if (/Carouse 1/i.test(t) && y(e, "Carouse", 1, null, !0), /Increase your SOC by \+1/i.test(t) && g(e, "SOC", f(e, "SOC") + 1), /Gain D3 Allies/i.test(t)) {
      const n = this.roller.d3();
      for (let i = 0; i < n; i++) e.associates.push({ kind: "ally", description: "Ally from pre-career education" });
    }
    /Gain a Rival/i.test(t) && e.associates.push({ kind: "rival", description: "Rival from pre-career education" }), /Gain an Enemy/i.test(t) && e.associates.push({ kind: "enemy", description: "Enemy from pre-career education" }), /Gain one Ally/i.test(t) && e.associates.push({ kind: "ally", description: "Ally from pre-career education" }), /gain an Enemy in a rival clan/i.test(t) && e.associates.push({ kind: "enemy", description: "Enemy in a rival clan" }), (/any one skill at level 0/i.test(t) || /any skill of your choice/i.test(t)) && (e.pending_life_event_choice = { kind: "pre_career_any_skill", level: 0, excluded: ["Jack-of-All-Trades"], prompt: t }), /crash and fail to graduate|cannot redeem yourself in time to graduate/i.test(t) && (e.pre_career_status = { ...e.pre_career_status ?? {}, forced_graduation_failure: !0 }), /Prisoner career in your next term/i.test(t) && r === 4 && (e.forced_next_career_id = "prisoner"), /join the Drifter career next term/i.test(t) && (e.pending_life_event_choice = { kind: "pre_career_war_choice", options: ["drifter", "draft", "avoid"], prompt: t }), s && /become Outcast|must become Outcast/i.test(t) && (e.forced_next_career_id = "aslan_outcast"), s && /Outlaw or Wanderer career without a qualification roll/i.test(t) && e.auto_qualify_career_ids.push("aslan_outlaw", "aslan_wanderer");
  }
  benefitRollsEarned(e, r, t) {
    let s = Math.max(0, e);
    return r >= 1 && (s += 1), r >= 3 && (s += 1), r >= 5 && (s += 1), t && (s = Math.max(0, s - 1)), s;
  }
  applyMusterBenefit(e, r) {
    const t = V(r);
    if (t.length) {
      e.pending_muster_benefit_choice = { options: t, raw: r };
      return;
    }
    for (const s of Y(r)) this.applySingleMusterBenefit(e, s);
  }
  applySingleMusterBenefit(e, r) {
    var c;
    const t = r.trim(), s = t.match(/^(D3|D6)\s+(Contact|Ally|Rival|Enemy)s?$/i);
    if (s) {
      const u = s[1].toUpperCase() === "D3" ? this.roller.d3() : this.roller.d6();
      for (let d = 0; d < u; d++) e.associates.push({ kind: s[2].toLowerCase(), description: `${s[2]} from mustering-out benefit` });
      return;
    }
    const n = t.match(/^(\d+)?\s*(Contact|Ally|Rival|Enemy)s?$/i);
    if (n) {
      const u = Number(n[1] ?? 1);
      for (let d = 0; d < u; d++) e.associates.push({ kind: n[2].toLowerCase(), description: `${n[2]} from mustering-out benefit` });
      return;
    }
    const i = t.match(/^(\d+|D3|D6)?\s*Ship Shares?$/i);
    if (i || /^Ship Share$/i.test(t)) {
      const u = (i == null ? void 0 : i[1]) ?? "1";
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
      u === "REP" ? e.reputation += Number(l[2]) : u === "RES" ? g(e, "SOC", f(e, "SOC") + Number(l[2])) : g(e, u, f(e, u) + Number(l[2])), u === "PSI" && (e.psi = f(e, "PSI"));
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
      const [u, d, _] = E(t);
      _ > 0 && u !== t ? y(e, u, _, d, !0) : e.equipment.push({ name: t, quantity: 1, notes: "Mustering-out benefit" });
    }
  }
  injuryPending(e, r) {
    const t = e.effects ?? [];
    if (!t.length) return null;
    const s = ["STR", "DEX", "END"], n = t.find((l) => l.type === "reduce_physical_random"), i = t.find((l) => l.type === "reduce_choice"), a = t.find((l) => l.type === "reduce_physical_other");
    return n ? {
      roll: r,
      title: e.title ?? "Injury",
      damage_to_chosen: n.amount === "1D" ? this.roller.d6() : Number(n.amount ?? 0),
      auto_reduce_others: Number((a == null ? void 0 : a.amount) ?? 0),
      choices: s,
      prompt: e.text ?? "Choose which physical characteristic takes the damage."
    } : i ? {
      roll: r,
      title: e.title ?? "Injury",
      damage_to_chosen: Number(i.amount ?? 0),
      auto_reduce_others: 0,
      choices: i.characteristics ?? s,
      prompt: e.text ?? "Choose which characteristic takes the damage."
    } : null;
  }
  applyAgingIfNeeded(e) {
    const r = this.rules.species(e.species_id) ?? {}, t = Number(r.aging_starts_term ?? this.rules.table("aging").triggers_at_term ?? 4);
    if (e.total_terms < t) return null;
    const s = this.roller.roll2D(-e.total_terms), n = this.rules.table("aging"), i = this.agingEntry(n, s.total), a = this.applyAgingEffects(e, i.effects ?? []), l = a.some((c) => f(e, c.stat) <= 0);
    if (l) {
      const c = this.roller.d6() * 1e4;
      e.pending_injury_treatment_choice = {
        kind: "aging_crisis",
        gross_debt: c,
        net_debt: c,
        title: "Aging crisis"
      }, e.notes.push("Aging crisis: medical care needed to keep reduced characteristics at 1.");
    }
    return e.notes.push(`Aging roll ${s.total}: ${i.title ?? "Aging"}.`), { roll: s, entry: i, reductions: a, crisis: l };
  }
  agingEntry(e, r) {
    var t, s, n;
    return r <= -6 ? ((t = e.entries) == null ? void 0 : t["-6_or_less"]) ?? {} : r >= 1 ? ((s = e.entries) == null ? void 0 : s["1_or_more"]) ?? {} : ((n = e.entries) == null ? void 0 : n[String(r)]) ?? {};
  }
  applyAgingEffects(e, r) {
    const t = [], s = ["STR", "DEX", "END"], n = ["INT", "EDU", "SOC"];
    for (const i of r) {
      const a = i.type === "reduce_mental" ? n : s, l = Math.min(Number(i.count ?? 1), a.length), c = Number(i.amount ?? 0);
      for (const u of a.slice(0, l))
        g(e, u, f(e, u) - c), t.push({ stat: u, amount: c });
    }
    return t;
  }
  finalizeRobot(e) {
    const r = N();
    return r.character_type = "robot", r.robot_config = e, r.name = String(e.name ?? "Traveller Robot"), r.age = 0, r.characteristics = {
      STR: Number(e.STR ?? 0),
      DEX: Number(e.DEX ?? 0),
      END: Number(e.END ?? 0),
      INT: Number(e.INT ?? 0),
      EDU: Number(e.EDU ?? 0),
      SOC: 0
    }, r.phase = "done", r.notes.push("Created robot placeholder from supplied robot configuration."), { character: r };
  }
  generateNpc() {
    let e = N();
    return e.name = "Generated Traveller", e = this.rollInitialCharacteristics(e).character, e = this.chooseSociety(e, "third_imperium").character, e = this.applySpecies(e, "imperial_human").character, e = this.applyBackgroundSkills(e, ["Admin", "Streetwise", "Vacc Suit"]).character, e = this.applyCareerPackage(e, "scout").character, e.phase = "done", { character: e };
  }
}
function T(o) {
  const e = o.match(/^(.+?)\s*\((.+)\)\s*$/);
  return e ? [e[1].trim(), e[2].trim()] : [o.trim(), null];
}
function E(o) {
  const e = o.trim(), r = e.match(/\s+(\d+)$/), t = r ? Number(r[1]) : 1, s = r ? e.slice(0, r.index).trim() : e, [n, i] = T(s);
  return [n, i, t];
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
    return o.split(/\s+or\s+/i).map((r) => r.trim()).filter(Boolean);
  if (/Ship's Boat|Air\/Raft|Personal Vehicle|Weapon|Gun|Blade|Armou?r|Combat Implant|Scientific Equipment/i.test(o))
    return o.split(/\s+or\s+/i).map((r) => r.trim()).filter(Boolean);
  const e = o.split(/\s+or\s+/i).map((r) => r.trim()).filter(Boolean);
  return e.every((r) => /\d$/.test(r) || /^[A-Z][A-Za-z -]+(?:\s+\([^)]+\))?$/.test(r)) ? e : [];
}
function L(o) {
  const e = o.match(/Gain (?:one of |one level of |a level of )(.+?)(?:\.|, or transfer| or transfer|$)/i);
  if (!e) return [];
  const r = e[1].replace(/^these skills by one level:\s*/i, "").replace(/^any of:\s*/i, "").replace(/\bat level 1\b/i, "").split(/\s+and\s+DM|\s+and\s+gain|\s+on failure/i)[0].trim();
  return /Benefit|Contact|Ally|Enemy|Rival|DM\+/i.test(r) ? [] : r.split(/,\s*|\s+or\s+/i).map((t) => t.replace(/\bone level in\b/i, "").trim()).filter((t) => /^[A-Z][A-Za-z -]+(?:\s+\([^)]+\))?(?:\s+1)?$/.test(t)).map((t) => /\d$/.test(t) ? t : `${t} 1`);
}
function Z(o) {
  const e = o.match(/Roll\s+([A-Z][A-Za-z -]+?(?:\s+\([^)]+\))?)\s+(\d+)\+(?:\s+or\s+([A-Z][A-Za-z -]+?(?:\s+\([^)]+\))?)\s+(\d+)\+)?/);
  if (!e) return null;
  const r = Number(e[2] ?? e[4] ?? 8), t = [e[1], e[3]].filter(Boolean).map((n) => String(n).trim()), s = L(o);
  return { skills: t, target: r, successSkillOptions: s };
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
    return Object.values(this.bundle.species).sort((e, r) => String(e.name).localeCompare(String(r.name)));
  }
  career(e) {
    return this.bundle.careers[e];
  }
  careerList() {
    return Object.values(this.bundle.careers).sort((e, r) => String(e.name).localeCompare(String(r.name)));
  }
  table(e) {
    return this.bundle.tables[e];
  }
  speciesForSociety(e) {
    var t;
    const r = new Set(((t = this.catalog.speciesBySociety[e]) == null ? void 0 : t.map((s) => s.id)) ?? []);
    return this.speciesList().filter((s) => r.has(s.id));
  }
  careersForSociety(e) {
    const r = /* @__PURE__ */ new Set([
      ...(this.catalog.careersBySociety.any ?? []).map((t) => t.id),
      ...(this.catalog.careersBySociety[e] ?? []).map((t) => t.id)
    ]);
    return this.careerList().filter((t) => r.has(t.id));
  }
}
async function J(o) {
  const e = o.replace(/\/$/, ""), [r, t, s, n] = await Promise.all([
    U(`${e}/species/index.json`, `${e}/species`),
    U(`${e}/careers/index.json`, `${e}/careers`),
    Q(e),
    R(`${e}/catalog.json`)
  ]);
  return new W({ species: r, careers: t, tables: s, catalog: n });
}
async function Q(o) {
  const e = await Promise.all(K.map(async (r) => [r, await R(`${o}/tables/${r}.json`)]));
  return Object.fromEntries(e);
}
async function U(o, e) {
  const r = await R(o), t = [];
  for (const s of r) {
    const n = await R(`${e}/${s}`), i = Array.isArray(n) ? n : [n];
    for (const a of i)
      a != null && a.deprecated || a != null && a.id && t.push([a.id, a]);
  }
  return Object.fromEntries(t);
}
async function R(o) {
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
function re(o) {
  return ee[M(o)];
}
function se(o) {
  if (o)
    return te[M(o)] ?? M(o).replace(/[^a-z0-9]/g, "");
}
function M(o) {
  return o.trim().toLowerCase();
}
function ie(o, e = {}) {
  const r = e.entryYear ?? 1105, t = ne(o), s = Object.fromEntries(z.map((l) => {
    const c = l === "PSI" && o.psi || f(o, l);
    return [l, { value: c, current: c, show: ce(l, c), default: !1 }];
  })), n = o.characteristics.STR + o.characteristics.DEX + o.characteristics.END, i = [
    ...ae(o),
    ...oe(o),
    ...le(o)
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
      hits: { value: n, max: n, damage: 0, tmpDamage: 0 },
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
      characteristics: s,
      skills: t,
      damage: { STR: { value: 0 }, DEX: { value: 0 }, END: { value: 0, tmp: 0 } },
      sophont: {
        age: String(o.age),
        species: D(o.species_id.replaceAll("_", " ")),
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
      entryYear: r,
      entryAge: o.age,
      currentYear: r,
      birthYear: r - o.age
    },
    items: i,
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
function ne(o) {
  const e = {};
  for (const r of o.skills) {
    const t = re(r.name);
    if (t)
      if (e[t] ?? (e[t] = { base: -1, specs: {} }), !r.speciality || r.speciality.toLowerCase() === "any")
        e[t].base = Math.max(e[t].base, r.level);
      else {
        const s = se(r.speciality);
        s && (e[t].specs[s] = Math.max(e[t].specs[s] ?? -1, r.level));
      }
  }
  return Object.fromEntries(Object.entries(e).map(([r, t]) => {
    const s = { id: r, value: t.base > 0 ? String(t.base) : Math.max(t.base, 0), trained: !0 };
    return Object.keys(t.specs).length && (s.specialities = Object.fromEntries(Object.entries(t.specs).map(([n, i]) => [n, { id: n, value: String(i) }]))), [r, s];
  }));
}
function ae(o) {
  const e = {
    ally: { affinity: 3, enmity: 0, power: 2, influence: 2 },
    contact: { affinity: 3, enmity: 0, power: 0, influence: 4 },
    rival: { affinity: 1, enmity: 0, power: 2, influence: 1 },
    enemy: { affinity: 0, enmity: -3, power: 3, influence: 1 }
  };
  return o.associates.map((r) => {
    const t = String(r.kind || "contact").toLowerCase(), s = e[t] ?? e.contact;
    return P(r.description || `Unnamed ${D(t)}`, "associate", {
      associate: { relationship: t, ...s },
      relation: t,
      description: r.description
    });
  });
}
function oe(o) {
  return o.term_history.map((e, r) => {
    const t = D(e.career_id.replaceAll("_", " ")), s = D(e.assignment_id.replaceAll("_", " ")), n = `${t}${s ? `: ${s}` : ""}${e.rank_title ? ` (${e.rank_title})` : ""}`, i = [n, ...e.events.map((a) => `* ${a}`)].join(`
`);
    return P(`Term ${r + 1}: ${n}`, "term", {
      term: { number: r + 1, termLength: 4, assignment: n, randomTerm: !1, randomLength: "" },
      name: "Term",
      description: i
    }, "systems/mgt2e/icons/misc/career.svg");
  });
}
function le(o) {
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
function P(o, e, r, t = "systems/mgt2e/icons/items/item.svg") {
  const s = Date.now();
  return {
    name: o,
    type: e,
    system: r,
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
      createdTime: s,
      modifiedTime: s
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
  const r = D(e.career_id.replaceAll("_", " ")), t = e.assignment_id && e.assignment_id !== "career_package" ? D(e.assignment_id.replaceAll("_", " ")) : "";
  return t ? `${r}: ${t}` : r;
}
function de(o) {
  return `<p>${_e(o).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`;
}
function _e(o) {
  return o.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function D(o) {
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
    const r = "modules/traveller-character-creator/data";
    this.rules = await J(r), this.engine = new H(this.rules);
    try {
      const t = await fetch("modules/traveller-character-creator/SOURCE_VERSION");
      t.ok && (this.sourceVersion = (await t.text()).trim());
    } catch {
      this.sourceVersion = "unknown";
    }
  }
  open(e = {}) {
    if (!this.engine || !this.appClass) throw new Error("Traveller Creator is not initialized yet.");
    const r = new this.appClass(this, e);
    return r.render(!0), r;
  }
  newCharacter() {
    return N();
  }
  exportActorData(e, r = {}) {
    const t = Number(r.entryYear ?? game.settings.get("traveller-character-creator", "defaultEntryYear"));
    return ie(e, { sourceVersion: this.sourceVersion, entryYear: t });
  }
  async createActor(e, r = {}) {
    var n, i;
    const t = this.exportActorData(e, r), s = await Actor.implementation.create(t);
    return game.settings.get("traveller-character-creator", "autoOpenCreatedActor") && ((n = s.sheet) == null || n.render(!0)), (i = ui.notifications) == null || i.info(`Created Traveller actor: ${s.name}`), s;
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
const { ApplicationV2: he, HandlebarsApplicationMixin: ge } = foundry.applications.api, b = class b extends ge(he) {
  constructor(e, r = {}) {
    super(r), this.api = e, this.character = this.loadDraft() ?? e.newCharacter();
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
      skillPackages: Object.entries(e.table("skill_packages").packages ?? {}).map(([r, t]) => ({ id: r, ...t })),
      canCreate: this.character.phase === "done"
    };
  }
  static async onSubmit() {
  }
  static async roll() {
    this.character = this.api.engine.rollInitialCharacteristics(this.character).character, this.saveDraft(), this.render();
  }
  static async chooseSociety(e, r) {
    const t = r.dataset.id;
    t && (this.character = this.api.engine.chooseSociety(this.character, t).character, this.saveDraft(), this.render());
  }
  static async applySpecies(e, r) {
    const t = r.dataset.id;
    t && (this.character = this.api.engine.applySpecies(this.character, t).character, (this.character.phase === "aslan_setup" || this.character.phase === "zhodani_training") && (this.character.phase = "background", this.character.notes.push("Advanced special ancestry setup placeholder; detailed branch port remains in lifepath engine.")), this.saveDraft(), this.render());
  }
  static async applyBackgroundPackage(e, r) {
    const t = r.dataset.id;
    t && (this.character = this.api.engine.applyBackgroundPackage(this.character, t).character, this.saveDraft(), this.render());
  }
  static async applyCareerPackage(e, r) {
    const t = r.dataset.id;
    t && (this.character = this.api.engine.applyCareerPackage(this.character, t).character, this.saveDraft(), this.render());
  }
  static async applySkillPackage(e, r) {
    const t = r.dataset.id;
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
    game.settings.get("traveller-character-creator", "persistDrafts") && localStorage.setItem(A(), JSON.stringify(this.character));
  }
  loadDraft() {
    var r;
    if (!game.settings.get("traveller-character-creator", "persistDrafts")) return null;
    const e = localStorage.getItem(A());
    if (!e) return null;
    try {
      return JSON.parse(e);
    } catch {
      return (r = ui.notifications) == null || r.warn("Traveller Creator draft was unreadable and has been reset."), localStorage.removeItem(A()), null;
    }
  }
  clearDraft() {
    localStorage.removeItem(A());
  }
};
b.DEFAULT_OPTIONS = {
  id: "traveller-character-creator",
  tag: "form",
  window: {
    title: "Traveller Character Creator",
    icon: "fa-solid fa-user-astronaut",
    resizable: !0
  },
  position: { width: 760, height: 720 },
  form: { handler: b.onSubmit, submitOnChange: !1, closeOnSubmit: !1 },
  actions: {
    roll: b.roll,
    chooseSociety: b.chooseSociety,
    applySpecies: b.applySpecies,
    applyBackgroundPackage: b.applyBackgroundPackage,
    applyCareerPackage: b.applyCareerPackage,
    applySkillPackage: b.applySkillPackage,
    createActor: b.createActor,
    reset: b.reset
  }
}, b.PARTS = {
  body: { template: "modules/traveller-character-creator/templates/creator.hbs" }
};
let q = b;
function A() {
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
  var s;
  const r = e instanceof HTMLElement ? e : e[0];
  if (!r || r.querySelector("[data-traveller-creator-open]")) return;
  const t = document.createElement("button");
  t.type = "button", t.dataset.travellerCreatorOpen = "true", t.classList.add("traveller-creator-open"), t.innerHTML = '<i class="fa-solid fa-user-astronaut"></i> Create Traveller', t.addEventListener("click", () => {
    var n;
    return (n = game.travellerCreator) == null ? void 0 : n.open();
  }), (s = r.querySelector(".directory-header")) == null || s.append(t);
});
//# sourceMappingURL=traveller-character-creator.js.map
