import { PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import { windowButtonDOM } from "../frontend";



export function WindowButtonPortal(props: PropsWithChildren) {
    if (windowButtonDOM)
        return ReactDOM.createPortal(
            props.children,
            windowButtonDOM);
    else
        return null
}