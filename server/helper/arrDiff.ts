import { differenceWith, isEqual } from "lodash";

export function arrDiff<T>(o: T[], n: T[]): { added: T[], removed: T[]; } {
    const added = differenceWith(n, o, isEqual);
    const removed = differenceWith(o, n, isEqual);
    return { added, removed };
}
