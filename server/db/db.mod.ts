// import { resolve } from "https://deno.land/std@0.176.0/path/mod.ts";
import { WaitFor } from "https://deno.land/x/simple_promise_lock@v2.2.1/deno/lock.ts";
import { DB_Downlink, SQLParams } from "./def/downlink.d.ts";
import { DB_Uplink } from "./def/uplink.d.ts";
import "./w/db.w.ts";

let requestID = 1;

const dbFile = WaitFor<string>();

// const bdw = WaitFor<Worker>(() => {
//     console.log("starting worker");
//     const url = new URL("./w/db.w.ts", import.meta.url);
//     console.log(url);
//     const w = new Worker(url.href, {
//         type: "module",
//     });
//     console.log(w);
//     return w;
// });

const bdw = WaitFor<Worker>();

dbFile().then(console.log);
bdw().then(console.log);

(async () => {
    const worker = await bdw();
    worker.onmessage = (e => {
        console.log("worker uplink", e);
        responses.get(e.data.id)?.(e.data);
        responses.delete(e.data.id);
    });
    dbFile().then(file => bdw().then(_ => _.postMessage({ call: "open-db", query: file })));
})();

const responses = new Map<typeof requestID, (msg: DB_Uplink) => void>();

function sendToWorker(msg: Omit<DB_Downlink, "id"> & { id?: number; }) {
    return new Promise<DB_Uplink>((res, rej) => {
        msg.id = requestID++;
        responses.set(msg.id, (msg) => {
            if (msg.err) {
                rej(msg.err);
            } else {
                res(msg);
            }
        });
        bdw().then(_ => _.postMessage(msg));
    });
}

function execSQL(query: string, params: SQLParams, type: string) {
    return sendToWorker({
        call: "exec-sql",
        type,
        query,
        params,
    });
}

export function openDB(file: string) {
    dbFile(file);
}

export async function runSQL(query: string, params: SQLParams = {}): Promise<void> {
    await execSQL(query, params, "run");
}

export async function getSQL(query: string, params: SQLParams = {}): Promise<unknown> {
    return (await execSQL(query, params, "get")).result[0];
}

export async function allSQL<T = unknown>(query: string, params: SQLParams = {}): Promise<T[]> {
    return (await execSQL(query, params, "all")).result as T[];
}
