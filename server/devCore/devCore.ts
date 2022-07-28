import { readDB } from "./db";

export async function main() {
    await readDB("test.db3");
}
main();