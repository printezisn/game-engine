import gsap from 'gsap';
export class Animation {
    _options;
    _tween = null;
    static rootTimeMs = 0;
    constructor(options) {
        this._options = options;
    }
    get options() {
        return this._options;
    }
    start(target) {
        return new Promise((resolve) => {
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
    static initEngine() {
        gsap.ticker.remove(gsap.updateRoot);
    }
    static updateEngine(delta) {
        this.rootTimeMs += delta;
        gsap.updateRoot(this.rootTimeMs / 1000);
    }
}
