import ButtonComponent from './button';
import type { BaseSpriteProps } from './types';
interface VolumeButtonProps extends BaseSpriteProps {
    hoverResource: string;
    mutedResource: string;
    mutedHoverResource: string;
}
declare class VolumeButtonComponent extends ButtonComponent {
    constructor(props: VolumeButtonProps);
    get props(): VolumeButtonProps;
    protected get defaultResource(): string;
    protected get hoverResource(): string;
    protected onClick(): Promise<void>;
}
export default VolumeButtonComponent;
