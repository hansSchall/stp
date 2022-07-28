import { commandLines } from "../cmdLine";
import { keyboards } from "../keyboard";

export function getContextList() {
    return {
        keyboards: [...keyboards].map(([id, keyboard]) => ({
            id,
            label: keyboard.label,
            context: keyboard.getContextId(),
        })),
        cmdls: [...commandLines].map(([id, cmdLine]) => ({
            id,
            label: cmdLine.label,
            context: cmdLine.getContextId(),
        }))
    }
}