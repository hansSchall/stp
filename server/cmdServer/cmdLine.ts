import { clone } from "lodash";
import { v4 } from "uuid";
import { CmdServerCtx, contexts } from "./context";

export class CommandLine {
    constructor(readonly label: string, changed: (state: CmdLineState) => void) {
        this.ctx?.on("cmd-updated", () => {
            changed({
                text: this.ctx?.toClientString() ?? "",
                exited: !!this.ctx?.coreResult?.executed,
                steps: this.ctx?.toStringArray() ?? []
            })
        })
    }
    readonly id: string = v4();
    protected ctx: CmdServerCtx | undefined;
    assignToContext(ctx: string) {
        this.ctx = contexts.get(ctx);
    }
    getContextId() {
        return this.ctx?.id;
    }
}

export interface CmdLineState {
    text: string,
    exited: boolean,
    steps: string[],
}

export const commandLines = new Map<string, CommandLine>();

export function addCommandLine(cmdl: CommandLine) {
    commandLines.set(cmdl.id, cmdl);
    return cmdl.id;
}