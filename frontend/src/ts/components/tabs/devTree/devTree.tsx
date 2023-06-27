import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { tablist } from "../../../exportonly";
import { DevTreeNode } from "./tree";
import { DevTreeProps } from "./props";
import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { createStateContext } from "react-use";

interface Fold {
    fold: Map<string, boolean>,
    setFold(id: string, fold: boolean): void,
}

export const FoldContext = createContext<Fold>({
    fold: new Map(),
    setFold: () => { },
});

export const DevTreeStruct = Type.Recursive(Item => Type.Object({
    id: Type.String(),
    label: Type.String(),
    cat: Type.Optional(Type.String()),
    iid: Type.Optional(Type.String()),
    children: Type.Array(Item),
}));

export type DevTreeStruct = Static<typeof DevTreeStruct>;

const DevTreeChecker = TypeCompiler.Compile(DevTreeStruct);

// interface DevTreeNodeContextType {

// }

// const DevTreeNodeContext = createContext<DevTreeNodeContextType>({

// });

function useDevTree() {
    const [tree, setTree] = useState<DevTreeStruct>({
        id: "root",
        label: "Root",
        children: [],
    });

    useEffect(() => {
        const abort = new AbortController();
        fetch(new URL("/api/tree/full", location.href), {
            signal: abort.signal,
        }).then(res => {
            if (res.ok) {
                res.json().then(treeUnchecked => {
                    if (DevTreeChecker.Check(treeUnchecked)) {
                        const checkedTree: DevTreeStruct = treeUnchecked;
                        setTree(checkedTree);
                    }
                });
            }
        });
        return () => {
            abort.abort();
        };
    }, []);

    return { tree };
}

export const [useSelNode, SelNodeCtx] = createStateContext("");


function DevTree() {
    const [fold, setFold] = useState<Fold>({
        fold: new Map(),
        setFold(id, foldState) {
            fold.fold.set(id, foldState);
            setFold({
                ...fold,
                fold: fold.fold,
            });
        },
    });

    const { tree } = useDevTree();

    const [selNode, setSelNode] = useSelNode();

    return <>
        <FoldContext.Provider value={fold}>
            <div className="devt-list">
                <DevTreeNode node={tree} />
            </div>
            <DevTreeProps />
        </FoldContext.Provider>
    </>;
}

function DevTreeContextWrapper() {
    return <SelNodeCtx>
        <DevTree />
    </SelNodeCtx>;
}



tablist.set("devTree", {
    id: "devTree",
    label: "Device Tree",
    comp: DevTreeContextWrapper,
});
