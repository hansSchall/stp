import { Database, open } from "sqlite";
import { Database as DB3 } from "sqlite3";
import lock, { waitFor } from "simple-promise-locks";
import { resolve } from "node:path";
import { TSchema } from "@sinclair/typebox";

const w_db = waitFor<Database>();
const l_db = lock(true);

export async function db() {
    await l_db();
    return await w_db();
}

export async function getDevConf(id: string) {
    return await (await db()).get(`SELECT value FROM devConf WHERE id = ?`, [id]);
}

export async function setDevConf(id: string, conf: string) {
    return await (await db()).get(`INSERT OR REPLACE INTO devConf VALUES (?,?)`, [id, conf]);
}

export async function loadConfig(id: string) {
    const db = await open({
        filename: resolve(__dirname, "../../config/devCore/data/" + id + ".stp"),
        driver: DB3,
    });

    await Promise.all([
        `CREATE TABLE IF NOT EXISTS devConf (id TEXT PRIMARY KEY, value TEXT)`,
    ].map((stmt) => db.run(stmt)));

    w_db(db);
    l_db.unlock();
}

export function releaseConfig() {
    l_db.lock();
}
