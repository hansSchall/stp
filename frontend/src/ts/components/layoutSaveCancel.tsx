import React from "react";
import { Bi } from "../lib/bi";

export function LayoutSaveCancel(props: {
    onSave: VoidFunction,
    onCancel: VoidFunction,
}) {
    return <div style={{
        position: "fixed",
        left: "6rem",
        top: "2rem",
        display: "flex",
        backgroundColor: "#111",
        borderRadius: ".3rem"
    }}>
        <SCButton icon="check-lg" onClick={props.onSave} color="green" />
        <SCButton icon="x-lg" onClick={props.onCancel} color="red" />
    </div>
}
function SCButton(p: {
    icon: string,
    onClick: VoidFunction,
    color: string
}) {
    return <button {...p} style={{
        backgroundColor: p.color,
        flex: "0 0 4rem",
        height: "4rem",
        width: "4rem",
        border: ".2rem solid #111",
        borderRadius: ".3rem",
        fontSize: "2rem",
        margin: ".3rem"
    }}>
        <Bi i={p.icon} />
    </button>
}