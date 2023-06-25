import React, { PropsWithChildren, createContext, useContext, useState } from "react";
import { tablist } from "../../../exportonly";
import { DevTreeNode } from "./tree";
import { DevTreeProps } from "./props";

interface Fold {
    fold: Map<string, boolean>,
    setFold(id: string, fold: boolean): void,
}

export const FoldContext = createContext<Fold>({
    fold: new Map(),
    setFold: () => { },
});

export interface DevTreeStruct {
    id: string,
    label: string,
    iid?: string,
    cat?: string,
    children: DevTreeStruct[],
}

// interface DevTreeNodeContextType {

// }

// const DevTreeNodeContext = createContext<DevTreeNodeContextType>({

// });



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
    const [tree, setTree] = useState<DevTreeStruct>({
        id: "root",
        label: "Root",
        children: [
            {
                id: "serial0",
                label: "Serial 0",
                iid: "COM6",
                cat: "Serial",
                children: [
                    {
                        id: "dccex",
                        label: "DCC-EX CommandStation",
                        children: [
                            {
                                id: "dccexdccmain",
                                label: "DCC Main Output",
                                children: [

                                ]
                            },
                            {
                                id: "dccexdccprog",
                                label: "DCC Prog Output",
                                children: [

                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: "dccroot",
                label: "DCC Root",
                cat: "Virtual",
                children: [
                    {
                        id: "askjd",
                        iid: "L20",
                        label: "Vectron",
                        cat: "loco",
                        children: [

                        ]
                    },
                    {
                        id: "dafgjk",
                        iid: "L21",
                        label: "Gravita",
                        cat: "loco",
                        children: [

                        ]
                    },
                    {
                        id: "ksadjf",
                        iid: "L22",
                        label: "E94",
                        cat: "loco",
                        children: [

                        ]
                    },



                    {
                        id: "kdfjg",
                        iid: "A1-4",
                        label: "WD 01",
                        cat: "Acc",
                        children: [
                            {
                                id: "lk",
                                iid: "A1",
                                label: "WD 01.1",
                                children: [

                                ]
                            },
                            {
                                id: "lk2",
                                iid: "A2",
                                label: "WD 01.2",
                                children: [

                                ]
                            },
                            {
                                id: "lk3",
                                iid: "A3",
                                label: "WD 01.3",
                                children: [

                                ]
                            },
                            {
                                id: "lk4",
                                iid: "A4",
                                label: "WD 01.4",
                                children: [

                                ]
                            }
                        ]
                    },
                    {
                        id: "dlfkgj",
                        iid: "A5-8",
                        label: "WD 02",
                        cat: "Acc",
                        children: [

                        ]
                    },
                    {
                        id: "a;lksdf",
                        iid: "A9-12",
                        label: "WD 03",
                        cat: "Acc",
                        children: [

                        ]
                    },
                    {
                        id: "aslkdfj",
                        iid: "A13-20",
                        label: "WD 04",
                        cat: "Acc",
                        children: [

                        ]
                    }
                ]
            }
        ]
    });
    return <>
        <FoldContext.Provider value={fold}>
            <div className="devt-list">
                <DevTreeNode node={tree} />
            </div>
            <DevTreeProps />
        </FoldContext.Provider>
    </>;
}



tablist.set("devTree", {
    id: "devTree",
    label: "Device Tree",
    comp: DevTree,
});
