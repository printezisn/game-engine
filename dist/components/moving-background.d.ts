import TilingBackgroundComponent from './tiling-background';
import type { BaseSpriteProps } from './types';
declare class MovingBackgroundComponent extends TilingBackgroundComponent {
    constructor(props: BaseSpriteProps);
    protected onTick(): void;
}
export default MovingBackgroundComponent;
