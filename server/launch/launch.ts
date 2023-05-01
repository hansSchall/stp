import { allSQL, openDB, runSQL } from "../db/db.mod.ts";

async function main() {
    console.log("main start");
    openDB("./test.db");
    await runSQL("CREATE TABLE IF NOT EXISTS test (id TEXT, label TEXT)");
    console.log("table created");
    await runSQL("INSERT INTO test (id,label) VALUES (?,?)", [Math.random().toString(), "Test"]);
    console.log(await allSQL("SELECT * FROm test"));
    console.log("main end");
}
main().catch(console.error);

// new Worker(new URL("./testworker.ts", import.meta.url).href, { type: "module" });
