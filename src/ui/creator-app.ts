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
      applyBackgroundPackage: TravellerCreatorApp.applyBackgroundPackage,
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
    return {
      character: this.character,
      stats: Object.entries(this.character.characteristics),
      extraStats: Object.entries(this.character.extra_characteristics),
      notes: [...this.character.notes].reverse().slice(0, 12),
      societies: rules.catalog.societies,
      species: rules.speciesForSociety(this.character.society_id),
      backgroundPackages: Object.values(rules.table<any>("background_packages").packages ?? {}),
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
    if (this.character.phase === "aslan_setup" || this.character.phase === "zhodani_training") {
      this.character.phase = "background";
      this.character.notes.push("Advanced special ancestry setup placeholder; detailed branch port remains in lifepath engine.");
    }
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
    const nameInput = this.element.querySelector<HTMLInputElement>("[name='name']");
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
