import TilingBackgroundComponent from './tiling-background';

class MovingBackgroundComponent extends TilingBackgroundComponent {
  protected _onTick() {
    this.tilePosition.x--;
  }
}

export default MovingBackgroundComponent;
