import config from '../config';
import { playSound } from '../sound';
import SpriteComponent from './sprite';
import { type ButtonProps } from './types';

class ButtonComponent extends SpriteComponent {
  private _pointerOver = false;
  private _enabled = true;

  constructor(props: ButtonProps) {
    super(props);
  }

  get props() {
    return super.props as ButtonProps;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(enabled: boolean) {
    if (this._enabled !== enabled) {
      this._enabled = enabled;
      this._setCurrentTexture();
    }
  }

  get pointerOver() {
    return this._pointerOver;
  }

  protected _onPointerEnter() {
    this._pointerOver = true;
    this._setCurrentTexture();
  }

  protected _onPointerOut() {
    this._pointerOver = false;
    this._setCurrentTexture();
  }

  protected async _onClick() {
    playSound(config.sounds.click);
    this.texture = this.enabled
      ? this.props.resource
      : this.props.disabledResource;
    await this.delay(0.1);
    this._setCurrentTexture();
  }

  protected _setCurrentTexture() {
    if (!this.enabled) {
      this.texture = this.props.disabledResource;
    } else if (this.pointerOver) {
      this.texture = this.props.hoverResource;
    } else {
      this.texture = this.props.resource;
    }
  }
}

export default ButtonComponent;
