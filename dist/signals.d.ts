export declare const addSignalListener: (name: string, callback: (...args: any[]) => void) => {
    name: string;
    binding: any;
};
export declare const removeSignalListener: (name: string, binding: any) => void;
export declare const fireSignal: (name: string, ...args: any[]) => void;
