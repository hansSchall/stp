import { createValidator, TypeOnlyValidator } from "@typeonly/validator";
import { generateRtoModules } from "typeonly";
import * as fs from "fs-extra";

export function typecheck<Type>(data: any, defFile: string, defName: string): {
    data: Type | null,
    valid: boolean,
    error: string | null,
} {
    const res = validator?.validate(defName, data, "./" + defFile);
    if (res?.valid) {
        return {
            data: data as Type,
            valid: true,
            error: null,
        }
    } else {
        console.debug(res?.error);
        return {
            data: null,
            valid: false,
            error: res?.error || "",
        }
    }
}

let validator: TypeOnlyValidator | null = null;

export async function initTypeonly() {
    console.debug("reading server/config/typecheck/drivers");
    const files = await fs.readdir(`../../config/typecheck/drivers`);
    validator = await createValidator({
        bundle: await generateRtoModules({
            modulePaths: files.map(_ => "./" + _),
            readFiles: {
                sourceDir: `../../config/typecheck/drivers`
            },
            returnRtoModules: true
        }).catch(console.error)
    })
    console.debug("created TypeOnly Checker");
}
