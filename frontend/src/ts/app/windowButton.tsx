import React, { ButtonHTMLAttributes } from "react"
import { WindowButtonPortal } from "../lib/portal"

export function WindowButtons(props: {
    onMenu: VoidFunction,
    onKeyboard: VoidFunction,
    onEdit: VoidFunction,
    menu?: boolean,
    edit?: boolean,
    keyboard?: boolean,
}) {
    return <WindowButtonPortal>
        <WindowButton
            icon="three-dots"
            elattr={{
                onClick: props.onMenu
            }}
            active={!!props.menu}
        />
        <WindowButton
            icon={props.keyboard ? "keyboard-fill" : "keyboard"}
            elattr={{
                style: { fontSize: "1.5rem" },
                onClick: props.onKeyboard
            }}
            active={!!props.keyboard}
        />
        <WindowButton
            icon={"columns-gap"}
            elattr={{
                style: { fontSize: "1.2rem" },
                onClick: props.onEdit
            }}
            active={!!props.edit}
        />
    </WindowButtonPortal>
}
function WindowButton(props: {
    icon: string,
    active: boolean,
    elattr: ButtonHTMLAttributes<HTMLElement>
}) {
    return <button className={"h-b bi-" + props.icon + (props.active ? " active" : "")} {...props.elattr} ></button>
}
