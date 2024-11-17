import { Application, Assets } from 'pixi.js';
import config from './config';
import { debounce } from './helpers/closures';
import resize from './helpers/aspect-ratio-resizer';
import gameState from './game-state';
import { LoadingScene } from './scenes';
import { fireSignal } from './signals';
import { type BaseScene } from './scenes';
import { initSound, pauseSounds, resumeSounds } from './sound';
import { initPhysicsEngine, updatePhysics } from './physics-engine';
import { Animation } from './animation';
import '@pixi/sound';
import { setRenderer } from './textures';

let _app!: Application;
let _paused = false;

const _getScreenHeight = () => {
  return (config.screen.width * 1) / config.screen.aspectRatio;
};

const _resizeCanvas = () => {
  const { width, height, orientation } = resize(
    config.gameContainer,
    _app.canvas,
    config.screen.width,
    _getScreenHeight(),
  );

  if (width !== gameState.screen.width || height !== gameState.screen.height) {
    gameState.screen.width = width;
    gameState.screen.height = height;
    _app.renderer.resize(width, height);
    fireSignal(config.signals.onResize);
  }

  const orientationChanged = gameState.screen.orientation !== orientation;
  gameState.screen.orientation = orientation;
  if (orientationChanged) {
    fireSignal(config.signals.onOrientationChange);
  }
};

const _handleContainerResize = () => {
  const { start: resizeCallback } = debounce(
    () => {
      _resizeCanvas();
    },
    () => {},
    100,
  );
  const containerResizeObservers = new ResizeObserver(() => {
    resizeCallback();
  });

  containerResizeObservers.observe(config.gameContainer);
  _resizeCanvas();
};

const _handleTick = () => {
  let totalDeltaTime = 0;
  let totalFPSEntries = 0;
  let totalFPS = 0;

  if (config.debug) {
    setInterval(() => {
      console.log(
        totalFPSEntries === 0 ? 0 : Math.floor(totalFPS / totalFPSEntries),
      );

      totalFPSEntries = 0;
      totalFPS = 0;
    }, 1000);
  }

  _app.ticker.maxFPS = config.maxFPS;
  _app.ticker.add((ticker) => {
    if (config.debug) {
      totalFPS += Math.floor(ticker.FPS);
      totalFPSEntries++;
    }

    if (_paused) return;

    totalDeltaTime += ticker.deltaMS;
    while (totalDeltaTime >= config.tickIntervalMillis) {
      fireSignal(config.signals.onTick);
      Animation.updateEngine(config.tickIntervalMillis);
      updatePhysics(config.tickIntervalMillis);
      totalDeltaTime -= config.tickIntervalMillis;
    }
  });
};

const _handleFocus = () => {
  let focusedOnce = false;

  window.addEventListener('focus', () => {
    focusedOnce = true;
    if (!_paused) return;

    _paused = false;
    resumeSounds();
  });

  window.addEventListener('blur', () => {
    if (_paused || !focusedOnce) return;

    _paused = true;
    pauseSounds();
  });
};

export const changeScene = async (newScene: BaseScene) => {
  if (gameState.scene) {
    gameState.scene.destroy();
    _app.stage.removeChild(gameState.scene.object);
  }

  gameState.scene = newScene;
  _app.stage.addChild(gameState.scene.object);

  await newScene.init();
};

export const initGame = async () => {
  config.gameContainer.style.backgroundColor = config.colors.backgroundColor;

  _app = new Application();

  await _app.init({
    backgroundColor: config.colors.backgroundColor,
    width: config.screen.width,
    height: _getScreenHeight(),
  });

  if (import.meta.env.DEV || config.debug) {
    (globalThis as any).__PIXI_APP__ = _app;
  }

  config.gameContainer.appendChild(_app.canvas);
  _app.canvas.style.position = 'absolute';

  setRenderer(_app.renderer);
  changeScene(new LoadingScene());
  _handleContainerResize();
  initPhysicsEngine();
  Animation.initEngine();
  _handleTick();
  _handleFocus();

  await Promise.all([
    new Promise((resolve) =>
      setTimeout(resolve, config.loadingScene.keepAliveTimeMS),
    ),
    (async () => {
      await Assets.init({
        basePath: config.assets.basePath,
        manifest: config.assets.manifest,
      });
      Assets.addBundle('extra', config.assets.extra);

      await Promise.all([
        Assets.loadBundle('default'),
        Assets.loadBundle('extra'),
      ]);

      initSound();
    })(),
  ]);

  fireSignal(config.signals.destroyLoadingScene);
};
