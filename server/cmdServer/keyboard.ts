import { v4 } from "uuid";
import { CmdServerCtx, contexts } from "./context";

export class Keyboard {
    constructor(readonly label: string) {

    }
    readonly id: string = v4();
    protected ctx: CmdServerCtx | undefined;
    assignToContext(ctx: string) {
        this.ctx = contexts.get(ctx);
    }
    getContextId() {
        return this.ctx?.id;
    }
    keypress(key: string) {
        if (this.ctx) {
            this.ctx.keypress(key);
        }
    }
}

export const keyboards = new Map<string, Keyboard>();

export function addKeyboard(board: Keyboard) {
    keyboards.set(board.id, board);
    return board.id;
}