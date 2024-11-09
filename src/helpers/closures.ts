export const debounce = (callback: () => void, timeMs = 500) => {
  let timerId: number | null = null;

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
