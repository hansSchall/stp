import { db, getSingleProp } from "./db";
import { DBCache } from "./dbCache";

export type If = string;
export type DevID = string;
export type DevPort = [If, DevID];

export class Dev {
    constructor(readonly id: DevID) {

    }
    private _upperDevice = new DBCache<DevPort>(async () => {
        const res = await db.get("SELECT upper, upperPort FROM dev WHERE id = ?", this.id);
        return [res.upper, res.upperPort];
    });
    get upperDevice(): Promise<Dev | undefined> {
        return new Promise(
            async res =>
                res(devs.get((await this._upperDevice.value)[1]))
        )
    }

    protected dispatchUplinkMsg() {

    }

    protected dispatchDownlinkMsg() {

    }


}

const devs = new Map<string, Dev>();