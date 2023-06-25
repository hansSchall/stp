// import RootDriver from "../devCore_/drivers/root.driver";
import { waitFor } from "simple-promise-locks";
import { RootDriver } from "../config/devCore/drivers/root/root.driver";
import { loadConfig } from "./devStore";
import { Interface } from "./interface";

export const w_rootDriver = waitFor<RootDriver>();

export async function initDevCore() {
    await loadConfig("default");

    const rootUplink = new Interface<void, void>();
    rootUplink.server.onReceiveA = (msg) => {
        console.log(msg);
        if (msg.type == "remount" && msg.origin == "root") {
            rootDriver.unmount();
            rootDriver = new RootDriver("root", rootUplink.client);
            w_rootDriver(rootDriver);
        }
    };
    rootUplink.server.lockR.unlock();
    let rootDriver = new RootDriver("root", rootUplink.client);
    w_rootDriver(rootDriver);
}

export async function getDevTree() {
    const root = await w_rootDriver();
    return root.getSnapshot();
}

setTimeout(async () => {
    console.dir(await getDevTree());
}, 1000);
