import { Sprite } from 'pixi.js';
import BaseComponent from './base';
import type { Point, Resource, SpriteProps } from './types';
import { basePropsToConfig } from './helpers';
import { getTexture } from '../textures';

class SpriteComponent extends BaseComponent<Sprite> {
  constructor(props: SpriteProps) {
    super(
      new Sprite({
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

  set texture(resource: Resource) {
    this.object.texture = getTexture(resource);
  }
}

export default SpriteComponent;
