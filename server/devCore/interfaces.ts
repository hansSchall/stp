import lock from "simple-promise-locks"

export abstract class InterfaceStream<R, W, RA, WA> {
    readonly lockAll = lock(true); // lock all (used by class Interface.constructor)
    readonly lockR = lock(true); // locks onReceive (unlock after you set the event handler!)
    send(data: W) {
        this.lockAll().then(() => {
            this._send(data);
        })
    }
    public _send: (data: W) => void = () => { }
    public onReceive: (data: R) => void = () => { };
    _receieve(data: R) {
        Promise.all([this.lockAll(), this.lockR()]).then(() => {
            this.onReceive(data);
        })
    }

    sendA(data: WA) {
        this.lockAll().then(() => {
            this._sendA(data);
        })
    }
    public _sendA: (data: WA) => void = () => { }
    public onReceiveA: (data: RA) => void = () => { };
    _receieveA(data: RA) {
        Promise.all([this.lockAll(), this.lockR()]).then(() => {
            this.onReceiveA(data);
        })
    }
}
type ArbiUplink = { type: string, origin: string };
type ArbiDownlink = { type: string, origin: string };
export class Interface<Uplink, Downlink> {
    constructor() {
        this.client._send = this.server._receieve.bind(this.server);
        this.server._send = this.client._receieve.bind(this.client);
        this.client._sendA = this.server._receieveA.bind(this.server);
        this.server._sendA = this.client._receieveA.bind(this.client);
        this.client.lockAll.unlock();
        this.server.lockAll.unlock();
    }
    readonly client = new InterfaceClient<Uplink, Downlink>()
    readonly server = new InterfaceServer<Uplink, Downlink>()
}
export class InterfaceClient<Uplink, Downlink> extends InterfaceStream<Downlink, Uplink, ArbiDownlink, ArbiUplink> {

}
export class InterfaceServer<Uplink, Downlink> extends InterfaceStream<Uplink, Downlink, ArbiUplink, ArbiDownlink> {

}
