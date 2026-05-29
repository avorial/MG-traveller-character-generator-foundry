import { newCharacter } from "../engine/character";
import { TravellerLifepathEngine } from "../engine/lifepath";
import { loadRules, type RulesIndex } from "../engine/rules";
import type { TravellerCharacter } from "../engine/types";
import { exportActorData } from "./actor-export";

declare const game: any;
declare const Actor: any;
declare const ui: any;

export class TravellerCreatorApi {
  rules?: RulesIndex;
  engine?: TravellerLifepathEngine;
  appClass?: any;
  sourceVersion = "unknown";

  async initialize(appClass: any): Promise<void> {
    this.appClass = appClass;
    const base = "modules/traveller-character-creator/data";
    this.rules = await loadRules(base);
    this.engine = new TravellerLifepathEngine(this.rules);
    try {
      const response = await fetch("modules/traveller-character-creator/SOURCE_VERSION");
      if (response.ok) this.sourceVersion = (await response.text()).trim();
    } catch {
      this.sourceVersion = "unknown";
    }
  }

  open(options: Record<string, unknown> = {}): any {
    if (!this.engine || !this.appClass) throw new Error("Traveller Creator is not initialized yet.");
    const app = new this.appClass(this, options);
    app.render(true);
    return app;
  }

  newCharacter(): TravellerCharacter {
    return newCharacter();
  }

  exportActorData(character: TravellerCharacter, options: Record<string, unknown> = {}): any {
    const entryYear = Number(options.entryYear ?? game.settings.get("traveller-character-creator", "defaultEntryYear"));
    return exportActorData(character, { sourceVersion: this.sourceVersion, entryYear });
  }

  async createActor(character: TravellerCharacter, options: Record<string, unknown> = {}): Promise<any> {
    const data = this.exportActorData(character, options);
    const actor = await Actor.implementation.create(data);
    if (game.settings.get("traveller-character-creator", "autoOpenCreatedActor")) actor.sheet?.render(true);
    ui.notifications?.info(`Created Traveller actor: ${actor.name}`);
    return actor;
  }
}

export function registerSettings(): void {
  game.settings.register("traveller-character-creator", "defaultEntryYear", {
    name: "Default Entry Year",
    hint: "The campaign year used for generated actor date fields.",
    scope: "world",
    config: true,
    type: Number,
    default: 1105
  });
  game.settings.register("traveller-character-creator", "autoOpenCreatedActor", {
    name: "Open Created Actor",
    hint: "Open the Traveller sheet after creating the actor.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
  game.settings.register("traveller-character-creator", "persistDrafts", {
    name: "Persist Character Creator Drafts",
    hint: "Save the in-progress creator state in this browser.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
}
