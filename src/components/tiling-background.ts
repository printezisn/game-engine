import gameState from '../game-state';
import TilingSpriteComponent from './tiling-sprite';
import type { SpriteProps } from './types';

class TilingBackgroundComponent extends TilingSpriteComponent {
  constructor(props: SpriteProps) {
    super(props);

    this._onResize();
  }

  protected _onResize() {
    this.width = gameState.screen.width;
    this.height = gameState.screen.height;

    const heightScale = gameState.screen.height / this.originalHeight;
    this.tileScale = { x: heightScale, y: heightScale };
  }
}

export default TilingBackgroundComponent;
