import {
  Circle,
  Polygon,
  Rectangle,
  RoundedRectangle,
  type Container,
} from 'pixi.js';
import type { BaseProps, DisplayObject, Point, Shape } from './types';
import type ContainerComponent from './container';
import { addSignalListener, removeSignalListener } from '../signals';
import config from '../config';
import { Animation, type AnimationOptions } from '../animation';
import gameState from '../game-state';
import { removePhysicalEntity } from '../physics-engine';

abstract class BaseComponent<T extends Container> implements DisplayObject {
  private _props: BaseProps;
  private _object: T;
  private _parent: ContainerComponent | null = null;
  private _bindings: { name: string; binding: any }[] = [];
  private _animations: Animation[] = [];

  constructor(object: T, props: BaseProps) {
    this._props = props;
    this._object = object;

    this.hitArea = this.props.hitArea;

    this._createEvents();
    this._positionToScreen();
  }

  protected _registerToSignal(
    name: string,
    callback: (...args: any[]) => void,
  ) {
    this._bindings.push(addSignalListener(name, callback.bind(this)));
  }

  protected _unregisterFromSignal(name: string) {
    for (let i = 0; i < this._bindings.length; i++) {
      if (this._bindings[i].name === name) {
        removeSignalListener(name, this._bindings[i].binding);
        this._bindings.splice(i, 1);
        i--;
      }
    }
  }

  get props(): BaseProps {
    return this._props;
  }

  get object(): T {
    return this._object;
  }

  get x() {
    return this.object.x;
  }

  set x(x: number) {
    this.object.x = x;
  }

  get y() {
    return this.object.y;
  }

  set y(y: number) {
    this.object.y = y;
  }

  get position(): Point {
    return this.object.position;
  }

  set position(position: Point) {
    this.object.position = position;
  }

  get globalPosition(): Point {
    return this.object.toGlobal(this.position);
  }

  set scale(scale: Point) {
    this.object.scale = scale;
  }

  get scale(): Point {
    return this.object.scale;
  }

  get scaleX(): number {
    return this.object.scale.x;
  }

  set scaleX(x: number) {
    this.object.scale.x = x;
  }

  get scaleY(): number {
    return this.object.scale.y;
  }

  set scaleY(y: number) {
    this.object.scale.y = y;
  }

  get width(): number {
    return this.object.width;
  }

  set width(width: number) {
    this.object.width = width;
  }

  get height(): number {
    return this.object.height;
  }

  set height(height: number) {
    this.object.height = height;
  }

  get alpha() {
    return this.object.alpha;
  }

  set alpha(alpha: number) {
    this.object.alpha = alpha;
  }

  get visible() {
    return this.object.visible;
  }

  set visible(visible: boolean) {
    this.object.visible = visible;
  }

  get label() {
    return this.object.label;
  }

  get parent() {
    return this._parent;
  }

  set parent(container: ContainerComponent | null) {
    this._parent = container;
  }

  get interactive() {
    return this.object.interactive ?? false;
  }

  set interactive(interactive: boolean) {
    this.object.interactive = interactive;
  }

  get rotation() {
    return this.object.rotation;
  }

  set rotation(rotation: number) {
    this.object.rotation = rotation;
  }

  get tint() {
    return this.object.tint;
  }

  set tint(tint: number) {
    this.object.tint = tint;
  }

  get zIndex() {
    return this.object.zIndex;
  }

  set zIndex(zIndex: number) {
    this.object.zIndex = zIndex;
  }

  set hitArea(hitArea: Shape | null | undefined) {
    if (hitArea?.circle) {
      this.object.hitArea = new Circle(
        hitArea.circle.x,
        hitArea.circle.y,
        hitArea.circle.radius,
      );
    } else if (hitArea?.roundedRectangle) {
      this.object.hitArea = new RoundedRectangle(
        hitArea.roundedRectangle.x,
        hitArea.roundedRectangle.y,
        hitArea.roundedRectangle.width,
        hitArea.roundedRectangle.height,
        hitArea.roundedRectangle.borderRadius,
      );
    } else if (hitArea?.rectangle) {
      this.object.hitArea = new Rectangle(
        hitArea.rectangle.x,
        hitArea.rectangle.y,
        hitArea.rectangle.width,
        hitArea.rectangle.height,
      );
    } else if (hitArea?.polygon) {
      this.object.hitArea = new Polygon(hitArea.polygon.points);
    } else {
      this.object.hitArea = null;
    }
  }

