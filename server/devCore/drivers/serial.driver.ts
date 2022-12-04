import { Driver, DriverType } from "../driver";

export abstract class SerialPortDriver extends Driver<void, void> {
    public getChildren(): Driver<unknown, unknown>[] {
        throw new Error("Method not implemented.");
    }
    public getName(): string {
        return `SerialPort COM?`;
    }
    public getDescription(): string {
        return "Serialport";
    }
    public unmount(): void {
        throw new Error("Method not implemented.");
    }
}

export const serialUplink: DriverType<string, string> = new Map();
