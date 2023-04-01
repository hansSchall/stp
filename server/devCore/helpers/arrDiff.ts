import { differenceWith, isEqual } from "lodash";

export function arrDiff<T>(o: T[], n: T[]) {
    const added = differenceWith(n, o, isEqual);
    const removed = differenceWith(o, n, isEqual);
    return { added, removed };
}
