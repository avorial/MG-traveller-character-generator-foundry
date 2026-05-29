const N = ["STR", "DEX", "END", "INT", "EDU", "SOC"], L = [
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
function D() {
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
function _(o) {
  return structuredClone(o);
}
function f(o, e) {
  return e in o.characteristics ? Number(o.characteristics[e] ?? 0) : Number(o.extra_characteristics[e] ?? 0);
}
function g(o, e, r) {
  const t = Math.max(0, Math.trunc(r));
  e in o.characteristics ? o.characteristics[e] = t : o.extra_characteristics[e] = t;
}
function k(o, e, r = 0, t = null, s = !1) {
  if (o.forbidden_skills.includes(e) || t && o.forbidden_skills.includes(`${e} (${t})`))
    return `Skipped ${S(e, t)} (forbidden by species)`;
  const i = o.skills.find((a) => a.name === e && (a.speciality ?? null) === t);
  if (i)
    return r === 0 ? `Already has ${S(e, t)} ${i.level}` : s ? r > i.level ? (i.level = Math.min(r, 4), x(o.skills), `Increased ${S(e, t)} to ${i.level}`) : `${S(e, t)} unchanged (already ${i.level})` : (i.level = Math.min(i.level + r, 4), x(o.skills), `Increased ${S(e, t)} to ${i.level}`);
  const n = Math.max(0, r);
  return o.skills.push({ name: e, level: n, speciality: t }), t && n >= 1 && !o.skills.some((a) => a.name === e && !a.speciality) && o.skills.push({ name: e, level: 0, speciality: null }), x(o.skills), `Gained ${S(e, t)} ${n}`;
}
function S(o, e) {
  return `${o}${e ? ` (${e})` : ""}`;
}
function x(o) {
  o.sort((e, r) => `${e.name.toLowerCase()}\0${e.speciality ?? ""}`.localeCompare(`${r.name.toLowerCase()}\0${r.speciality ?? ""}`));
}
class B {
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
function M(o) {
  return o <= 0 ? -3 : o <= 2 ? -2 : Math.floor(o / 3) - 2;
}
class U {
  constructor(e, r = new B()) {
    this.rules = e, this.roller = r;
  }
  freshCharacter() {
    return D();
  }
  rollInitialCharacteristics(e, r = !1) {
    const t = _(e), s = {}, i = /* @__PURE__ */ new Set();
    if (r) {
      const n = N.map((a) => ({ stat: a, roll: this.roller.roll2D() }));
      n.sort((a, l) => l.roll.total - a.roll.total), i.add(n[0].stat), i.add(n[1].stat);
    }
    for (const n of N) {
      const a = this.roller.rollCharacteristic(r && i.has(n));
      t.characteristics[n] = a.total, s[n] = a;
    }
    return t.phase = "society", t.notes.push("Rolled initial characteristics."), { rolls: s, character: t };
  }
  rollExtraCharacteristics(e, r, t = !1) {
    const s = _(e), i = {};
    for (const n of r) {
      const a = this.roller.rollCharacteristic(t);
      g(s, n, a.total), n === "PSI" && (s.psi = a.total), i[n] = a;
    }
    return s.notes.push(`Rolled extra characteristics: ${r.join(", ")}.`), { rolls: i, character: s };
  }
  chooseSociety(e, r) {
    const t = _(e);
    return t.society_id = r, t.phase = "species", t.notes.push(`Society of origin: ${r}.`), { character: t };
  }
  applySpecies(e, r) {
    const t = this.rules.species(r);
    if (!t) throw new Error(`Unknown species: ${r}`);
    const s = _(e);
    s.species_id = r;
    for (const [i, n] of Object.entries(t.characteristic_modifiers ?? {}))
      g(s, i, f(s, i) + Number(n));
    if (t.starting_age && (s.age = Number(t.starting_age)), t.uses_cha) {
      const i = this.roller.d6() + 2;
      g(s, "CHA", i), s.characteristics.SOC = 0;
    }
    if (t.extra_characteristics_required)
      for (const i of t.extra_characteristics_required)
        f(s, i) || g(s, i, this.roller.roll2D().total);
    return s.forbidden_skills = [...t.forbidden_skills ?? []], s.traits = [...t.traits ?? []], r.includes("aslan") ? (s.phase = "aslan_setup", s.aslan_setup_status = { phase: "gender" }) : t.psionic_training_at_start || r.includes("zhodani") && s.characteristics.SOC >= 10 ? s.phase = "zhodani_training" : s.phase = "background", s.notes.push(`Applied species: ${t.name ?? r}.`), { species: t, character: s };
  }
  applyBackgroundSkills(e, r) {
    const t = _(e), s = Math.max(0, 3 + M(t.characteristics.EDU));
    for (const i of r.slice(0, s)) {
      const [n, a] = T(i);
      k(t, n, 0, a);
    }
    return t.phase = "pre_career", t.notes.push(`Chose ${Math.min(r.length, s)} background skills.`), { allowed: s, chosen: r.slice(0, s), character: t };
  }
  applyBackgroundPackage(e, r, t = {}) {
    const i = (this.rules.table("background_packages").packages ?? this.rules.table("background_packages"))[r];
    if (!i) throw new Error(`Unknown background package: ${r}`);
    const n = _(e);
    for (const [a, l] of Object.entries(i.characteristic_modifiers ?? i.stat_mods ?? {}))
      g(n, a, f(n, a) + Number(l));
    for (const a of i.skills ?? []) {
      const l = typeof a == "string" ? a : `${a.name}${a.speciality ? ` (${a.speciality})` : ""}`, c = t[l] ?? a;
      if (typeof c == "string") {
        const [u, d, m] = $(c);
        k(n, u, m === 1 && !/\d+$/.test(c.trim()) ? 0 : m, d);
      } else
        k(n, c.name, Number(c.level ?? 0), c.speciality ?? null);
    }
    n.credits += Number(i.credits ?? 0);
    for (const a of i.equipment ?? []) n.equipment.push({ name: String(a), quantity: 1, notes: null });
    return n.age = Math.max(n.age, 22), n.phase = "career", n.notes.push(`Applied background package: ${i.name ?? r}.`), { package: i, character: n };
  }
  applyCareerPackage(e, r) {
    const t = this.rules.table("career_packages"), i = (Array.isArray(t == null ? void 0 : t.packages) ? t.packages : Array.isArray(t) ? t : Object.values(t.packages ?? t)).find((a) => a.id === r);
    if (!i) throw new Error(`Unknown career package: ${r}`);
    const n = _(e);
    for (const [a, l] of Object.entries(i.characteristic_modifiers ?? i.characteristics ?? i.stat_mods ?? {}))
      g(n, a, f(n, a) + Number(l));
    for (const a of i.skills ?? [])
      if (typeof a == "string") {
        const [l, c, u] = $(a);
        k(n, l, u, c);
      } else
        k(n, a.name, Number(a.level ?? 0), a.speciality ?? null, !0);
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
    const i = _(e);
    for (const n of s.skills ?? []) {
      const [a, l] = T(n);
      k(i, a, 1, l);
    }
    return i.phase = "done", i.notes.push(`Applied skill package: ${s.name ?? r}.`), { package: s, character: i };
  }
  skipPreCareer(e) {
    const r = _(e);
    return r.phase = "career", r.notes.push("Skipped pre-career education."), { character: r };
  }
  qualifyForPreCareer(e, r, t = {}) {
    var h, v, j;
    const s = (h = this.rules.table("education").tracks) == null ? void 0 : h[r];
    if (!s) throw new Error(`Unknown pre-career track: ${r}`);
    const i = _(e), n = t.service ? (v = s.services) == null ? void 0 : v[t.service] : null, a = t.curriculum ? (j = s.curricula) == null ? void 0 : j[t.curriculum] : null, l = (n == null ? void 0 : n.qualification) ?? s.qualification ?? {}, c = this.checkDm(i, l), u = l.automatic ? null : this.roller.roll2D(c), d = l.automatic || !!(u && u.total >= Number(l.target ?? 0));
    if (!d)
      return i.phase = "career", i.notes.push(`Failed ${s.name ?? r} qualification${u ? ` (${u.total})` : ""}.`), { track: s, roll: u, qualified: d, character: i };
    this.applyStatBlock(i, s.enrollment_bonus ?? {}), this.applySkillResults(i, s.enrollment_auto_skills ?? [], 0);
    const m = this.preCareerSkillPool(s, n, a), p = this.applyChosenSkills(i, t.skills, m, Number(s.enrollment_skill_picks ?? 0), Number(s.enrollment_pick_level ?? 0));
    if (a != null && a.enrollment_skill_table) {
      const b = this.rollOnExternalSkillTable(i, a.enrollment_skill_table.career, a.enrollment_skill_table.table);
      b && p.push(b);
    }
    for (let b = 0; b < Number(s.enrollment_service_skill_random ?? 0); b++) {
      const R = this.rollOnExternalSkillTable(i, (n == null ? void 0 : n.career_id) ?? "merchant", "service_skills");
      R && p.push(R);
    }
    if (l.requires_psi_test && !i.psi_tested) {
      const b = this.roller.roll2D();
      i.psi = b.total, g(i, "PSI", b.total), i.psi_tested = !0;
    }
    return i.pre_career_status = {
      track_id: r,
      service_id: (n == null ? void 0 : n.id) ?? t.service ?? null,
      career_id: (n == null ? void 0 : n.career_id) ?? null,
      curriculum_id: (a == null ? void 0 : a.id) ?? t.curriculum ?? null,
      enrolled: !0,
      skill_pool: m,
      enrollment_skills: p
    }, i.phase = "pre_career", i.notes.push(`Qualified for ${s.name ?? r}.`), { track: s, roll: u, qualified: d, character: i };
  }
  graduatePreCareer(e, r = []) {
    var p;
    const t = e.pre_career_status ?? {}, s = String(t.track_id ?? ""), i = (p = this.rules.table("education").tracks) == null ? void 0 : p[s];
    if (!i) throw new Error("No active pre-career track to graduate.");
    const n = _(e), a = i.graduation ?? {}, l = this.checkDm(n, a), c = this.roller.roll2D(l), u = c.total >= Number(a.honours_target ?? 1 / 0), d = u || c.total >= Number(a.target ?? 0), m = d ? (u ? a.on_honours : a.on_graduation) ?? {} : a.on_failure ?? {};
    return d && this.applyPreCareerOutcome(n, i, m, r), n.age = Math.max(n.age + Number(i.age_cost ?? 0), this.rollAgeOverride(m.age_override) ?? 0), n.pre_career_terms += Number(i.age_cost ?? 0) > 0 ? 1 : 0, n.pre_career_status = { ...t, graduated: d, honours: u, graduation_roll: c.total, outcome_note: m.note ?? null }, n.phase = "career", n.notes.push(`${d ? u ? "Graduated with honours from" : "Graduated from" : "Failed to graduate from"} ${i.name ?? s}.`), { track: i, roll: c, graduated: d, honours: u, character: n };
  }
  qualifyForCareer(e, r) {
    var u, d, m;
    const t = this.rules.career(r);
    if (!t) throw new Error(`Unknown career: ${r}`);
    const s = _(e), i = this.careerBlocked(s, t);
    if (i)
      return s.notes.push(`Cannot qualify for ${t.name ?? r}: ${i}.`), { career: t, qualified: !1, blockedReason: i, character: s };
    const n = s.auto_entry_career_id === r || s.auto_qualify_career_ids.includes(r), a = this.checkDm(s, t.qualification ?? {}) + s.dm_next_qualification + Number(s.permanent_qualification_dm_by_career[r] ?? 0) - s.failed_qualifications_this_term, l = n || (u = t.qualification) != null && u.automatic ? null : this.roller.roll2D(a), c = n || ((d = t.qualification) == null ? void 0 : d.automatic) || !!(l && l.total >= Number(((m = t.qualification) == null ? void 0 : m.target) ?? 0));
    return s.dm_next_qualification = 0, c ? (s.failed_qualifications_this_term = 0, s.notes.push(`Qualified for ${t.name ?? r}.`)) : (s.failed_qualifications_this_term += 1, s.notes.push(`Failed qualification for ${t.name ?? r}${l ? ` (${l.total})` : ""}.`)), { career: t, roll: l, qualified: c, character: s };
  }
  startTerm(e, r, t) {
    var m, p;
    const s = this.rules.career(r);
    if (!s) throw new Error(`Unknown career: ${r}`);
    const i = Object.keys(s.assignments ?? {}), n = t ?? i[0];
    if (!((m = s.assignments) != null && m[n])) throw new Error(`Unknown assignment ${n} for ${r}`);
    const a = _(e), l = a.term_history.filter((h) => h.career_id === r).length, c = a.starts_commissioned_career_id === r || !!a.completed_careers.find((h) => h.career_id === r && h.commissioned), u = c ? Number(a.starts_commissioned_rank ?? 1) : 0, d = {
      career_id: r,
      assignment_id: n,
      term_number: l + 1,
      overall_term_number: a.total_terms + a.pre_career_terms + 1,
      rank: u,
      rank_title: this.rankTitle(s, c, u),
      commissioned: c,
      events: [],
      skills_gained: [],
      survived: null,
      advanced: null,
      mishap: null,
      basic_training: l === 0,
      benefit_forfeited: !1,
      survival_roll_total: null,
      advancement_roll_total: null,
      cover_career_id: null,
      frozen_watch: !1
    };
    if (a.current_term = d, d.basic_training) {
      for (const h of Object.values(((p = s.skill_tables) == null ? void 0 : p.service_skills) ?? {}).filter((v) => typeof v == "string")) {
        const v = this.applySkillOrStat(a, h, 0);
        v && d.skills_gained.push(v);
      }
      this.applyRankBonus(a, s, d);
    }
    return a.phase = "career", a.notes.push(`Started ${s.name ?? r} term ${d.term_number}.`), { career: s, term: d, character: a };
  }
  rollOnSkillTable(e, r) {
    const t = _(e), s = this.requireCurrentTerm(t), i = this.rules.career(s.career_id), n = this.rollOnCareerSkillTable(t, i, r);
    return n.note && s.skills_gained.push(n.note), { career: i, tableId: r, roll: n.roll, result: n.entry, character: t };
  }
  survivalRoll(e) {
    const r = _(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), n = s.assignments[t.assignment_id].survival ?? {}, a = this.checkDm(r, n) + r.dm_next_survival, l = this.roller.roll2D(a), c = l.natural !== 2 && l.total >= Number(n.target ?? 0);
    return t.survived = c, t.survival_roll_total = l.total, r.dm_next_survival = 0, c || t.events.push("Failed survival roll; roll on the Mishap table."), r.notes.push(`${c ? "Passed" : "Failed"} survival in ${s.name ?? t.career_id}.`), { career: s, roll: l, survived: c, character: r };
  }
  eventRoll(e) {
    var a;
    const r = _(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), i = this.roller.roll2D(r.dm_next_events), n = String(((a = s.events) == null ? void 0 : a[String(Math.max(2, Math.min(12, i.total)))]) ?? "No event.");
    return t.events.push(n), this.applyInlineEventEffects(r, t, n), r.dm_next_events = 0, r.notes.push(`Career event: ${n}`), { career: s, roll: i, event: n, character: r };
  }
  mishapRoll(e) {
    var a;
    const r = _(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), i = this.roller.rollD(6), n = String(((a = s.mishaps) == null ? void 0 : a[String(Math.max(1, Math.min(6, i.total)))]) ?? "Mishap.");
    return t.mishap = n, t.survived = !1, t.events.push(n), this.applyInlineEventEffects(r, t, n), r.force_career_end = !0, r.notes.push(`Career mishap: ${n}`), { career: s, roll: i, mishap: n, character: r };
  }
  advancementRoll(e) {
    const r = _(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), n = s.assignments[t.assignment_id].advancement ?? {}, a = this.checkDm(r, n) + r.dm_next_advancement + r.dm_permanent_advancement + Number(r.permanent_advancement_dm_by_career[t.career_id] ?? 0), l = this.roller.roll2D(a), c = l.total >= Number(n.target ?? 0);
    return t.advanced = c, t.advancement_roll_total = l.total, r.dm_next_advancement = 0, c && (t.rank = Math.min(6, t.rank + 1), t.rank_title = this.rankTitle(s, t.commissioned, t.rank), this.applyRankBonus(r, s, t)), r.notes.push(`${c ? "Advanced" : "Did not advance"} in ${s.name ?? t.career_id}.`), { career: s, roll: l, advanced: c, character: r };
  }
  commissionRoll(e) {
    const r = _(e), t = this.requireCurrentTerm(r), s = this.rules.career(t.career_id), i = s.commission;
    if (!i) throw new Error(`${s.name ?? t.career_id} does not have commission rolls.`);
    if (t.commissioned || r.term_history.some((m) => m.career_id === t.career_id && m.commissioned))
      throw new Error("Already commissioned in this career.");
    if (t.term_number > 1 && f(r, "SOC") < 9) throw new Error("Commission after the first term requires SOC 9+.");
    const n = -(t.term_number - 1), a = r.academy_commission_career_id === t.career_id ? r.academy_commission_dm : 0, l = r.completed_careers.length === 0 ? Number(r.pre_career_permanent_dms.first_career_commission_dm ?? 0) : 0, c = this.checkDm(r, i) + n + a + l + r.dm_next_advancement + r.dm_permanent_advancement, u = this.roller.roll2D(c), d = u.total >= Number(i.target ?? 8);
    return d && (t.commissioned = !0, t.rank = 1, t.rank_title = this.rankTitle(s, !0, 1), this.applyRankBonus(r, s, t), t.advanced = !1), r.dm_next_advancement = 0, r.academy_commission_career_id = null, r.academy_commission_dm = 0, r.notes.push(`${d ? "Commissioned" : "Failed commission"} in ${s.name ?? t.career_id}.`), { career: s, roll: u, commissioned: d, character: r };
  }
  endTerm(e, r = !1, t = "voluntary") {
    const s = _(e), i = this.requireCurrentTerm(s), n = this.rules.career(i.career_id);
    s.term_history.push(i), s.total_terms += 1, s.age += 4;
    const a = this.applyAgingIfNeeded(s);
    if (s.current_term = null, s.failed_qualifications_this_term = 0, r || s.force_career_end || i.survived === !1) {
      const c = s.term_history.filter((d) => d.career_id === i.career_id).length, u = this.benefitRollsEarned(c, i.rank, i.benefit_forfeited);
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
    var m;
    const s = _(e), i = r ? [...s.completed_careers].reverse().find((p) => p.career_id === r) : s.completed_careers[s.completed_careers.length - 1];
    if (!i) throw new Error("No completed career to muster out from.");
    if (s.pending_benefit_rolls <= 0) throw new Error("No pending benefit rolls.");
    const n = this.rules.career(i.career_id), a = this.roller.rollD(6), l = Math.max(1, Math.min(7, a.total + s.dm_next_benefit)), c = ((m = n.mustering_out) == null ? void 0 : m[String(l)]) ?? {}, u = t === "cash" && s.cash_rolls_used < 3 && c.cash != null ? "cash" : "benefit", d = c[u];
    return u === "cash" ? (s.credits += Number(d ?? 0), s.cash_rolls_used += 1) : this.applyMusterBenefit(s, String(d ?? "Benefit")), s.pending_benefit_rolls -= 1, i.benefit_rolls_used += 1, s.dm_next_benefit = 0, s.pending_benefit_rolls <= 0 && (s.phase = "skill_package"), s.notes.push(`Mustering out ${u}: ${d}.`), { career: n, roll: a, tableRoll: l, column: u, result: d, character: s };
  }
  applyInjury(e, r) {
    var l;
    const t = _(e), s = r ? { dice: [], natural: r, total: r, dm: 0 } : this.roller.rollD(6), n = ((l = this.rules.table("injury").entries) == null ? void 0 : l[String(Math.max(1, Math.min(6, s.total)))]) ?? {}, a = this.injuryPending(n, s.total);
    return a ? (t.pending_injury_choice = a, t.notes.push(`Injury: ${n.title ?? "Injury"}; characteristic choice pending.`)) : t.notes.push(`Injury: ${n.title ?? "Lightly Injured"}; no permanent effect.`), { roll: s, entry: n, pendingChoice: a, character: t };
  }
  resolveInjuryChoice(e, r) {
    const t = _(e), s = t.pending_injury_choice;
    if (!s) throw new Error("No pending injury choice.");
    const i = s.choices;
    if (i != null && i.length && !i.includes(r)) throw new Error(`${r} is not a valid injury choice.`);
    const n = Number(s.damage_to_chosen ?? 0), a = Number(s.auto_reduce_others ?? 0), l = ["STR", "DEX", "END"].filter((p) => p !== r), c = Math.min(f(t, r), n), u = l.map((p) => ({ stat: p, loss: Math.min(f(t, p), a) })).filter((p) => p.loss > 0), d = c + u.reduce((p, h) => p + h.loss, 0), m = d * 5e3;
    return t.pending_injury_treatment_choice = {
      chosen_stat: r,
      damage_to_chosen: n,
      auto_reduce_others: a,
      secondary_losses: u,
      total_loss: d,
      gross_debt: m,
      net_debt: m,
      title: s.title ?? "Injury"
    }, t.pending_injury_choice = null, { chosenStat: r, totalLoss: d, grossDebt: m, character: t };
  }
  resolveInjuryPayment(e, r) {
    const t = _(e), s = t.pending_injury_treatment_choice;
    if (!s) throw new Error("No pending injury treatment choice.");
    if (r)
      t.medical_debt += Number(s.net_debt ?? s.gross_debt ?? 0);
    else {
      const i = String(s.chosen_stat);
      g(t, i, f(t, i) - Number(s.damage_to_chosen ?? 0));
      for (const n of s.secondary_losses ?? [])
        g(t, n.stat, f(t, n.stat) - n.loss);
    }
    return t.pending_injury_treatment_choice = null, t.notes.push(r ? "Paid for injury treatment." : "Accepted injury characteristic loss."), { paid: r, character: t };
  }
  checkDm(e, r) {
    let t = M(f(e, r == null ? void 0 : r.characteristic));
    for (const s of (r == null ? void 0 : r.modifiers) ?? [])
      s.type === "per_previous_term" && (t += Number(s.dm ?? 0) * e.total_terms), s.type === "per_previous_career" && (t += Number(s.dm ?? 0) * e.completed_careers.length), s.type === "characteristic_threshold" && f(e, s.characteristic) >= Number(s.threshold ?? 0) && (t += Number(s.dm ?? 0));
    return t;
  }
  applyStatBlock(e, r) {
    for (const [t, s] of Object.entries(r))
      (N.includes(t) || t === "PSI" || t === "CHA") && (g(e, t, f(e, t) + Number(s)), t === "PSI" && (e.psi = f(e, "PSI")));
  }
  applyPreCareerOutcome(e, r, t, s) {
    var l, c, u, d, m, p;
    this.applyStatBlock(e, t), t.EDU_penalty_dice === "D3" && g(e, "EDU", f(e, "EDU") - this.roller.d3()), t.jack_of_all_trades && k(e, "Jack-of-All-Trades", Number(t.jack_of_all_trades), null, !0), this.applySkillResults(e, t.fixed_skills ?? [], 1);
    const i = ((l = e.pre_career_status) == null ? void 0 : l.skill_pool) ?? this.preCareerSkillPool(r, null, null), n = Number(t.skills_at_level_1 ?? 0) + Number(t.skills_upgrade_from_enrollment ?? 0) + Number(t.skills_from_enrollment_1 ?? 0);
    this.applyChosenSkills(e, s, i, n, 1), this.applyChosenSkills(e, s.slice(n), i, Number(t.additional_skills_from_enrollment_0 ?? 0), 0);
    for (const h of t.associates ?? [])
      e.associates.push({ kind: h.kind ?? "contact", description: h.description ?? `${r.name} associate` });
    const a = t.permanent ?? {};
    for (const h of a.advancement_dm_careers ?? [])
      e.permanent_advancement_dm_by_career[h] = Number(a.advancement_dm ?? 0);
    if (a.qualification_dm) {
      for (const h of this.rules.careerList()) e.permanent_qualification_dm_by_career[h.id] = Number(a.qualification_dm);
      for (const h of a.bonus_qualify_careers ?? []) e.permanent_qualification_dm_by_career[h] = Number(a.bonus_qualify_dm ?? 0);
    }
    a.psion_career_auto_entry && e.auto_qualify_career_ids.push("psion"), t.auto_entry && ((c = e.pre_career_status) != null && c.career_id) && (e.auto_entry_career_id = String(e.pre_career_status.career_id)), t.commission_dm && ((u = e.pre_career_status) != null && u.career_id) && (e.academy_commission_career_id = String(e.pre_career_status.career_id), e.academy_commission_dm = Number(t.commission_dm)), t.starts_commissioned_rank && ((d = e.pre_career_status) != null && d.career_id) && (e.starts_commissioned_career_id = String(e.pre_career_status.career_id), e.starts_commissioned_rank = Number(t.starts_commissioned_rank)), (m = t.permanent) != null && m.auto_rank && ((p = e.pre_career_status) != null && p.career_id) && (e.starts_commissioned_career_id = String(e.pre_career_status.career_id), e.starts_commissioned_rank = Number(t.permanent.auto_rank), e.auto_entry_career_id = String(e.pre_career_status.career_id));
  }
  preCareerSkillPool(e, r, t) {
    const s = I(e);
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
      const u = t.find((h) => h.toLowerCase() === c.toLowerCase()) ?? c, [d, m, p] = $(/\d+$/.test(u.trim()) ? u : `${u} ${i}`);
      l.push(k(e, d, p, m, !0));
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
  rankTrack(e, r) {
    var t, s, i, n, a;
    return r && ((t = e.ranks) != null && t.officer) ? e.ranks.officer : !r && ((s = e.ranks) != null && s.enlisted) ? e.ranks.enlisted : ((i = e.ranks) == null ? void 0 : i.default) ?? ((n = e.ranks) == null ? void 0 : n.enlisted) ?? ((a = e.ranks) == null ? void 0 : a.officer) ?? {};
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
    if (s.requires_edu && f(e, "EDU") < Number(s.requires_edu)) throw new Error(`${s.name ?? t} requires EDU ${s.requires_edu}+.`);
    const i = this.roller.rollD(6), n = String(s[String(Math.max(1, Math.min(6, i.total)))] ?? ""), a = this.applySkillOrStat(e, n, 1);
    return { roll: i, entry: n, note: a };
  }
  applySkillOrStat(e, r, t) {
    const s = r.split(/\s+or\s+/i)[0].replace(/\b(any|one of)\b/gi, "").trim(), i = s.match(/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+(\d+)/);
    if (i) {
      const d = i[1];
      return g(e, d, f(e, d) + Number(i[2])), d === "PSI" && (e.psi = f(e, "PSI")), `${d} +${i[2]}`;
    }
    const n = s.replace(/\s*\((?:any|Small Craft or Spacecraft|riding or Training)\)\s*/i, "").trim();
    if (!n) return null;
    const [a, l, c] = $(/\d+$/.test(n) ? n : `${n} ${t}`), u = typeof l == "string" && l.toLowerCase() === "any" ? null : l;
    return k(e, z(a), c, u, !0);
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
      const [l, c, u] = $(`${a[1]} ${a[2]}`);
      if (["Roll", "Gain", "Table", "DM"].includes(l)) continue;
      const d = k(e, l, u, c, !0);
      r.skills_gained.push(d);
    }
    /Gain (?:a|one) Contact/i.test(t) && e.associates.push({ kind: "contact", description: `Contact from ${r.career_id} event` }), /Gain (?:an|one) Ally/i.test(t) && e.associates.push({ kind: "ally", description: `Ally from ${r.career_id} event` }), /Gain (?:an|one) Enemy/i.test(t) && e.associates.push({ kind: "enemy", description: `Enemy from ${r.career_id} event` }), /Gain (?:a|one) Rival/i.test(t) && e.associates.push({ kind: "rival", description: `Rival from ${r.career_id} event` });
  }
  benefitRollsEarned(e, r, t) {
    let s = Math.max(0, e);
    return r >= 1 && (s += 1), r >= 3 && (s += 1), r >= 5 && (s += 1), t && (s = Math.max(0, s - 1)), s;
  }
  applyMusterBenefit(e, r) {
    if (/TAS Membership/i.test(r)) e.tas_member = !0;
    else if (/Ship Share/i.test(r)) e.ship_shares += 1;
    else if (/Scout Ship/i.test(r)) e.equipment.push({ name: "Scout Ship", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Weapon/i.test(r)) e.equipment.push({ name: "Weapon", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Armou?r/i.test(r)) e.equipment.push({ name: "Armour", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Blade/i.test(r)) e.equipment.push({ name: "Blade", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Gun/i.test(r)) e.equipment.push({ name: "Gun", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Ship's Boat/i.test(r)) e.equipment.push({ name: "Ship's Boat", quantity: 1, notes: "Mustering-out benefit" });
    else {
      const t = r.match(/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+(\d+)/);
      t ? g(e, t[1], f(e, t[1]) + Number(t[2])) : e.equipment.push({ name: r, quantity: 1, notes: "Mustering-out benefit" });
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
    const s = this.roller.roll2D(-e.total_terms), i = this.rules.table("aging"), n = this.agingEntry(i, s.total), a = this.applyAgingEffects(e, n.effects ?? []), l = a.some((c) => f(e, c.stat) <= 0);
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
        g(e, u, f(e, u) - c), t.push({ stat: u, amount: c });
    }
    return t;
  }
  finalizeRobot(e) {
    const r = D();
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
    let e = D();
    return e.name = "Generated Traveller", e = this.rollInitialCharacteristics(e).character, e = this.chooseSociety(e, "third_imperium").character, e = this.applySpecies(e, "imperial_human").character, e = this.applyBackgroundSkills(e, ["Admin", "Streetwise", "Vacc Suit"]).character, e = this.applyCareerPackage(e, "scout").character, e.phase = "done", { character: e };
  }
}
function T(o) {
  const e = o.match(/^(.+?)\s*\((.+)\)\s*$/);
  return e ? [e[1].trim(), e[2].trim()] : [o.trim(), null];
}
function $(o) {
  const e = o.trim(), r = e.match(/\s+(\d+)$/), t = r ? Number(r[1]) : 1, s = r ? e.slice(0, r.index).trim() : e, [i, n] = T(s);
  return [i, n, t];
}
function I(o) {
  return [...o.skill_list_male ?? [], ...o.skill_list_female ?? []].map(String);
}
function z(o) {
  return o === "Jack-of-all-Trades" || o === "Jack-of-all-trades" ? "Jack-of-All-Trades" : o.trim();
}
const F = [
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
class H {
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
async function G(o) {
  const e = o.replace(/\/$/, ""), [r, t, s, i] = await Promise.all([
    P(`${e}/species/index.json`, `${e}/species`),
    P(`${e}/careers/index.json`, `${e}/careers`),
    V(e),
    E(`${e}/catalog.json`)
  ]);
  return new H({ species: r, careers: t, tables: s, catalog: i });
}
async function V(o) {
  const e = await Promise.all(F.map(async (r) => [r, await E(`${o}/tables/${r}.json`)]));
  return Object.fromEntries(e);
}
async function P(o, e) {
  const r = await E(o), t = [];
  for (const s of r) {
    const i = await E(`${e}/${s}`), n = Array.isArray(i) ? i : [i];
    for (const a of n)
      a != null && a.deprecated || a != null && a.id && t.push([a.id, a]);
  }
  return Object.fromEntries(t);
}
async function E(o) {
  const e = await fetch(o);
  if (!e.ok) throw new Error(`Failed to load ${o}: ${e.status} ${e.statusText}`);
  return e.json();
}
const X = {
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
}, Y = {
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
function J(o) {
  return X[A(o)];
}
function K(o) {
  if (o)
    return Y[A(o)] ?? A(o).replace(/[^a-z0-9]/g, "");
}
function A(o) {
  return o.trim().toLowerCase();
}
function W(o, e = {}) {
  const r = e.entryYear ?? 1105, t = Z(o), s = Object.fromEntries(L.map((l) => {
    const c = l === "PSI" && o.psi || f(o, l);
    return [l, { value: c, current: c, show: re(l, c), default: !1 }];
  })), i = o.characteristics.STR + o.characteristics.DEX + o.characteristics.END, n = [
    ...Q(o),
    ...ee(o),
    ...te(o)
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
      description: o.capsule_description ? ie(o.capsule_description) : "",
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
        species: w(o.species_id.replaceAll("_", " ")),
        speciesTraits: o.traits.map((l) => l.name ?? l.id ?? "").filter(Boolean).join(", "),
        gender: o.gender || "Unknown",
        weight: 0,
        height: 0,
        profession: se(o),
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
function Z(o) {
  const e = {};
  for (const r of o.skills) {
    const t = J(r.name);
    if (t)
      if (e[t] ?? (e[t] = { base: -1, specs: {} }), !r.speciality || r.speciality.toLowerCase() === "any")
        e[t].base = Math.max(e[t].base, r.level);
      else {
        const s = K(r.speciality);
        s && (e[t].specs[s] = Math.max(e[t].specs[s] ?? -1, r.level));
      }
  }
  return Object.fromEntries(Object.entries(e).map(([r, t]) => {
    const s = { id: r, value: t.base > 0 ? String(t.base) : Math.max(t.base, 0), trained: !0 };
    return Object.keys(t.specs).length && (s.specialities = Object.fromEntries(Object.entries(t.specs).map(([i, n]) => [i, { id: i, value: String(n) }]))), [r, s];
  }));
}
function Q(o) {
  const e = {
    ally: { affinity: 3, enmity: 0, power: 2, influence: 2 },
    contact: { affinity: 3, enmity: 0, power: 0, influence: 4 },
    rival: { affinity: 1, enmity: 0, power: 2, influence: 1 },
    enemy: { affinity: 0, enmity: -3, power: 3, influence: 1 }
  };
  return o.associates.map((r) => {
    const t = String(r.kind || "contact").toLowerCase(), s = e[t] ?? e.contact;
    return O(r.description || `Unnamed ${w(t)}`, "associate", {
      associate: { relationship: t, ...s },
      relation: t,
      description: r.description
    });
  });
}
function ee(o) {
  return o.term_history.map((e, r) => {
    const t = w(e.career_id.replaceAll("_", " ")), s = w(e.assignment_id.replaceAll("_", " ")), i = `${t}${s ? `: ${s}` : ""}${e.rank_title ? ` (${e.rank_title})` : ""}`, n = [i, ...e.events.map((a) => `* ${a}`)].join(`
`);
    return O(`Term ${r + 1}: ${i}`, "term", {
      term: { number: r + 1, termLength: 4, assignment: i, randomTerm: !1, randomLength: "" },
      name: "Term",
      description: n
    }, "systems/mgt2e/icons/misc/career.svg");
  });
}
function te(o) {
  return o.equipment.map((e) => O(e.name, "item", {
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
function O(o, e, r, t = "systems/mgt2e/icons/items/item.svg") {
  const s = Date.now();
  return {
    name: o,
    type: e,
    system: r,
    _id: ae(),
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
function re(o, e) {
  return ["STR", "DEX", "END", "INT", "EDU", "SOC"].includes(o) || o === "PSI" && e > 0;
}
function se(o) {
  const e = o.completed_careers.at(-1);
  if (!e) return "";
  const r = w(e.career_id.replaceAll("_", " ")), t = e.assignment_id && e.assignment_id !== "career_package" ? w(e.assignment_id.replaceAll("_", " ")) : "";
  return t ? `${r}: ${t}` : r;
}
function ie(o) {
  return `<p>${ne(o).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`;
}
function ne(o) {
  return o.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function w(o) {
  return o.replace(/\w\S*/g, (e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase());
}
function ae() {
  return crypto.getRandomValues(new Uint32Array(2)).reduce((o, e) => o + e.toString(16).padStart(8, "0"), "").slice(0, 16);
}
class oe {
  constructor() {
    this.sourceVersion = "unknown";
  }
  async initialize(e) {
    this.appClass = e;
    const r = "modules/traveller-character-creator/data";
    this.rules = await G(r), this.engine = new U(this.rules);
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
    return D();
  }
  exportActorData(e, r = {}) {
    const t = Number(r.entryYear ?? game.settings.get("traveller-character-creator", "defaultEntryYear"));
    return W(e, { sourceVersion: this.sourceVersion, entryYear: t });
  }
  async createActor(e, r = {}) {
    var i, n;
    const t = this.exportActorData(e, r), s = await Actor.implementation.create(t);
    return game.settings.get("traveller-character-creator", "autoOpenCreatedActor") && ((i = s.sheet) == null || i.render(!0)), (n = ui.notifications) == null || n.info(`Created Traveller actor: ${s.name}`), s;
  }
}
function le() {
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
const { ApplicationV2: ce, HandlebarsApplicationMixin: ue } = foundry.applications.api, y = class y extends ue(ce) {
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
    game.settings.get("traveller-character-creator", "persistDrafts") && localStorage.setItem(C(), JSON.stringify(this.character));
  }
  loadDraft() {
    var r;
    if (!game.settings.get("traveller-character-creator", "persistDrafts")) return null;
    const e = localStorage.getItem(C());
    if (!e) return null;
    try {
      return JSON.parse(e);
    } catch {
      return (r = ui.notifications) == null || r.warn("Traveller Creator draft was unreadable and has been reset."), localStorage.removeItem(C()), null;
    }
  }
  clearDraft() {
    localStorage.removeItem(C());
  }
};
y.DEFAULT_OPTIONS = {
  id: "traveller-character-creator",
  tag: "form",
  window: {
    title: "Traveller Character Creator",
    icon: "fa-solid fa-user-astronaut",
    resizable: !0
  },
  position: { width: 760, height: 720 },
  form: { handler: y.onSubmit, submitOnChange: !1, closeOnSubmit: !1 },
  actions: {
    roll: y.roll,
    chooseSociety: y.chooseSociety,
    applySpecies: y.applySpecies,
    applyBackgroundPackage: y.applyBackgroundPackage,
    applyCareerPackage: y.applyCareerPackage,
    applySkillPackage: y.applySkillPackage,
    createActor: y.createActor,
    reset: y.reset
  }
}, y.PARTS = {
  body: { template: "modules/traveller-character-creator/templates/creator.hbs" }
};
let q = y;
function C() {
  var o, e;
  return `traveller-character-creator.${((o = game.world) == null ? void 0 : o.id) ?? "world"}.${((e = game.user) == null ? void 0 : e.id) ?? "user"}.draft`;
}
Hooks.once("init", () => {
  le(), Handlebars.registerHelper("eq", (o, e) => o === e);
});
Hooks.once("ready", async () => {
  const o = new oe();
  await o.initialize(q), game.travellerCreator = o;
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
