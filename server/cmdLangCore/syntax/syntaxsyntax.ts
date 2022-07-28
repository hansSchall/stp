import { Branch } from "../src/parseQuery";
import { FK } from "./flags";

export function parseSyntax(syntax: [string, SyntaxRecord][]): Map<string, SyntaxRecord> {
    return new Map(syntax);
}
export interface SyntaxRecord {
    desc?: string,
    consumeStep?: boolean,
    fixString?: string,
    number?: FK,
    needCurrentStep?: boolean,
    continueWith?: string | string[],
    fn?: (this: Branch, ctx: Branch, record: SyntaxRecord) => void | Promise<void>
}