const gameState = {
    screen: {
        orientation: 'landscape',
        width: 0,
        height: 0,
    },
    scene: null,
    muted: localStorage.getItem('muted') === 'true',
};
export default gameState;
