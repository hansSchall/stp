import React, { useReducer, useRef, useState } from "react";
import { tablist } from "../../../exportonly";
import { Bi } from "../../../lib/bi";
import { chanSymbolMap } from "../chanView/chanSymblMap";
import { ChanView } from "../chanView/chanView";
import { vec2, vecDiff } from "./vec2";

export function TrackView() {
    const [zoom, setZoom] = useState(1);
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);

    function homePos() {
        const viewArea = containerRef.current?.getBoundingClientRect();
        if (viewArea) {
            const emW = viewArea.width / 16;
            const emH = viewArea.height / 16;

        } else {
            setTimeout(homePos, 100);
        }
    }

    return <>
        <div className="trv-container" ref={containerRef}>
            <div className="trv-content">
                <div className="trv-view">
                    <div className="trv-layer -track-base">
                        <TrackBase from={vec2(10, 10)} to={vec2(20, 10)} />
                        <TrackCornerBase pos={vec2(20, 10)} />
                        <TrackBase from={vec2(20, 10)} to={vec2(30, 20)} />
                    </div>
                    <div className="trv-layer -track-inner">
                        <TrackInner color={TrackColor.FST} from={vec2(10, 10)} to={vec2(20, 10)} />
                        <TrackCornerInner color={TrackColor.FST} pos={vec2(20, 10)} />
                        <TrackInner color={TrackColor.FST} from={vec2(20, 10)} to={vec2(30, 20)} />
                    </div>
                    <div className="trv-layer -w-base">
                        <TurnoutTrack from={vec2(30, 20)} to={vec2(20, 10)} />
                        <TurnoutSwitch pos={vec2(30, 20)} />

                        {/* <div className="trv-to-track"></div> */}
                    </div>
                    <div className="trv-layer -w-top">
                        {/* <div className="trv-track-base"></div> */}
                    </div>
                </div>
            </div>
            <div className="trv-nav">
                <div className="trv-nav-button"><Bi i="collection" /></div>
                <div className="trv-nav-button"><Bi i="arrow-repeat" /></div>
                <div className="trv-nav-spacer"></div>
                <div className="trv-nav-button"><Bi i="aspect-ratio" /></div>
                <div className="trv-nav-spacer"></div>
                <div className="trv-nav-button"><Bi i="arrow-left" /></div>
                <div className="trv-nav-button"><Bi i="arrow-down" /></div>
                <div className="trv-nav-button"><Bi i="arrow-up" /></div>
                <div className="trv-nav-button"><Bi i="arrow-right" /></div>
                <div className="trv-nav-spacer"></div>
                <div className="trv-nav-button"><Bi i="zoom-in" /></div>
                <div className="trv-nav-button"><Bi i="zoom-out" /></div>
                <div className="trv-nav-spacer"></div>
                <div className="trv-nav-button"><Bi i="chevron-bar-up" /></div>
            </div>
            <div className="trv-parts trv-sidebar">
                <div className="trv-sidebar-title">Bauteile</div>
                <div className="trv-sidebar-content">
                    {[...chanSymbolMap].map(([id, sym], ind) => <div className="trv-lib-item">
                        <div className="trv-lib-symbl">
                            <div className="chs-box">
                                {sym.map(def => <div className={"chs-" + def} />)}
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>
            <div className="trv-props trv-sidebar">
                <div className="trv-sidebar-title">Eigenschaften</div>
                <div className="trv-sidebar-content">

                </div>
            </div>
            {/* <div className="trv-chansel">
                <div className="trv-chansel-content">
                    <ChanView />
                </div>
            </div> */}
        </div>
    </>
}

function TrackBase(props: {
    from: vec2,
    to: vec2,
}) {
    const [d, a] = xy2pol(...vecDiff(props.from, props.to));
    console.log(props.from, props.to, a, d);
    return <div className="trv-track-base" style={{
        left: props.from[0] + "em",
        top: props.from[1] + "em",
        width: d + "em",
        transform: `translateY(-50%) rotate(${a}deg)`
    }}></div>
}

interface TVLayout {
    tracks: TVTrack[],
}

interface TVTrack {

}

function TrackCornerBase(props: {
    pos: vec2,
}) {
    return <div className="trv-track-corner-base" style={{
        left: props.pos[0] + "em",
        top: props.pos[1] + "em",
    }}></div>
}
function TrackInner(props: {
    from: vec2,
    to: vec2,
    color: TrackColor,
}) {
    const [d, a] = xy2pol(...vecDiff(props.from, props.to));
    return <div className={"trv-track-inner -" + props.color} style={{
        left: props.from[0] + "em",
        top: props.from[1] + "em",
        width: d + "em",
        transform: `translateY(-50%) rotate(${a}deg)`
    }}></div>
}
function TrackCornerInner(props: {
    pos: vec2,
    color: TrackColor,
}) {
    return <div className={"trv-track-corner-inner -" + props.color} style={{
        left: props.pos[0] + "em",
        top: props.pos[1] + "em",
    }}></div>
}
function TurnoutTrack(props: {
    from: vec2,
    to: vec2,
}) {
    const [d, a] = xy2pol(...vecDiff(props.from, props.to));
    return <div className="trv-to-track" style={{
        left: props.from[0] + "em",
        top: props.from[1] + "em",
        transform: `translateY(-50%) rotate(${a}deg)`
    }}></div>
}
function TurnoutSwitch(props: {
    pos: vec2,
}) {
    return <div className="trv-to-switch" style={{
        left: props.pos[0] + "em",
        top: props.pos[1] + "em",
    }}>W5</div>
}

export enum TrackColor {
    BEL = "bel",
    FST = "fst",
    NONE = "",
}

function xy2pol(x: number, y: number): [number, number] {
    const d = Math.sqrt(x * x + y * y);
    let a = Math.atan2(y, x) * (180 / Math.PI);
    return [d, a]
}

tablist.set("trackView", {
    id: "trackView",
    label: "Track View",
    comp: TrackView,
})
