import { type Sound, type IMediaInstance } from '@pixi/sound';
import gameState from './game-state';
import { Assets } from 'pixi.js';
import { Animation } from './animation';

interface PlaySoundOptions {
  loop?: boolean;
  volume?: number;
}

interface FadeInSoundOptions {
  fromVolume?: number;
  toVolume?: number;
  fadeDuration: number;
  loop?: boolean;
}

interface FadeOutSoundOptions {
  fadeDuration: number;
}

let _sound!: Sound;
const _playingSounds = new Map<string, IMediaInstance>();

export const initSound = () => {
  _sound = Assets.get('audio/sounds.mp3');
  const sprites = Assets.get('audio/sounds.json');

  _sound.muted = gameState.muted;
  _sound.addSprites(sprites);
};

export const playSound = async (
  name: string,
  options = {} as PlaySoundOptions,
) => {
  const { loop = false, volume = 1 } = options;

  const playingSound = await _sound.play({
    sprite: name,
    loop,
    volume,
    complete: () => _playingSounds.delete(name),
  });

  _playingSounds.set(name, playingSound);
};

export const fadeInSound = async (
  name: string,
  options: FadeInSoundOptions,
) => {
  const {
    fromVolume = 0.1,
    toVolume = 1,
    fadeDuration,
    loop = false,
  } = options;

  await playSound(name, { loop, volume: toVolume });

  const animation = new Animation({
    duration: fadeDuration,
    from: { volume: fromVolume },
    to: { volume: toVolume },
  });

  await animation.start(_playingSounds.get(name));
};

export const stopSound = (name: string) => {
  _playingSounds.get(name)?.stop();
  _playingSounds.delete(name);
};

export const fadeOutSound = async (
  name: string,
  options: FadeOutSoundOptions,
) => {
  const playingSound = _playingSounds.get(name);
  if (!playingSound) return;

  const { fadeDuration } = options;

  const animation = new Animation({
    duration: fadeDuration,
    from: { volume: playingSound.volume },
    to: { volume: 0 },
  });

  await animation.start(playingSound);
  stopSound(name);
};

export const setMute = (muted: boolean) => {
  _sound.muted = muted;
};
