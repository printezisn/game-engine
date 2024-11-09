import TilingBackgroundComponent from './tiling-background';
class MovingBackgroundComponent extends TilingBackgroundComponent {
    constructor(props) {
        super(props);
    }
    onTick() {
        this.tilePosition.x--;
    }
}
export default MovingBackgroundComponent;
