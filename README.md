# MG Traveller Character Generator Foundry

Foundry VTT module for creating Mongoose Traveller 2e actors using rules and data ported from [`avorial/MG-traveller-character-generator`](https://github.com/avorial/MG-traveller-character-generator).

This is a standalone module for the `mgt2e` Foundry system. It does not call the FastAPI web app at runtime; rule data is bundled under `public/data`, and the TypeScript engine runs inside Foundry.

## Development

```bash
npm install
npm run test
npm run build
```

Link or copy this folder into Foundry's `Data/modules/traveller-character-creator`, then enable the module in an `mgt2e` world.

Repository: <https://github.com/avorial/MG-traveller-character-generator-foundry>

## Current Implementation Status

Implemented:

- Foundry module manifest and Vite build.
- Rules data sync/validation scripts.
- Character state model with Traveller-compatible skill merging.
- Dice roller with GM forced totals.
- Initial lifepath actions for characteristics, extra characteristics, species application, background packages, simple career packages, and NPC seed generation.
- `mgt2e` actor-data export and direct actor creation API.
- ApplicationV2 launcher, actor directory button, macro helper, draft persistence setting, and direct actor creation.

Remaining parity work is concentrated in `src/engine/lifepath.ts`: porting every career term handler, event/mishap pending-choice branch, education branch, and robot construction calculation from the source generator.
