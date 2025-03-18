
import { useState } from "react";

type useAction<T> = React.Dispatch<React.SetStateAction<T[Extract<keyof T, string>]>>;

class UseList<T = any> extends Array<T> {

    #setState: useAction<T[]>;

    constructor(value: T[], setState: useAction<T[]>) {
        super(...value);
        this.#setState = setState;
    }

    push(...items: T[]): number {
        const n = super.push(...items);
        // @ts-ignore
        this.#setState(this);
        return n;
    }


    setAll(items: T[]): number {
        super.length = 0;
        return this.push(...items)
    }

    pop(): T | undefined {
        const item = super.pop();
        this.#setState((prev: any) => prev.slice(0, -1));
        return item;
    }

    shift(): T | undefined {
        const item = super.shift();
        this.#setState((prev: any) => prev.slice(1));
        return item;
    }
    unshift(...items: T[]): number {
        const n = super.unshift(...items);
        this.#setState((prev: any) => [...items, ...prev]);
        return n;
    }
    splice(start: number, deleteCount?: number): T[];
    splice(start: number, deleteCount: number, ...items: T[]): T[];
    splice(start: number, deleteCount: number = 0, ...items: T[]): T[] {
        const deleted = super.splice(start, deleteCount, ...items);
        // @ts-ignore
        this.#setState(deleted);
        return deleted;
    }
    sort(compareFn?: (a: T, b: T) => number): this {
        super.sort(compareFn);
        // @ts-ignore
        this.#setState([...this]);
        return this;
    }
    reverse(): T[] {
        const reversed = super.reverse();
        // @ts-ignore
        this.#setState(reversed);
        return reversed;
    }
    fill(value: T, start?: number, end?: number): this {
        super.fill(value, start, end);
        // @ts-ignore
        this.#setState([...this]);
        return this;
    }

    copyWithin(target: number, start: number, end?: number): this {
        super.copyWithin(target, start, end);
        // @ts-ignore
        this.#setState(this);
        return this;
    }

    set length(value: number) {
        super.length = value;
        console.log("length: ", value)
        // @ts-ignore
        this.#setState([...this]);
    }

    clear() {
        super.length = 0;
        // @ts-ignore
        this.#setState([...this]);
    }


    remove(index: number, count: number = 1): number {
        // @ts-ignore
        this.#setState(super.splice(index, count));
        return this.length;
    }

    valueOf(): T[] {
        return Array.from(this);
    }

    get length(): number {
        return super.length;
    }


    static get [Symbol.species]() {
        return Array;
    }


}


function useList<T>(items: T[]): UseList<T> {
    const [value, setValue] = useState(items);
    // @ts-ignore
    return new UseList(value, setValue);
}

Object.defineProperty(useList, Symbol.hasInstance, {
    value: function (instance: any): boolean {
        return !!instance && instance instanceof UseList;
    },
});

function useObject<T extends object>(obj: T) {
    const state: any = {};

    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            const [value, setValue] = useState(obj[key]);
            // @ts-ignore
            const list = new UseList(value, setValue);
            Object.defineProperty(state, key, {
                get: () => list,
                set: (newValue) => {
                    list.length = 0;
                    list.push(...newValue);
                },
                enumerable: true,
                configurable: true,
            });
            continue;
        }
        // @ts-ignore
        else if (obj[key] !== null && typeof obj[key] === "object") {
            // @ts-ignore
            state[key] = useObject(obj[key]);
            continue;
        }
        const [value, setValue] = useState(obj[key]);
        Object.defineProperty(state, key, {
            get: () => value,
            set: (newValue) => {
                setValue(newValue);
            },
            enumerable: true,
            configurable: true,
        });
    }
    Object.setPrototypeOf(state, useObject.prototype);
    return state as T;
}


export { useList, useObject };

declare global {
    interface Array<T> {
        clear(): void;
        setAll(items: T[]): number;
    }
}


Array.prototype.clear = function () {
    this.length = 0;
};

Array.prototype.setAll = function (items: []) {
    this.length = 0;
    return (this.push(...items));
};