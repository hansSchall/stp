/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

console.log("worker started");

// self.postMessage("hello from worker");

import { BindParameters, Database } from "https://deno.land/x/sqlite3@0.9.1/mod.ts";
import { DB_Downlink } from "../def/downlink.d.ts";
import { WaitFor } from "https://deno.land/x/simple_promise_lock@v2.2.1/deno/lock.ts";

const dbSocket = WaitFor<Database>();

dbSocket(new Database("./test.db"));

self.onmessage = async (msg: MessageEvent<DB_Downlink>) => {
    self.postMessage({
        call: "opened",
        msg,
    });
    console.log("[db.w.ts] received message from parent", msg.data);
    if (msg.data.call == "open-db") {
        dbSocket(new Database(msg.data.query));
        self.postMessage("database opened");
    } else if (msg.data.call == "exec-sql") {
        try {
            const db = await dbSocket();
            const stmt = db.prepare(msg.data.query);
            if (msg.data.type == "run") {
                self.postMessage({
                    id: msg.data?.id,
                    result: stmt.run(msg.data.params as unknown as BindParameters),
                });
            } else if (msg.data.type == "get") {
                self.postMessage({
                    id: msg.data?.id,
                    result: [stmt.get(msg.data.params as unknown as BindParameters)],
                });
            } else {
                self.postMessage({
                    id: msg.data?.id,
                    result: stmt.all(msg.data.params as unknown as BindParameters),
                });
            }
        } catch (err) {
            self.postMessage({
                id: msg.data?.id,
                err: err,
            });
        }
    }
};

