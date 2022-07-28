import { DevPort } from "../dev";
import { DriverImplementation, DriverMsg } from "../driver";

export default class RootDriver extends DriverImplementation {
    init(msgToParent: DriverMsg): void {

    }
    msgFromChild(port: DevPort, msg: DriverMsg): void {
        // throw new Error("Method not implemented.");
    }
    msgToDev(msg: DriverMsg): void {
        // throw new Error("Method not implemented.");
    }

}