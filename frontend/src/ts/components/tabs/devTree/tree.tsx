import React, { useContext } from "react";
import { PropsWithChildren } from "react";
import { DevTreeStruct, FoldContext } from "./devTree";

function groupNodes(nodes: DevTreeStruct[]) {
    const res = new Map<string, DevTreeStruct[]>();
    for (const i of nodes) {
        res.get(i.cat ?? "")?.push(i) || res.set(i.cat ?? "", [i]);
    }
    return res;
}

export function DevTreeNode(p: PropsWithChildren & {
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
