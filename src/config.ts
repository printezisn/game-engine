import type { AssetsManifest } from 'pixi.js';

interface Asset {
  alias: string;
  src: string;
  data?: any;
}

const config = {
  gameName: '',
  gameContainer: document.body,
  maxFPS: 60,
  debug: false,
  assets: {
    basePath: '/assets',
    manifest: {} as AssetsManifest,
    extra: [] as Asset[],
  },
  colors: {
    backgroundColor: '#000000',
  },
  screen: {
    width: 1280,
    aspectRatio: 16 / 9,
  },
  tickIntervalMillis: 16,
  loadingScene: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 28,
    textColor: 0xffffff,
    keepAliveTimeMS: 2000,
    text: 'Loading...',
  },
  pauseScene: {
    overlayColor: 0x000000,
    overlayAlpha: 0.8,
    fontFamily: 'Arial, sans-serif',
    titleFontSize: 48,
    subTitleFontSize: 28,
    textColor: 0xffffff,
    title: 'Paused',
    subTitle: 'Click/tap to continue',
  },
  signals: {
    onResize: 'onResize',
    onOrientationChange: 'onOrientationChange',
    onTick: 'onTick',
    destroyLoadingScene: 'destroyLoadingScene',
    showCredits: 'showCredits',
  },
  sounds: {
    click: 'click',
  },
};

export default config;
