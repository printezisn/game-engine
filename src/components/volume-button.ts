import gameState from '../game-state';
import { setMute } from '../sound';
import ButtonComponent from './button';
import { type VolumeButtonProps } from './types';

class VolumeButtonComponent extends ButtonComponent {
  private _originalProps: VolumeButtonProps;

  constructor(props: VolumeButtonProps) {
    super(props);

    this._originalProps = structuredClone(props);
    this._setResources();
  }

  get props() {
    return super.props as VolumeButtonProps;
  }

  protected async _onClick() {
    super._onClick();

    localStorage.setItem('muted', gameState.muted ? 'false' : 'true');
    gameState.muted = !gameState.muted;
    setMute(gameState.muted);

    this._setResources();
  }

  private _setResources() {
    if (gameState.muted) {
      this.props.resource = this._originalProps.mutedResource;
      this.props.hoverResource = this._originalProps.mutedHoverResource;
      this.props.disabledResource = this._originalProps.mutedDisabledResource;
    } else {
      this.props.resource = this._originalProps.resource;
      this.props.hoverResource = this._originalProps.hoverResource;
      this.props.disabledResource = this._originalProps.disabledResource;
    }

    this._setCurrentTexture();
  }
}

export default VolumeButtonComponent;
