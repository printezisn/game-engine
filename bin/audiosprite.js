#!/usr/bin/env node

import audiosprite from 'audiosprite';
import fs from 'fs';

audiosprite(
  [`./assets/raw-audio-files/*`],
  {
    output: `./assets/audio/sounds`,
  },
  (err, result) => {
    if (err) {
      console.log(err);
      // eslint-disable-next-line
      process.exit(1);
    }

    fs.writeFileSync(
      `./assets/audio/sounds.json`,
      JSON.stringify(result.spritemap),
    );
    fs.unlinkSync(`./assets/audio/sounds.ac3`);
    fs.unlinkSync(`./assets/audio/sounds.m4a`);
    fs.unlinkSync(`./assets/audio/sounds.ogg`);
  },
);
