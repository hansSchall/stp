import "colors";
import "./broker/broker";
import { initHTML5Client } from "./html5client/html5client";

async function main() {
    const html5client = initHTML5Client();

    await Promise.all([html5client]);
}
main()
    .then(() => {
        console.log("Startup::main() initialized".green);
    })
    .catch(err => {
        console.error("[FatalError] Startup::main() Error during init phase".red);
        console.error(err);
    });
