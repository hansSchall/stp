import { Driver, DriverError, DriverType } from "../driver";
import { InterfaceClient } from "../interfaces";
import { rootUplinkSupport } from "./root.driver";
import * as TC from "../../config/typecheck/drivers/serial";
import { getDevStorageType } from "../devStore";

export class SerialPortDriver extends Driver<void, void> {
    constructor(devID: string, uplink: InterfaceClient<void, void>) {
        super(devID, uplink);
        const config = getDevStorageType<TC.SerialConfig>(this, "SerialConfig")
        if (config.valid) {

        } else {
            this.addError(new DriverError(`[Driver:Serial] Config TypeOnly error`, config.error, [devID]));
        }
    }
    public unmount(): void {
        super.unmount();
    }
    public driverName = "serial";
    public getChildren(): Driver<string, string>[] {
        throw new Error("Method not implemented.");
    }
    public getName(): string {
        return `SerialPort COM?`;
    }
    public getDescription(): string {
        return "Serialport";
    }
}

rootUplinkSupport.set("serial", SerialPortDriver);

export const serialUplinkSupport: DriverType<string, string> = new Map();
