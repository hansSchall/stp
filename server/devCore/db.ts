import { Database } from "sqlite";
import { Database as Database3 } from "sqlite3";

export let db: Database;

export async function readDB(file: string) {
    db = new Database({
        driver: Database3,
        filename: file,
    })
    await db.open();
    await db.run("PRAGMA journal_mode = TRUNCATE");
    await Promise.all(
        dbSchema.map(_ => db.run(_)));
}

const dbSchema = [
    "CREATE TABLE IF NOT EXISTS dev (id text, upper text, upperPort text, driver text)",

]

export async function getSingleProp(q: Promise<any>, p: string): Promise<unknown> {
    return (await q)[p];
}