  animate(options: AnimationOptions) {
    return this._createAnimation(this, options);
  }

  getAnimation(name: string) {
    return this._animations.find((animation) => animation.name === name);
  }

  stopAnimations() {
    this._animations.forEach((animation) => animation.stop());
    this._animations = [];
  }

  finishAnimations() {
    this._animations.forEach((animation) => animation.finish());
  }

  delay(duration: number) {
    return this._createAnimation(
      { x: 0 },
      {
        from: { x: 0 },
        to: { x: 1 },
        duration,
      },
    );
  }

  destroy() {
    if (this.parent) {
      this.parent.removeComponent(this);
      return;
    }

    removePhysicalEntity(this);

    this._bindings.forEach(({ name, binding }) =>
      removeSignalListener(name, binding),
    );
    this._bindings = [];

    this.stopAnimations();

    this.parent = null;
    this.object.destroy();
  }

  protected _positionToScreen() {
    if (this.props.horizontalAlignment === 'center') {
      this.x = gameState.screen.width / 2 + (this.props.margin?.x ?? 0);
    } else if (this.props.horizontalAlignment === 'right') {
      this.x = gameState.screen.width + (this.props.margin?.x ?? 0);
    }

    if (this.props.verticalAlignment === 'center') {
      this.y = gameState.screen.height / 2 + (this.props.margin?.y ?? 0);
    } else if (this.props.verticalAlignment === 'bottom') {
      this.y = gameState.screen.height + (this.props.margin?.y ?? 0);
    }
  }

  private _setOrientationProperties() {
    const props = this.props[gameState.screen.orientation];
    for (const key in props) {
      (this as any)[key] = props[key];
    }
  }

  private async _createAnimation(target: any, options: AnimationOptions) {
    const animation = new Animation(options);
    this._animations.push(animation);

    await animation.start(target);

    const index = this._animations.indexOf(animation);
    this._animations.splice(index, 1);
  }

  private _createEvents() {
    const onResizeCallbacks = [
      this.props.horizontalAlignment || this.props.verticalAlignment
        ? this._positionToScreen.bind(this)
        : null,
      this.props.onResize,
      (this as any)._onResize?.bind(this),
    ].filter(Boolean);

    if (onResizeCallbacks.length > 0) {
      this._registerToSignal(config.signals.onResize, () => {
        onResizeCallbacks.forEach((callback) => callback(this));
      });
    }

    const onOrientationCallbacks = [
      this.props.landscape || this.props.portrait
        ? this._setOrientationProperties.bind(this)
        : null,
      this.props.onOrientationChange,
      (this as any)._onOrientationChange?.bind(this),
    ].filter(Boolean);

    if (onOrientationCallbacks.length > 0) {
      this._registerToSignal(config.signals.onOrientationChange, () => {
        onOrientationCallbacks.forEach((callback) => callback(this));
      });
    }

    const onTickCallbacks = [
      this.props.onTick,
      (this as any)._onTick?.bind(this),
    ].filter(Boolean);

    if (onTickCallbacks.length > 0) {
      this._registerToSignal(config.signals.onTick, () => {
        onTickCallbacks.forEach((callback) => callback(this));
      });
    }

    if ((this as any)._onClick || this.props.onClick) {
      this.object.on('pointerdown', (e) => {
        e.stopImmediatePropagation();
        this.props.onClick?.(this);
        (this as any)._onClick();
      });
    }
    if ((this as any)._onPointerUp || this.props.onPointerUp) {
      this.object.on('pointerup', (e) => {
        e.stopImmediatePropagation();
        this.props.onPointerUp?.(this);
        (this as any)._onPointerUp();
      });
    }
    if ((this as any)._onPointerEnter || this.props.onPointerEnter) {
      this.object.on('pointerenter', (e) => {
        e.stopImmediatePropagation();
        this.props.onPointerEnter?.(this);
        (this as any)._onPointerEnter();
      });
    }
    if ((this as any)._onPointerOut || this.props.onPointerOut) {
      this.object.on('pointerout', (e) => {
        e.stopImmediatePropagation();
        this.props.onPointerOut?.(this);
        (this as any)._onPointerOut();
      });
    }
  }
}

export default BaseComponent;
