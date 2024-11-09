import TilingSpriteComponent from './tiling-sprite';
import type { BaseSpriteProps } from './types';
declare class TilingBackgroundComponent extends TilingSpriteComponent {
    constructor(props: BaseSpriteProps);
    protected onResize(): void;
}
export default TilingBackgroundComponent;
