require("colors");
import { shortenNumbers } from "./src/utils";
import * as colors from "colors";
import { CmdResult, parseQuery } from "./src/parseQuery";

export function runCmd(cmd: string | string[]): Promise<CmdResult> {
    if (typeof cmd == "string") cmd = cmd.split(" ");
    cmd = cmd.filter(_ => _);
    const query = shortenNumbers(cmd);
    // console.log(execute ? "running".red : "previewing".yellow, ...query.map(_ => typeof _ == "string" ? _.cyan : _));
    return parseQuery(query);
}
process.stdin.on("data", (data_) => {
    console.log(data_);
    const data = data_.toString().replace(/\n|\r/g, "");
    // console.log(JSON.stringify(data));
    test(data).then(console.log);
});

export async function test(cmd: string) {
    // await runCmd("Chan 1 Thru 5 Dir Left Enter");
    return await runCmd(cmd);
}
