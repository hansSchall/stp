import React, { PropsWithChildren, createContext, useContext, useState } from "react";
import { tablist } from "../../../exportonly";

interface Fold {
    fold: Map<string, boolean>,
    setFold(id: string, fold: boolean): void,
}

const FoldContext = createContext<Fold>({
    fold: new Map(),
    setFold: () => { },
});

interface DevTreeStruct {
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

function groupNodes(nodes: DevTreeStruct[]) {
    const res = new Map<string, DevTreeStruct[]>();
    for (const i of nodes) {
        res.get(i.cat ?? "")?.push(i) || res.set(i.cat ?? "", [i]);
    }
    return res;
}

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
                {/* <DevTreeNode label="Root">
                    <DevTreeNode label="Serial0">
                        <DevTreeNode label="DCC-EX CommandStation">
                            <DevTreeNode label="DCC Output"></DevTreeNode>
                        </DevTreeNode>
                    </DevTreeNode>
                    <DevTreeNode label="Serial1"></DevTreeNode>
                    <DevTreeNode label="DCC-Mgr">
                        <DevTreeGroup label="Loco">
                            <DevTreeNode label="Vectron"></DevTreeNode>
                            <DevTreeNode label="Gravita"></DevTreeNode>
                            <DevTreeNode label="E94"></DevTreeNode>
                        </DevTreeGroup>
                        <DevTreeGroup label="Acc"></DevTreeGroup>
                    </DevTreeNode>
                </DevTreeNode> */}
            </div>
            <div className="devt-props">

            </div>
        </FoldContext.Provider>
    </>;
}

function DevTreeNode(p: PropsWithChildren & {
    // label: string,
    // id: string
    node: DevTreeStruct,
}) {
    const fold = useContext(FoldContext);
    return <div className="devt-node -node">
        <div className="devt-node-label">
            <i className="bi-chevron-right" onClick={() => {
                fold.setFold(p.node.id, !fold.fold.get(p.node.id));
            }} />
            {p.node.iid ? <div className="-iid">{p.node.iid}</div> : null}
            <div className="-label">{p.node.label}</div>
        </div>
        {fold.fold.get(p.node.id) ? null :
            <div className="devt-children">
                {groupNodes(p.node.children).map((cat, items) => {
                    const children = items.map(child => <DevTreeNode node={child} key={child.id} />);
                    if (cat)
                        return <DevTreeGroup label={cat} key={cat}>{children}</DevTreeGroup>;
                    else
                        return children;
                })
                }
                {/* {p.node.children.map(child => <DevTreeNode node={child} />)} */}
            </div>
        }
    </div>;
}
function DevTreeGroup(p: PropsWithChildren & {
    label: string,
    // id: string
}) {
    return <div className="devt-node -group">
        <div className="devt-node-label">
            <div className="-label">{p.label}</div>
        </div>
        <div className="devt-children">
            {p.children}
        </div>
    </div>;
}

tablist.set("devTree", {
    id: "devTree",
    label: "Device Tree",
    comp: DevTree,
});
