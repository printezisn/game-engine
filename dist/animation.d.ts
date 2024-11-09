export interface AnimationOptions {
    from: any;
    to: any;
    duration: number;
    repeat?: number;
    revert?: boolean;
    ease?: string;
    delay?: number;
    repeatDelay?: number;
}
export declare class Animation {
    private _options;
    private _tween;
    private static rootTimeMs;
    constructor(options: AnimationOptions);
    get options(): AnimationOptions;
    start(target: any): Promise<void>;
    stop(): void;
    pause(): void;
    resume(): void;
    static initEngine(): void;
    static updateEngine(delta: number): void;
}
