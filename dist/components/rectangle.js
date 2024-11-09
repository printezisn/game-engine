import { Graphics } from 'pixi.js';
import BaseComponent from './base';
import { basePropsToConfig } from './types';
class RectangleComponent extends BaseComponent {
    constructor(props) {
        const config = basePropsToConfig(props);
        delete config.position;
        let component = new Graphics(config)
            .rect(props.position?.x ?? 0, props.position?.y ?? 0, props.width ?? 0, props.height ?? 0)
            .fill(props.fillColor);
        if (props.strokeColor != null) {
            component = component.stroke({
                color: props.strokeColor,
                width: props.strokeWidth ?? 1,
            });
        }
        super(component, props);
    }
}
export default RectangleComponent;