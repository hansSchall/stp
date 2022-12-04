import { initTypeonly } from "./typecheck";
import * as fs from "fs-extra";
import { Interface } from "./interfaces";
import { RootDriver } from "./drivers/root.driver";


async function main() {
    await initTypeonly()
    const files = await fs.readdir(`./drivers`);
    files.forEach(file => {
        if (file.endsWith(".js"))
            import("./drivers/" + file);
    });
    console.debug("loaded drivers");

    const rootUplink = new Interface<void, void>();
    rootUplink.server.onReceiveA = (msg) => {
        if (msg.type == "remount" && msg.origin == "root") {
            rootDriver.unmount();
            rootDriver = new RootDriver("root", rootUplink.client);
        }
    }
    rootUplink.server.lockR.unlock();
    var rootDriver = new RootDriver("root", rootUplink.client);
}
main().catch(err => {
    throw err;
})
