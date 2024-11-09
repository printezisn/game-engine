import { Texture, TilingSprite } from 'pixi.js';
import BaseComponent from './base';
import { basePropsToConfig } from './types';
class TilingSpriteComponent extends BaseComponent {
    constructor(props) {
        super(new TilingSprite({
            ...basePropsToConfig(props),
            texture: Texture.from(props.resource),
        }), props);
    }
    get originalWidth() {
        return this.object.texture.width;
    }
    get originalHeight() {
        return this.object.texture.height;
    }
    get tileScale() {
        return this.object.tileScale;
    }
    set tileScale(scale) {
        this.object.tileScale = scale;
    }
    get tilePosition() {
        return this.object.tilePosition;
    }
    set tilePosition(position) {
        this.object.tilePosition = position;
    }
}
export default TilingSpriteComponent;
