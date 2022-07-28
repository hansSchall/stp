type StorageType = [(() => void)[], boolean];
export type Lock = Symbol;
export function waitFor(id: Symbol) {
    if (!reg.has(id)) {
        var regEntry: StorageType = [[], true]
        reg.set(id, regEntry);
    } else {
        var regEntry = reg.get(id) as StorageType;
    }
    if (regEntry[1]) {
        return new Promise<void>((res) => {
            regEntry[0]?.push(res);
        })
    } else {
        return Promise.resolve();
    }
}
export function lock(id: Symbol, locked?: boolean): void {
    if (locked === undefined) return lock(id, true);
    if (locked) {
        reg.set(id, [[], true]);
    } else {
        unlock(id);
    }
}
export function unlock(id: Symbol) {
    const regEntry = reg.get(id);
    if (regEntry) {
        regEntry[1] = false;
        while (!regEntry[1] && regEntry[0].length) {
            regEntry[0]?.shift()?.();
        }
    } else {
        reg.set(id, [[], false]);
    }
}
const reg = new Map<Symbol, [(() => void)[], boolean]>();