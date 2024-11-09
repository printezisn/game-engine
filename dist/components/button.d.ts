import SpriteComponent from './sprite';
import type { BaseSpriteProps } from './types';
interface ButtonProps extends BaseSpriteProps {
    hoverResource: string;
}
declare class ButtonComponent extends SpriteComponent {
    private _pointerOver;
    constructor(props: ButtonProps);
    get props(): ButtonProps;
    protected get defaultResource(): string;
    protected get hoverResource(): string;
    protected onPointerEnter(): void;
    protected onPointerOut(): void;
    protected onClick(): Promise<void>;
}
export default ButtonComponent;
