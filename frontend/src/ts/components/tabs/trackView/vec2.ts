export type vec2 = [number, number];
export function vec2(x: number, y: number): vec2 {
    return [x, y];
}

export function vecDiff(a: vec2, b: vec2): vec2 {
    return sub(b, a);
}
export function add(a: vec2, b: vec2): vec2 {
    const [ax, ay] = a;
    const [bx, by] = b;
    return vec2(ax + bx, ay + by);
}
export function sub(a: vec2, b: vec2): vec2 {
    const [ax, ay] = a;
    const [bx, by] = b;
    return vec2(ax - bx, ay - by);
}
export function mul(a: vec2, b: vec2 | number): vec2 {
    const [ax, ay] = a;
    const [bx, by] = typeof b == "number" ? [b, b] : b;
    return vec2(ax * bx, ay * by);
}
export function div(a: vec2, b: vec2): vec2 {
    const [ax, ay] = a;
    const [bx, by] = b;
    return vec2(ax / bx, ay / by);
}
export function xy2pol(diff: vec2): [number, number] {
    const [x, y] = diff;
    const d = Math.sqrt(x * x + y * y);
    let a = Math.atan2(y, x) * (180 / Math.PI);
    return [d, a]
}
