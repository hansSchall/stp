import { readdir } from "fs-extra";
import { join } from "path";
import { RtoModules, generateRtoModules } from "typeonly";
import { waitFor } from "simple-promise-locks";

export const toDefs = waitFor<RtoModules>()

export async function initTypeonly() {
    const typeDir = join(__dirname, "../../src/typeonly");
    const defs = await readdir(typeDir);
    const bundle = await generateRtoModules({
        modulePaths: defs.map(_ => "../../src/typeonly/" + _),
        readFiles: {
            sourceDir: typeDir
        },
        returnRtoModules: true
    }).catch(console.error);

    if (bundle)
        toDefs(bundle);
}
