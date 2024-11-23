import { BitmapText, Text, type TextOptions } from 'pixi.js';
import BaseComponent from './base';
import { type TextProps, type Point } from './types';
import { basePropsToConfig } from './helpers';

class TextComponent extends BaseComponent<Text | BitmapText> {
  constructor(props: TextProps) {
    const options: TextOptions = {
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

  get anchor(): Point {
    return this.object.anchor;
  }

  set anchor(anchor: Point | number) {
    this.object.anchor = anchor;
  }

  get fontSize() {
    return this.object.style.fontSize;
  }

  set fontSize(fontSize: number) {
    this.object.style.fontSize = fontSize;
  }

  get wordWrapWidth(): number {
    return this.object.style.wordWrapWidth;
  }

  set wordWrapWidth(width: number) {
    this.object.style.wordWrapWidth = width;
  }

  get text() {
    return this.object.text;
  }

  set text(text: string) {
    this.object.text = text;
  }
}

export default TextComponent;
