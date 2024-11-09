interface PlaySoundOptions {
    loop?: boolean;
    volume?: number;
}
interface FadeInSoundOptions {
    fromVolume?: number;
    toVolume?: number;
    fadeDuration: number;
    loop?: boolean;
}
interface FadeOutSoundOptions {
    fadeDuration: number;
}
export declare const initSound: () => void;
export declare const playSound: (name: string, options?: PlaySoundOptions) => Promise<void>;
export declare const fadeInSound: (name: string, options: FadeInSoundOptions) => Promise<void>;
export declare const stopSound: (name: string) => void;
export declare const fadeOutSound: (name: string, options: FadeOutSoundOptions) => Promise<void>;
export declare const setMute: (muted: boolean) => void;
export {};
