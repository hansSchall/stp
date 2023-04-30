const fs = require("fs-extra");
const path = require("node:path");

const srcPath = __dirname;
const destPath = path.join(__dirname, "../frontend/src/typedef/");

async function main() {
    await fs.ensureDir(destPath);
    /**
     * @type string[]
     */
    const files = (await fs.readdir(srcPath)).filter((/** @type {string} */ _) => _.endsWith(".ts"));

    files.forEach(async name => {
        const def = await fs.readFile(path.join(srcPath, name));
        await fs.writeFile(path.join(destPath, name), build(def.toString()));
    });
}

/**
 * 
 * @param {string} input 
 */

function build(input) {
    return input.replace(/https:\/\/esm.sh\/@sinclair\/typebox@0.27.4/g, "@sinclair/typebox");
}

main();
