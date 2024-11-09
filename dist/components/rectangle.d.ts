import { Graphics } from 'pixi.js';
import BaseComponent from './base';
import { type BaseProps } from './types';
interface RectangleProps extends BaseProps {
    fillColor: number;
    strokeColor?: number;
    strokeWidth?: number;
}
declare class RectangleComponent extends BaseComponent<Graphics> {
    constructor(props: RectangleProps);
}
export default RectangleComponent;
