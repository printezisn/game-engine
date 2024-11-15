import { Application, Assets } from 'pixi.js';
import config from './config';
import { debounce } from './helpers/closures';
import resize from './helpers/aspect-ratio-resizer';
import gameState from './game-state';
import { LoadingScene } from './scenes';
import { fireSignal } from './signals';
import { type BaseScene } from './scenes';
import { initSound } from './sound';
import { initPhysicsEngine, updatePhysics } from './physics-engine';
import { Animation } from './animation';
import '@pixi/sound';

let app!: Application;

const getScreenHeight = () => {
  return (config.screen.width * 1) / config.screen.aspectRatio;
};

const resizeCanvas = () => {
  const { width, height, orientation } = resize(
    config.gameContainer,
    app.canvas,
    config.screen.width,
    getScreenHeight(),
  );

  if (width !== gameState.screen.width || height !== gameState.screen.height) {
    gameState.screen.width = width;
    gameState.screen.height = height;
    app.renderer.resize(width, height);
    fireSignal(config.signals.onResize);
  }

  const orientationChanged = gameState.screen.orientation !== orientation;
  gameState.screen.orientation = orientation;
  if (orientationChanged) {
    fireSignal(config.signals.onOrientationChange);
  }
};

const handleContainerResize = () => {
  const { start: resizeCallback } = debounce(
    () => {
      resizeCanvas();
    },
    () => {},
    100,
  );
  const containerResizeObservers = new ResizeObserver(() => {
    resizeCallback();
  });

  containerResizeObservers.observe(config.gameContainer);
  resizeCanvas();
};

const handleTick = () => {
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

  app.ticker.maxFPS = config.maxFPS;
  app.ticker.add((ticker) => {
    if (config.debug) {
      totalFPS += Math.floor(ticker.FPS);
      totalFPSEntries++;
    }

    totalDeltaTime += ticker.deltaMS;
    while (totalDeltaTime >= config.tickIntervalMillis) {
      fireSignal(config.signals.onTick);
      Animation.updateEngine(config.tickIntervalMillis);
      updatePhysics(config.tickIntervalMillis);
      totalDeltaTime -= config.tickIntervalMillis;
    }
  });
};

export const changeScene = async (newScene: BaseScene) => {
  if (gameState.scene) {
    gameState.scene.destroy();
    app.stage.removeChild(gameState.scene.object);
  }

  gameState.scene = newScene;
  app.stage.addChild(gameState.scene.object);

  await newScene.init();
};

export const initGame = async () => {
  config.gameContainer.style.backgroundColor = config.colors.backgroundColor;

  app = new Application();

  await app.init({
    backgroundColor: config.colors.backgroundColor,
    width: config.screen.width,
    height: getScreenHeight(),
  });

  if (import.meta.env.DEV || config.debug) {
    (globalThis as any).__PIXI_APP__ = app;
  }

  config.gameContainer.appendChild(app.canvas);
  app.canvas.style.position = 'absolute';

  changeScene(new LoadingScene());
  handleContainerResize();
  initPhysicsEngine();
  Animation.initEngine();
  handleTick();

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
