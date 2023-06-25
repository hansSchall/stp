import "colors";
import "./helper/mapMap";
import "./broker/broker";
import { initHTML5Client } from "./html5client/html5client";
import { initDevCore } from "./devCore/devCore";

async function main() {
    const html5client = initHTML5Client();
    const devCore = initDevCore();

    await Promise.all([html5client, devCore]);
}
main()
    .then(() => {
        console.log("Startup::main() initialized".green);
    })
    .catch(err => {
        console.error("[FatalError] Startup::main() Error during init phase".red);
        console.error(err);
    });
