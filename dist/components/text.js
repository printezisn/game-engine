import { BitmapText, Text } from 'pixi.js';
import BaseComponent from './base';
import { basePropsToConfig } from './types';
class TextComponent extends BaseComponent {
    constructor(props) {
        const options = {
            ...basePropsToConfig(props),
            text: props.text,
            style: {
                fontFamily: props.fontFamily,
                fontSize: props.fontSize,
                fill: props.textColor,
                lineHeight: props.lineHeight,
                wordWrap: props.wordWrap,
                wordWrapWidth: props.wordWrapWidth,
                align: props.align,
                stroke: props.strokeColor && {
                    color: props.strokeColor,
                    width: props.strokeWidth,
                },
            },
        };
        super(props.bitmap ? new BitmapText(options) : new Text(options), props);
    }
    get anchor() {
        return this.object.anchor;
    }
    set anchor(anchor) {
        this.object.anchor = anchor;
    }
    get fontSize() {
        return this.object.style.fontSize;
    }
    set fontSize(fontSize) {
        this.object.style.fontSize = fontSize;
    }
    get wordWrapWidth() {
        return this.object.style.wordWrapWidth;
    }
    set wordWrapWidth(width) {
        this.object.style.wordWrapWidth = width;
    }
    get text() {
        return this.object.text;
    }
    set text(text) {
        this.object.text = text;
    }
}
export default TextComponent;
