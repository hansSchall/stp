import { Driver, DriverError, DriverType } from "../drivers";
import { InterfaceClient } from "../drivers";
import { rootUplinkSupport } from "../root/root.driver";

export class SerialPortDriver extends Driver<void, void> {
    constructor(devID: string, uplink: InterfaceClient<void, void>) {
        super(devID, uplink);

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
    public cat: string = "Serial";
}

rootUplinkSupport.set("serial", SerialPortDriver);

export const serialUplinkSupport: DriverType<string, string> = new Map();
