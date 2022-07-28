import { DevPort } from "./dev";

export class Driver {

}
export class DriverInstance {
    constructor(protected readonly driver: Driver) {

    }
}
export interface DriverCtx {

}

export abstract class DriverImplementation {
    abstract init(msgToParent: DriverMsg): void;
    abstract msgFromChild(port: DevPort, msg: DriverMsg): void;
    abstract msgToDev(msg: DriverMsg): void;
}

export abstract class DriverMsg {
    abstract toString: () => string
}