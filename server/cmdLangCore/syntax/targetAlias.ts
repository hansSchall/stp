import { FV } from "./flags";

export async function resolveComplexTarget(target: FV, range: number[]) {
    if (target == FV.Chan) {
        return range;
    } else if (target == FV.Group) {
        return await resolveGroup(range);
    }
}
function resolveGroup(range: number[]): Promise<number[]> {
    return new Promise((res) => {
        setTimeout(() => {
            res(range);
        }, 1000);
    })
}