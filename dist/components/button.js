import config from '../config';
import { playSound } from '../sound';
import SpriteComponent from './sprite';
class ButtonComponent extends SpriteComponent {
    _pointerOver = false;
    constructor(props) {
        super(props);
    }
    get props() {
        return super.props;
    }
    get defaultResource() {
        return this.props.resource;
    }
    get hoverResource() {
        return this.props.hoverResource;
    }
    onPointerEnter() {
        this.texture = this.hoverResource;
        this._pointerOver = true;
    }
    onPointerOut() {
        this.texture = this.defaultResource;
        this._pointerOver = false;
    }
    async onClick() {
        playSound(config.sounds.click);
        this.texture = this.defaultResource;
        await this.delay(0.1);
        if (this._pointerOver) {
            this.texture = this.hoverResource;
        }
    }
}
export default ButtonComponent;
