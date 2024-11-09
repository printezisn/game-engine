import { BitmapText, Text } from 'pixi.js';
import BaseComponent from './base';
import { type BaseTextProps, type Point } from './types';
declare class TextComponent extends BaseComponent<Text | BitmapText> {
    constructor(props: BaseTextProps);
    get anchor(): Point;
    set anchor(anchor: Point);
    get fontSize(): number;
    set fontSize(fontSize: number);
    get wordWrapWidth(): number;
    set wordWrapWidth(width: number);
    get text(): string;
    set text(text: string);
}
export default TextComponent;
