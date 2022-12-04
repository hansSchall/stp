import { Driver, DriverType } from "../driver";
import { InterfaceClient } from "../interfaces";
import { rootUplink } from "./root.driver";

export class SerialPortDriver extends Driver<void, void> {
    constructor(devID: string, uplink: InterfaceClient<void, void>) {
        super(devID, uplink);
        // const children = getDevStorageType<TC.Children>(this, "Children")
        // if (children.valid) {
        //     
        // }
    }
    public driverName = "serial";
    public getChildren(): Driver<unknown, unknown>[] {
        throw new Error("Method not implemented.");
    }
    public getName(): string {
        return `SerialPort COM?`;
    }
    public getDescription(): string {
        return "Serialport";
    }
}

rootUplink.set("serial", SerialPortDriver);

export const serialUplink: DriverType<string, string> = new Map();
