import React, { CSSProperties, PropsWithChildren } from "react";
import { keyboardDef } from "./keyboardDef";

export function Softkeyboard(props: {

}) {
    return <div className="skb" key="skb-root" style={{
        gridTemplateColumns: keyboardDef[0].map(_ => _[0].length + "fr").join(" "),
        gridTemplateRows: keyboardDef.map(_ => _[0].length + "fr").join(" "),
    }}>
        {keyboardDef.map((row, rowInd) => <>
            {row.map((col, colInd) => <Block key={`b${rowInd}.${colInd}`} x={colInd} y={rowInd}>
                {col.map((bRow, bRowInd) => <>
                    {bRow.map(([id, label, hardkey], keyInd) => <Key id={id} label={label} hardkey={hardkey} key={`k${bRowInd}.${keyInd}`} x={keyInd} y={bRowInd} />)}
                </>)}
            </Block>)}
        </>)}
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
    hardkey: string,
    x: number,
    y: number,
}) {
    return <div className="skb-key" key={"skb-key"} style={xy2Grid(props.x, props.y)}>
        <div className="-label">{props.label}</div>
    </div>;
}

function xy2Grid(
    x: number,
    y: number,
): CSSProperties {
    return {
        gridColumn: `${x + 1} / ${x + 2}`,
        gridRow: `${y + 1} / ${y + 2}`,
    };
}

function xy2GridSize(x: number, y: number): CSSProperties {
    return {
        gridAutoColumns: x + "fr",
        gridAutoRows: y + "fr",
    };
}
