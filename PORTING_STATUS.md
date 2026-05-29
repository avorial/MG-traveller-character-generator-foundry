# Porting Status

The module is structurally implemented and usable for the data-driven fast path:

- Roll core characteristics.
- Choose society and species from synced generator data.
- Apply background packages from synced generator data.
- Apply career packages from synced generator data.
- Apply final skill packages.
- Create a native `mgt2e` Traveller actor directly in Foundry.

The remaining full-parity work is concentrated in `src/engine/lifepath.ts`:

- Pre-career education branches and event choices.
- Aslan, Zhodani, Droyne, Hiver, Vargr, K'kree, Solomani special lifecycle branches.
- Full term-by-term career qualification, assignment, training, survival, event, mishap, advancement, and continuation flow.
- Mustering-out benefit rolls and pending benefit choices.
- Robot builder calculations and UI parity with the source generator.
- Complete parity fixture suite comparing fixed-roll source-generator outputs to module outputs.

The existing code deliberately exposes not-yet-ported methods as explicit throwing API methods instead of silently doing nothing.
