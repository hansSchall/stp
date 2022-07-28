import { isUndefined } from "lodash";

export class DBCache<T> {
    constructor(protected readonly dbGet: () => Promise<T>) {
        addClearListener(this.clear);
    }
    protected cachedValue: T | undefined = undefined;
    async getValue() {
        if (isUndefined(this.cachedValue)) {
            this.cachedValue = await this.dbGet();
        }
        return this.cachedValue;
    }
    public get value() {
        return this.getValue();
    }
    public clear() {
        this.cachedValue = undefined;
    }
}

const clearListener = new Set<VoidFunction>();
export function addClearListener(fn: VoidFunction) {
    clearListener.add(fn);
}
export function clearAll() {
    clearListener.forEach(_ => _());
}
