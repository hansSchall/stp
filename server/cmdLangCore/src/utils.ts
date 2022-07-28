export const INVISIBLE = "\ufeff";

export type QueryArr = (string | number)[];

export function mapArrayAdd<K, V>(map: Map<K, V[] | V>, key: K, value: V) {
    const oldValue = map.get(key);
    if (oldValue) {
        if (Array.isArray(oldValue)) {
            oldValue.push(value);
        } else {
            map.set(key, [oldValue, value]);
        }
    } else {
        map.set(key, [value]);
    }
}

export function range(from: number, to: number) {
    const res: number[] = [];
    for (let i = from; i <= to; i++)
        res.push(i);
    return res;
}

export function shortenNumbers(cmd: string[]): QueryArr {
    const res: string[] = [];
    let lastIndex: number = 0;
    for (let part of cmd) {
        lastIndex = res.length - 1;
        if (!isNaN(+res[lastIndex]) && !isNaN(+part)) {//number
            res[lastIndex] += part;
        } else {
            res.push(part);
        }
    }
    return res.map(_ => +_ || _); // parse all numbers
}