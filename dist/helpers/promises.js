export const timeout = (timeMs) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeMs);
    });
};
