declare const resize: (container: HTMLElement, canvas: HTMLCanvasElement, desiredWidth: number, desiredHeight: number) => {
    width: number;
    height: number;
    orientation: "portrait" | "landscape";
};
export default resize;
