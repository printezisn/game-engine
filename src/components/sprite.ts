import { Sprite, Texture } from 'pixi.js';
import BaseComponent from './base';
import type { Point, SpriteProps } from './types';
import { basePropsToConfig } from './helpers';

class SpriteComponent extends BaseComponent<Sprite> {
  constructor(props: SpriteProps) {
    super(
      new Sprite({
        ...basePropsToConfig(props),
        texture: Texture.from(props.resource),
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

  set texture(resource: string) {
    this.object.texture = Texture.from(resource);
  }
}

export default SpriteComponent;
