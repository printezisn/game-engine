import { Container } from 'pixi.js';
import BaseComponent from './base';
import { type BaseProps, type DisplayObject } from './types';
declare class ContainerComponent extends BaseComponent<Container> {
    private _components;
    constructor(props: BaseProps);
    private set components(value);
    get components(): DisplayObject[];
    addComponent<T extends DisplayObject>(component: T): T;
    removeComponent(component: DisplayObject): void;
    removeComponents(): void;
    destroy(): void;
    positionToScreen(): void;
}
export default ContainerComponent;
