import { Static } from "https://esm.sh/@sinclair/typebox@0.27.4";
import { TypeCompiler } from "https://esm.sh/@sinclair/typebox@0.27.4/compiler";
import { ApiIDType, ApiIncoming, ApiOutgoing } from "../../ApiTypes/ApiTypes.ts";

type Incoming = Static<typeof ApiIncoming>;
type Outgoing = Static<typeof ApiOutgoing>;
export type ApiID = Static<typeof ApiIDType>;

const checkIncoming = TypeCompiler.Compile(ApiIncoming);

export class TypedSocket {
    constructor(private sendv: (data: string) => void) {
        sockets.add(this);
    }
    private destroyed = false;
    public destroy() {
        if (this.destroyed) {
            console.warn(`[warn] [ignored] TypedSocket destroyed more than once`);
        }
        this.destroyed = true;
        this.sendv = () => { };
        sockets.delete(this);
    }
    public isDestroyed() {
        return this.destroyed;
    }

    public send(data: Outgoing) {
        const serialized = JSON.stringify(data);
        this.sendv(serialized);
        return !this.destroyed;
    }

    public recv(data: string) {
        if (this.destroyed) {
            console.warn(`received`);
            return;
        }
        try {
            const parsed = JSON.parse(data);
            if (checkIncoming.Check(parsed)) {
                const msg: Incoming = parsed;
                console.log("incoming", msg);
                for (const cb of onRecv.values()) {
                    cb(msg.tx, msg.reqID, msg.resID);
                }
            } else {
                console.warn("ApiIncoming", checkIncoming.Errors(parsed));
            }
        } catch (err) {
            console.warn("ApiIncoming", err);
        }
    }
}

const sockets = new Set<TypedSocket>();

export function callApi<T extends keyof Outgoing["tx"]>(req: T, value: Outgoing["tx"][T], resID?: ApiID): string;
export function callApi(req: Outgoing["tx"], resID?: ApiID): string;
export function callApi<T extends keyof Outgoing["tx"]>(req: Outgoing["tx"] | T, value?: Outgoing["tx"][T] | ApiID, resID?: ApiID): string {
    const reqID = crypto.randomUUID();
    const data = (typeof req === "string") ? {
        tx: {
            [req]: value,
        },
        reqID,
        resID,
    } : {
        tx: {
            ...req,
        },
        reqID,
        resID: value as ApiID,
    };
    sockets.forEach(s => s.send(data));
    return reqID;
}

type ApiCb = (data: Incoming["tx"], reqID?: ApiID, resID?: ApiID) => void;

const onRecv = new Map<ApiCb | symbol, ApiCb>();

export function onApiID(cb: ApiCb, id: ApiID, timeout = -1, once = true) {
    const cbID = Symbol();
    onRecv.set(cbID, (data, reqID, resId) => {
        if (resId == id) {
            cb(data, reqID, resId);
            if (once)
                onRecv.delete(cbID);
        }
    });
    if (timeout > 0) {
        setTimeout(() => onRecv.delete(cbID), timeout);
    }
}

export function onApi(cb: ApiCb, method?: keyof Incoming["tx"]) {
    if (method) {
        onRecv.set(cb, (data, reqID, resID) => {
            if (data[method] !== undefined)
                cb(data, reqID, resID);
        });
    } else {
        onRecv.set(cb, cb);
    }
}

export function unApi(cb: ApiCb) {
    onRecv.delete(cb);
}
