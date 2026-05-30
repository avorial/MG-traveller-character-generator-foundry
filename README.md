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

Manifest URL for Foundry:

```text
https://github.com/avorial/MG-traveller-character-generator-foundry/releases/latest/download/module.json
```

## Current Implementation Status

Implemented:

- Foundry module manifest and Vite build.
- Rules data sync/validation scripts.
- Character state model with Traveller-compatible skill merging.
- Dice roller with GM forced totals.
- Lifepath actions for characteristics, heroic rolls, species/society setup, background packages, pre-career education, career terms, events, mishaps, injuries, aging, mustering out, skill packages, psionics, NPC seed generation, and robot finalization.
- Alien/society flows for Aslan setup, Droyne casting, Hiver nest/status, K'kree family/caste handling, Solomani/Vargr/Zhodani gates, and alien life-event tables.
- `mgt2e` actor-data export and direct actor creation API.
- ApplicationV2 launcher, actor directory button, macro helper, draft persistence setting, and direct actor creation.
- Release packaging that publishes the installable ZIP and manifest assets.

Remaining parity work is concentrated in the long-tail branch logic inside `src/engine/lifepath.ts`: every ambiguous event/mishap choice, deeper robot construction math, and direct parity fixtures against fixed source-generator roll sequences.
