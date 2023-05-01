import { nextTick } from "process";
import { FK, FV } from "../syntax/flags";
import { syntax } from "../syntax/syntax";
import { QueryArr } from "./utils";
import { clone, cloneDeep, flattenDeep, last } from "lodash";
import { EXL } from "../exl/exl";

export function parseQuery(query: QueryArr): Promise<CmdResult> {
    return new Promise((res, rej) => {
        const branches: Branch[] = [new Branch(new ExecutionContext(query, res))];
        branches[0].runRec("root");
    });
}

export class Branch {
    constructor(readonly ctx: ExecutionContext) {
        ctx.addBranch(this);
    }

    clone() {
        const r = new Branch(this.ctx);
        r.step = this.step;
        r.consumeStep = this.consumeStep;
        r.results = clone(this.results);
        r.flags = cloneDeep(this.flags);
        r.history = clone(this.history);
        return r;
    }

    public status = BranchStatus.RUNNING;
    public step = 0;
    public consumeStep = false;
    currentStep: string | number = "";
    flags = {
        e: new Map<FK, FV>(),
        s: new Map<FK, string>(),
        n: new Map<FK, number>(),
        a: new Map<FK, any>(),
        sa: new Map<FK, string[]>(),
        na: new Map<FK, number[]>(),
        aa: new Map<FK, any[]>(),
    };
    results: EXL.Result[] = [];
    history: string[] = [];

    exit(reason: BranchStatus) {
        this.status = reason;
        this.ctx.finish(this);
    }

    split(into: string[]) {
        into.map(nextRec => {
            const res = this.clone();
            res.runRec(nextRec);
            return res;
        });
        this.exit(BranchStatus.NOT_NEEDED_ANYMORE);
    }

    branch(nextRec: string) {
        const res = this.clone();
        res.runRec(nextRec);
        return res;
    }

    addResult(result: EXL.Result) {
        this.results.push(result);
    }

    async runResults(effectfull: boolean) {
        const results = await Promise.all(this.results.map(_ =>
            _ instanceof Promise ? _ : Promise.resolve(_)
        ));
        return await Promise.all((effectfull ? results : results.filter(_ => !_.effectfull)).map(async res => {
            if (!res.filter || await res.filter.bind(this)()) {
                return await res.execute.bind(this)(this.ctx.client);
            }
        }));
    }

    continueWith(continueWith: string | string[] | void) {
        if (continueWith)
            if (typeof continueWith == "string")
                this.runRec(continueWith);
            else
                this.split(continueWith);
    }


    runRec(recName: string) {
        nextTick(async () => {
            if (this.consumeStep)
                this.step++;

            this.consumeStep = false;
            this.currentStep = this.ctx.query[this.step];

            this.history.push(`${this.currentStep}: ${recName}`);

            if (recName == "enter" && !this.currentStep)
                return this.exit(BranchStatus.FINISHED);

            const rec = syntax.get(recName);

            if (!this.currentStep && (rec?.needCurrentStep || rec?.number || rec?.fixString))
                return this.exit(BranchStatus.END_OF_QUERY);

            if (!rec)
                throw new Error(`Executing not existing record '${recName}'`);

            if (rec.consumeStep)
                this.consumeStep = true;

            if (rec.fixString && rec.fixString != this.currentStep)
                return this.exit(BranchStatus.SYNTAXERROR);
            else if (rec.fixString)
                this.consumeStep = true;

            if (rec.number && typeof this.currentStep == "number") {
                this.flags.n.set(rec.number, this.currentStep);
                this.consumeStep = true;
            } else if (rec.number)
                return this.exit(BranchStatus.SYNTAXERROR);

            await rec.fn?.bind(this)(this, rec);

            this.continueWith(rec.continueWith);
        });
    }
}

export enum BranchStatus {
    RUNNING,
    SYNTAXERROR,
    FINISHED,
    NOT_NEEDED_ANYMORE,
    END_OF_QUERY,
    RANGE_ERROR,
}

class ExecutionContext {
    constructor(readonly query: QueryArr, protected finished: (res: CmdResult) => void) {
        setTimeout(() => {
            if (this.timedOut)
                return;

            this.timedOut = true;
            console.error(`[cmdLangServer] Query timed out`);
            this.finished({
                results: this.client.results,
                msg: "Query timed out",
                executed: false,
            });
        }, 1000);
    }

    branches = new Set<Branch>();
    timedOut = false;

    addBranch(branch: Branch) {
        this.branches.add(branch);
    }

    finish(branch: Branch) {
        if ([...this.branches].filter(_ => _.status == BranchStatus.RUNNING).length) {

        } else {
            this.allFinished();
        }
    }

    protected async allFinished() {
        if (this.timedOut)
            return;
        else
            this.timedOut = true;

        const relevantBranches = [...this.branches]
            .filter(_ => _.status == BranchStatus.FINISHED)
            .sort((a, b) => b.step - a.step);

        console.log(`found ${relevantBranches.length} relevant branches`);

        const relevantBranch = relevantBranches[0];

        const execute = relevantBranch?.flags?.e?.get?.(FK.Execute) == FV.True
            || last(this.query) == "Enter";

        if (relevantBranch) {
            const msg = flattenDeep([
                await relevantBranch.runResults(execute),
                relevantBranch.flags.sa.get(FK.Msgs),
            ]).filter(_ => _).join(" AND ");
            this.finished({
                results: this.client.results,
                msg,
                executed: execute && !msg.length,
            });
        } else {
            if (execute) {
                this.finished({
                    results: new Map<string, any>(),
                    msg: "Syntax Error",
                    executed: false,
                });
            } else {
                this.finished({
                    results: new Map<string, any>(),
                    executed: false,
                });
            }
        }
    }
    client: EXL.ClientContext = {
        results: new Map<string, any>(),
    };
}

export class CmdResult {
    results = new Map<string, any>();
    msg?: string;
    executed: boolean = false;
}
