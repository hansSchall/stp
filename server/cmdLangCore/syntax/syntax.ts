import { union, without } from "lodash";
import { EXL } from "../exl/exl";
import { BranchStatus } from "../src/parseQuery";
import { mapArrayAdd, range as rangeFn } from "../src/utils";
import { FK, FV } from "./flags";
import { isAttrOf, isStringValueOf } from "./setValue";
import { parseSyntax } from "./syntaxsyntax";
import { resolveComplexTarget } from "./targetAlias";

export const syntax = parseSyntax([
    ["root", {
        desc: "Root",
        continueWith: ["selection"],
    }],
    ["selection", {
        desc: "Selection",
        continueWith: ["chan", "group", "rangeStart"],
        fn() {
            this.flags.n.delete(FK.RangeStart);
            this.flags.n.delete(FK.RangeEnd);
            this.flags.e.set(FK.SelectionTarget, FV.Chan);
        },
    }],
    ["chan", {
        desc: "Chan",
        fixString: "Chan",
        continueWith: "rangeStart",
        fn(this, ctx, record) {
            this.flags.e.set(FK.SelectionTarget, FV.Chan);
        },
    }],
    ["group", {
        desc: "Group",
        fixString: "Group",
        continueWith: "rangeStart",
        fn(this, ctx, record) {
            this.flags.e.set(FK.SelectionTarget, FV.Group);
        },
    }],
    ["rangeStart", {
        desc: "Range Start",
        number: FK.RangeStart,
        continueWith: ["thru", "rangeAgg"]
    }],
    ["thru", {
        desc: "Thru",
        fixString: "Thru",
        continueWith: "rangeEnd"
    }],
    ["rangeEnd", {
        desc: "Range End",
        number: FK.RangeEnd,
        continueWith: "rangeAgg",
    }],
    ["rangeAgg", {
        desc: "",
        continueWith: ["plus", "minus", "selectChans"],
        async fn() {
            const rangeStart = this.flags.n.get(FK.RangeStart) ?? 0;
            const rangeEnd = this.flags.n.get(FK.RangeEnd) ?? 0;
            const range = rangeEnd ? rangeFn(rangeStart, rangeEnd) : [rangeStart];
            const ctarget = this.flags.e.get(FK.SelectionTarget) ?? FV.Chan; //complexTarget
            const ptarget = await resolveComplexTarget(ctarget, range) ?? [];
            const Aggregation = this.flags.e.get(FK.Aggregation);
            const oldSelection = this.flags.na.get(FK.Selection) ?? [];
            let newSelection: number[] = [];
            if (Aggregation === FV.Plus) {
                newSelection = union(oldSelection, ptarget);
            } else if (Aggregation === FV.Minus) {
                newSelection = without(oldSelection, ...ptarget);
            } else {
                newSelection = ptarget;
            }
            this.flags.na.set(FK.Selection, newSelection);
        },
    }],
    ["plus", {
        desc: "+",
        fixString: "+",
        continueWith: "selection",
        fn() {
            this.flags.e.set(FK.Aggregation, FV.Plus);
        },
    }],
    ["minus", {
        desc: "-",
        fixString: "-",
        continueWith: "selection",
        fn() {
            this.flags.e.set(FK.Aggregation, FV.Minus);
        },
    }],
    ["selectChans", {
        desc: "Select Chans",
        continueWith: ["attr", "enter"],
        fn() {
            this.addResult(EXL.selectChans(this.flags.na.get(FK.Selection) ?? []));
        },
    }],
    ["attr", {
        desc: "Attr",
        consumeStep: true,
        needCurrentStep: true,
        async fn() {
            if (await isAttrOf(this.currentStep.toString(), this.flags.na.get(FK.Selection) ?? [])) {
                this.flags.s.set(FK.Attr, this.currentStep.toString());
                this.continueWith("value");
            } else {
                this.exit(BranchStatus.SYNTAXERROR);
            }
        },
    }],
    ["value", {
        desc: "Value",
        consumeStep: true,
        needCurrentStep: true,
        async fn() {
            if (await isStringValueOf(this.flags.s.get(FK.Attr) ?? "", this.currentStep.toString(), this.flags.na.get(FK.Selection) ?? [])) {
                this.addResult(EXL.setAttrValue(this.flags.na.get(FK.Selection) ?? [], this.flags.s.get(FK.Attr) ?? "", this.currentStep.toString()));
                this.continueWith("enter");
            } else {
                this.exit(BranchStatus.SYNTAXERROR);
            }
        },
    }],
    ["enter", {
        desc: "Enter",
        fixString: "Enter",
        fn() {
            this.flags.e.set(FK.Execute, FV.True);
            this.exit(BranchStatus.FINISHED);
        }
    }],
    ["", {
        desc: "",
    }],
])