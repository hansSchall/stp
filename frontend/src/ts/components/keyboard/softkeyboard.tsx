import React, { CSSProperties, Fragment, PropsWithChildren, useContext } from "react";
import { keyboardDef } from "./keyboardDef";
import { CmdLineState } from "../cmdLine/cmdLine";

export function Softkeyboard(props: {

}) {
    return <div className="skb" key="skb-root" style={{
        gridTemplateColumns: keyboardDef[0].map(_ => _[0].length + "fr").join(" "),
        gridTemplateRows: keyboardDef.map(_ => _[0].length + "fr").join(" "),
    }}>
        {keyboardDef.map((row, rowInd) => <Fragment key={rowInd}>
            {row.map((col, colInd) => <Block key={`b${rowInd}.${colInd}`} x={colInd} y={rowInd}>
                {col.map((bRow, bRowInd) => <Fragment key={bRowInd}>
                    {bRow.map(([id, label], keyInd) => <Key id={id} label={label} key={`k${bRowInd}.${keyInd}`} x={keyInd} y={bRowInd} />)}
                </Fragment >)}
            </Block>)}
        </Fragment>)}
    </div>;
}

export function OverlaySoftkeyboard(props: {
    shown: boolean,
}) {
    if (props.shown)
        return <div className="overlay-skb">
            <Softkeyboard />
        </div>;
    else
        return null;
}

function Block(props: PropsWithChildren & {
    x: number,
    y: number,
}) {
    return <div className="skb-block" key={"skb-block"} style={xy2Grid(props.x, props.y)}>
        {props.children}
    </div>;
}

function Key(props: {
    id: string,
    label: string,
    x: number,
    y: number,
}) {
    if (props.id == "*") {
        return null;
    }
    const cmd = useContext(CmdLineState);
    return <div className="skb-key" key={"skb-key"} style={xy2Grid(props.x, props.y, props.id == "enter")} onClick={() => {
        cmd.keydown(props.id);
    }}>
        <div className="-label">{props.label}</div>
    </div>;
}

function xy2Grid(x: number, y: number, expand = false): CSSProperties {
    return {
        gridColumn: `${x + 1} / ${x + (expand ? 3 : 2)}`,
        gridRow: `${y + 1} / ${y + 2}`,
    };
}

function xy2GridSize(x: number, y: number): CSSProperties {
    return {
        gridAutoColumns: x + "fr",
        gridAutoRows: y + "fr",
    };
}
