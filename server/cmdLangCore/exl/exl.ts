import { Branch } from "../src/parseQuery";

export namespace EXL {
    export function selectChans(range: number[]): Result {
        return {
            effectfull: false,
            execute(cl) {
                console.log("EXL: Select Chans:", range);
                cl.results.set("Selection", range);

            }
        }
    }
    export function setAttrValue(range: number[], attr: string, value: string): Result {
        return {
            effectfull: true,
            execute(cl) {
                console.log("EXL: setAttrValue:", range, attr, value);
            }
        }
    }
    export type Result = EXLresult | Promise<EXLresult>;
    export interface EXLresult {
        effectfull: boolean,
        execute: (this: Branch, client: ClientContext) => void | string | Promise<void | string>,
        filter?: (this: Branch) => boolean | Promise<boolean>
    }
    export interface ClientContext {
        results: Map<string, any>
    }
}