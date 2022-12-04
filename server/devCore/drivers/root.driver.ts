import { isArray } from "lodash";
import { getDevStorage, getDevStorageType } from "../devStore";
import { Driver, DriverChildMgr, DriverError, DriverType } from "../driver";
import { InterfaceClient } from "../interfaces";
import * as TC from "../../config/typecheck/drivers/root";

export class RootDriver extends Driver<void, void> {
    constructor(devID: string, uplink: InterfaceClient<void, void>) {
        super(devID, uplink);
        const children = getDevStorageType<TC.Children>(this, "Children")
        if (children.valid) {
            children.data.forEach(({ type, id }) => {
                const driver = rootUplink.get(type);
                if (driver) {
                    const mgr = new DriverChildMgr(driver, devID + "." + id, uplink);
                    mgr.link.server.lockR.unlock();
                } else {
                    this.addError(new DriverError("driver not found", `Driver '${type}' was not found for <void,void>`, [devID]))
                }
            })
        }
    }
    public readonly driverName = "root";
    public getChildren(): Driver<unknown, unknown>[] {
        throw new Error("Method not implemented.");
    }
    public getName(): string {
        return "root"
    }
    public getDescription(): string {
        return "Root Node"
    }
}

export const rootUplink: DriverType<void, void> = new Map();
