import { isArray } from "lodash";
import { getDevStorage, getDevStorageType } from "../devStore";
import { Driver, DriverType } from "../driver";
import { InterfaceClient } from "../interfaces";
import * as TC from "../../config/typecheck/drivers/root";

export class RootDriver extends Driver<void, void> {
    constructor(devID: string, uplink: InterfaceClient<void, void>) {
        super(devID, uplink);
        const children = getDevStorageType<TC.Children>(this, "Children")

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
    public unmount(): void {
        throw new Error("Unmounting root");
    }

}

export const rootUplink: DriverType<void, void> = new Map();
