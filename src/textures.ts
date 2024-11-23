import { Graphics, Renderer, RenderTexture, Texture } from 'pixi.js';
import { FilledShape, Resource } from './components/types';

let _renderer!: Renderer;
const _textures = new Map<string, Texture>();

export const setRenderer = (renderer: Renderer) => {
  _renderer = renderer;
};

export const createShape = (shape: FilledShape) => {
  let component: Graphics;

  if (shape.rectangle) {
    component = new Graphics().rect(
      shape.rectangle.x,
      shape.rectangle.y,
      shape.rectangle.width,
      shape.rectangle.height,
    );
  } else if (shape.roundedRectangle) {
    component = new Graphics().roundRect(
      shape.roundedRectangle.x,
      shape.roundedRectangle.y,
      shape.roundedRectangle.width,
      shape.roundedRectangle.height,
      shape.roundedRectangle.borderRadius,
    );
  } else if (shape.circle) {
    component = new Graphics().circle(
      shape.circle.x,
      shape.circle.y,
      shape.circle.radius,
    );
  } else if (shape.polygon) {
    component = new Graphics().poly(shape.polygon.points);
  } else {
    throw new Error('Invalid shape type');
  }

  component = component.fill(shape.fillColor);
  if (shape.strokeColor != null) {
    component = component.stroke({
      color: shape.strokeColor,
      width: shape.strokeWidth ?? 0,
    });
  }

  return component;
};

export const getTexture = (resource: Resource) => {
  const key = JSON.stringify(resource);
  let texture = _textures.get(key);
  if (texture) return texture;
  if (typeof resource === 'string') return Texture.from(resource);

  const shape = createShape(resource);
  texture = RenderTexture.create({
    width: shape.width,
    height: shape.height,
  });
  _renderer.render({ container: shape, target: texture });

  _textures.set(key, texture);
  return texture;
};
