import { type BaseScene } from './scenes';
interface GameState {
    screen: {
        orientation: 'landscape' | 'portrait';
        width: number;
        height: number;
    };
    scene: BaseScene | null;
    muted: boolean;
}
declare const gameState: GameState;
export default gameState;
