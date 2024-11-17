import { TilingSprite } from 'pixi.js';
import BaseComponent from './base';
import type { SpriteProps, Point } from './types';
import { basePropsToConfig } from './helpers';
import { getTexture } from '../textures';

class TilingSpriteComponent extends BaseComponent<TilingSprite> {
  constructor(props: SpriteProps) {
    super(
      new TilingSprite({
        ...basePropsToConfig(props),
        texture: getTexture(props.resource),
      }),
      props,
    );
  }

  get anchor(): Point {
    return this.object.anchor;
  }

  set anchor(anchor: Point) {
    this.object.anchor = anchor;
  }

  get originalWidth() {
    return this.object.texture.width;
  }

  get originalHeight() {
    return this.object.texture.height;
  }

  get tileScale(): Point {
    return this.object.tileScale;
  }

  set tileScale(scale: Point) {
    this.object.tileScale = scale;
  }

  get tilePosition(): Point {
    return this.object.tilePosition;
  }

  set tilePosition(position: Point) {
    this.object.tilePosition = position;
  }
}

export default TilingSpriteComponent;
