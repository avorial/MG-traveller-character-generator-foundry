const R = ["STR", "DEX", "END", "INT", "EDU", "SOC"], U = [
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
function T() {
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
function m(o, e) {
  return e in o.characteristics ? Number(o.characteristics[e] ?? 0) : Number(o.extra_characteristics[e] ?? 0);
}
function g(o, e, r) {
  const t = Math.max(0, Math.trunc(r));
  e in o.characteristics ? o.characteristics[e] = t : o.extra_characteristics[e] = t;
}
function y(o, e, r = 0, t = null, s = !1) {
  if (o.forbidden_skills.includes(e) || t && o.forbidden_skills.includes(`${e} (${t})`))
    return `Skipped ${w(e, t)} (forbidden by species)`;
  const i = o.skills.find((a) => a.name === e && (a.speciality ?? null) === t);
  if (i)
    return r === 0 ? `Already has ${w(e, t)} ${i.level}` : s ? r > i.level ? (i.level = Math.min(r, 4), O(o.skills), `Increased ${w(e, t)} to ${i.level}`) : `${w(e, t)} unchanged (already ${i.level})` : (i.level = Math.min(i.level + r, 4), O(o.skills), `Increased ${w(e, t)} to ${i.level}`);
  const n = Math.max(0, r);
  return o.skills.push({ name: e, level: n, speciality: t }), t && n >= 1 && !o.skills.some((a) => a.name === e && !a.speciality) && o.skills.push({ name: e, level: 0, speciality: null }), O(o.skills), `Gained ${w(e, t)} ${n}`;
}
function w(o, e) {
  return `${o}${e ? ` (${e})` : ""}`;
}
function O(o) {
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
    const r = [this.d6(), this.d6(), this.d6()].sort((s, i) => i - s), t = r.slice(0, 2);
    return { dice: r, natural: t[0] + t[1], total: t[0] + t[1], dm: 0 };
  }
  rollDie(e) {
    return Math.floor(Math.random() * e) + 1;
  }
}
function x(o) {
  return o <= 0 ? -3 : o <= 2 ? -2 : Math.floor(o / 3) - 2;
}
class z {
  constructor(e, r = new F()) {
    this.rules = e, this.roller = r;
  }
  freshCharacter() {
    return T();
  }
  rollInitialCharacteristics(e, r = !1) {
    const t = h(e), s = {}, i = /* @__PURE__ */ new Set();
    if (r) {
      const n = R.map((a) => ({ stat: a, roll: this.roller.roll2D() }));
      n.sort((a, l) => l.roll.total - a.roll.total), i.add(n[0].stat), i.add(n[1].stat);
    }
    for (const n of R) {
      const a = this.roller.rollCharacteristic(r && i.has(n));
      t.characteristics[n] = a.total, s[n] = a;
    }
    return t.phase = "society", t.notes.push("Rolled initial characteristics."), { rolls: s, character: t };
  }
  rollExtraCharacteristics(e, r, t = !1) {
    const s = h(e), i = {};
    for (const n of r) {
      const a = this.roller.rollCharacteristic(t);
      g(s, n, a.total), n === "PSI" && (s.psi = a.total), i[n] = a;
    }
    return s.notes.push(`Rolled extra characteristics: ${r.join(", ")}.`), { rolls: i, character: s };
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
    for (const [i, n] of Object.entries(t.characteristic_modifiers ?? {}))
      g(s, i, m(s, i) + Number(n));
    if (t.starting_age && (s.age = Number(t.starting_age)), t.uses_cha) {
      const i = this.roller.d6() + 2;
      g(s, "CHA", i), s.characteristics.SOC = 0;
    }
    if (t.extra_characteristics_required)
      for (const i of t.extra_characteristics_required)
        m(s, i) || g(s, i, this.roller.roll2D().total);
    return s.forbidden_skills = [...t.forbidden_skills ?? []], s.traits = [...t.traits ?? []], r.includes("aslan") ? (s.phase = "aslan_setup", s.aslan_setup_status = { phase: "gender" }) : t.psionic_training_at_start || r.includes("zhodani") && s.characteristics.SOC >= 10 ? s.phase = "zhodani_training" : s.phase = "background", s.notes.push(`Applied species: ${t.name ?? r}.`), { species: t, character: s };
  }
  applyBackgroundSkills(e, r) {
    const t = h(e), s = Math.max(0, 3 + x(t.characteristics.EDU));
    for (const i of r.slice(0, s)) {
      const [n, a] = j(i);
      y(t, n, 0, a);
    }
    return t.phase = "pre_career", t.notes.push(`Chose ${Math.min(r.length, s)} background skills.`), { allowed: s, chosen: r.slice(0, s), character: t };
  }
  applyBackgroundPackage(e, r, t = {}) {
    const i = (this.rules.table("background_packages").packages ?? this.rules.table("background_packages"))[r];
    if (!i) throw new Error(`Unknown background package: ${r}`);
    const n = h(e);
    for (const [a, l] of Object.entries(i.characteristic_modifiers ?? i.stat_mods ?? {}))
      g(n, a, m(n, a) + Number(l));
    for (const a of i.skills ?? []) {
      const l = typeof a == "string" ? a : `${a.name}${a.speciality ? ` (${a.speciality})` : ""}`, c = t[l] ?? a;
      if (typeof c == "string") {
        const [u, d, _] = C(c);
        y(n, u, _ === 1 && !/\d+$/.test(c.trim()) ? 0 : _, d);
      } else
        y(n, c.name, Number(c.level ?? 0), c.speciality ?? null);
    }
    n.credits += Number(i.credits ?? 0);
    for (const a of i.equipment ?? []) n.equipment.push({ name: String(a), quantity: 1, notes: null });
    return n.age = Math.max(n.age, 22), n.phase = "career", n.notes.push(`Applied background package: ${i.name ?? r}.`), { package: i, character: n };
  }
  applyCareerPackage(e, r) {
    const t = this.rules.table("career_packages"), i = (Array.isArray(t == null ? void 0 : t.packages) ? t.packages : Array.isArray(t) ? t : Object.values(t.packages ?? t)).find((a) => a.id === r);
    if (!i) throw new Error(`Unknown career package: ${r}`);
    const n = h(e);
    for (const [a, l] of Object.entries(i.characteristic_modifiers ?? i.characteristics ?? i.stat_mods ?? {}))
      g(n, a, m(n, a) + Number(l));
    for (const a of i.skills ?? [])
      if (typeof a == "string") {
        const [l, c, u] = C(a);
        y(n, l, u, c);
      } else
        y(n, a.name, Number(a.level ?? 0), a.speciality ?? null, !0);
    n.credits += Number(i.credits ?? 0);
    for (const a of i.equipment ?? []) n.equipment.push({ name: String(a), quantity: 1, notes: null });
    for (let a = 0; a < Number(i.contacts ?? 0); a++) n.associates.push({ kind: "contact", description: i.contact_description ?? "career package contact" });
    for (let a = 0; a < Number(i.allies ?? 0); a++) n.associates.push({ kind: "ally", description: i.ally_description ?? "career package ally" });
    return n.age += this.roller.d3(), n.career_package_id = r, n.career_package_taken = !0, n.completed_careers.push({
      career_id: r,
      assignment_id: "career_package",
      terms_served: 1,
      final_rank: Number(i.rank ?? 0),
      final_rank_title: i.rank_title ?? null,
      commissioned: !1,
      left_due_to: "career_package",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 0
    }), n.phase = "skill_package", n.notes.push(`Applied career package: ${i.name ?? r}.`), { package: i, character: n };
  }
  applySkillPackage(e, r) {
    const s = (this.rules.table("skill_packages").packages ?? this.rules.table("skill_packages"))[r];
    if (!s) throw new Error(`Unknown skill package: ${r}`);
    const i = h(e);
    for (const n of s.skills ?? []) {
      const [a, l] = j(n);
      y(i, a, 1, l);
    }
    return i.phase = "done", i.notes.push(`Applied skill package: ${s.name ?? r}.`), { package: s, character: i };
  }
  skipPreCareer(e) {
    const r = h(e);
    return r.phase = "career", r.notes.push("Skipped pre-career education."), { character: r };
  }
  qualifyForPreCareer(e, r, t = {}) {
    var p, v, $;
    const s = (p = this.rules.table("education").tracks) == null ? void 0 : p[r];
    if (!s) throw new Error(`Unknown pre-career track: ${r}`);
    const i = h(e), n = t.service ? (v = s.services) == null ? void 0 : v[t.service] : null, a = t.curriculum ? ($ = s.curricula) == null ? void 0 : $[t.curriculum] : null, l = (n == null ? void 0 : n.qualification) ?? s.qualification ?? {}, c = this.checkDm(i, l), u = l.automatic ? null : this.roller.roll2D(c), d = l.automatic || !!(u && u.total >= Number(l.target ?? 0));
    if (!d)
      return i.phase = "career", i.notes.push(`Failed ${s.name ?? r} qualification${u ? ` (${u.total})` : ""}.`), { track: s, roll: u, qualified: d, character: i };
    this.applyStatBlock(i, s.enrollment_bonus ?? {}), this.applySkillResults(i, s.enrollment_auto_skills ?? [], 0);
    const _ = this.preCareerSkillPool(s, n, a), f = this.applyChosenSkills(i, t.skills, _, Number(s.enrollment_skill_picks ?? 0), Number(s.enrollment_pick_level ?? 0));
    if (a != null && a.enrollment_skill_table) {
      const k = this.rollOnExternalSkillTable(i, a.enrollment_skill_table.career, a.enrollment_skill_table.table);
      k && f.push(k);
    }
    for (let k = 0; k < Number(s.enrollment_service_skill_random ?? 0); k++) {
      const E = this.rollOnExternalSkillTable(i, (n == null ? void 0 : n.career_id) ?? "merchant", "service_skills");
      E && f.push(E);
    }
    if (l.requires_psi_test && !i.psi_tested) {
      const k = this.roller.roll2D();
      i.psi = k.total, g(i, "PSI", k.total), i.psi_tested = !0;
    }
    return i.pre_career_status = {
      track_id: r,
      service_id: (n == null ? void 0 : n.id) ?? t.service ?? null,
      career_id: (n == null ? void 0 : n.career_id) ?? null,
      curriculum_id: (a == null ? void 0 : a.id) ?? t.curriculum ?? null,
      enrolled: !0,
      skill_pool: _,
      enrollment_skills: f
    }, i.phase = "pre_career", i.notes.push(`Qualified for ${s.name ?? r}.`), { track: s, roll: u, qualified: d, character: i };
  }
  graduatePreCareer(e, r = []) {
    var f, p;
    const t = e.pre_career_status ?? {}, s = String(t.track_id ?? ""), i = (f = this.rules.table("education").tracks) == null ? void 0 : f[s];
    if (!i) throw new Error("No active pre-career track to graduate.");
    const n = h(e), a = i.graduation ?? {};
    if (t.forced_graduation_failure)
      return n.pre_career_status = { ...t, graduated: !1, honours: !1, graduation_roll: null, outcome_note: ((p = a.on_failure) == null ? void 0 : p.note) ?? "Failed to graduate." }, n.age += Number(i.age_cost ?? 0), n.pre_career_terms += Number(i.age_cost ?? 0) > 0 ? 1 : 0, n.phase = "career", n.notes.push(`Failed to graduate from ${i.name ?? s} due to pre-career event.`), { track: i, roll: null, graduated: !1, honours: !1, character: n };
    const l = this.checkDm(n, a), c = this.roller.roll2D(l), u = c.total >= Number(a.honours_target ?? 1 / 0), d = u || c.total >= Number(a.target ?? 0), _ = d ? (u ? a.on_honours : a.on_graduation) ?? {} : a.on_failure ?? {};
    return d && this.applyPreCareerOutcome(n, i, _, r), n.age = Math.max(n.age + Number(i.age_cost ?? 0), this.rollAgeOverride(_.age_override) ?? 0), n.pre_career_terms += Number(i.age_cost ?? 0) > 0 ? 1 : 0, n.pre_career_status = { ...t, graduated: d, honours: u, graduation_roll: c.total, outcome_note: _.note ?? null }, n.phase = "career", n.notes.push(`${d ? u ? "Graduated with honours from" : "Graduated from" : "Failed to graduate from"} ${i.name ?? s}.`), { track: i, roll: c, graduated: d, honours: u, character: n };
  }
  preCareerEventRoll(e, r = !1) {
    const t = h(e), s = this.rules.table("education"), i = r ? s.aslan_pre_career_events : s.pre_career_events, n = this.roller.roll2D(), a = String(Math.max(2, Math.min(12, n.total))), l = String((i == null ? void 0 : i[a]) ?? "No event.");
    return this.applyPreCareerEventEffects(t, n.total, l, r), t.pre_career_status = { ...t.pre_career_status ?? {}, last_event_roll: n.total, last_event: l }, t.notes.push(`Pre-career event: ${l}`), { roll: n, event: l, character: t };
  }
  qualifyForCareer(e, r) {
    var d, _, f;
    const t = this.rules.career(r);
    if (!t) throw new Error(`Unknown career: ${r}`);
    const s = h(e), i = this.careerBlocked(s, t);
    if (i)
      return s.notes.push(`Cannot qualify for ${t.name ?? r}: ${i}.`), { career: t, qualified: !1, blockedReason: i, character: s };
    const n = s.pending_transfer_career_id === "any" || s.pending_transfer_career_id === r, a = n || s.auto_entry_career_id === r || s.auto_qualify_career_ids.includes(r), l = this.checkDm(s, t.qualification ?? {}) + s.dm_next_qualification + Number(s.permanent_qualification_dm_by_career[r] ?? 0) - s.failed_qualifications_this_term, c = a || (d = t.qualification) != null && d.automatic ? null : this.roller.roll2D(l), u = a || ((_ = t.qualification) == null ? void 0 : _.automatic) || !!(c && c.total >= Number(((f = t.qualification) == null ? void 0 : f.target) ?? 0));
    return s.dm_next_qualification = 0, u ? (s.failed_qualifications_this_term = 0, n && (s.pending_transfer_career_id = null), s.auto_qualify_career_ids = s.auto_qualify_career_ids.filter((p) => p !== r), s.notes.push(`Qualified for ${t.name ?? r}.`)) : (s.failed_qualifications_this_term += 1, s.notes.push(`Failed qualification for ${t.name ?? r}${c ? ` (${c.total})` : ""}.`)), { career: t, roll: c, qualified: u, character: s };
  }
  startTerm(e, r, t) {
    var f;
    const s = this.rules.career(r);
    if (!s) throw new Error(`Unknown career: ${r}`);
    const i = this.assignmentIds(s), n = t ?? i[0];
    if (!this.assignmentData(s, n)) throw new Error(`Unknown assignment ${n} for ${r}`);
    const a = h(e), l = a.term_history.filter((p) => p.career_id === r).length, c = !!s.all_commissioned || a.starts_commissioned_career_id === r || !!a.completed_careers.find((p) => p.career_id === r && p.commissioned), u = a.pending_transfer_career_id === r || a.pending_transfer_career_id === "any" ? a.pending_transfer_rank : null, d = u != null ? Number(u) : c ? Number(a.starts_commissioned_rank ?? 1) : 0, _ = {
      career_id: r,
      assignment_id: n,
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
      for (const p of Object.values(((f = s.skill_tables) == null ? void 0 : f.service_skills) ?? {}).filter((v) => typeof v == "string")) {
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
    const t = h(e), s = this.requireCurrentTerm(t), i = this.rules.career(s.career_id), n = this.rollOnCareerSkillTable(t, i, r);
    return n.note && s.skills_gained.push(n.note), { career: i, tableId: r, roll: n.roll, result: n.entry, character: t };
  }
  survivalRoll(e) {
    const r = h(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id);
    if (s.no_survival)
      return t.survived = !0, t.survival_roll_total = null, r.notes.push(`${s.name ?? t.career_id} has no survival roll.`), { career: s, roll: null, survived: !0, character: r };
    const i = this.assignmentData(s, t.assignment_id), n = s.survival ?? i.survival ?? {}, a = this.checkDm(r, n) + r.dm_next_survival, l = this.roller.roll2D(a), c = l.natural !== 2 && l.total >= Number(n.target ?? 0);
    return t.survived = c, t.survival_roll_total = l.total, r.dm_next_survival = 0, c || t.events.push("Failed survival roll; roll on the Mishap table."), r.notes.push(`${c ? "Passed" : "Failed"} survival in ${s.name ?? t.career_id}.`), { career: s, roll: l, survived: c, character: r };
  }
  eventRoll(e) {
    var l;
    const r = h(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), i = this.roller.roll2D(r.dm_next_events), n = String(((l = s.events) == null ? void 0 : l[String(Math.max(2, Math.min(12, i.total)))]) ?? "No event.");
    t.events.push(n), this.applyInlineEventEffects(r, t, n), this.applyCareerTextEffects(r, t, n, !1);
    let a = null;
    if (/Life Event|Life event|Life Events Table/i.test(n)) {
      const c = this.lifeEventRoll(r, this.isAslanLifeEventCharacter(r));
      a = { roll: c.roll, event: c.event, subEvent: c.subEvent ?? null }, Object.assign(r, c.character);
    }
    return r.dm_next_events = 0, r.notes.push(`Career event: ${n}`), { career: s, roll: i, event: n, lifeEvent: a, character: r };
  }
  lifeEventRoll(e, r = !1) {
    var d;
    const t = h(e), s = r ? (d = this.rules.table("aslan_life_events").aslan_life_events) == null ? void 0 : d.results : this.rules.table("life_events").entries, i = this.roller.roll2D(), n = String(Math.max(2, Math.min(12, i.total))), a = s == null ? void 0 : s[n], l = typeof a == "string" ? a.split(":")[0] : (a == null ? void 0 : a.title) ?? "Life Event", c = typeof a == "string" ? a : (a == null ? void 0 : a.text) ?? "Life Event.";
    let u = null;
    if (!r && (a != null && a.sub_table)) {
      const _ = this.roller.rollD(6);
      return u = String(a.sub_table[String(_.total)] ?? ""), this.applyLifeEventEffects(t, l, `${c} ${u}`, r), t.notes.push(`Life event: ${l}; ${u}`), { roll: i, event: { title: l, text: c }, subEvent: u, character: t };
    }
    return this.applyLifeEventEffects(t, l, c, r), t.notes.push(`Life event: ${l}.`), { roll: i, event: { title: l, text: c }, character: t };
  }
  resolveLifeEventChoice(e, r) {
    const t = h(e), s = t.pending_life_event_choice;
    if (!s) throw new Error("No pending life event choice.");
    const i = String(s.kind ?? "");
    if (i === "relationship_end" || i === "betrayal") {
      const n = r === "enemy" ? "enemy" : "rival", a = t.associates.findIndex((l) => ["ally", "contact"].includes(l.kind));
      a >= 0 && i === "betrayal" ? t.associates[a] = { kind: n, description: `Former ${t.associates[a].kind} betrayed you` } : t.associates.push({ kind: n, description: `${n} from life event` });
    } else if (i === "crime")
      if (r === "prisoner") t.forced_next_career_id = "prisoner";
      else {
        const n = t.current_term;
        n ? n.benefit_forfeited = !0 : t.pending_benefit_rolls = Math.max(0, t.pending_benefit_rolls - 1);
      }
    else if (i === "pre_career_any_skill") {
      const n = Number(s.level ?? 0), [a, l, c] = C(/\d+$/.test(r) ? r : `${r} ${n}`);
      String(s.excluded ?? "").includes(a) || y(t, a, c, l, !0);
    } else i === "pre_career_war_choice" && (r === "drifter" ? t.forced_next_career_id = "drifter" : r === "draft" && (t.pending_life_event_choice = { kind: "draft", options: ["army", "marine", "navy"] }));
    return t.pending_life_event_choice = null, t.notes.push(`Resolved life event choice: ${r}.`), { choice: r, character: t };
  }
  mishapRoll(e) {
    var l;
    const r = h(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), i = this.roller.rollD(6), n = String(((l = s.mishaps) == null ? void 0 : l[String(Math.max(1, Math.min(6, i.total)))]) ?? "Mishap.");
    t.mishap = n;
    const a = !!s.mishap_no_eject || /not ejected|not have to leave|stay (?:in|on) (?:this )?career|remain in (?:the|this) career/i.test(n);
    return t.survived = !!a, t.events.push(n), this.applyInlineEventEffects(r, t, n), this.applyCareerTextEffects(r, t, n, !0), r.force_career_end = !a, r.notes.push(`Career mishap: ${n}`), { career: s, roll: i, mishap: n, character: r };
  }
  advancementRoll(e) {
    const r = h(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), i = this.assignmentData(s, t.assignment_id), n = s.advancement ?? i.advancement ?? {}, a = this.checkDm(r, n) + r.dm_next_advancement + r.dm_permanent_advancement + Number(r.permanent_advancement_dm_by_career[t.career_id] ?? 0), l = this.roller.roll2D(a), c = l.total >= Number(n.target ?? 0);
    return t.advanced = c, t.advancement_roll_total = l.total, r.dm_next_advancement = 0, c && (t.rank = Math.min(6, t.rank + 1), t.rank_title = this.rankTitle(s, t.commissioned, t.rank), this.applyRankBonus(r, s, t)), r.notes.push(`${c ? "Advanced" : "Did not advance"} in ${s.name ?? t.career_id}.`), { career: s, roll: l, advanced: c, character: r };
  }
  commissionRoll(e) {
    const r = h(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), i = s.commission;
    if (!i) throw new Error(`${s.name ?? t.career_id} does not have commission rolls.`);
    if (t.commissioned || r.term_history.some((_) => _.career_id === t.career_id && _.commissioned))
      throw new Error("Already commissioned in this career.");
    if (t.term_number > 1 && m(r, "SOC") < 9) throw new Error("Commission after the first term requires SOC 9+.");
    const n = -(t.term_number - 1), a = r.academy_commission_career_id === t.career_id ? r.academy_commission_dm : 0, l = r.completed_careers.length === 0 ? Number(r.pre_career_permanent_dms.first_career_commission_dm ?? 0) : 0, c = this.checkDm(r, i) + n + a + l + r.dm_next_advancement + r.dm_permanent_advancement, u = this.roller.roll2D(c), d = u.total >= Number(i.target ?? 8);
    return d && (t.commissioned = !0, t.rank = 1, t.rank_title = this.rankTitle(s, !0, 1), this.applyRankBonus(r, s, t), t.advanced = !1), r.dm_next_advancement = 0, r.academy_commission_career_id = null, r.academy_commission_dm = 0, r.notes.push(`${d ? "Commissioned" : "Failed commission"} in ${s.name ?? t.career_id}.`), { career: s, roll: u, commissioned: d, character: r };
  }
  endTerm(e, r = !1, t = "voluntary") {
    const s = h(e), i = this.requireCurrentTerm(s), n = this.rules.career(i.career_id);
    s.term_history.push(i), s.total_terms += 1, s.age += 4;
    const a = this.applyAgingIfNeeded(s);
    if (s.current_term = null, s.failed_qualifications_this_term = 0, r || s.force_career_end || i.survived === !1) {
      const c = s.term_history.filter((d) => d.career_id === i.career_id).length, u = n.mustering_out === null ? 0 : this.benefitRollsEarned(c * Number(n.mustering_out_rolls_per_term ?? 1), i.rank, i.benefit_forfeited);
      s.pending_benefit_rolls += u, s.completed_careers.push({
        career_id: i.career_id,
        assignment_id: i.assignment_id,
        terms_served: c,
        final_rank: i.rank,
        final_rank_title: i.rank_title ?? null,
        commissioned: i.commissioned,
        left_due_to: t,
        benefit_rolls_used: 0,
        benefit_rolls_earned: u
      }), s.force_career_end = !1, s.phase = s.pending_benefit_rolls > 0 ? "mustering" : "career";
    }
    return s.notes.push(`Ended ${n.name ?? i.career_id} term ${i.term_number}.`), { career: n, term: i, aging: a, character: s };
  }
  musterOutRoll(e, r, t = "benefit") {
    var P;
    const s = h(e), i = r ? [...s.completed_careers].reverse().find((S) => S.career_id === r) : s.completed_careers[s.completed_careers.length - 1];
    if (!i) throw new Error("No completed career to muster out from.");
    if (s.pending_benefit_rolls <= 0) throw new Error("No pending benefit rolls.");
    const n = this.rules.career(i.career_id);
    if (n.mustering_out === null) throw new Error(`${n.name ?? i.career_id} grants no mustering-out benefits.`);
    const a = i.final_rank >= 5 ? 1 : 0, l = t === "cash" && s.skills.some((S) => S.name.toLowerCase() === "gambler") ? 1 : 0, c = n.mustering_out_dm_characteristic ? x(m(s, n.mustering_out_dm_characteristic)) : 0, u = s.dm_next_benefit + a + l + c, d = n.hiver_career ? this.roller.roll2D(u) : this.roller.rollD(6), _ = Object.keys(n.mustering_out ?? {}).filter((S) => /^\d+$/.test(S)).map(Number), f = Math.min(..._, n.hiver_career ? 2 : 1), p = Math.max(..._, 7), v = Math.max(f, Math.min(p, d.total + (n.hiver_career ? 0 : u))), $ = ((P = n.mustering_out) == null ? void 0 : P[String(v)]) ?? {}, k = t === "cash" && s.cash_rolls_used < 3 && $.cash != null ? "cash" : "benefit", E = $[k];
    if (k === "cash") {
      const S = Number(E ?? 0);
      if (S < 0)
        s.medical_debt = Math.max(0, s.medical_debt + S);
      else {
        const B = Math.min(s.medical_debt, S);
        s.medical_debt -= B, s.credits += S - B;
      }
      s.cash_rolls_used += 1;
    } else
      this.applyMusterBenefit(s, String(E ?? "Benefit"));
    return s.pending_benefit_rolls -= 1, i.benefit_rolls_used += 1, s.dm_next_benefit = 0, s.pending_benefit_rolls <= 0 && (s.phase = "skill_package"), s.notes.push(`Mustering out ${k}: ${E}.`), { career: n, roll: d, tableRoll: v, column: k, result: E, character: s };
  }
  applyInjury(e, r) {
    var l;
    const t = h(e), s = r ? { dice: [], natural: r, total: r, dm: 0 } : this.roller.rollD(6), n = ((l = this.rules.table("injury").entries) == null ? void 0 : l[String(Math.max(1, Math.min(6, s.total)))]) ?? {}, a = this.injuryPending(n, s.total);
    return a ? (t.pending_injury_choice = a, t.notes.push(`Injury: ${n.title ?? "Injury"}; characteristic choice pending.`)) : t.notes.push(`Injury: ${n.title ?? "Lightly Injured"}; no permanent effect.`), { roll: s, entry: n, pendingChoice: a, character: t };
  }
  resolveInjuryChoice(e, r) {
    const t = h(e), s = t.pending_injury_choice;
    if (!s) throw new Error("No pending injury choice.");
    const i = s.choices;
    if (i != null && i.length && !i.includes(r)) throw new Error(`${r} is not a valid injury choice.`);
    const n = Number(s.damage_to_chosen ?? 0), a = Number(s.auto_reduce_others ?? 0), l = ["STR", "DEX", "END"].filter((f) => f !== r), c = Math.min(m(t, r), n), u = l.map((f) => ({ stat: f, loss: Math.min(m(t, f), a) })).filter((f) => f.loss > 0), d = c + u.reduce((f, p) => f + p.loss, 0), _ = d * 5e3;
    return t.pending_injury_treatment_choice = {
      chosen_stat: r,
      damage_to_chosen: n,
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
      const i = String(s.chosen_stat);
      g(t, i, m(t, i) - Number(s.damage_to_chosen ?? 0));
      for (const n of s.secondary_losses ?? [])
        g(t, n.stat, m(t, n.stat) - n.loss);
    }
    return t.pending_injury_treatment_choice = null, t.notes.push(r ? "Paid for injury treatment." : "Accepted injury characteristic loss."), { paid: r, character: t };
  }
  checkDm(e, r) {
    let t = x(m(e, r == null ? void 0 : r.characteristic));
    for (const s of (r == null ? void 0 : r.modifiers) ?? [])
      s.type === "per_previous_term" && (t += Number(s.dm ?? 0) * e.total_terms), s.type === "per_previous_career" && (t += Number(s.dm ?? 0) * e.completed_careers.length), s.type === "characteristic_threshold" && m(e, s.characteristic) >= Number(s.threshold ?? 0) && (t += Number(s.dm ?? 0));
    return t;
  }
  applyStatBlock(e, r) {
    for (const [t, s] of Object.entries(r))
      (R.includes(t) || t === "PSI" || t === "CHA") && (g(e, t, m(e, t) + Number(s)), t === "PSI" && (e.psi = m(e, "PSI")));
  }
  applyPreCareerOutcome(e, r, t, s) {
    var l, c, u, d, _, f;
    this.applyStatBlock(e, t), t.EDU_penalty_dice === "D3" && g(e, "EDU", m(e, "EDU") - this.roller.d3()), t.jack_of_all_trades && y(e, "Jack-of-All-Trades", Number(t.jack_of_all_trades), null, !0), this.applySkillResults(e, t.fixed_skills ?? [], 1);
    const i = ((l = e.pre_career_status) == null ? void 0 : l.skill_pool) ?? this.preCareerSkillPool(r, null, null), n = Number(t.skills_at_level_1 ?? 0) + Number(t.skills_upgrade_from_enrollment ?? 0) + Number(t.skills_from_enrollment_1 ?? 0);
    this.applyChosenSkills(e, s, i, n, 1), this.applyChosenSkills(e, s.slice(n), i, Number(t.additional_skills_from_enrollment_0 ?? 0), 0);
    for (const p of t.associates ?? [])
      e.associates.push({ kind: p.kind ?? "contact", description: p.description ?? `${r.name} associate` });
    const a = t.permanent ?? {};
    for (const p of a.advancement_dm_careers ?? [])
      e.permanent_advancement_dm_by_career[p] = Number(a.advancement_dm ?? 0);
    if (a.qualification_dm) {
      for (const p of this.rules.careerList()) e.permanent_qualification_dm_by_career[p.id] = Number(a.qualification_dm);
      for (const p of a.bonus_qualify_careers ?? []) e.permanent_qualification_dm_by_career[p] = Number(a.bonus_qualify_dm ?? 0);
    }
    a.psion_career_auto_entry && e.auto_qualify_career_ids.push("psion"), t.auto_entry && ((c = e.pre_career_status) != null && c.career_id) && (e.auto_entry_career_id = String(e.pre_career_status.career_id)), t.commission_dm && ((u = e.pre_career_status) != null && u.career_id) && (e.academy_commission_career_id = String(e.pre_career_status.career_id), e.academy_commission_dm = Number(t.commission_dm)), t.starts_commissioned_rank && ((d = e.pre_career_status) != null && d.career_id) && (e.starts_commissioned_career_id = String(e.pre_career_status.career_id), e.starts_commissioned_rank = Number(t.starts_commissioned_rank)), (_ = t.permanent) != null && _.auto_rank && ((f = e.pre_career_status) != null && f.career_id) && (e.starts_commissioned_career_id = String(e.pre_career_status.career_id), e.starts_commissioned_rank = Number(t.permanent.auto_rank), e.auto_entry_career_id = String(e.pre_career_status.career_id));
  }
  preCareerSkillPool(e, r, t) {
    const s = H(e);
    return [
      ...e.skill_list ?? [],
      ...s,
      ...e.enrollment_skill_pool ?? [],
      ...(r == null ? void 0 : r.skill_list) ?? [],
      ...(t == null ? void 0 : t.skill_list) ?? []
    ].map(String);
  }
  applyChosenSkills(e, r, t, s, i) {
    const n = Array.isArray(r) ? r.map(String) : typeof r == "string" ? r.split(",").map((c) => c.trim()).filter(Boolean) : [], a = n.length ? n : t, l = [];
    for (const c of a.slice(0, Math.max(0, s))) {
      const u = t.find((p) => p.toLowerCase() === c.toLowerCase()) ?? c, [d, _, f] = C(/\d+$/.test(u.trim()) ? u : `${u} ${i}`);
      l.push(y(e, d, f, _, !0));
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
    var s, i, n, a, l, c;
    if (e.banned_career_ids.includes(r.id)) return "career is banned by a prior result";
    if (e.forced_next_career_id && e.forced_next_career_id !== r.id) return `must enter ${e.forced_next_career_id}`;
    if ((s = r.blocked_societies) != null && s.includes(e.society_id)) return `blocked for ${e.society_id}`;
    if ((i = r.allowed_societies) != null && i.length && !r.allowed_societies.includes(e.society_id)) return `not available for ${e.society_id}`;
    if ((n = r.blocked_species) != null && n.includes(e.species_id)) return `blocked for ${e.species_id}`;
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
    var t, s, i;
    if (Array.isArray(e.assignments)) {
      const n = e.assignments.find((a) => a.id === r) ?? null;
      return {
        ...n ?? {},
        survival: ((t = e.survival) == null ? void 0 : t[r]) ?? (n == null ? void 0 : n.survival),
        advancement: ((s = e.advancement) == null ? void 0 : s[r]) ?? (n == null ? void 0 : n.advancement)
      };
    }
    return ((i = e.assignments) == null ? void 0 : i[r]) ?? null;
  }
  rankTrack(e, r) {
    var t, s, i, n, a, l;
    return r && ((t = e.ranks) != null && t.officer) ? e.ranks.officer : !r && ((s = e.ranks) != null && s.enlisted) ? e.ranks.enlisted : ((i = e.ranks) == null ? void 0 : i.default) ?? ((n = e.ranks) == null ? void 0 : n.all) ?? ((a = e.ranks) == null ? void 0 : a.enlisted) ?? ((l = e.ranks) == null ? void 0 : l.officer) ?? {};
  }
  rankTitle(e, r, t) {
    var s, i;
    return ((i = (s = this.rankTrack(e, r)) == null ? void 0 : s[String(t)]) == null ? void 0 : i.title) ?? null;
  }
  applyRankBonus(e, r, t) {
    var n, a;
    const s = (a = (n = this.rankTrack(r, t.commissioned)) == null ? void 0 : n[String(t.rank)]) == null ? void 0 : a.bonus;
    if (!s) return;
    const i = this.applySkillOrStat(e, String(s), 1);
    i && t.skills_gained.push(i);
  }
  rollOnExternalSkillTable(e, r, t) {
    const s = this.rules.career(r);
    return s ? this.rollOnCareerSkillTable(e, s, t).note : null;
  }
  rollOnCareerSkillTable(e, r, t) {
    var l;
    const s = (l = r.skill_tables) == null ? void 0 : l[t];
    if (!s) throw new Error(`Unknown skill table ${t} for ${r.id}`);
    if (s.requires_edu && m(e, "EDU") < Number(s.requires_edu)) throw new Error(`${s.name ?? t} requires EDU ${s.requires_edu}+.`);
    const i = this.roller.rollD(6), n = String(s[String(Math.max(1, Math.min(6, i.total)))] ?? ""), a = this.applySkillOrStat(e, n, 1);
    return { roll: i, entry: n, note: a };
  }
  applySkillOrStat(e, r, t) {
    const s = r.split(/\s+or\s+/i)[0].replace(/\b(any|one of)\b/gi, "").trim(), i = s.match(/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+(\d+)/);
    if (i) {
      const d = i[1];
      return g(e, d, m(e, d) + Number(i[2])), d === "PSI" && (e.psi = m(e, "PSI")), `${d} +${i[2]}`;
    }
    const n = s.replace(/\s*\((?:any|Small Craft or Spacecraft|riding or Training)\)\s*/i, "").trim();
    if (!n) return null;
    const [a, l, c] = C(/\d+$/.test(n) ? n : `${n} ${t}`), u = typeof l == "string" && l.toLowerCase() === "any" ? null : l;
    return y(e, G(a), c, u, !0);
  }
  applyInlineEventEffects(e, r, t) {
    const s = t.match(/DM\+(\d+) to (?:any one |your next )Benefit/i);
    s && (e.dm_next_benefit += Number(s[1]));
    const i = t.match(/DM\+(\d+) to your next Advancement/i);
    if (i && (e.dm_next_advancement += Number(i[1])), /automatically promoted/i.test(t)) {
      const a = this.rules.career(r.career_id);
      r.rank = Math.min(6, r.rank + 1), r.advanced = !0, r.rank_title = this.rankTitle(a, r.commissioned, r.rank), this.applyRankBonus(e, a, r);
    }
    const n = [...t.matchAll(/\b([A-Z][A-Za-z-]+(?:\s+[A-Z][A-Za-z-]+)?(?:\s+\([^)]+\))?)\s+(\d)\b/g)];
    for (const a of n.slice(0, 2)) {
      const [l, c, u] = C(`${a[1]} ${a[2]}`);
      if (["Roll", "Gain", "Table", "DM"].includes(l)) continue;
      const d = y(e, l, u, c, !0);
      r.skills_gained.push(d);
    }
    /Gain (?:a|one) Contact/i.test(t) && e.associates.push({ kind: "contact", description: `Contact from ${r.career_id} event` }), /Gain (?:an|one) Ally/i.test(t) && e.associates.push({ kind: "ally", description: `Ally from ${r.career_id} event` }), /Gain (?:an|one) Enemy/i.test(t) && e.associates.push({ kind: "enemy", description: `Enemy from ${r.career_id} event` }), /Gain (?:a|one) Rival/i.test(t) && e.associates.push({ kind: "rival", description: `Rival from ${r.career_id} event` }), /transfer to (?:the )?Marines/i.test(t) && (e.pending_transfer_career_id = "marine"), /transfer to (?:the )?Army/i.test(t) && (e.pending_transfer_career_id = "army"), /transfer to (?:the )?Confederation Army/i.test(t) && (e.pending_transfer_career_id = "confederation_army"), /transfer to any other non-military career|transfer to any other career|transfer to any career/i.test(t) && (e.pending_transfer_career_id = "any"), /you are ejected from this career|losing your place|forced out of the career/i.test(t) && (e.ejected_by_event = !0), /lose (?:one|1) Benefit roll|Lose one benefit roll|Lose one Benefit roll/i.test(t) && (r.benefit_forfeited = !0);
  }
  applyCareerTextEffects(e, r, t, s) {
    if (/Frozen Watch|cold sleep|cryoberth/i.test(t) && (r.frozen_watch = !0, e.age = Math.max(0, e.age - 4), r.advanced = !1, r.skills_gained.push("Frozen Watch: no skill or advancement roll this term")), /Severely injured|seriously injured|Injured|suffer injuries|Injury Table|Injury table|injure you/i.test(t)) {
      const l = /result of 2|roll of 2/i.test(t) ? 2 : void 0, c = this.applyInjury(e, l);
      Object.assign(e, c.character);
    }
    const i = [...t.matchAll(/\b(STR|DEX|END|INT|EDU|SOC|PSI|CHA|TER|RES|REP)\s*(?:−|-)\s*(\d+)/gi)];
    for (const l of i) {
      const c = l[1].toUpperCase(), u = Number(l[2]);
      c === "REP" ? e.reputation = Math.max(0, e.reputation - u) : c === "RES" ? g(e, "SOC", m(e, "SOC") - u) : g(e, c, m(e, c) - u);
    }
    const n = t.match(/Reduce (?:your )?(STR|DEX|END|INT|EDU|SOC|PSI|CHA|TER|RES|REP)(?: or (STR|DEX|END|INT|EDU|SOC|PSI|CHA|TER|RES|REP))? by (\d+)/i);
    n && (e.pending_career_mishap_choice = {
      kind: "stat_choice",
      choices: [n[1], n[2]].filter(Boolean),
      amount: Number(n[3]),
      prompt: t
    });
    const a = t.match(/rank (?:is )?reduced by (?:−|-)(\d+)|lose one level of rank|demoted one Rank/i);
    if (a) {
      const l = a[1] ? Number(a[1]) : 1;
      r.rank = Math.max(0, r.rank - l);
      const c = this.rules.career(r.career_id);
      r.rank_title = this.rankTitle(c, r.commissioned, r.rank), r.rank === 0 && /below zero|takes it below zero/i.test(t) && (e.force_career_end = !0);
    }
    if (/lose (?:all|any) Benefit rolls|no Benefit rolls/i.test(t) && (r.benefit_forfeited = !0), /must take (?:the )?Prisoner/i.test(t) && (e.forced_next_career_id = "prisoner"), /may not re-enlist|may not re-enter/i.test(t) && e.banned_career_ids.push(r.career_id), s && /gain (?:D3|1D|D6) Contacts/i.test(t)) {
      const l = /D3/i.test(t) ? this.roller.d3() : this.roller.d6();
      for (let c = 0; c < l; c++) e.associates.push({ kind: "contact", description: `Contact from ${r.career_id} mishap` });
    }
  }
  applyLifeEventEffects(e, r, t, s) {
    if (/Sickness or Injury/i.test(r) || /Roll on the Injury/i.test(t)) {
      const i = this.applyInjury(e);
      Object.assign(e, i.character);
      return;
    }
    /Ending of Relationship/i.test(r) ? e.pending_life_event_choice = { kind: "relationship_end", options: ["rival", "enemy"], prompt: t } : /Improved Relationship|New Relationship/i.test(r) ? e.associates.push({ kind: "ally", description: "Ally from life event" }) : /New Contact/i.test(r) ? e.associates.push({ kind: "contact", description: "Contact from life event" }) : /Betrayal/i.test(r) ? e.pending_life_event_choice = { kind: "betrayal", options: ["rival", "enemy"], prompt: t } : /Travel/i.test(r) ? e.dm_next_qualification += 2 : /Good Fortune/i.test(r) ? (e.good_fortune_benefit_dm += 2, e.dm_next_benefit += 2) : /Crime|Dishonoured/i.test(r) ? e.pending_life_event_choice = { kind: "crime", options: ["lose_benefit", "prisoner"], prompt: t } : /Aliens/i.test(t) ? (y(e, s ? "Tolerance" : "Science", 1, null, !0), e.associates.push({ kind: "contact", description: "Alien contact from life event" })) : /Psionics|Psionic/i.test(t) ? (e.pending_life_event_choice = { kind: "psionic_institute", options: ["test_psi", "ignore"], prompt: t }, e.auto_qualify_career_ids.push("psion")) : /Alien Artefact|Ancient Technology/i.test(t) ? e.equipment.push({ name: /Ancient Technology/i.test(t) ? "Ancient Technology" : "Alien Artefact", quantity: 1, notes: "Life event" }) : /Contact with Government|Contact with Clan Leaders/i.test(t) ? e.associates.push({ kind: "contact", description: "High-level contact from life event" }) : s && /Territory Challenge/i.test(r) ? e.pending_life_event_choice = { kind: "aslan_territory_challenge", options: ["increase", "decrease"], prompt: t } : s && /Clan Event/i.test(r) ? this.applyAslanClanEvent(e) : s && /Duel/i.test(r) && (e.pending_life_event_choice = { kind: "aslan_duel", options: ["accept", "refuse"], prompt: t });
  }
  applyAslanClanEvent(e) {
    var i;
    const r = ((i = this.rules.table("aslan_life_events").clan_events) == null ? void 0 : i.results) ?? {}, t = this.roller.rollD(6), s = String(r[String(t.total)] ?? "");
    /extra Benefit roll/i.test(s) && (e.pending_benefit_rolls += 1), /DM\+2 to your next advancement/i.test(s) && (e.dm_next_advancement += 2), /SOC \+1/i.test(s) && g(e, "SOC", m(e, "SOC") + 1), /Ally/i.test(s) && e.associates.push({ kind: "ally", description: "Ally from clan event" }), /Enemy/i.test(s) && e.associates.push({ kind: "enemy", description: "Enemy family from clan event" }), /DM-2 to survival/i.test(s) && (e.dm_next_survival -= 2), /lose one Benefit roll|no Benefit rolls/i.test(s) && e.current_term && (e.current_term.benefit_forfeited = !0), /DM-4 to advancement/i.test(s) && (e.dm_next_advancement -= 4), e.notes.push(`Aslan clan event: ${s}`);
  }
  isAslanLifeEventCharacter(e) {
    var r;
    return e.species_id.includes("aslan") && ((r = e.current_term) == null ? void 0 : r.career_id) !== "aslan_outcast";
  }
  applyPreCareerEventEffects(e, r, t, s) {
    if (/Carouse 1/i.test(t) && y(e, "Carouse", 1, null, !0), /Increase your SOC by \+1/i.test(t) && g(e, "SOC", m(e, "SOC") + 1), /Gain D3 Allies/i.test(t)) {
      const i = this.roller.d3();
      for (let n = 0; n < i; n++) e.associates.push({ kind: "ally", description: "Ally from pre-career education" });
    }
    /Gain a Rival/i.test(t) && e.associates.push({ kind: "rival", description: "Rival from pre-career education" }), /Gain an Enemy/i.test(t) && e.associates.push({ kind: "enemy", description: "Enemy from pre-career education" }), /Gain one Ally/i.test(t) && e.associates.push({ kind: "ally", description: "Ally from pre-career education" }), /gain an Enemy in a rival clan/i.test(t) && e.associates.push({ kind: "enemy", description: "Enemy in a rival clan" }), (/any one skill at level 0/i.test(t) || /any skill of your choice/i.test(t)) && (e.pending_life_event_choice = { kind: "pre_career_any_skill", level: 0, excluded: ["Jack-of-All-Trades"], prompt: t }), /crash and fail to graduate|cannot redeem yourself in time to graduate/i.test(t) && (e.pre_career_status = { ...e.pre_career_status ?? {}, forced_graduation_failure: !0 }), /Prisoner career in your next term/i.test(t) && r === 4 && (e.forced_next_career_id = "prisoner"), /join the Drifter career next term/i.test(t) && (e.pending_life_event_choice = { kind: "pre_career_war_choice", options: ["drifter", "draft", "avoid"], prompt: t }), s && /become Outcast|must become Outcast/i.test(t) && (e.forced_next_career_id = "aslan_outcast"), s && /Outlaw or Wanderer career without a qualification roll/i.test(t) && e.auto_qualify_career_ids.push("aslan_outlaw", "aslan_wanderer");
  }
  benefitRollsEarned(e, r, t) {
    let s = Math.max(0, e);
    return r >= 1 && (s += 1), r >= 3 && (s += 1), r >= 5 && (s += 1), t && (s = Math.max(0, s - 1)), s;
  }
  applyMusterBenefit(e, r) {
    const t = Y(r);
    if (t.length) {
      e.pending_muster_benefit_choice = { options: t, raw: r };
      return;
    }
    for (const s of X(r)) this.applySingleMusterBenefit(e, s);
  }
  applySingleMusterBenefit(e, r) {
    var c;
    const t = r.trim(), s = t.match(/^(D3|D6)\s+(Contact|Ally|Rival|Enemy)s?$/i);
    if (s) {
      const u = s[1].toUpperCase() === "D3" ? this.roller.d3() : this.roller.d6();
      for (let d = 0; d < u; d++) e.associates.push({ kind: s[2].toLowerCase(), description: `${s[2]} from mustering-out benefit` });
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
      u === "REP" ? e.reputation += Number(l[2]) : u === "RES" ? g(e, "SOC", m(e, "SOC") + Number(l[2])) : g(e, u, m(e, u) + Number(l[2])), u === "PSI" && (e.psi = m(e, "PSI"));
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
      _ > 0 && u !== t ? y(e, u, _, d, !0) : e.equipment.push({ name: t, quantity: 1, notes: "Mustering-out benefit" });
    }
  }
  injuryPending(e, r) {
    const t = e.effects ?? [];
    if (!t.length) return null;
    const s = ["STR", "DEX", "END"], i = t.find((l) => l.type === "reduce_physical_random"), n = t.find((l) => l.type === "reduce_choice"), a = t.find((l) => l.type === "reduce_physical_other");
    return i ? {
      roll: r,
      title: e.title ?? "Injury",
      damage_to_chosen: i.amount === "1D" ? this.roller.d6() : Number(i.amount ?? 0),
      auto_reduce_others: Number((a == null ? void 0 : a.amount) ?? 0),
      choices: s,
      prompt: e.text ?? "Choose which physical characteristic takes the damage."
    } : n ? {
      roll: r,
      title: e.title ?? "Injury",
      damage_to_chosen: Number(n.amount ?? 0),
      auto_reduce_others: 0,
      choices: n.characteristics ?? s,
      prompt: e.text ?? "Choose which characteristic takes the damage."
    } : null;
  }
  applyAgingIfNeeded(e) {
    const r = this.rules.species(e.species_id) ?? {}, t = Number(r.aging_starts_term ?? this.rules.table("aging").triggers_at_term ?? 4);
    if (e.total_terms < t) return null;
    const s = this.roller.roll2D(-e.total_terms), i = this.rules.table("aging"), n = this.agingEntry(i, s.total), a = this.applyAgingEffects(e, n.effects ?? []), l = a.some((c) => m(e, c.stat) <= 0);
    if (l) {
      const c = this.roller.d6() * 1e4;
      e.pending_injury_treatment_choice = {
        kind: "aging_crisis",
        gross_debt: c,
        net_debt: c,
        title: "Aging crisis"
      }, e.notes.push("Aging crisis: medical care needed to keep reduced characteristics at 1.");
    }
    return e.notes.push(`Aging roll ${s.total}: ${n.title ?? "Aging"}.`), { roll: s, entry: n, reductions: a, crisis: l };
  }
  agingEntry(e, r) {
    var t, s, i;
    return r <= -6 ? ((t = e.entries) == null ? void 0 : t["-6_or_less"]) ?? {} : r >= 1 ? ((s = e.entries) == null ? void 0 : s["1_or_more"]) ?? {} : ((i = e.entries) == null ? void 0 : i[String(r)]) ?? {};
  }
  applyAgingEffects(e, r) {
    const t = [], s = ["STR", "DEX", "END"], i = ["INT", "EDU", "SOC"];
    for (const n of r) {
      const a = n.type === "reduce_mental" ? i : s, l = Math.min(Number(n.count ?? 1), a.length), c = Number(n.amount ?? 0);
      for (const u of a.slice(0, l))
        g(e, u, m(e, u) - c), t.push({ stat: u, amount: c });
    }
    return t;
  }
  finalizeRobot(e) {
    const r = T();
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
    let e = T();
    return e.name = "Generated Traveller", e = this.rollInitialCharacteristics(e).character, e = this.chooseSociety(e, "third_imperium").character, e = this.applySpecies(e, "imperial_human").character, e = this.applyBackgroundSkills(e, ["Admin", "Streetwise", "Vacc Suit"]).character, e = this.applyCareerPackage(e, "scout").character, e.phase = "done", { character: e };
  }
}
function j(o) {
  const e = o.match(/^(.+?)\s*\((.+)\)\s*$/);
  return e ? [e[1].trim(), e[2].trim()] : [o.trim(), null];
}
function C(o) {
  const e = o.trim(), r = e.match(/\s+(\d+)$/), t = r ? Number(r[1]) : 1, s = r ? e.slice(0, r.index).trim() : e, [i, n] = j(s);
  return [i, n, t];
}
function H(o) {
  return [...o.skill_list_male ?? [], ...o.skill_list_female ?? []].map(String);
}
function G(o) {
  return o === "Jack-of-all-Trades" || o === "Jack-of-all-trades" ? "Jack-of-All-Trades" : o.trim();
}
function X(o) {
  return /\s+and\s+/i.test(o) && !/\s+or\s+/i.test(o) ? o.split(/\s+and\s+/i).map((e) => e.trim()).filter(Boolean) : [o.trim()];
}
function Y(o) {
  if (!/\s+or\s+/i.test(o)) return [];
  if (/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+\d+\s+or\s+\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+\d+/i.test(o))
    return o.split(/\s+or\s+/i).map((r) => r.trim()).filter(Boolean);
  if (/Ship's Boat|Air\/Raft|Personal Vehicle|Weapon|Gun|Blade|Armou?r|Combat Implant|Scientific Equipment/i.test(o))
    return o.split(/\s+or\s+/i).map((r) => r.trim()).filter(Boolean);
  const e = o.split(/\s+or\s+/i).map((r) => r.trim()).filter(Boolean);
  return e.every((r) => /\d$/.test(r) || /^[A-Z][A-Za-z -]+(?:\s+\([^)]+\))?$/.test(r)) ? e : [];
}
const V = [
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
  const e = o.replace(/\/$/, ""), [r, t, s, i] = await Promise.all([
    I(`${e}/species/index.json`, `${e}/species`),
    I(`${e}/careers/index.json`, `${e}/careers`),
    K(e),
    A(`${e}/catalog.json`)
  ]);
  return new W({ species: r, careers: t, tables: s, catalog: i });
}
async function K(o) {
  const e = await Promise.all(V.map(async (r) => [r, await A(`${o}/tables/${r}.json`)]));
  return Object.fromEntries(e);
}
async function I(o, e) {
  const r = await A(o), t = [];
  for (const s of r) {
    const i = await A(`${e}/${s}`), n = Array.isArray(i) ? i : [i];
    for (const a of n)
      a != null && a.deprecated || a != null && a.id && t.push([a.id, a]);
  }
  return Object.fromEntries(t);
}
async function A(o) {
  const e = await fetch(o);
  if (!e.ok) throw new Error(`Failed to load ${o}: ${e.status} ${e.statusText}`);
  return e.json();
}
const Z = {
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
}, Q = {
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
function ee(o) {
  return Z[q(o)];
}
function te(o) {
  if (o)
    return Q[q(o)] ?? q(o).replace(/[^a-z0-9]/g, "");
}
function q(o) {
  return o.trim().toLowerCase();
}
function re(o, e = {}) {
  const r = e.entryYear ?? 1105, t = se(o), s = Object.fromEntries(U.map((l) => {
    const c = l === "PSI" && o.psi || m(o, l);
    return [l, { value: c, current: c, show: oe(l, c), default: !1 }];
  })), i = o.characteristics.STR + o.characteristics.DEX + o.characteristics.END, n = [
    ...ie(o),
    ...ne(o),
    ...ae(o)
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
      description: o.capsule_description ? ce(o.capsule_description) : "",
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
        profession: le(o),
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
function se(o) {
  const e = {};
  for (const r of o.skills) {
    const t = ee(r.name);
    if (t)
      if (e[t] ?? (e[t] = { base: -1, specs: {} }), !r.speciality || r.speciality.toLowerCase() === "any")
        e[t].base = Math.max(e[t].base, r.level);
      else {
        const s = te(r.speciality);
        s && (e[t].specs[s] = Math.max(e[t].specs[s] ?? -1, r.level));
      }
  }
  return Object.fromEntries(Object.entries(e).map(([r, t]) => {
    const s = { id: r, value: t.base > 0 ? String(t.base) : Math.max(t.base, 0), trained: !0 };
    return Object.keys(t.specs).length && (s.specialities = Object.fromEntries(Object.entries(t.specs).map(([i, n]) => [i, { id: i, value: String(n) }]))), [r, s];
  }));
}
function ie(o) {
  const e = {
    ally: { affinity: 3, enmity: 0, power: 2, influence: 2 },
    contact: { affinity: 3, enmity: 0, power: 0, influence: 4 },
    rival: { affinity: 1, enmity: 0, power: 2, influence: 1 },
    enemy: { affinity: 0, enmity: -3, power: 3, influence: 1 }
  };
  return o.associates.map((r) => {
    const t = String(r.kind || "contact").toLowerCase(), s = e[t] ?? e.contact;
    return M(r.description || `Unnamed ${D(t)}`, "associate", {
      associate: { relationship: t, ...s },
      relation: t,
      description: r.description
    });
  });
}
function ne(o) {
  return o.term_history.map((e, r) => {
    const t = D(e.career_id.replaceAll("_", " ")), s = D(e.assignment_id.replaceAll("_", " ")), i = `${t}${s ? `: ${s}` : ""}${e.rank_title ? ` (${e.rank_title})` : ""}`, n = [i, ...e.events.map((a) => `* ${a}`)].join(`
`);
    return M(`Term ${r + 1}: ${i}`, "term", {
      term: { number: r + 1, termLength: 4, assignment: i, randomTerm: !1, randomLength: "" },
      name: "Term",
      description: n
    }, "systems/mgt2e/icons/misc/career.svg");
  });
}
function ae(o) {
  return o.equipment.map((e) => M(e.name, "item", {
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
function M(o, e, r, t = "systems/mgt2e/icons/items/item.svg") {
  const s = Date.now();
  return {
    name: o,
    type: e,
    system: r,
    _id: de(),
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
function oe(o, e) {
  return ["STR", "DEX", "END", "INT", "EDU", "SOC"].includes(o) || o === "PSI" && e > 0;
}
function le(o) {
  const e = o.completed_careers.at(-1);
  if (!e) return "";
  const r = D(e.career_id.replaceAll("_", " ")), t = e.assignment_id && e.assignment_id !== "career_package" ? D(e.assignment_id.replaceAll("_", " ")) : "";
  return t ? `${r}: ${t}` : r;
}
function ce(o) {
  return `<p>${ue(o).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`;
}
function ue(o) {
  return o.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function D(o) {
  return o.replace(/\w\S*/g, (e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase());
}
function de() {
  return crypto.getRandomValues(new Uint32Array(2)).reduce((o, e) => o + e.toString(16).padStart(8, "0"), "").slice(0, 16);
}
class _e {
  constructor() {
    this.sourceVersion = "unknown";
  }
  async initialize(e) {
    this.appClass = e;
    const r = "modules/traveller-character-creator/data";
    this.rules = await J(r), this.engine = new z(this.rules);
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
    return T();
  }
  exportActorData(e, r = {}) {
    const t = Number(r.entryYear ?? game.settings.get("traveller-character-creator", "defaultEntryYear"));
    return re(e, { sourceVersion: this.sourceVersion, entryYear: t });
  }
  async createActor(e, r = {}) {
    var i, n;
    const t = this.exportActorData(e, r), s = await Actor.implementation.create(t);
    return game.settings.get("traveller-character-creator", "autoOpenCreatedActor") && ((i = s.sheet) == null || i.render(!0)), (n = ui.notifications) == null || n.info(`Created Traveller actor: ${s.name}`), s;
  }
}
function pe() {
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
const { ApplicationV2: me, HandlebarsApplicationMixin: fe } = foundry.applications.api, b = class b extends fe(me) {
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
    game.settings.get("traveller-character-creator", "persistDrafts") && localStorage.setItem(N(), JSON.stringify(this.character));
  }
  loadDraft() {
    var r;
    if (!game.settings.get("traveller-character-creator", "persistDrafts")) return null;
    const e = localStorage.getItem(N());
    if (!e) return null;
    try {
      return JSON.parse(e);
    } catch {
      return (r = ui.notifications) == null || r.warn("Traveller Creator draft was unreadable and has been reset."), localStorage.removeItem(N()), null;
    }
  }
  clearDraft() {
    localStorage.removeItem(N());
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
let L = b;
function N() {
  var o, e;
  return `traveller-character-creator.${((o = game.world) == null ? void 0 : o.id) ?? "world"}.${((e = game.user) == null ? void 0 : e.id) ?? "user"}.draft`;
}
Hooks.once("init", () => {
  pe(), Handlebars.registerHelper("eq", (o, e) => o === e);
});
Hooks.once("ready", async () => {
  const o = new _e();
  await o.initialize(L), game.travellerCreator = o;
});
Hooks.on("renderActorDirectory", (o, e) => {
  var s;
  const r = e instanceof HTMLElement ? e : e[0];
  if (!r || r.querySelector("[data-traveller-creator-open]")) return;
  const t = document.createElement("button");
  t.type = "button", t.dataset.travellerCreatorOpen = "true", t.classList.add("traveller-creator-open"), t.innerHTML = '<i class="fa-solid fa-user-astronaut"></i> Create Traveller', t.addEventListener("click", () => {
    var i;
    return (i = game.travellerCreator) == null ? void 0 : i.open();
  }), (s = r.querySelector(".directory-header")) == null || s.append(t);
});
//# sourceMappingURL=traveller-character-creator.js.map
