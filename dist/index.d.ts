import { AssetsManifest } from 'pixi.js';
import { BitmapText } from 'pixi.js';
import { Container } from 'pixi.js';
import { Graphics } from 'pixi.js';
import { Sprite } from 'pixi.js';
import { Text as Text_2 } from 'pixi.js';
import { TilingSprite } from 'pixi.js';

export declare const addPhysicalEntity: (entity: PhysicalEntity) => void;

export declare const addSignalListener: (name: string, callback: (...args: any[]) => void) => {
    name: string;
    binding: any;
};

declare class Animation_2 {
    private _options;
    private _tween;
    private static _rootTimeMs;
    constructor(options: AnimationOptions);
    get options(): AnimationOptions;
    start(target: any): Promise<void>;
    stop(): void;
    pause(): void;
    resume(): void;
    static initEngine(): void;
    static updateEngine(delta: number): void;
}
export { Animation_2 as Animation }

export declare interface AnimationOptions {
    from: any;
    to: any;
    duration: number;
    repeat?: number;
    revert?: boolean;
    ease?: string;
    delay?: number;
    repeatDelay?: number;
}

declare interface Asset {
    alias: string;
    src: string;
    data?: any;
}

export declare abstract class BaseComponent<T extends Container> implements DisplayObject {
    private _props;
    private _object;
    private _parent;
    private _bindings;
    private _animations;
    constructor(object: T, props: BaseProps);
    protected _registerToSignal(name: string, callback: (...args: any[]) => void): void;
    protected _unregisterFromSignal(name: string): void;
    get props(): BaseProps;
    get object(): T;
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get position(): Point;
    set position(position: Point);
    get globalPosition(): Point;
    set scale(scale: Point);
    get scale(): Point;
    get scaleX(): number;
    set scaleX(x: number);
    get scaleY(): number;
    set scaleY(y: number);
    get width(): number;
    set width(width: number);
    get height(): number;
    set height(height: number);
    get alpha(): number;
    set alpha(alpha: number);
    get visible(): boolean;
    set visible(visible: boolean);
    get label(): string;
    get parent(): ContainerComponent | null;
    set parent(container: ContainerComponent | null);
    get interactive(): boolean;
    set interactive(interactive: boolean);
    get rotation(): number;
    set rotation(rotation: number);
    get tint(): number;
    set tint(tint: number);
    get zIndex(): number;
    set zIndex(zIndex: number);
    set hitArea(hitArea: HitArea | null | undefined);
    animate(options: AnimationOptions): Promise<void>;
    stopAnimations(): void;
    delay(duration: number): Promise<void>;
    destroy(): void;
    protected _positionToScreen(): void;
    private _createAnimation;
}

export declare interface BaseProps {
    label: string;
    position?: Point;
    anchor?: Point;
    scale?: Point;
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
    hitArea?: HitArea;
}

export declare class BaseScene extends ContainerComponent {
    constructor();
    init(): Promise<void>;
}

export declare class ButtonComponent extends SpriteComponent {
    private _pointerOver;
    private _enabled;
    constructor(props: ButtonProps);
    get props(): ButtonProps;
    get enabled(): boolean;
    set enabled(enabled: boolean);
    get pointerOver(): boolean;
    protected _onPointerEnter(): void;
    protected _onPointerOut(): void;
    protected _onClick(): Promise<void>;
    protected _setCurrentTexture(): void;
}

export declare interface ButtonProps extends SpriteProps {
    hoverResource: string;
    disabledResource: string;
}

export declare const changeScene: (newScene: BaseScene) => Promise<void>;

export declare interface Circle {
    x: number;
    y: number;
    radius: number;
}

declare interface Circle_2 {
    x: number;
    y: number;
    radius: number;
}

export declare class ContainerComponent extends BaseComponent<Container> {
    private _components;
    constructor(props: ContainerProps);
    get components(): DisplayObject[];
    get sortableChildren(): boolean;
    set sortableChildren(sortableChildren: boolean);
    addComponent<T extends DisplayObject>(component: T): T;
    removeComponent(component: DisplayObject): void;
    removeComponents(): void;
    destroy(): void;
    protected _positionToScreen(): void;
}

export declare interface ContainerProps extends BaseProps {
    sortableChildren?: boolean;
}

export declare class CreditsButtonComponent extends ButtonComponent {
    protected _onClick(): Promise<void>;
}

export declare const debounce: (startCallback: () => void, cancelCallback: () => void, startWaitTime?: number, cancelWaitTime?: number) => {
    start: () => void;
    cancel: () => void;
};

export declare interface DisplayObject {
    get object(): Container;
    set parent(parent: DisplayObject | null);
    get label(): string;
    set visible(visible: boolean);
    get visible(): boolean;
    get position(): Point;
    destroy(): void;
}

export declare const engineConfig: {
    gameName: string;
    gameContainer: HTMLElement;
    maxFPS: number;
    debug: boolean;
    assets: {
        basePath: string;
        manifest: AssetsManifest;
        extra: Asset[];
    };
    colors: {
        backgroundColor: string;
    };
    screen: {
        width: number;
        aspectRatio: number;
    };
    tickIntervalMillis: number;
    loadingScene: {
        fontFamily: string;
        fontSize: number;
        textColor: number;
        keepAliveTimeMS: number;
    };
    signals: {
        onResize: string;
        onOrientationChange: string;
        onTick: string;
        destroyLoadingScene: string;
        showCredits: string;
    };
    sounds: {
        click: string;
    };
};

