import type { Container } from 'pixi.js';

export interface DisplayObject {
  get object(): Container;
  set parent(parent: DisplayObject | null);
  get label(): string;
  set visible(visible: boolean);
  get visible(): boolean;
  get position(): Point;
  destroy(): void;
}

export interface Point {
  x: number;
  y: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoundedRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
}

export interface Polygon {
  points: Point[];
}

export interface Shape {
  circle?: Circle;
  rectangle?: Rectangle;
  roundedRectangle?: RoundedRectangle;
  polygon?: Polygon;
}

export interface FilledShape extends Shape {
  fillColor: number;
  strokeColor?: number;
  strokeWidth?: number;
}

export interface BaseProps {
  label: string;
  position?: Point;
  anchor?: Point | number;
  scale?: Point | number;
  rotation?: number;
  width?: number;
  height?: number;
  alpha?: number;
  horizontalAlignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  margin?: Point;
  interactive?: boolean;
  cursor?: string;
  visible?: boolean;
  tint?: number;
  zIndex?: number;
  hitArea?: Shape;
  landscape?: any;
  portrait?: any;
  onResize?: (component: DisplayObject) => any;
  onOrientationChange?: (component: DisplayObject) => any;
  onClick?: (component: DisplayObject) => any;
  onPointerUp?: (component: DisplayObject) => any;
  onPointerEnter?: (component: DisplayObject) => any;
  onPointerOut?: (component: DisplayObject) => any;
  onTick?: (component: DisplayObject) => any;
}

export interface SpriteProps extends BaseProps {
  resource: Resource;
}

export interface ButtonProps extends SpriteProps {
  hoverResource: Resource;
  disabledResource: Resource;
}

export interface VolumeButtonProps extends ButtonProps {
  mutedResource: Resource;
  mutedHoverResource: Resource;
  mutedDisabledResource: Resource;
}

export interface LinkButtonProps extends ButtonProps {
  url: string;
}

export type FontWeight = 'normal' | 'bold';
export type FontStyle = 'normal' | 'italic';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface TextProps extends BaseProps {
  text: string;
  fontFamily: string;
  fontSize: number;
  textColor: number;
  strokeColor?: number;
  strokeWidth?: number;
  lineHeight?: number;
  wordWrap?: boolean;
  wordWrapWidth?: number;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  align?: TextAlign;
  bitmap?: boolean;
}

export interface ContainerProps extends BaseProps {
  sortableChildren?: boolean;
  components?: DisplayObject[];
}

export type Resource = string | FilledShape;
