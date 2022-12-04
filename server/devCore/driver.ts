import { InterfaceClient } from "./interfaces";

export abstract class Driver<PortUplink = unknown, PortDownlink = unknown> {
    constructor(readonly devID: string, protected readonly uplink: InterfaceClient<PortUplink, PortDownlink>) {
        this.uplink.sendA({ type: "mount", origin: this.devID });
    }
    public abstract getChildren(): Driver[];
    public abstract getName(): string;
    public abstract getDescription(): string;
    public abstract unmount(): void;
    public readonly abstract driverName: string;
    private errorList = new Set<DriverError>();
    public getErrorStatus() {

    }
    protected addError(err: DriverError) {
        this.errorList.add(err);
        this.uplink.sendA({ type: "error", origin: this.devID });
    }
}

export class DriverError {
    constructor(readonly name: string, readonly desc: string, readonly stack: string[] | null) {

    }
}

export type DriverType<Uplink, Downlink> = Map<string, {
    new(devID: string, uplink: InterfaceClient<Uplink, Downlink>): Driver<Uplink, Downlink>
}>;
