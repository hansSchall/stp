import { ArbiUplink, Interface, InterfaceClient } from "./interfaces";

const devList = new Map<string, Driver<any, any>>();

export abstract class Driver<PortUplink = unknown, PortDownlink = unknown> {
    constructor(readonly devID: string, protected readonly uplink: InterfaceClient<PortUplink, PortDownlink>) {
        devList.set(devID, this);
        this.uplink.sendA({ type: "mount", origin: this.devID });
    }
    public abstract getChildren(): Driver[];
    public abstract getName(): string;
    public abstract getDescription(): string;
    public unmount() {
        devList.delete(this.devID);
    }
    public readonly abstract driverName: string;
    private errorList = new Set<DriverError>();
    public getErrorStatus() {
        return [...this.errorList];
    }
    protected addError(err: DriverError) {
        this.errorList.add(err);
        this.uplink.sendA({ type: "error", origin: this.devID });
    }
}

export class DriverChildMgr<Uplink, Downlink>{
    constructor(readonly driverConstructor: { new(devID: string, uplink: InterfaceClient<Uplink, Downlink>): Driver<Uplink, Downlink> }, readonly devID: string, readonly uplink: InterfaceClient<any, any>) {
        this.link = new Interface<Uplink, Downlink>();
        this.link.server.onReceiveA = this.arbiReceiveHandler.bind(this);
        this.instance = new driverConstructor(devID, this.link.client);
    }
    readonly link: Interface<Uplink, Downlink>;
    private instance: Driver<Uplink, Downlink>;
    public arbiReceiveHandler(data: ArbiUplink) {
        if (data.type == "remount") {
            this.remount();
        } else {
            this.uplink.sendA(data);
        }
    }
    private remount() {
        this.instance.unmount();
        this.instance = new this.driverConstructor(this.devID, this.link.client);
    }
}

export class DriverError {
    constructor(readonly name: string, readonly desc: string, readonly stack: string[] | null) {
        console.error(name, desc, stack);
    }
}

export type DriverType<Uplink, Downlink> = Map<string, {
    new(devID: string, uplink: InterfaceClient<Uplink, Downlink>): Driver<Uplink, Downlink>
}>;
