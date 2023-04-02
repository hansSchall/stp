export type vec2 = [number, number];
export function vec2(x: number, y: number): vec2 {
    return [x, y];
}

export function vecDiff(a: vec2, b: vec2): vec2 {
    const [ax, ay] = a;
    const [bx, by] = b;
    return vec2(bx - ax, by - ay);
}
