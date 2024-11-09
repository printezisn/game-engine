import { MiniSignal } from 'mini-signals';
const signals = new Map();
export const addSignalListener = (name, callback) => {
    let signal = signals.get(name);
    if (!signal) {
        signal = new MiniSignal();
        signals.set(name, signal);
    }
    return { name, binding: signal.add(callback) };
};
export const removeSignalListener = (name, binding) => {
    const signal = signals.get(name);
    if (!signal)
        return;
    signal.detach(binding);
};
export const fireSignal = (name, ...args) => {
    const signal = signals.get(name);
    if (!signal)
        return;
    signal.dispatch(...args);
};
