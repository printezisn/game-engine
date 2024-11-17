import { MiniSignal } from 'mini-signals';

const _signals = new Map<string, MiniSignal>();

export const addSignalListener = (
  name: string,
  callback: (...args: any[]) => void,
) => {
  let signal = _signals.get(name);

  if (!signal) {
    signal = new MiniSignal();
    _signals.set(name, signal);
  }

  return { name, binding: signal.add(callback) as any };
};

export const removeSignalListener = (name: string, binding: any) => {
  const signal = _signals.get(name);
  if (!signal) return;

  signal.detach(binding);
};

export const fireSignal = (name: string, ...args: any[]) => {
  const signal = _signals.get(name);
  if (!signal) return;

  signal.dispatch(...args);
};
