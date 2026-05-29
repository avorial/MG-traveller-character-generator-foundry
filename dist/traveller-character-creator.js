const x = ["STR", "DEX", "END", "INT", "EDU", "SOC"], j = [
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
function m(l) {
  return structuredClone(l);
}
function f(l, e) {
  return e in l.characteristics ? Number(l.characteristics[e] ?? 0) : Number(l.extra_characteristics[e] ?? 0);
}
function y(l, e, t) {
  const r = Math.max(0, Math.trunc(t));
  e in l.characteristics ? l.characteristics[e] = r : l.extra_characteristics[e] = r;
}
function k(l, e, t = 0, r = null, s = !1) {
  if (l.forbidden_skills.includes(e) || r && l.forbidden_skills.includes(`${e} (${r})`))
    return `Skipped ${S(e, r)} (forbidden by species)`;
  const i = l.skills.find((n) => n.name === e && (n.speciality ?? null) === r);
  if (i)
    return t === 0 ? `Already has ${S(e, r)} ${i.level}` : s ? t > i.level ? (i.level = Math.min(t, 4), T(l.skills), `Increased ${S(e, r)} to ${i.level}`) : `${S(e, r)} unchanged (already ${i.level})` : (i.level = Math.min(i.level + t, 4), T(l.skills), `Increased ${S(e, r)} to ${i.level}`);
  const a = Math.max(0, t);
  return l.skills.push({ name: e, level: a, speciality: r }), r && a >= 1 && !l.skills.some((n) => n.name === e && !n.speciality) && l.skills.push({ name: e, level: 0, speciality: null }), T(l.skills), `Gained ${S(e, r)} ${a}`;
}
function S(l, e) {
  return `${l}${e ? ` (${e})` : ""}`;
}
function T(l) {
  l.sort((e, t) => `${e.name.toLowerCase()}\0${e.speciality ?? ""}`.localeCompare(`${t.name.toLowerCase()}\0${t.speciality ?? ""}`));
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
    const t = this.forced.length ? this.forced.shift() ?? 1 : this.rollDie(e);
    return { dice: [], natural: t, total: t, dm: 0 };
  }
  d3() {
    return Math.ceil(this.d6() / 2);
  }
  roll2D(e = 0) {
    if (this.forced.length) {
      const s = this.forced.shift() ?? 0;
      return { dice: [], natural: s, total: s + e, dm: e };
    }
    const t = [this.d6(), this.d6()], r = t[0] + t[1];
    return { dice: t, natural: r, total: r + e, dm: e };
  }
  rollCharacteristic(e = !1) {
    if (!e) return this.roll2D();
    if (this.forced.length) return this.roll2D();
    const t = [this.d6(), this.d6(), this.d6()].sort((s, i) => i - s), r = t.slice(0, 2);
    return { dice: t, natural: r[0] + r[1], total: r[0] + r[1], dm: 0 };
  }
  rollDie(e) {
    return Math.floor(Math.random() * e) + 1;
  }
}
function P(l) {
  return l <= 0 ? -3 : l <= 2 ? -2 : Math.floor(l / 3) - 2;
}
class U {
  constructor(e, t = new B()) {
    this.rules = e, this.roller = t;
  }
  freshCharacter() {
    return D();
  }
  rollInitialCharacteristics(e, t = !1) {
    const r = m(e), s = {}, i = /* @__PURE__ */ new Set();
    if (t) {
      const a = x.map((n) => ({ stat: n, roll: this.roller.roll2D() }));
      a.sort((n, o) => o.roll.total - n.roll.total), i.add(a[0].stat), i.add(a[1].stat);
    }
    for (const a of x) {
      const n = this.roller.rollCharacteristic(t && i.has(a));
      r.characteristics[a] = n.total, s[a] = n;
    }
    return r.phase = "society", r.notes.push("Rolled initial characteristics."), { rolls: s, character: r };
  }
  rollExtraCharacteristics(e, t, r = !1) {
    const s = m(e), i = {};
    for (const a of t) {
      const n = this.roller.rollCharacteristic(r);
      y(s, a, n.total), a === "PSI" && (s.psi = n.total), i[a] = n;
    }
    return s.notes.push(`Rolled extra characteristics: ${t.join(", ")}.`), { rolls: i, character: s };
  }
  chooseSociety(e, t) {
    const r = m(e);
    return r.society_id = t, r.phase = "species", r.notes.push(`Society of origin: ${t}.`), { character: r };
  }
  applySpecies(e, t) {
    const r = this.rules.species(t);
    if (!r) throw new Error(`Unknown species: ${t}`);
    const s = m(e);
    s.species_id = t;
    for (const [i, a] of Object.entries(r.characteristic_modifiers ?? {}))
      y(s, i, f(s, i) + Number(a));
    if (r.starting_age && (s.age = Number(r.starting_age)), r.uses_cha) {
      const i = this.roller.d6() + 2;
      y(s, "CHA", i), s.characteristics.SOC = 0;
    }
    if (r.extra_characteristics_required)
      for (const i of r.extra_characteristics_required)
        f(s, i) || y(s, i, this.roller.roll2D().total);
    return s.forbidden_skills = [...r.forbidden_skills ?? []], s.traits = [...r.traits ?? []], t.includes("aslan") ? (s.phase = "aslan_setup", s.aslan_setup_status = { phase: "gender" }) : r.psionic_training_at_start || t.includes("zhodani") && s.characteristics.SOC >= 10 ? s.phase = "zhodani_training" : s.phase = "background", s.notes.push(`Applied species: ${r.name ?? t}.`), { species: r, character: s };
  }
  applyBackgroundSkills(e, t) {
    const r = m(e), s = Math.max(0, 3 + P(r.characteristics.EDU));
    for (const i of t.slice(0, s)) {
      const [a, n] = N(i);
      k(r, a, 0, n);
    }
    return r.phase = "pre_career", r.notes.push(`Chose ${Math.min(t.length, s)} background skills.`), { allowed: s, chosen: t.slice(0, s), character: r };
  }
  applyBackgroundPackage(e, t, r = {}) {
    const i = (this.rules.table("background_packages").packages ?? this.rules.table("background_packages"))[t];
    if (!i) throw new Error(`Unknown background package: ${t}`);
    const a = m(e);
    for (const [n, o] of Object.entries(i.characteristic_modifiers ?? i.stat_mods ?? {}))
      y(a, n, f(a, n) + Number(o));
    for (const n of i.skills ?? []) {
      const o = typeof n == "string" ? n : `${n.name}${n.speciality ? ` (${n.speciality})` : ""}`, c = r[o] ?? n;
      if (typeof c == "string") {
        const [u, d, p] = $(c);
        k(a, u, p === 1 && !/\d+$/.test(c.trim()) ? 0 : p, d);
      } else
        k(a, c.name, Number(c.level ?? 0), c.speciality ?? null);
    }
    a.credits += Number(i.credits ?? 0);
    for (const n of i.equipment ?? []) a.equipment.push({ name: String(n), quantity: 1, notes: null });
    return a.age = Math.max(a.age, 22), a.phase = "career", a.notes.push(`Applied background package: ${i.name ?? t}.`), { package: i, character: a };
  }
  applyCareerPackage(e, t) {
    const r = this.rules.table("career_packages"), i = (Array.isArray(r == null ? void 0 : r.packages) ? r.packages : Array.isArray(r) ? r : Object.values(r.packages ?? r)).find((n) => n.id === t);
    if (!i) throw new Error(`Unknown career package: ${t}`);
    const a = m(e);
    for (const [n, o] of Object.entries(i.characteristic_modifiers ?? i.characteristics ?? i.stat_mods ?? {}))
      y(a, n, f(a, n) + Number(o));
    for (const n of i.skills ?? [])
      if (typeof n == "string") {
        const [o, c, u] = $(n);
        k(a, o, u, c);
      } else
        k(a, n.name, Number(n.level ?? 0), n.speciality ?? null, !0);
    a.credits += Number(i.credits ?? 0);
    for (const n of i.equipment ?? []) a.equipment.push({ name: String(n), quantity: 1, notes: null });
    for (let n = 0; n < Number(i.contacts ?? 0); n++) a.associates.push({ kind: "contact", description: i.contact_description ?? "career package contact" });
    for (let n = 0; n < Number(i.allies ?? 0); n++) a.associates.push({ kind: "ally", description: i.ally_description ?? "career package ally" });
    return a.age += this.roller.d3(), a.career_package_id = t, a.career_package_taken = !0, a.completed_careers.push({
      career_id: t,
      assignment_id: "career_package",
      terms_served: 1,
      final_rank: Number(i.rank ?? 0),
      final_rank_title: i.rank_title ?? null,
      commissioned: !1,
      left_due_to: "career_package",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 0
    }), a.phase = "skill_package", a.notes.push(`Applied career package: ${i.name ?? t}.`), { package: i, character: a };
  }
  applySkillPackage(e, t) {
    const s = (this.rules.table("skill_packages").packages ?? this.rules.table("skill_packages"))[t];
    if (!s) throw new Error(`Unknown skill package: ${t}`);
    const i = m(e);
    for (const a of s.skills ?? []) {
      const [n, o] = N(a);
      k(i, n, 1, o);
    }
    return i.phase = "done", i.notes.push(`Applied skill package: ${s.name ?? t}.`), { package: s, character: i };
  }
  skipPreCareer(e) {
    const t = m(e);
    return t.phase = "career", t.notes.push("Skipped pre-career education."), { character: t };
  }
  qualifyForPreCareer(e, t, r = {}) {
    var _, v, R;
    const s = (_ = this.rules.table("education").tracks) == null ? void 0 : _[t];
    if (!s) throw new Error(`Unknown pre-career track: ${t}`);
    const i = m(e), a = r.service ? (v = s.services) == null ? void 0 : v[r.service] : null, n = r.curriculum ? (R = s.curricula) == null ? void 0 : R[r.curriculum] : null, o = (a == null ? void 0 : a.qualification) ?? s.qualification ?? {}, c = this.checkDm(i, o), u = o.automatic ? null : this.roller.roll2D(c), d = o.automatic || !!(u && u.total >= Number(o.target ?? 0));
    if (!d)
      return i.phase = "career", i.notes.push(`Failed ${s.name ?? t} qualification${u ? ` (${u.total})` : ""}.`), { track: s, roll: u, qualified: d, character: i };
    this.applyStatBlock(i, s.enrollment_bonus ?? {}), this.applySkillResults(i, s.enrollment_auto_skills ?? [], 0);
    const p = this.preCareerSkillPool(s, a, n), h = this.applyChosenSkills(i, r.skills, p, Number(s.enrollment_skill_picks ?? 0), Number(s.enrollment_pick_level ?? 0));
    if (n != null && n.enrollment_skill_table) {
      const b = this.rollOnExternalSkillTable(i, n.enrollment_skill_table.career, n.enrollment_skill_table.table);
      b && h.push(b);
    }
    for (let b = 0; b < Number(s.enrollment_service_skill_random ?? 0); b++) {
      const M = this.rollOnExternalSkillTable(i, (a == null ? void 0 : a.career_id) ?? "merchant", "service_skills");
      M && h.push(M);
    }
    if (o.requires_psi_test && !i.psi_tested) {
      const b = this.roller.roll2D();
      i.psi = b.total, y(i, "PSI", b.total), i.psi_tested = !0;
    }
    return i.pre_career_status = {
      track_id: t,
      service_id: (a == null ? void 0 : a.id) ?? r.service ?? null,
      career_id: (a == null ? void 0 : a.career_id) ?? null,
      curriculum_id: (n == null ? void 0 : n.id) ?? r.curriculum ?? null,
      enrolled: !0,
      skill_pool: p,
      enrollment_skills: h
    }, i.phase = "pre_career", i.notes.push(`Qualified for ${s.name ?? t}.`), { track: s, roll: u, qualified: d, character: i };
  }
  graduatePreCareer(e, t = []) {
    var h;
    const r = e.pre_career_status ?? {}, s = String(r.track_id ?? ""), i = (h = this.rules.table("education").tracks) == null ? void 0 : h[s];
    if (!i) throw new Error("No active pre-career track to graduate.");
    const a = m(e), n = i.graduation ?? {}, o = this.checkDm(a, n), c = this.roller.roll2D(o), u = c.total >= Number(n.honours_target ?? 1 / 0), d = u || c.total >= Number(n.target ?? 0), p = d ? (u ? n.on_honours : n.on_graduation) ?? {} : n.on_failure ?? {};
    return d && this.applyPreCareerOutcome(a, i, p, t), a.age = Math.max(a.age + Number(i.age_cost ?? 0), this.rollAgeOverride(p.age_override) ?? 0), a.pre_career_terms += Number(i.age_cost ?? 0) > 0 ? 1 : 0, a.pre_career_status = { ...r, graduated: d, honours: u, graduation_roll: c.total, outcome_note: p.note ?? null }, a.phase = "career", a.notes.push(`${d ? u ? "Graduated with honours from" : "Graduated from" : "Failed to graduate from"} ${i.name ?? s}.`), { track: i, roll: c, graduated: d, honours: u, character: a };
  }
  qualifyForCareer(e, t) {
    var u, d, p;
    const r = this.rules.career(t);
    if (!r) throw new Error(`Unknown career: ${t}`);
    const s = m(e), i = this.careerBlocked(s, r);
    if (i)
      return s.notes.push(`Cannot qualify for ${r.name ?? t}: ${i}.`), { career: r, qualified: !1, blockedReason: i, character: s };
    const a = s.auto_entry_career_id === t || s.auto_qualify_career_ids.includes(t), n = this.checkDm(s, r.qualification ?? {}) + s.dm_next_qualification + Number(s.permanent_qualification_dm_by_career[t] ?? 0) - s.failed_qualifications_this_term, o = a || (u = r.qualification) != null && u.automatic ? null : this.roller.roll2D(n), c = a || ((d = r.qualification) == null ? void 0 : d.automatic) || !!(o && o.total >= Number(((p = r.qualification) == null ? void 0 : p.target) ?? 0));
    return s.dm_next_qualification = 0, c ? (s.failed_qualifications_this_term = 0, s.notes.push(`Qualified for ${r.name ?? t}.`)) : (s.failed_qualifications_this_term += 1, s.notes.push(`Failed qualification for ${r.name ?? t}${o ? ` (${o.total})` : ""}.`)), { career: r, roll: o, qualified: c, character: s };
  }
  startTerm(e, t, r) {
    var p, h;
    const s = this.rules.career(t);
    if (!s) throw new Error(`Unknown career: ${t}`);
    const i = Object.keys(s.assignments ?? {}), a = r ?? i[0];
    if (!((p = s.assignments) != null && p[a])) throw new Error(`Unknown assignment ${a} for ${t}`);
    const n = m(e), o = n.term_history.filter((_) => _.career_id === t).length, c = n.starts_commissioned_career_id === t || !!n.completed_careers.find((_) => _.career_id === t && _.commissioned), u = c ? Number(n.starts_commissioned_rank ?? 1) : 0, d = {
      career_id: t,
      assignment_id: a,
      term_number: o + 1,
      overall_term_number: n.total_terms + n.pre_career_terms + 1,
      rank: u,
      rank_title: this.rankTitle(s, c, u),
      commissioned: c,
      events: [],
      skills_gained: [],
      survived: null,
      advanced: null,
      mishap: null,
      basic_training: o === 0,
      benefit_forfeited: !1,
      survival_roll_total: null,
      advancement_roll_total: null,
      cover_career_id: null,
      frozen_watch: !1
    };
    if (n.current_term = d, d.basic_training) {
      for (const _ of Object.values(((h = s.skill_tables) == null ? void 0 : h.service_skills) ?? {}).filter((v) => typeof v == "string")) {
        const v = this.applySkillOrStat(n, _, 0);
        v && d.skills_gained.push(v);
      }
      this.applyRankBonus(n, s, d);
    }
    return n.phase = "career", n.notes.push(`Started ${s.name ?? t} term ${d.term_number}.`), { career: s, term: d, character: n };
  }
  rollOnSkillTable(e, t) {
    const r = m(e), s = this.requireCurrentTerm(r), i = this.rules.career(s.career_id), a = this.rollOnCareerSkillTable(r, i, t);
    return a.note && s.skills_gained.push(a.note), { career: i, tableId: t, roll: a.roll, result: a.entry, character: r };
  }
  survivalRoll(e) {
    const t = m(e), r = this.requireCurrentTerm(t), s = this.rules.career(r.career_id), a = s.assignments[r.assignment_id].survival ?? {}, n = this.checkDm(t, a) + t.dm_next_survival, o = this.roller.roll2D(n), c = o.natural !== 2 && o.total >= Number(a.target ?? 0);
    return r.survived = c, r.survival_roll_total = o.total, t.dm_next_survival = 0, c || r.events.push("Failed survival roll; roll on the Mishap table."), t.notes.push(`${c ? "Passed" : "Failed"} survival in ${s.name ?? r.career_id}.`), { career: s, roll: o, survived: c, character: t };
  }
  eventRoll(e) {
    var n;
    const t = m(e), r = this.requireCurrentTerm(t), s = this.rules.career(r.career_id), i = this.roller.roll2D(t.dm_next_events), a = String(((n = s.events) == null ? void 0 : n[String(Math.max(2, Math.min(12, i.total)))]) ?? "No event.");
    return r.events.push(a), this.applyInlineEventEffects(t, r, a), t.dm_next_events = 0, t.notes.push(`Career event: ${a}`), { career: s, roll: i, event: a, character: t };
  }
  mishapRoll(e) {
    var n;
    const t = m(e), r = this.requireCurrentTerm(t), s = this.rules.career(r.career_id), i = this.roller.rollD(6), a = String(((n = s.mishaps) == null ? void 0 : n[String(Math.max(1, Math.min(6, i.total)))]) ?? "Mishap.");
    return r.mishap = a, r.survived = !1, r.events.push(a), this.applyInlineEventEffects(t, r, a), t.force_career_end = !0, t.notes.push(`Career mishap: ${a}`), { career: s, roll: i, mishap: a, character: t };
  }
  advancementRoll(e) {
    const t = m(e), r = this.requireCurrentTerm(t), s = this.rules.career(r.career_id), a = s.assignments[r.assignment_id].advancement ?? {}, n = this.checkDm(t, a) + t.dm_next_advancement + t.dm_permanent_advancement + Number(t.permanent_advancement_dm_by_career[r.career_id] ?? 0), o = this.roller.roll2D(n), c = o.total >= Number(a.target ?? 0);
    return r.advanced = c, r.advancement_roll_total = o.total, t.dm_next_advancement = 0, c && (r.rank = Math.min(6, r.rank + 1), r.rank_title = this.rankTitle(s, r.commissioned, r.rank), this.applyRankBonus(t, s, r)), t.notes.push(`${c ? "Advanced" : "Did not advance"} in ${s.name ?? r.career_id}.`), { career: s, roll: o, advanced: c, character: t };
  }
  endTerm(e, t = !1, r = "voluntary") {
    const s = m(e), i = this.requireCurrentTerm(s), a = this.rules.career(i.career_id);
    if (s.term_history.push(i), s.total_terms += 1, s.age += 4, s.current_term = null, s.failed_qualifications_this_term = 0, t || s.force_career_end || i.survived === !1) {
      const o = s.term_history.filter((u) => u.career_id === i.career_id).length, c = this.benefitRollsEarned(o, i.rank, i.benefit_forfeited);
      s.pending_benefit_rolls += c, s.completed_careers.push({
        career_id: i.career_id,
        assignment_id: i.assignment_id,
        terms_served: o,
        final_rank: i.rank,
        final_rank_title: i.rank_title ?? null,
        commissioned: i.commissioned,
        left_due_to: r,
        benefit_rolls_used: 0,
        benefit_rolls_earned: c
      }), s.force_career_end = !1, s.phase = s.pending_benefit_rolls > 0 ? "mustering" : "career";
    }
    return s.notes.push(`Ended ${a.name ?? i.career_id} term ${i.term_number}.`), { career: a, term: i, character: s };
  }
  musterOutRoll(e, t, r = "benefit") {
    var p;
    const s = m(e), i = t ? [...s.completed_careers].reverse().find((h) => h.career_id === t) : s.completed_careers[s.completed_careers.length - 1];
    if (!i) throw new Error("No completed career to muster out from.");
    if (s.pending_benefit_rolls <= 0) throw new Error("No pending benefit rolls.");
    const a = this.rules.career(i.career_id), n = this.roller.rollD(6), o = Math.max(1, Math.min(7, n.total + s.dm_next_benefit)), c = ((p = a.mustering_out) == null ? void 0 : p[String(o)]) ?? {}, u = r === "cash" && s.cash_rolls_used < 3 && c.cash != null ? "cash" : "benefit", d = c[u];
    return u === "cash" ? (s.credits += Number(d ?? 0), s.cash_rolls_used += 1) : this.applyMusterBenefit(s, String(d ?? "Benefit")), s.pending_benefit_rolls -= 1, i.benefit_rolls_used += 1, s.dm_next_benefit = 0, s.pending_benefit_rolls <= 0 && (s.phase = "skill_package"), s.notes.push(`Mustering out ${u}: ${d}.`), { career: a, roll: n, tableRoll: o, column: u, result: d, character: s };
  }
  checkDm(e, t) {
    let r = P(f(e, t == null ? void 0 : t.characteristic));
    for (const s of (t == null ? void 0 : t.modifiers) ?? [])
      s.type === "per_previous_term" && (r += Number(s.dm ?? 0) * e.total_terms), s.type === "per_previous_career" && (r += Number(s.dm ?? 0) * e.completed_careers.length), s.type === "characteristic_threshold" && f(e, s.characteristic) >= Number(s.threshold ?? 0) && (r += Number(s.dm ?? 0));
    return r;
  }
  applyStatBlock(e, t) {
    for (const [r, s] of Object.entries(t))
      (x.includes(r) || r === "PSI" || r === "CHA") && (y(e, r, f(e, r) + Number(s)), r === "PSI" && (e.psi = f(e, "PSI")));
  }
  applyPreCareerOutcome(e, t, r, s) {
    var o, c, u, d, p, h;
    this.applyStatBlock(e, r), r.EDU_penalty_dice === "D3" && y(e, "EDU", f(e, "EDU") - this.roller.d3()), r.jack_of_all_trades && k(e, "Jack-of-All-Trades", Number(r.jack_of_all_trades), null, !0), this.applySkillResults(e, r.fixed_skills ?? [], 1);
    const i = ((o = e.pre_career_status) == null ? void 0 : o.skill_pool) ?? this.preCareerSkillPool(t, null, null), a = Number(r.skills_at_level_1 ?? 0) + Number(r.skills_upgrade_from_enrollment ?? 0) + Number(r.skills_from_enrollment_1 ?? 0);
    this.applyChosenSkills(e, s, i, a, 1), this.applyChosenSkills(e, s.slice(a), i, Number(r.additional_skills_from_enrollment_0 ?? 0), 0);
    for (const _ of r.associates ?? [])
      e.associates.push({ kind: _.kind ?? "contact", description: _.description ?? `${t.name} associate` });
    const n = r.permanent ?? {};
    for (const _ of n.advancement_dm_careers ?? [])
      e.permanent_advancement_dm_by_career[_] = Number(n.advancement_dm ?? 0);
    if (n.qualification_dm) {
      for (const _ of this.rules.careerList()) e.permanent_qualification_dm_by_career[_.id] = Number(n.qualification_dm);
      for (const _ of n.bonus_qualify_careers ?? []) e.permanent_qualification_dm_by_career[_] = Number(n.bonus_qualify_dm ?? 0);
    }
    n.psion_career_auto_entry && e.auto_qualify_career_ids.push("psion"), r.auto_entry && ((c = e.pre_career_status) != null && c.career_id) && (e.auto_entry_career_id = String(e.pre_career_status.career_id)), r.commission_dm && ((u = e.pre_career_status) != null && u.career_id) && (e.academy_commission_career_id = String(e.pre_career_status.career_id), e.academy_commission_dm = Number(r.commission_dm)), r.starts_commissioned_rank && ((d = e.pre_career_status) != null && d.career_id) && (e.starts_commissioned_career_id = String(e.pre_career_status.career_id), e.starts_commissioned_rank = Number(r.starts_commissioned_rank)), (p = r.permanent) != null && p.auto_rank && ((h = e.pre_career_status) != null && h.career_id) && (e.starts_commissioned_career_id = String(e.pre_career_status.career_id), e.starts_commissioned_rank = Number(r.permanent.auto_rank), e.auto_entry_career_id = String(e.pre_career_status.career_id));
  }
  preCareerSkillPool(e, t, r) {
    const s = z(e);
    return [
      ...e.skill_list ?? [],
      ...s,
      ...e.enrollment_skill_pool ?? [],
      ...(t == null ? void 0 : t.skill_list) ?? [],
      ...(r == null ? void 0 : r.skill_list) ?? []
    ].map(String);
  }
  applyChosenSkills(e, t, r, s, i) {
    const a = Array.isArray(t) ? t.map(String) : typeof t == "string" ? t.split(",").map((c) => c.trim()).filter(Boolean) : [], n = a.length ? a : r, o = [];
    for (const c of n.slice(0, Math.max(0, s))) {
      const u = r.find((_) => _.toLowerCase() === c.toLowerCase()) ?? c, [d, p, h] = $(/\d+$/.test(u.trim()) ? u : `${u} ${i}`);
      o.push(k(e, d, h, p, !0));
    }
    return o;
  }
  applySkillResults(e, t, r) {
    return t.map((s) => this.applySkillOrStat(e, s, r)).filter(Boolean);
  }
  rollAgeOverride(e) {
    return e === "22+2D3" ? 22 + this.roller.d3() + this.roller.d3() : null;
  }
  careerBlocked(e, t) {
    var s, i, a, n, o, c;
    if (e.banned_career_ids.includes(t.id)) return "career is banned by a prior result";
    if (e.forced_next_career_id && e.forced_next_career_id !== t.id) return `must enter ${e.forced_next_career_id}`;
    if ((s = t.blocked_societies) != null && s.includes(e.society_id)) return `blocked for ${e.society_id}`;
    if ((i = t.allowed_societies) != null && i.length && !t.allowed_societies.includes(e.society_id)) return `not available for ${e.society_id}`;
    if ((a = t.blocked_species) != null && a.includes(e.species_id)) return `blocked for ${e.species_id}`;
    if ((n = t.allowed_species) != null && n.length && !t.allowed_species.includes(e.species_id)) return `not available for ${e.species_id}`;
    const r = this.rules.species(e.species_id);
    return (o = r == null ? void 0 : r.blocked_careers) != null && o.includes(t.id) ? `blocked for ${r.name ?? e.species_id}` : (c = r == null ? void 0 : r.allowed_species_careers) != null && c.length && !r.allowed_species_careers.includes(t.id) ? "not in species career list" : null;
  }
  requireCurrentTerm(e) {
    if (!e.current_term) throw new Error("No active career term.");
    return e.current_term;
  }
  rankTrack(e, t) {
    var r, s, i, a, n;
    return t && ((r = e.ranks) != null && r.officer) ? e.ranks.officer : !t && ((s = e.ranks) != null && s.enlisted) ? e.ranks.enlisted : ((i = e.ranks) == null ? void 0 : i.default) ?? ((a = e.ranks) == null ? void 0 : a.enlisted) ?? ((n = e.ranks) == null ? void 0 : n.officer) ?? {};
  }
  rankTitle(e, t, r) {
    var s, i;
    return ((i = (s = this.rankTrack(e, t)) == null ? void 0 : s[String(r)]) == null ? void 0 : i.title) ?? null;
  }
  applyRankBonus(e, t, r) {
    var a, n;
    const s = (n = (a = this.rankTrack(t, r.commissioned)) == null ? void 0 : a[String(r.rank)]) == null ? void 0 : n.bonus;
    if (!s) return;
    const i = this.applySkillOrStat(e, String(s), 1);
    i && r.skills_gained.push(i);
  }
  rollOnExternalSkillTable(e, t, r) {
    const s = this.rules.career(t);
    return s ? this.rollOnCareerSkillTable(e, s, r).note : null;
  }
  rollOnCareerSkillTable(e, t, r) {
    var o;
    const s = (o = t.skill_tables) == null ? void 0 : o[r];
    if (!s) throw new Error(`Unknown skill table ${r} for ${t.id}`);
    if (s.requires_edu && f(e, "EDU") < Number(s.requires_edu)) throw new Error(`${s.name ?? r} requires EDU ${s.requires_edu}+.`);
    const i = this.roller.rollD(6), a = String(s[String(Math.max(1, Math.min(6, i.total)))] ?? ""), n = this.applySkillOrStat(e, a, 1);
    return { roll: i, entry: a, note: n };
  }
  applySkillOrStat(e, t, r) {
    const s = t.split(/\s+or\s+/i)[0].replace(/\b(any|one of)\b/gi, "").trim(), i = s.match(/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+(\d+)/);
    if (i) {
      const d = i[1];
      return y(e, d, f(e, d) + Number(i[2])), d === "PSI" && (e.psi = f(e, "PSI")), `${d} +${i[2]}`;
    }
    const a = s.replace(/\s*\((?:any|Small Craft or Spacecraft|riding or Training)\)\s*/i, "").trim();
    if (!a) return null;
    const [n, o, c] = $(/\d+$/.test(a) ? a : `${a} ${r}`), u = typeof o == "string" && o.toLowerCase() === "any" ? null : o;
    return k(e, F(n), c, u, !0);
  }
  applyInlineEventEffects(e, t, r) {
    const s = r.match(/DM\+(\d+) to (?:any one |your next )Benefit/i);
    s && (e.dm_next_benefit += Number(s[1]));
    const i = r.match(/DM\+(\d+) to your next Advancement/i);
    if (i && (e.dm_next_advancement += Number(i[1])), /automatically promoted/i.test(r)) {
      const n = this.rules.career(t.career_id);
      t.rank = Math.min(6, t.rank + 1), t.advanced = !0, t.rank_title = this.rankTitle(n, t.commissioned, t.rank), this.applyRankBonus(e, n, t);
    }
    const a = [...r.matchAll(/\b([A-Z][A-Za-z-]+(?:\s+[A-Z][A-Za-z-]+)?(?:\s+\([^)]+\))?)\s+(\d)\b/g)];
    for (const n of a.slice(0, 2)) {
      const [o, c, u] = $(`${n[1]} ${n[2]}`);
      if (["Roll", "Gain", "Table", "DM"].includes(o)) continue;
      const d = k(e, o, u, c, !0);
      t.skills_gained.push(d);
    }
    /Gain (?:a|one) Contact/i.test(r) && e.associates.push({ kind: "contact", description: `Contact from ${t.career_id} event` }), /Gain (?:an|one) Ally/i.test(r) && e.associates.push({ kind: "ally", description: `Ally from ${t.career_id} event` }), /Gain (?:an|one) Enemy/i.test(r) && e.associates.push({ kind: "enemy", description: `Enemy from ${t.career_id} event` }), /Gain (?:a|one) Rival/i.test(r) && e.associates.push({ kind: "rival", description: `Rival from ${t.career_id} event` });
  }
  benefitRollsEarned(e, t, r) {
    let s = Math.max(0, e);
    return t >= 1 && (s += 1), t >= 3 && (s += 1), t >= 5 && (s += 1), r && (s = Math.max(0, s - 1)), s;
  }
  applyMusterBenefit(e, t) {
    if (/TAS Membership/i.test(t)) e.tas_member = !0;
    else if (/Ship Share/i.test(t)) e.ship_shares += 1;
    else if (/Scout Ship/i.test(t)) e.equipment.push({ name: "Scout Ship", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Weapon/i.test(t)) e.equipment.push({ name: "Weapon", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Armou?r/i.test(t)) e.equipment.push({ name: "Armour", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Blade/i.test(t)) e.equipment.push({ name: "Blade", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Gun/i.test(t)) e.equipment.push({ name: "Gun", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Ship's Boat/i.test(t)) e.equipment.push({ name: "Ship's Boat", quantity: 1, notes: "Mustering-out benefit" });
    else {
      const r = t.match(/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+(\d+)/);
      r ? y(e, r[1], f(e, r[1]) + Number(r[2])) : e.equipment.push({ name: t, quantity: 1, notes: "Mustering-out benefit" });
    }
  }
  finalizeRobot(e) {
    const t = D();
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
    let e = D();
    return e.name = "Generated Traveller", e = this.rollInitialCharacteristics(e).character, e = this.chooseSociety(e, "third_imperium").character, e = this.applySpecies(e, "imperial_human").character, e = this.applyBackgroundSkills(e, ["Admin", "Streetwise", "Vacc Suit"]).character, e = this.applyCareerPackage(e, "scout").character, e.phase = "done", { character: e };
  }
}
function N(l) {
  const e = l.match(/^(.+?)\s*\((.+)\)\s*$/);
  return e ? [e[1].trim(), e[2].trim()] : [l.trim(), null];
}
function $(l) {
  const e = l.trim(), t = e.match(/\s+(\d+)$/), r = t ? Number(t[1]) : 1, s = t ? e.slice(0, t.index).trim() : e, [i, a] = N(s);
  return [i, a, r];
}
function z(l) {
  return [...l.skill_list_male ?? [], ...l.skill_list_female ?? []].map(String);
}
function F(l) {
  return l === "Jack-of-all-Trades" || l === "Jack-of-all-trades" ? "Jack-of-All-Trades" : l.trim();
}
const I = [
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
    const t = new Set(((r = this.catalog.speciesBySociety[e]) == null ? void 0 : r.map((s) => s.id)) ?? []);
    return this.speciesList().filter((s) => t.has(s.id));
  }
  careersForSociety(e) {
    const t = /* @__PURE__ */ new Set([
      ...(this.catalog.careersBySociety.any ?? []).map((r) => r.id),
      ...(this.catalog.careersBySociety[e] ?? []).map((r) => r.id)
    ]);
    return this.careerList().filter((r) => t.has(r.id));
  }
}
async function G(l) {
  const e = l.replace(/\/$/, ""), [t, r, s, i] = await Promise.all([
    L(`${e}/species/index.json`, `${e}/species`),
    L(`${e}/careers/index.json`, `${e}/careers`),
    V(e),
    E(`${e}/catalog.json`)
  ]);
  return new H({ species: t, careers: r, tables: s, catalog: i });
}
async function V(l) {
  const e = await Promise.all(I.map(async (t) => [t, await E(`${l}/tables/${t}.json`)]));
  return Object.fromEntries(e);
}
async function L(l, e) {
  const t = await E(l), r = [];
  for (const s of t) {
    const i = await E(`${e}/${s}`), a = Array.isArray(i) ? i : [i];
    for (const n of a)
      n != null && n.deprecated || n != null && n.id && r.push([n.id, n]);
  }
  return Object.fromEntries(r);
}
async function E(l) {
  const e = await fetch(l);
  if (!e.ok) throw new Error(`Failed to load ${l}: ${e.status} ${e.statusText}`);
  return e.json();
}
const Y = {
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
}, X = {
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
function J(l) {
  return Y[A(l)];
}
function K(l) {
  if (l)
    return X[A(l)] ?? A(l).replace(/[^a-z0-9]/g, "");
}
function A(l) {
  return l.trim().toLowerCase();
}
function W(l, e = {}) {
  const t = e.entryYear ?? 1105, r = Z(l), s = Object.fromEntries(j.map((o) => {
    const c = o === "PSI" && l.psi || f(l, o);
    return [o, { value: c, current: c, show: re(o, c), default: !1 }];
  })), i = l.characteristics.STR + l.characteristics.DEX + l.characteristics.END, a = [
    ...Q(l),
    ...ee(l),
    ...te(l)
  ], n = l.name || "Unnamed Traveller";
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
      heavyLoad: l.characteristics.STR * 10,
      maxLoad: l.characteristics.STR * 20,
      modifiers: {},
      hits: { value: i, max: i, damage: 0, tmpDamage: 0 },
      description: l.capsule_description ? ie(l.capsule_description) : "",
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
      skills: r,
      damage: { STR: { value: 0 }, DEX: { value: 0 }, END: { value: 0, tmp: 0 } },
      sophont: {
        age: String(l.age),
        species: w(l.species_id.replaceAll("_", " ")),
        speciesTraits: l.traits.map((o) => o.name ?? o.id ?? "").filter(Boolean).join(", "),
        gender: l.gender || "Unknown",
        weight: 0,
        height: 0,
        profession: se(l),
        homeworld: l.homeworld
      },
      finance: {
        cash: String(l.credits),
        pension: String(l.pension_per_year),
        medicalDebt: String(l.medical_debt),
        mortgage: "0",
        livingCosts: "0",
        otherIncome: "0",
        shipShares: l.ship_shares,
        description: l.ship_shares ? `Ship Shares: ${l.ship_shares}` : ""
      },
      terms: l.total_terms || l.completed_careers.reduce((o, c) => o + c.terms_served, 0),
      startAge: l.character_type === "robot" ? 0 : 18,
      termLength: l.character_type === "robot" ? 0 : 4,
      entryYear: t,
      entryAge: l.age,
      currentYear: t,
      birthYear: t - l.age
    },
    items: a,
    effects: [],
    folder: null,
    flags: {
      travellerCreator: {
        sourceVersion: e.sourceVersion ?? "unknown",
        creationState: l,
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
function Z(l) {
  const e = {};
  for (const t of l.skills) {
    const r = J(t.name);
    if (r)
      if (e[r] ?? (e[r] = { base: -1, specs: {} }), !t.speciality || t.speciality.toLowerCase() === "any")
        e[r].base = Math.max(e[r].base, t.level);
      else {
        const s = K(t.speciality);
        s && (e[r].specs[s] = Math.max(e[r].specs[s] ?? -1, t.level));
      }
  }
  return Object.fromEntries(Object.entries(e).map(([t, r]) => {
    const s = { id: t, value: r.base > 0 ? String(r.base) : Math.max(r.base, 0), trained: !0 };
    return Object.keys(r.specs).length && (s.specialities = Object.fromEntries(Object.entries(r.specs).map(([i, a]) => [i, { id: i, value: String(a) }]))), [t, s];
  }));
}
function Q(l) {
  const e = {
    ally: { affinity: 3, enmity: 0, power: 2, influence: 2 },
    contact: { affinity: 3, enmity: 0, power: 0, influence: 4 },
    rival: { affinity: 1, enmity: 0, power: 2, influence: 1 },
    enemy: { affinity: 0, enmity: -3, power: 3, influence: 1 }
  };
  return l.associates.map((t) => {
    const r = String(t.kind || "contact").toLowerCase(), s = e[r] ?? e.contact;
    return O(t.description || `Unnamed ${w(r)}`, "associate", {
      associate: { relationship: r, ...s },
      relation: r,
      description: t.description
    });
  });
}
function ee(l) {
  return l.term_history.map((e, t) => {
    const r = w(e.career_id.replaceAll("_", " ")), s = w(e.assignment_id.replaceAll("_", " ")), i = `${r}${s ? `: ${s}` : ""}${e.rank_title ? ` (${e.rank_title})` : ""}`, a = [i, ...e.events.map((n) => `* ${n}`)].join(`
`);
    return O(`Term ${t + 1}: ${i}`, "term", {
      term: { number: t + 1, termLength: 4, assignment: i, randomTerm: !1, randomLength: "" },
      name: "Term",
      description: a
    }, "systems/mgt2e/icons/misc/career.svg");
  });
}
function te(l) {
  return l.equipment.map((e) => O(e.name, "item", {
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
function O(l, e, t, r = "systems/mgt2e/icons/items/item.svg") {
  const s = Date.now();
  return {
    name: l,
    type: e,
    system: t,
    _id: ne(),
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
      createdTime: s,
      modifiedTime: s
    },
    ownership: { default: 0 }
  };
}
function re(l, e) {
  return ["STR", "DEX", "END", "INT", "EDU", "SOC"].includes(l) || l === "PSI" && e > 0;
}
function se(l) {
  const e = l.completed_careers.at(-1);
  if (!e) return "";
  const t = w(e.career_id.replaceAll("_", " ")), r = e.assignment_id && e.assignment_id !== "career_package" ? w(e.assignment_id.replaceAll("_", " ")) : "";
  return r ? `${t}: ${r}` : t;
}
function ie(l) {
  return `<p>${ae(l).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`;
}
function ae(l) {
  return l.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function w(l) {
  return l.replace(/\w\S*/g, (e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase());
}
function ne() {
  return crypto.getRandomValues(new Uint32Array(2)).reduce((l, e) => l + e.toString(16).padStart(8, "0"), "").slice(0, 16);
}
class le {
  constructor() {
    this.sourceVersion = "unknown";
  }
  async initialize(e) {
    this.appClass = e;
    const t = "modules/traveller-character-creator/data";
    this.rules = await G(t), this.engine = new U(this.rules);
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
    return D();
  }
  exportActorData(e, t = {}) {
    const r = Number(t.entryYear ?? game.settings.get("traveller-character-creator", "defaultEntryYear"));
    return W(e, { sourceVersion: this.sourceVersion, entryYear: r });
  }
  async createActor(e, t = {}) {
    var i, a;
    const r = this.exportActorData(e, t), s = await Actor.implementation.create(r);
    return game.settings.get("traveller-character-creator", "autoOpenCreatedActor") && ((i = s.sheet) == null || i.render(!0)), (a = ui.notifications) == null || a.info(`Created Traveller actor: ${s.name}`), s;
  }
}
function oe() {
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
const { ApplicationV2: ce, HandlebarsApplicationMixin: ue } = foundry.applications.api, g = class g extends ue(ce) {
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
    game.settings.get("traveller-character-creator", "persistDrafts") && localStorage.setItem(C(), JSON.stringify(this.character));
  }
  loadDraft() {
    var t;
    if (!game.settings.get("traveller-character-creator", "persistDrafts")) return null;
    const e = localStorage.getItem(C());
    if (!e) return null;
    try {
      return JSON.parse(e);
    } catch {
      return (t = ui.notifications) == null || t.warn("Traveller Creator draft was unreadable and has been reset."), localStorage.removeItem(C()), null;
    }
  }
  clearDraft() {
    localStorage.removeItem(C());
  }
};
g.DEFAULT_OPTIONS = {
  id: "traveller-character-creator",
  tag: "form",
  window: {
    title: "Traveller Character Creator",
    icon: "fa-solid fa-user-astronaut",
    resizable: !0
  },
  position: { width: 760, height: 720 },
  form: { handler: g.onSubmit, submitOnChange: !1, closeOnSubmit: !1 },
  actions: {
    roll: g.roll,
    chooseSociety: g.chooseSociety,
    applySpecies: g.applySpecies,
    applyBackgroundPackage: g.applyBackgroundPackage,
    applyCareerPackage: g.applyCareerPackage,
    applySkillPackage: g.applySkillPackage,
    createActor: g.createActor,
    reset: g.reset
  }
}, g.PARTS = {
  body: { template: "modules/traveller-character-creator/templates/creator.hbs" }
};
let q = g;
function C() {
  var l, e;
  return `traveller-character-creator.${((l = game.world) == null ? void 0 : l.id) ?? "world"}.${((e = game.user) == null ? void 0 : e.id) ?? "user"}.draft`;
}
Hooks.once("init", () => {
  oe(), Handlebars.registerHelper("eq", (l, e) => l === e);
});
Hooks.once("ready", async () => {
  const l = new le();
  await l.initialize(q), game.travellerCreator = l;
});
Hooks.on("renderActorDirectory", (l, e) => {
  var s;
  const t = e instanceof HTMLElement ? e : e[0];
  if (!t || t.querySelector("[data-traveller-creator-open]")) return;
  const r = document.createElement("button");
  r.type = "button", r.dataset.travellerCreatorOpen = "true", r.classList.add("traveller-creator-open"), r.innerHTML = '<i class="fa-solid fa-user-astronaut"></i> Create Traveller', r.addEventListener("click", () => {
    var i;
    return (i = game.travellerCreator) == null ? void 0 : i.open();
  }), (s = t.querySelector(".directory-header")) == null || s.append(r);
});
//# sourceMappingURL=traveller-character-creator.js.map
