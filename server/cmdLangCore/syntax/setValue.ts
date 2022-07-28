export async function isAttrOf(attr: string, chans: number[]) {
    return new Set([
        "Dir",
        "Intens",
        "Attr"
    ]).has(attr);
}
export async function isStringValueOf(attr: string, value: string, chans: number[]) {
    return new Set([
        "Left",
        "Right",
        "Straight"
    ]).has(value);
}