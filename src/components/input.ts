import { Input } from '@pixi/ui';
import BaseComponent from './base';
import type { InputProps } from './types';
import { basePropsToConfig } from './helpers';
import { Sprite } from 'pixi.js';
import { getTexture } from '../textures';

class InputComponent extends BaseComponent<Input> {
  constructor(props: InputProps) {
    super(
      new Input({
        ...basePropsToConfig(props),
        value: props.text,
        bg: Sprite.from(getTexture(props.background)),
        align: props.align,
        padding: props.padding,
        maxLength: props.maxLength,
        placeholder: props.placeholder,
        textStyle: {
          fontFamily: props.fontFamily,
          fontSize: props.fontSize,
          fill: props.textColor,
          fontWeight: props.fontWeight ?? 'normal',
          stroke: props.strokeColor && {
            color: props.strokeColor,
            width: props.strokeWidth,
          },
        },
      }),
      props,
    );

    if (props.onChange) {
      this.object.on('change', props.onChange);
    }
  }

  get text() {
    return this.object.value;
  }

  set text(text: string) {
    this.object.value = text;
  }
}

export default InputComponent;
