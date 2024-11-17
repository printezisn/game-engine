import { SpriteComponent, TextComponent } from '../components';
import config from '../config';
import BaseScene from './base';

class PauseScene extends BaseScene {
  constructor() {
    super('Pause');

    this.visible = false;
    this.zIndex = 1000;
  }

  async init() {
    this.addComponent(
      new SpriteComponent({
        label: 'overlay',
        resource: {
          fillColor: config.pauseScene.overlayColor,
          rectangle: {
            x: 0,
            y: 0,
            width: config.screen.width,
            height: config.screen.width,
          },
        },
        alpha: config.pauseScene.overlayAlpha,
      }),
    );

    this.addComponent(
      new TextComponent({
        label: 'title',
        text: config.pauseScene.title,
        fontFamily: config.pauseScene.fontFamily,
        fontSize: config.pauseScene.titleFontSize,
        textColor: config.pauseScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: 'center',
        verticalAlignment: 'center',
        margin: { x: 0, y: -50 },
      }),
    );

    this.addComponent(
      new TextComponent({
        label: 'subtitle',
        text: config.pauseScene.subTitle,
        fontFamily: config.pauseScene.fontFamily,
        fontSize: config.pauseScene.subTitleFontSize,
        textColor: config.pauseScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: 'center',
        verticalAlignment: 'center',
        margin: { x: 0, y: 50 },
      }),
    );
  }
}

export default PauseScene;
