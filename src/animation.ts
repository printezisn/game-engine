import gsap from 'gsap';

export interface AnimationOptions {
  name?: string;
  from: any;
  to: any;
  duration: number;
  repeat?: number;
  revert?: boolean;
  ease?: string;
  delay?: number;
  repeatDelay?: number;
}

export class Animation {
  private _options: AnimationOptions;
  private _tween: gsap.core.Tween | null = null;

  private static _rootTimeMs = 0;

  constructor(options: AnimationOptions) {
    this._options = options;
  }

  get options() {
    return this._options;
  }

  get name() {
    return this._options.name;
  }

  start(target: any) {
    return new Promise<void>((resolve) => {
      this._tween = gsap.fromTo(target, this.options.from, {
        ...this.options.to,
        onComplete: () => resolve(),
        duration: this.options.duration,
        repeat: this.options.repeat,
        yoyo: this.options.revert,
        ease: this.options.ease,
        delay: this.options.delay,
        repeatDelay: this.options.repeatDelay,
      });
      this._tween.play();
    });
  }

  stop() {
    this._tween?.kill();
  }

  pause() {
    this._tween?.pause();
  }

  resume() {
    this._tween?.resume();
  }

  finish() {
    this._tween?.progress(1);
  }

  static initEngine() {
    gsap.ticker.remove(gsap.updateRoot);
  }

  static updateEngine(delta: number) {
    this._rootTimeMs += delta;
    gsap.updateRoot(this._rootTimeMs / 1000);
  }
}
