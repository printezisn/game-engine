import { TilingSprite } from 'pixi.js';
import BaseComponent from './base';
import type { SpriteProps, Point, Resource } from './types';
import { basePropsToConfig } from './helpers';
import { getTexture } from '../textures';

class TilingSpriteComponent extends BaseComponent<TilingSprite> {
  constructor(props: SpriteProps) {
    super(
      new TilingSprite({
        ...basePropsToConfig(props),
        texture: getTexture(props.resource),
        anchor:
          typeof props.anchor === 'number'
            ? { x: props.anchor, y: props.anchor }
            : props.anchor,
      }),
      props,
    );
  }

  get anchor(): Point {
    return this.object.anchor;
  }

  set anchor(anchor: Point | number) {
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

  set tileScale(scale: Point | number) {
    this.object.tileScale = scale;
  }

  get tilePosition(): Point {
    return this.object.tilePosition;
  }

  set tilePosition(position: Point) {
    this.object.tilePosition = position;
  }

  set texture(resource: Resource) {
    this.object.texture = getTexture(resource);
  }
}

export default TilingSpriteComponent;
