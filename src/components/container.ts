import { Container } from 'pixi.js';
import BaseComponent from './base';
import { type ContainerProps, type DisplayObject } from './types';
import gameState from '../game-state';
import { basePropsToConfig } from './helpers';

class ContainerComponent extends BaseComponent<Container> {
  private _components: DisplayObject[] = [];

  constructor(props: ContainerProps) {
    super(
      new Container({
        ...basePropsToConfig(props),
        sortableChildren: props.sortableChildren,
      }),
      props,
    );

    this.addComponents(props.components ?? []);
  }

  get components(): DisplayObject[] {
    return this._components;
  }

  get sortableChildren() {
    return this.object.sortableChildren;
  }

  set sortableChildren(sortableChildren: boolean) {
    this.object.sortableChildren = sortableChildren;
  }

  addComponent<T extends DisplayObject>(component: T) {
    this.components.push(component);
    this.object.addChild(component.object);
    component.parent = this;

    return component;
  }

  addComponents(components: DisplayObject[]) {
    components.forEach((component) => this.addComponent(component));
  }

  getComponent<T extends DisplayObject>(label: string) {
    return this.components.find((component) => component.label === label) as T;
  }

  removeComponent(component: DisplayObject) {
    const index = this.components.indexOf(component);
    if (index >= 0) {
      this.components[index].parent = null;
      this.components[index].destroy();
      this.components.splice(index, 1);
    }
  }

  removeComponents() {
    this.components.forEach((component) => {
      component.parent = null;
      component.destroy();
    });
    this._components = [];
  }

  destroy() {
    this.removeComponents();
    super.destroy();
  }

  protected _positionToScreen() {
    if (this.props.horizontalAlignment === 'center') {
      this.x =
        (gameState.screen.width - (this.props.width ?? 0)) / 2 +
        (this.props.margin?.x ?? 0);
    } else if (this.props.horizontalAlignment === 'right') {
      this.x =
        gameState.screen.width -
        (this.props.width ?? 0) +
        (this.props.margin?.x ?? 0);
    }

    if (this.props.verticalAlignment === 'center') {
      this.y =
        (gameState.screen.height - (this.props.height ?? 0)) / 2 +
        (this.props.margin?.y ?? 0);
    } else if (this.props.verticalAlignment === 'bottom') {
      this.y =
        gameState.screen.height -
        (this.props.height ?? 0) +
        (this.props.margin?.y ?? 0);
    }
  }
}

export default ContainerComponent;
