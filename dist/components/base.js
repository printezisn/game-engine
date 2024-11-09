import { addSignalListener, removeSignalListener } from '../signals';
import config from '../config';
import { Animation } from '../animation';
import gameState from '../game-state';
import { removePhysicalEntity } from '../physics-engine';
class BaseComponent {
    _props;
    _object;
    _parent = null;
    _bindings = [];
    _animations = [];
    constructor(object, props) {
        this._props = props;
        this._object = object;
        if (this.props.horizontalAlignment || this.props.verticalAlignment) {
            this.registerToSignal(config.signals.onResize, this.positionToScreen);
        }
        if (this.onResize) {
            this.registerToSignal(config.signals.onResize, this.onResize);
        }
        if (this.onOrientationChange) {
            this.registerToSignal(config.signals.onOrientationChange, this.onOrientationChange);
        }
        if (this.onTick) {
            this.registerToSignal(config.signals.onTick, this.onTick);
        }
        if (this.onClick) {
            this.object.on('pointerdown', (e) => {
                e.stopImmediatePropagation();
                this.onClick();
            });
        }
        if (this.onPointerUp) {
            this.object.on('pointerup', (e) => {
                e.stopImmediatePropagation();
                this.onPointerUp();
            });
        }
        if (this.onPointerEnter) {
            this.object.on('pointerenter', () => {
                this.onPointerEnter();
            });
        }
        if (this.onPointerOut) {
            this.object.on('pointerout', () => {
                this.onPointerOut();
            });
        }
        this.positionToScreen();
    }
    registerToSignal(name, callback) {
        this._bindings.push(addSignalListener(name, callback.bind(this)));
    }
    unregisterFromSignal(name) {
        for (let i = 0; i < this._bindings.length; i++) {
            if (this._bindings[i].name === name) {
                removeSignalListener(name, this._bindings[i].binding);
                this._bindings.splice(i, 1);
                i--;
            }
        }
    }
    get props() {
        return this._props;
    }
    get object() {
        return this._object;
    }
    get x() {
        return this.object.x;
    }
    set x(x) {
        this.object.x = x;
    }
    get y() {
        return this.object.y;
    }
    set y(y) {
        this.object.y = y;
    }
    get position() {
        return this.object.position;
    }
    set position(position) {
        this.object.position = position;
    }
    get globalPosition() {
        return this.object.toGlobal(this.position);
    }
    set scale(scale) {
        this.object.scale = scale;
    }
    get scale() {
        return this.object.scale;
    }
    get scaleX() {
        return this.object.scale.x;
    }
    set scaleX(x) {
        this.object.scale.x = x;
    }
    get scaleY() {
        return this.object.scale.y;
    }
    set scaleY(y) {
        this.object.scale.y = y;
    }
    get width() {
        return this.object.width;
    }
    set width(width) {
        this.object.width = width;
    }
    get height() {
        return this.object.height;
    }
    set height(height) {
        this.object.height = height;
    }
    get alpha() {
        return this.object.alpha;
    }
    set alpha(alpha) {
        this.object.alpha = alpha;
    }
    get visible() {
        return this.object.visible;
    }
    set visible(visible) {
        this.object.visible = visible;
    }
    get label() {
        return this.object.label;
    }
    get parent() {
        return this._parent;
    }
    set parent(container) {
        this._parent = container;
    }
    get interactive() {
        return this.object.interactive ?? false;
    }
    set interactive(interactive) {
        this.object.interactive = interactive;
    }
    get rotation() {
        return this.object.rotation;
    }
    set rotation(rotation) {
        this.object.rotation = rotation;
    }
    get tint() {
        return this.object.tint;
    }
    set tint(tint) {
        this.object.tint = tint;
    }
    animate(options) {
        return this._createAnimation(this, options);
    }
    stopAnimations() {
        this._animations.forEach((animation) => animation.stop());
        this._animations = [];
    }
    delay(duration) {
        return this._createAnimation({ x: 0 }, {
            from: { x: 0 },
            to: { x: 1 },
            duration,
        });
    }
    destroy() {
        if (this.parent) {
            this.parent.removeComponent(this);
            return;
        }
        removePhysicalEntity(this);
        this._bindings.forEach(({ name, binding }) => removeSignalListener(name, binding));
        this._bindings = [];
        this.stopAnimations();
        this.parent = null;
        this.object.destroy();
    }
    positionToScreen() {
        if (this.props.horizontalAlignment === 'center') {
            this.x = gameState.screen.width / 2 + (this.props.margin?.x ?? 0);
        }
        else if (this.props.horizontalAlignment === 'right') {
            this.x = gameState.screen.width + (this.props.margin?.x ?? 0);
        }
        if (this.props.verticalAlignment === 'center') {
            this.y = gameState.screen.height / 2 + (this.props.margin?.y ?? 0);
        }
        else if (this.props.verticalAlignment === 'bottom') {
            this.y = gameState.screen.height + (this.props.margin?.y ?? 0);
        }
    }
    async _createAnimation(target, options) {
        const animation = new Animation(options);
        this._animations.push(animation);
        await animation.start(target);
        const index = this._animations.indexOf(animation);
        this._animations.splice(index, 1);
    }
}
export default BaseComponent;
