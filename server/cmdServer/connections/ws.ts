import { Keyboard } from "../keyboard";

export class CmdWS {
    constructor(readonly send: (msg: any) => void, label: string) {
        this.keyboard = new Keyboard(label);
        send({
            keyboardId: this.keyboard.id,
        })
    }
    protected keyboard: Keyboard;
    gotMsg(msg: any) {
        if (msg?.key) {
            this.keyboard.keypress(msg.key);
        } else if (msg?.assignKeyboardTo) {
            this.keyboard.assignToContext(msg?.assignKeyboardTo);
        }
    }
}