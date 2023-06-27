import { ArbiUplink, Interface, InterfaceClient } from "./interface";
import { DevTreeSnapshot } from "./exportonly";

const devList = new Map<string, Driver<any, any>>();

export abstract class Driver<PortUplink = any, PortDownlink = any> {
    constructor(
        readonly devID: string,
        protected readonly uplink: InterfaceClient<PortUplink, PortDownlink>,
    ) {
        devList.set(devID, this);
        this.uplink.sendA({ type: "mount", origin: this.devID });
    }

    public abstract getChildren(): Driver[];
    public abstract getName(): string;
    public abstract getDescription(): string;
    public abstract cat: string;
    public readonly abstract driverName: string;

    public unmount() {
        devList.delete(this.devID);
    }

    private errorList = new Set<DriverError>();
    public getErrorStatus() {
        return [...this.errorList];
    }
    protected addError(err: DriverError) {
        this.errorList.add(err);
        this.uplink.sendA({ type: "error", origin: this.devID, err });
    }

    public hotConfigChanged() { // if supported overwrite // this is fallback
        this.uplink.sendA(new ArbiUplink(this, "remount"));
    }

    public getSnapshot(): DevTreeSnapshot {
        return {
            id: this.devID,
            label: this.getName(),
            cat: this.cat,
            iid: "",
            children: this.getChildren().map(_ => _.getSnapshot()),
        };
    }
}

export class DriverChildMgr<Uplink, Downlink>{
    constructor(readonly driverConstructor: DriverConstructor<Uplink, Downlink>, readonly devID: string, readonly uplink: InterfaceClient<any, any>) {
        this.link = new Interface<Uplink, Downlink>();
        this.link.server.onReceiveA = this.arbiReceiveHandler.bind(this);
        this.instance = new driverConstructor(devID, this.link.client);
    }
    readonly link: Interface<Uplink, Downlink>;
    private instance: Driver<Uplink, Downlink>;
    public getInstance() {
        return this.instance;
    }
    public arbiReceiveHandler(data: ArbiUplink) {
        if (data.type == "remount") {
            this.remount();
        } else {
            this.uplink.sendA(data);
        }
    }
    public unmount() {
        this.instance.unmount();
    }
    private remount() {
        this.unmount();
        this.instance = new this.driverConstructor(this.devID, this.link.client);
    }
}

export class DriverError {
    constructor(readonly name: string, readonly desc: string, readonly stack: string[] | null) {
        console.error(`DriverError:`, name, desc, stack);
    }
}

export type DriverConstructor<Uplink, Downlink> = {
    new(devID: string, uplink: InterfaceClient<Uplink, Downlink>): Driver<Uplink, Downlink>;
};

export type DriverType<Uplink, Downlink> = Map<string, DriverConstructor<Uplink, Downlink>>;
