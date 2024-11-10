# Game Engine

The game engine which drives all my 2D browser games.

## Prerequisites

1. Install **NodeJS** >= 20.0.0. If you already have **nvm**, you can just do the following steps:
   1. `nvm install`
   1. `nvm use`
1. Install **pnpm** (e.g. with `npm i -g pnpm`).
1. Download the node packages with `pnpm i`.
1. Install **ffmpeg** to convert audio files.

## Stack

1. Typescript
1. [PixiJS](https://pixijs.com/) for 2D graphics.
1. [GSAP](https://gsap.com/) for animations.
1. [PixiJS Sound](https://pixijs.io/sound/examples/index.html) for playing sounds.
1. [PixiJS Assetpack](https://pixijs.io/assetpack/) for packing and optimizing assets.
1. [MatterJS](https://brm.io/matter-js/) for game physics.
1. [Audiosprite](https://github.com/tonistiigi/audiosprite) to combine audio files.

## Scripts

1. `pnpm build`: builds the library and makes it ready to be consumed by the games.
1. `pnpm lint`: uses eslint to find linting issues.
1. `pnpm lint:fix`: uses eslint to find linting issues and fix them if possible.
1. `pnpm prettier:format`: uses prettier to find formatting issues and fix them if possible.
1. `pnpm test:unit`: runs the unit tests.

## Commands

1. `build-game-audio`: builds audio for a game.
1. `build-game-assets`: builds assets for a game.
