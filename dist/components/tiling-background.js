import gameState from '../game-state';
import TilingSpriteComponent from './tiling-sprite';
class TilingBackgroundComponent extends TilingSpriteComponent {
    constructor(props) {
        super(props);
        this.onResize();
    }
    onResize() {
        this.width = gameState.screen.width;
        this.height = gameState.screen.height;
        const heightScale = gameState.screen.height / this.originalHeight;
        this.tileScale = { x: heightScale, y: heightScale };
    }
}
export default TilingBackgroundComponent;
