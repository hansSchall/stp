import { Type } from "@sinclair/typebox";

export function getScheme() {
    return JSON.stringify(Type.Object({
        a: Type.Number(),
        b: Type.String(),
    }));
}
