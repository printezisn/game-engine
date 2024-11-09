import { Sprite } from 'pixi.js';
import BaseComponent from './base';
import { type BaseSpriteProps } from './types';
declare class SpriteComponent extends BaseComponent<Sprite> {
    constructor(props: BaseSpriteProps);
    get originalWidth(): number;
    get originalHeight(): number;
    set texture(resource: string);
}
export default SpriteComponent;
