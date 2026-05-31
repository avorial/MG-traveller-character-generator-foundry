import type { TravellerCreatorApi } from "../foundry/api";
import type { TravellerCharacter } from "../engine/types";

declare const foundry: any;
declare const game: any;
declare const ui: any;

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class TravellerCreatorApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "traveller-character-creator",
    tag: "form",
    window: {
      title: "Traveller Character Creator",
      icon: "fa-solid fa-user-astronaut",
      resizable: true
    },
    position: { width: 760, height: 720 },
    form: { handler: TravellerCreatorApp.onSubmit, submitOnChange: false, closeOnSubmit: false },
    actions: {
      roll: TravellerCreatorApp.roll,
      chooseSociety: TravellerCreatorApp.chooseSociety,
      applySpecies: TravellerCreatorApp.applySpecies,
      chooseAslanGender: TravellerCreatorApp.chooseAslanGender,
      rollAslanClan: TravellerCreatorApp.rollAslanClan,
      rollAslanAncestry: TravellerCreatorApp.rollAslanAncestry,
      rollAslanFamily: TravellerCreatorApp.rollAslanFamily,
      rollAslanRite: TravellerCreatorApp.rollAslanRite,
      finishZhodaniTraining: TravellerCreatorApp.finishZhodaniTraining,
      rollDroyneCaste: TravellerCreatorApp.rollDroyneCaste,
      setupKkreeFamily: TravellerCreatorApp.setupKkreeFamily,
      applyBackgroundPackage: TravellerCreatorApp.applyBackgroundPackage,
      applyManualBackground: TravellerCreatorApp.applyManualBackground,
      skipBackground: TravellerCreatorApp.skipBackground,
      qualifyPreCareer: TravellerCreatorApp.qualifyPreCareer,
      preCareerEvent: TravellerCreatorApp.preCareerEvent,
      graduatePreCareer: TravellerCreatorApp.graduatePreCareer,
      skipPreCareer: TravellerCreatorApp.skipPreCareer,
      qualifyStartCareer: TravellerCreatorApp.qualifyStartCareer,
      survivalRoll: TravellerCreatorApp.survivalRoll,
      eventRoll: TravellerCreatorApp.eventRoll,
      mishapRoll: TravellerCreatorApp.mishapRoll,
      commissionRoll: TravellerCreatorApp.commissionRoll,
      advancementRoll: TravellerCreatorApp.advancementRoll,
      continueCareer: TravellerCreatorApp.continueCareer,
      leaveCareer: TravellerCreatorApp.leaveCareer,
      musterCash: TravellerCreatorApp.musterCash,
      musterBenefit: TravellerCreatorApp.musterBenefit,
      applyCareerPackage: TravellerCreatorApp.applyCareerPackage,
      applySkillPackage: TravellerCreatorApp.applySkillPackage,
      createActor: TravellerCreatorApp.createActor,
      reset: TravellerCreatorApp.reset
    }
  };

  static PARTS = {
    body: { template: "modules/traveller-character-creator/templates/creator.hbs" }
  };

  character: TravellerCharacter;

  constructor(readonly api: TravellerCreatorApi, options: Record<string, unknown> = {}) {
    super(options);
    this.character = this.loadDraft() ?? api.newCharacter();
  }

  async _prepareContext(): Promise<Record<string, unknown>> {
    const rules = this.api.rules!;
    const educationTracks = Object.values(rules.table<any>("education").tracks ?? {}).map((track: any) => ({
      ...track,
      servicesList: Object.values(track.services ?? {}),
      curriculaList: Object.values(track.curricula ?? {})
    }));
    const activeTrack = rules.table<any>("education").tracks?.[String(this.character.pre_career_status?.track_id ?? "")] ?? null;
    const currentCareer = this.character.current_term ? rules.career(this.character.current_term.career_id) : null;
    const careerChoices = rules.careersForSociety(this.character.society_id).map((career: any) => ({
      ...career,
      assignmentList: assignmentList(career)
    }));
    const currentCareerRecord = this.character.completed_careers.at(-1) ?? null;
    return {
      character: this.character,
      aslanPhase: this.character.aslan_setup_status?.phase ?? null,
      isDroyne: this.character.species_id === "droyne",
      needsDroyneCaste: this.character.species_id === "droyne" && !this.character.droyne_caste,
      isKkree: this.character.species_id === "kkree",
      stats: Object.entries(this.character.characteristics),
      extraStats: Object.entries(this.character.extra_characteristics),
      notes: [...this.character.notes].reverse().slice(0, 12),
      societies: rules.catalog.societies,
      species: rules.speciesForSociety(this.character.society_id),
      backgroundPackages: Object.values(rules.table<any>("background_packages").packages ?? {}),
      educationTracks,
      activeTrack,
      manualBackgroundSkills: ["Admin", "Athletics", "Carouse", "Drive", "Electronics", "Flyer", "Language", "Mechanic", "Medic", "Profession", "Science", "Streetwise", "Survival", "Vacc Suit"],
      careerChoices,
      currentCareer,
      currentCareerRecord,
      hasCurrentTerm: Boolean(this.character.current_term),
      canRollSurvival: Boolean(this.character.current_term && this.character.current_term.survived == null),
      canRollEvent: Boolean(this.character.current_term && this.character.current_term.survived !== false),
      canRollCommission: Boolean(this.character.current_term && currentCareer?.commission && !this.character.current_term.commissioned),
      canRollAdvancement: Boolean(this.character.current_term && this.character.current_term.survived !== false && this.character.current_term.advanced == null),
      careerPackages: Object.values(rules.table<any>("career_packages").packages ?? {}),
      skillPackages: Object.entries(rules.table<any>("skill_packages").packages ?? {}).map(([id, pkg]: [string, any]) => ({ id, ...pkg })),
      canCreate: this.character.phase === "done"
    };
  }

  static async onSubmit(): Promise<void> {}

  static async roll(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.rollInitialCharacteristics(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async chooseSociety(this: TravellerCreatorApp, event: Event, target: HTMLElement): Promise<void> {
    const id = target.dataset.id;
    if (!id) return;
    this.character = this.api.engine!.chooseSociety(this.character, id).character;
    this.saveDraft();
    this.render();
  }

  static async applySpecies(this: TravellerCreatorApp, event: Event, target: HTMLElement): Promise<void> {
    const id = target.dataset.id;
    if (!id) return;
    this.character = this.api.engine!.applySpecies(this.character, id).character;
    if (this.character.phase === "aslan_setup") this.character = this.api.engine!.beginAslanSetup(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async chooseAslanGender(this: TravellerCreatorApp, event: Event, target: HTMLElement): Promise<void> {
    const gender = target.dataset.gender === "female" ? "female" : "male";
    this.character = this.api.engine!.chooseAslanGender(this.character, gender).character;
    this.saveDraft();
    this.render();
  }

  static async rollAslanClan(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.rollAslanClan(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async rollAslanAncestry(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.rollAslanAncestry(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async rollAslanFamily(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.rollAslanFamily(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async rollAslanRite(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.rollAslanRite(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async finishZhodaniTraining(this: TravellerCreatorApp): Promise<void> {
    this.character.phase = "background";
    this.character.notes.push("Deferred detailed psionic training; continuing to background choices.");
    this.saveDraft();
    this.render();
  }

  static async rollDroyneCaste(this: TravellerCreatorApp, event: Event, target: HTMLElement): Promise<void> {
    const caste = target.dataset.caste;
    this.character = this.api.engine!.rollDroyneCaste(this.character, caste).character;
    this.saveDraft();
    this.render();
  }

  static async setupKkreeFamily(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.setupKkreeFamily(this.character, Math.max(1, this.character.kkree_wives || 1), this.character.kkree_family_members).character;
    this.saveDraft();
    this.render();
  }

  static async applyBackgroundPackage(this: TravellerCreatorApp, event: Event, target: HTMLElement): Promise<void> {
    const id = target.dataset.id;
    if (!id) return;
    this.character = this.api.engine!.applyBackgroundPackage(this.character, id).character;
    this.saveDraft();
    this.render();
  }

  static async applyManualBackground(this: TravellerCreatorApp, event: Event, target: HTMLElement): Promise<void> {
    const skills = (target.dataset.skills ?? "").split(",").map((skill) => skill.trim()).filter(Boolean);
    this.character = this.api.engine!.applyBackgroundSkills(this.character, skills).character;
    this.saveDraft();
    this.render();
  }

  static async skipBackground(this: TravellerCreatorApp): Promise<void> {
    this.character.phase = "pre_career";
    this.character.notes.push("Skipped background package selection.");
    this.saveDraft();
    this.render();
  }

  static async qualifyPreCareer(this: TravellerCreatorApp, event: Event, target: HTMLElement): Promise<void> {
    const id = target.dataset.id;
    if (!id) return;
    const options: Record<string, string> = {};
    if (target.dataset.service) options.service = target.dataset.service;
    if (target.dataset.curriculum) options.curriculum = target.dataset.curriculum;
    this.character = this.api.engine!.qualifyForPreCareer(this.character, id, options).character;
    this.saveDraft();
    this.render();
  }

  static async preCareerEvent(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.preCareerEventRoll(this.character, this.character.species_id.includes("aslan")).character;
    this.saveDraft();
    this.render();
  }

  static async graduatePreCareer(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.graduatePreCareer(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async skipPreCareer(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.skipPreCareer(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async qualifyStartCareer(this: TravellerCreatorApp, event: Event, target: HTMLElement): Promise<void> {
    const careerId = target.dataset.career;
    if (!careerId) return;
    const assignmentId = target.dataset.assignment;
    try {
      const qualified = this.api.engine!.qualifyForCareer(this.character, careerId);
      this.character = qualified.character;
      if (qualified.qualified) this.character = this.api.engine!.startTerm(this.character, careerId, assignmentId).character;
    } catch (error) {
      ui.notifications?.warn(error instanceof Error ? error.message : String(error));
    }
    this.saveDraft();
    this.render();
  }

  static async survivalRoll(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.survivalRoll(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async eventRoll(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.eventRoll(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async mishapRoll(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.mishapRoll(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async commissionRoll(this: TravellerCreatorApp): Promise<void> {
    try {
      this.character = this.api.engine!.commissionRoll(this.character).character;
    } catch (error) {
      ui.notifications?.warn(error instanceof Error ? error.message : String(error));
    }
    this.saveDraft();
    this.render();
  }

  static async advancementRoll(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.advancementRoll(this.character).character;
    this.saveDraft();
    this.render();
  }

  static async continueCareer(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.endTerm(this.character, false).character;
    this.saveDraft();
    this.render();
  }

  static async leaveCareer(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.endTerm(this.character, true).character;
    this.saveDraft();
    this.render();
  }

  static async musterCash(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.musterOutRoll(this.character, undefined, "cash").character;
    this.saveDraft();
    this.render();
  }

  static async musterBenefit(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.engine!.musterOutRoll(this.character, undefined, "benefit").character;
    this.saveDraft();
    this.render();
  }

  static async applyCareerPackage(this: TravellerCreatorApp, event: Event, target: HTMLElement): Promise<void> {
    const id = target.dataset.id;
    if (!id) return;
    this.character = this.api.engine!.applyCareerPackage(this.character, id).character;
    this.saveDraft();
    this.render();
  }

  static async applySkillPackage(this: TravellerCreatorApp, event: Event, target: HTMLElement): Promise<void> {
    const id = target.dataset.id;
    if (!id) return;
    this.character = this.api.engine!.applySkillPackage(this.character, id).character;
    this.saveDraft();
    this.render();
  }

  static async createActor(this: TravellerCreatorApp): Promise<void> {
    const nameInput = this.element.querySelector("[name='name']") as HTMLInputElement | null;
    if (nameInput?.value) this.character.name = nameInput.value;
    await this.api.createActor(this.character);
    this.clearDraft();
    this.close();
  }

  static async reset(this: TravellerCreatorApp): Promise<void> {
    this.character = this.api.newCharacter();
    this.clearDraft();
    this.render();
  }

  private saveDraft(): void {
    if (!game.settings.get("traveller-character-creator", "persistDrafts")) return;
    localStorage.setItem(draftKey(), JSON.stringify(this.character));
  }

  private loadDraft(): TravellerCharacter | null {
    if (!game.settings.get("traveller-character-creator", "persistDrafts")) return null;
    const raw = localStorage.getItem(draftKey());
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      ui.notifications?.warn("Traveller Creator draft was unreadable and has been reset.");
      localStorage.removeItem(draftKey());
      return null;
    }
  }

  private clearDraft(): void {
    localStorage.removeItem(draftKey());
  }
}

function draftKey(): string {
  return `traveller-character-creator.${game.world?.id ?? "world"}.${game.user?.id ?? "user"}.draft`;
}

function assignmentList(career: any): Array<{ id: string; name: string }> {
  if (Array.isArray(career.assignments)) {
    return career.assignments.map((assignment: any) => ({ id: String(assignment.id), name: String(assignment.name ?? assignment.id) }));
  }
  return Object.entries(career.assignments ?? {}).map(([id, assignment]: [string, any]) => ({ id, name: String(assignment?.name ?? id) }));
}
