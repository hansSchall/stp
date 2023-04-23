import { io } from "socket.io-client";
import { Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { ApiIDType, ApiIncomming, ApiOutgoing } from "../../typedef/ApiTypes";
import { uniqueId } from "lodash-es";


export type Outgoing = Static<typeof ApiIncomming>;
export type Incoming = Static<typeof ApiOutgoing>;
export type ApiID = Static<typeof ApiIDType>;

const checkIncoming = TypeCompiler.Compile(ApiOutgoing);

export class TypedSocket {
    constructor(private sendv: (data: string) => void) {

    }
    private destroyed = false;
    public destroy() {
        if (this.destroyed) {
            console.warn(`[warn] [ignored] TypedSocket destroyed more than once`);
        }
        this.destroyed = true;
        this.sendv = () => { };
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
            console.warn(`[warn] [ignored] destroyed TypedSocket receieved data`);
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
                console.warn("ApiIncoming::TypeError:", checkIncoming.Errors(parsed));
            }
        } catch (err) {
            console.warn("ApiIncoming::TypeError: invalid JSON", err);
        }
    }
}

const socket = io(`${location.protocol}://${location.host}:81/`);

socket.on("connect", () => {
    console.log(`%c socket connected ${socket.id}`, `color: green`);
});

const api = new TypedSocket(data => socket.emit("msg", data));

socket.on("msg", data => {
    api.recv(data);
});
export function callApi<T extends keyof Outgoing["tx"]>(req: T, value: Outgoing["tx"][T], resID?: ApiID): string;
export function callApi(req: Outgoing["tx"], resID?: ApiID): string;
export function callApi<T extends keyof Outgoing["tx"]>(req: Outgoing["tx"] | T, value?: Outgoing["tx"][T] | ApiID, resID?: ApiID): string {
    const reqID = uniqueId("api");
    if (typeof req === "string") {
        api.send({
            tx: {
                [req]: value,
            },
            reqID,
            resID,
        });
    } else {
        resID = value as ApiID;
        api.send({
            tx: {
                ...req,
            },
            reqID,
            resID,
        });
    }
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
