import { Sprite, Texture } from 'pixi.js';
import BaseComponent from './base';
import { basePropsToConfig } from './types';
class SpriteComponent extends BaseComponent {
    constructor(props) {
        super(new Sprite({
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
    set texture(resource) {
        this.object.texture = Texture.from(resource);
    }
}
export default SpriteComponent;
