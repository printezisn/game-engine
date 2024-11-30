import type { InputProps } from './types';
import ContainerComponent from './container';
import SpriteComponent from './sprite';
import TextComponent from './text';
import config from '../config';

class InputComponent extends ContainerComponent {
  private _input: HTMLInputElement | null = null;
  private _inputEventAbort: AbortController | null = null;
  private _text: string = '';

  constructor(props: InputProps) {
    super({
      ...props,
      interactive: true,
      cursor: 'text',
    });

    const { height } = this.addComponent(
      new SpriteComponent({
        label: 'bg',
        resource: this.props.background,
      }),
    );
    const text = this.addComponent(
      new TextComponent({
        label: 'text',
        position: { x: this.props.padding ?? 0, y: height / 2 },
        anchor: { x: 0, y: 0.5 },
        text: this.props.text ?? '',
        fontFamily: this.props.fontFamily,
        fontSize: this.props.fontSize,
        fontWeight: this.props.fontWeight,
        textColor: this.props.textColor,
        strokeColor: this.props.strokeColor,
        strokeWidth: this.props.strokeWidth,
        letterSpacing: this.props.letterSpacing,
      }),
    );
    this.addComponent(
      new SpriteComponent({
        label: 'caret',
        position: { x: text.x + text.width + 2, y: height / 2 },
        anchor: { x: 0, y: 0.5 },
        visible: false,
        resource: {
          rectangle: {
            x: 0,
            y: 0,
            width: 2,
            height: height - (this.props.padding ?? 0) * 2,
          },
          fillColor: this.props.textColor,
        },
        animations: [
          {
            from: { alpha: 1 },
            to: { alpha: 0 },
            duration: 0.4,
            repeat: -1,
            revert: true,
          },
        ],
      }),
    );

    this._text = this.props.text ?? '';
  }

  get props() {
    return super.props as InputProps;
  }

  get text() {
    return this._text;
  }

  set text(text: string) {
    if (this._text === text) return;

    this._text = text;

    const textComponent = this.getComponent<TextComponent>('text');
    textComponent.text = this._text;

    const caret = this.getComponent<SpriteComponent>('caret');
    caret.x = textComponent.x + textComponent.width + 2;

    this.props.onChange?.(this._text);
    if ((this as any)._onChange) {
      (this as any)._onChange(this._text);
    }
  }

  override destroy() {
    this._removeInput();
    super.destroy();
  }

  protected _onClick() {
    this._createInput();
    setTimeout(() => {
      if (!this._input) return;

      this._input.focus();
      this.getComponent<SpriteComponent>('caret').visible = true;
      setTimeout(() => {
        if (!this._input) return;

        this._input.style.left = '-9999px';
      }, 100);
    }, 100);
  }

  private _createInput() {
    if (this._input) return;

    const canvas = config.gameContainer.querySelector('canvas');
    if (!canvas) return;

    const { x, y } = this.globalPosition;
    const { width, height } = this.getComponent<SpriteComponent>('bg');

    const canvasTop = parseFloat(canvas.style.top);
    const canvasLeft = parseFloat(canvas.style.left);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasStyleWidth = parseFloat(canvas.style.width);
    const canvasStyleHeight = parseFloat(canvas.style.height);

    const screenHorizontalScale = canvasStyleWidth / canvasWidth;
    const screenVerticalScale = canvasStyleHeight / canvasHeight;

    const inputTop = canvasTop + y * screenVerticalScale;
    const inputLeft = canvasLeft + x * screenHorizontalScale;
    const inputHeight = height * screenVerticalScale;
    const inputWidth = width * screenHorizontalScale;

    this._input = document.createElement('input') as HTMLInputElement;
    this._input.type = 'text';
    this._input.value = this.text;
    this._input.style.position = 'fixed';
    this._input.style.top = `${inputTop}px`;
    this._input.style.left = `${inputLeft}px`;
    this._input.style.width = `${inputWidth}px`;
    this._input.style.height = `${inputHeight}px`;
    this._input.style.opacity = '0';

    config.gameContainer.appendChild(this._input);

    this._inputEventAbort = new AbortController();
    this._input.addEventListener('change', this._updateText.bind(this), {
      signal: this._inputEventAbort.signal,
    });
    this._input.addEventListener('keyup', this._updateText.bind(this), {
      signal: this._inputEventAbort.signal,
    });
    this._input.addEventListener('input', this._updateText.bind(this), {
      signal: this._inputEventAbort.signal,
    });
    this._input.addEventListener('blur', this._blur.bind(this), {
      signal: this._inputEventAbort.signal,
    });
  }

  private _blur() {
    this._removeInput();
    this.getComponent<SpriteComponent>('caret').visible = false;
  }

  private _updateText() {
    if (!this._input) return;

    const text = this._input.value.substring(
      0,
      this.props.maxLength ?? this._input.value.length,
    );

    this._input.value = text;
    this.text = text;
  }

  private _removeInput() {
    if (!this._input) return;

    this._inputEventAbort?.abort();
    this._input.remove();
    this._input = null;
    this._inputEventAbort = null;
  }
}

export default InputComponent;
