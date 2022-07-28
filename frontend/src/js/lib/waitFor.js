export function waitFor(id) {
    if (!reg.has(id)) {
        var regEntry = [[], true];
        reg.set(id, regEntry);
    }
    else {
        var regEntry = reg.get(id);
    }
    if (regEntry[1]) {
        return new Promise((res) => {
            regEntry[0]?.push(res);
        });
    }
    else {
        return Promise.resolve();
    }
}
export function lock(id, locked) {
    if (locked === undefined)
        return lock(id, true);
    if (locked) {
        reg.set(id, [[], true]);
    }
    else {
        unlock(id);
    }
}
export function unlock(id) {
    const regEntry = reg.get(id);
    if (regEntry) {
        regEntry[1] = false;
        while (!regEntry[1] && regEntry[0].length) {
            regEntry[0]?.shift()?.();
        }
    }
    else {
        reg.set(id, [[], false]);
    }
}
const reg = new Map();
