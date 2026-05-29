import { registerSettings, TravellerCreatorApi } from "./foundry/api";
import { TravellerCreatorApp } from "./ui/creator-app";

declare const Hooks: any;
declare const game: any;
declare const Handlebars: any;

Hooks.once("init", () => {
  registerSettings();
  Handlebars.registerHelper("eq", (a: unknown, b: unknown) => a === b);
});

Hooks.once("ready", async () => {
  const api = new TravellerCreatorApi();
  await api.initialize(TravellerCreatorApp);
  game.travellerCreator = api;
});

Hooks.on("renderActorDirectory", (_app: any, html: any) => {
  const root = html instanceof HTMLElement ? html : html[0];
  if (!root || root.querySelector("[data-traveller-creator-open]")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.travellerCreatorOpen = "true";
  button.classList.add("traveller-creator-open");
  button.innerHTML = `<i class="fa-solid fa-user-astronaut"></i> Create Traveller`;
  button.addEventListener("click", () => game.travellerCreator?.open());
  root.querySelector(".directory-header")?.append(button);
});
