import React from "react";
import { TrackColor } from "./trackView";
import { vec2, vecDiff, xy2pol } from "./vec2";

export function TrackBase(props: {
    from: vec2,
    to: vec2,
}) {
    const [d, a] = xy2pol(vecDiff(props.from, props.to));
    // console.log(props.from, props.to, a, d);
    return <div className="trv-track-base" style={{
        left: props.from[0] + "em",
        top: props.from[1] + "em",
        width: d + "em",
        transform: `translateY(-50%) rotate(${a}deg)`
    }}></div>
}
export function TrackCornerBase(props: {
    pos: vec2,
}) {
    return <div className="trv-track-corner-base" style={{
        left: props.pos[0] + "em",
        top: props.pos[1] + "em",
    }}></div>
}
export function TrackInner(props: {
    from: vec2,
    to: vec2,
    color: TrackColor,
}) {
    const [d, a] = xy2pol(vecDiff(props.from, props.to));
    return <div className={"trv-track-inner -" + props.color} style={{
        left: props.from[0] + "em",
        top: props.from[1] + "em",
        width: d + "em",
        transform: `translateY(-50%) rotate(${a}deg)`
    }}></div>
}
export function TrackCornerInner(props: {
    pos: vec2,
    color: TrackColor,
}) {
    return <div className={"trv-track-corner-inner -" + props.color} style={{
        left: props.pos[0] + "em",
        top: props.pos[1] + "em",
    }}></div>
}
export function TurnoutTrack(props: {
    from: vec2,
    to: vec2,
    locked: boolean,
}) {
    const [d, a] = xy2pol(vecDiff(props.from, props.to));
    return <div className={"trv-to-track" + (props.locked ? " -locked" : "")} style={{
        left: props.from[0] + "em",
        top: props.from[1] + "em",
        transform: `translateY(-50%) rotate(${a}deg)`
    }}></div>
}
export function TurnoutSwitch(props: {
    pos: vec2,
}) {
    return <div className="trv-to-switch" style={{
        left: props.pos[0] + "em",
        top: props.pos[1] + "em",
    }}>W5</div>
}
