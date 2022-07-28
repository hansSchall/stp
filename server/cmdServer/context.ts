import EventEmitter = require("events");
import { clone, last } from "lodash";
import { v4 } from "uuid"
import { runCmd } from "../cmdLangCore/cmdLangCore";
import { CmdResult } from "../cmdLangCore/src/parseQuery";
import { shortenNumbers } from "../cmdLangCore/src/utils";
import { ClearAllKey, ClearKey } from "./cmdServer";
import { FnKeys } from "./keys";

export class CmdServerCtx extends EventEmitter {
    constructor() {
        super();
        this.id = v4();
    }
    readonly id: string;
    protected currentCmd: string[] = [];

    keypress(key: string) {
        if (key === FnKeys.Clear) {
            this.currentCmd.pop();
        } else if (key === FnKeys.ClearAll) {
            this.clearCmd();
        } else if (key === FnKeys.Enter) {
            this.currentCmd.push("Enter");
            this.runCmd();
        } else {
            this.currentCmd.push(key);
        }
    }

    clearCmd() {
        this.currentCmd = [];
    }

    protected coreResult_: CmdResult | null = null;

    get coreResult() {
        return this.coreResult_;
    }

    async runCmd() {
        this.coreResult_ = await runCmd(this.toCoreString());
        this.clearCmd();
    }

    toStringArray() {
        return clone(this.currentCmd);
    }

    toCoreString() {
        return shortenNumbers(this.currentCmd).join(" ");
    }

    toClientString() {
        return this.toCoreString().replace(/ Enter$/, "");
    }

    protected cmdLineUpdate() {
        this.emit("cmd-updated");
    }

    // dispatchKeyPress(key: string) {
    //     key = key.trim();
    //     const lastCmdIndex = this.currentCmd.length - 1;
    //     if (isNaN(+key) || isNaN(+(this.currentCmd[lastCmdIndex]))) { 
    //         this.currentCmd.push(key);
    //     }else{
    //         this.currentCmd[lastCmdIndex] += key;
    //     }
    // }

}

export const contexts = new Map<string, CmdServerCtx>();

export function addCtx(ctx: CmdServerCtx) {
    contexts.set(ctx.id, ctx);
    return ctx.id;
}