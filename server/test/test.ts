import { CmdServerCtx } from "../cmdServer/context";

async function run() {
    const a = new CmdServerCtx();
    a.keypress("Chan");
    a.keypress("1");
    a.keypress("Thru");
    a.keypress("5");
    console.log(a.toCoreString());
    console.log(a.toClientString());
    a.keypress("Clear");
    a.keypress("10");
    a.keypress("Enter");
    console.log(a.toCoreString());
    console.log(a.toClientString());
}
run();