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
