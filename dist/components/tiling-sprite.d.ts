import { TilingSprite } from 'pixi.js';
import BaseComponent from './base';
import { type BaseSpriteProps, type Point } from './types';
declare class TilingSpriteComponent extends BaseComponent<TilingSprite> {
    constructor(props: BaseSpriteProps);
    get originalWidth(): number;
    get originalHeight(): number;
    get tileScale(): Point;
    set tileScale(scale: Point);
    get tilePosition(): Point;
    set tilePosition(position: Point);
}
export default TilingSpriteComponent;
