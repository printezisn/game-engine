import type { AssetsManifest } from 'pixi.js';
interface Asset {
    alias: string;
    src: string;
    data?: any;
}
declare const config: {
    gameName: string;
    gameContainer: HTMLElement;
    maxFPS: number;
    debug: boolean;
    assets: {
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
export default config;
