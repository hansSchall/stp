import { initTypeonly } from "./typecheck";
import * as fs from "fs-extra";
import { Interface } from "./interfaces";
import { RootDriver } from "./drivers/root.driver";
import { fromfile } from "./devStore";


async function main() {
    await initTypeonly()
    const files = await fs.readdir(`./drivers`);
    await Promise.all(files.map(file => {
        if (file.endsWith(".js"))
            return import("./drivers/" + file);
        else
            return Promise.resolve()
    }));
    console.debug("loaded drivers");

    fromfile(`
#root
*Children
=[{"type": "serial", "id": "ksjfh"}]
    `.split("\n"))

    const rootUplink = new Interface<void, void>();
    rootUplink.server.onReceiveA = (msg) => {
        console.log(msg);
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