export declare const engineGameState: GameState;

export declare const fadeInSound: (name: string, options: FadeInSoundOptions) => Promise<void>;

declare interface FadeInSoundOptions {
    fromVolume?: number;
    toVolume?: number;
    fadeDuration: number;
    loop?: boolean;
}

export declare const fadeOutSound: (name: string, options: FadeOutSoundOptions) => Promise<void>;

declare interface FadeOutSoundOptions {
    fadeDuration: number;
}

export declare const fireSignal: (name: string, ...args: any[]) => void;

declare interface GameState {
    screen: {
        orientation: 'landscape' | 'portrait';
        width: number;
        height: number;
    };
    scene: BaseScene | null;
    muted: boolean;
}

export declare const getRandomInt: (min: number, max: number) => number;

export declare interface HitArea {
    circle?: Circle;
    rectangle?: Rectangle;
    polygon?: Polygon;
}

export declare const initGame: () => Promise<void>;

export declare const initPhysicsEngine: () => void;

export declare const initSound: () => void;

declare interface LinearMovement {
    velocity: Velocity;
}

export declare class LoadingScene extends BaseScene {
    init(): Promise<void>;
}

declare interface Movement {
    linearMovement?: LinearMovement;
}

export declare const movePhysicalEntity: (target: Target, x: number, y: number) => void;

export declare class MovingBackgroundComponent extends TilingBackgroundComponent {
    protected _onTick(): void;
}

declare interface PhysicalEntity {
    target: Target;
    rectangle?: Rectangle_2;
    circle?: Circle_2;
    surface?: boolean;
    movement?: Movement;
    onUpdatePosition?: (x: number, y: number, onGround: boolean) => any;
    onCollision?: (entity: DisplayObject) => any;
}

export declare const playSound: (name: string, options?: PlaySoundOptions) => Promise<void>;

declare interface PlaySoundOptions {
    loop?: boolean;
    volume?: number;
}

export declare interface Point {
    x: number;
    y: number;
}

export declare interface Polygon {
    points: Point[];
}

export declare interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius?: number;
}

declare interface Rectangle_2 {
    x: number;
    y: number;
    width: number;
    height: number;
}

export declare class RectangleComponent extends BaseComponent<Graphics> {
    constructor(props: RectangleProps);
}

declare interface RectangleProps extends BaseProps {
    fillColor: number;
    strokeColor?: number;
    strokeWidth?: number;
}

export declare const removePhysicalEntity: (target: Target) => void;

export declare const removeSignalListener: (name: string, binding: any) => void;

export declare const setMovement: (target: Target, movement: Movement) => void;

export declare const setMute: (muted: boolean) => void;

export declare class SpriteComponent extends BaseComponent<Sprite> {
    constructor(props: SpriteProps);
    get anchor(): Point;
    set anchor(anchor: Point);
    get originalWidth(): number;
    get originalHeight(): number;
    set texture(resource: string);
}

export declare interface SpriteProps extends BaseProps {
    resource: string;
}

export declare const stopSound: (name: string) => void;

declare type Target = DisplayObject & {
    matterBody?: Matter.Body;
};

export declare class TextComponent extends BaseComponent<Text_2 | BitmapText> {
    constructor(props: TextProps);
    get anchor(): Point;
    set anchor(anchor: Point);
    get fontSize(): number;
    set fontSize(fontSize: number);
    get wordWrapWidth(): number;
    set wordWrapWidth(width: number);
    get text(): string;
    set text(text: string);
}

export declare interface TextProps extends BaseProps {
    text: string;
    fontFamily: string;
    fontSize: number;
    textColor: number;
    strokeColor?: number;
    strokeWidth?: number;
    lineHeight?: number;
    wordWrap?: boolean;
    wordWrapWidth?: number;
    align?: 'left' | 'center' | 'right' | 'justify';
    bitmap?: boolean;
}

export declare class TilingBackgroundComponent extends TilingSpriteComponent {
    constructor(props: SpriteProps);
    protected _onResize(): void;
}

export declare class TilingSpriteComponent extends BaseComponent<TilingSprite> {
    constructor(props: SpriteProps);
    get anchor(): Point;
    set anchor(anchor: Point);
    get originalWidth(): number;
    get originalHeight(): number;
    get tileScale(): Point;
    set tileScale(scale: Point);
    get tilePosition(): Point;
    set tilePosition(position: Point);
}

export declare const updatePhysics: (interval: number) => void;

declare interface Velocity {
    x: number;
    y: number;
}

export declare class VolumeButtonComponent extends ButtonComponent {
    private _originalProps;
    constructor(props: VolumeButtonProps);
    get props(): VolumeButtonProps;
    protected _onClick(): Promise<void>;
    private _setResources;
}

export declare interface VolumeButtonProps extends ButtonProps {
    mutedResource: string;
    mutedHoverResource: string;
    mutedDisabledResource: string;
}

export { }
