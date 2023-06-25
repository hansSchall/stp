import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const SchemeScheme = Type.Object({

});

export const testScheme = {
    "type": "object",
    "properties": {
        "a": {
            "type": "number"
        },
        "b": {
            "type": "string"
        }
    },
    "required": [
        "a",
        "b"
    ]
};
