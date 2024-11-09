import gameState from '../game-state';
import { setMute } from '../sound';
import ButtonComponent from './button';
class VolumeButtonComponent extends ButtonComponent {
    constructor(props) {
        super(props);
        if (gameState.muted) {
            this.texture = this.props.mutedResource;
        }
    }
    get props() {
        return super.props;
    }
    get defaultResource() {
        if (gameState.muted)
            return this.props.mutedResource;
        return super.defaultResource;
    }
    get hoverResource() {
        if (gameState.muted)
            return this.props.mutedHoverResource;
        return super.hoverResource;
    }
    async onClick() {
        super.onClick();
        localStorage.setItem('muted', gameState.muted ? 'false' : 'true');
        gameState.muted = !gameState.muted;
        setMute(gameState.muted);
    }
}
export default VolumeButtonComponent;
