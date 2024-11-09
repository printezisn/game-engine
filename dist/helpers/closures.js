export const debounce = (callback, timeMs = 500) => {
    let timerId = null;
    return () => {
        if (timerId !== null) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            timerId = null;
            callback();
        }, timeMs);
    };
};
