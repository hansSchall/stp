import { Worker } from "node:worker_threads";

async function main() {
    const testInstance = new Worker("./devCore.js");
}
main();