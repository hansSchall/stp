import React, { useEffect, useReducer, useRef, useState } from "react";
import { tablist } from "../../../exportonly";
import { Bi } from "../../../lib/bi";
import { chanSymbolMap } from "../../chs/chanSymblMap";
import { Chs } from "../../chs/chs";
import { ChanView } from "../chanView/chanView";
import { TVSheetSelection } from "./sheetSelection";
import { TrackViewRender } from "./tvRender";
import { add, mul, sub, vec2, vecDiff } from "./vec2";

export function TrackView(props: {
    id: number,
    sheetSelection: VoidFunction,
}) {
    const [zoom, setZoom] = useState(1);
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);
    const posOff = vec2(xPos, yPos);

    const [chanSel, setChanSel] = useState(false);
    const [toEdit, setToEdit] = useState(false);
    const [edit, setEdit] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const DEFAULT_MOVE_AMOUNT = 5 * 16 * (1 / zoom);

    function getContentSize(): vec2 {
        return vec2(50, 40);
    }
    function getTopLeftContent(): vec2 {
        return vec2(0, 0);
    }

    function applyZoomDiff(amount: number) { // 1 = no change
        const prevCenter = getCenterPoint();
        setZoom(zoom * amount);
        centerViewOn(prevCenter, zoom * amount);
    }
    function getUnitPointOfPx(pos: vec2) {
        return mul(pos, 1 / (zoom * 16));
    }
    function getPxOfUnitPoint(pos: vec2, zoomOverride?: number) {
        return mul(pos, (zoomOverride || zoom) * 16);
    }
    function getCenterPoint() {
        const viewArea = containerRef.current?.getBoundingClientRect();
        if (viewArea) {
            const tl = vec2(viewArea.x, viewArea.y);
            const wh = vec2(viewArea.width, viewArea.height);
            const center = add(tl, mul(wh, 0.5));
            return getUnitPointOfPx(sub(center, posOff))
        } else {
            return vec2(0, 0);
        }
    }
    function centerViewOn(pos: vec2, zoomOverride?: number) {
        const viewArea = containerRef.current?.getBoundingClientRect();
        if (viewArea) {
            const tl = vec2(viewArea.x, viewArea.y);
            const wh = vec2(viewArea.width, viewArea.height);
            const center = add(tl, mul(wh, 0.5));
            const centerTo = sub(center, getPxOfUnitPoint(pos, zoomOverride));
            setXPos(centerTo[0]);
            setYPos(centerTo[1]);
        }
    }

    function homePos() {
        const viewArea = containerRef.current?.getBoundingClientRect();
        if (viewArea) {
            const emW = viewArea.width / 16;
            const emH = viewArea.height / 16;
            const viewportWidth = emW - 3 - (edit ? 42 : 0);
            const viewportHeight = emH - 5;
            const [contentX, contentY] = getContentSize();
            const maxXScale = viewportWidth / contentX;
            const maxYScale = viewportHeight / contentY;
            const scale = Math.min(maxXScale, maxYScale);
            setZoom(scale);
            const [negXContent, negYContent] = getTopLeftContent();
            centerViewOn(vec2(negXContent + contentX / 2, negYContent + contentY / 2), scale)
        }
    }

    return <div className="trv-container" ref={containerRef}>
        <div className="trv-content" onWheel={(ev) => {
            ev.preventDefault();
            if (ev.deltaMode == 0x0) { // px
                // 1 wheel tick ~ 100 px
                applyZoomDiff(-ev.deltaY / 1000 + 1);
            }
        }} onMouseMove={ev => {
            if (ev.buttons & 2) {
                setXPos(xPos + ev.movementX);
                setYPos(yPos + ev.movementY);
            }
        }} key="view-box">
            <TrackViewRender scale={zoom} offset={vec2(xPos, yPos)} tracks={[
                {
                    id: "1",
                    color: TrackColor.BEL,
                    points: [[10, 20], [30, 20]]
                },
                {
                    id: "2",
                    color: TrackColor.NONE,
                    points: [[10, 10], [20, 10], [30, 20]]
                },
                {
                    id: "3",
                    color: TrackColor.FST,
                    points: [[30, 20], [40, 20], [50, 30], [50, 40]]
                },
            ]} turnouts={[
                {
                    id: "1",
                    pos: [30, 20],
                    tracks: [
                        {
                            to: [10, 20],
                            locked: true,
                        },
                        {
                            to: [20, 10],
                            locked: false,
                        },
                        {
                            to: [40, 20],
                            locked: true,
                        }
                    ],
                    locked: false,
                }
            ]} />
        </div>
        <div className="trv-nav" key="nav">
            <div className="trv-nav-button" key="edit" onClick={() => { setEdit(!edit) }}><Bi i="pencil" /></div>
            <div className="trv-nav-button" key="collection" onClick={(props.sheetSelection)}><Bi i="collection" /></div>
            <div className="trv-nav-button" key="reload"><Bi i="arrow-repeat" /></div>
            <div className="trv-nav-spacer" key="spacer-1"></div>
            <div className="trv-nav-button" key="viewHome" onClick={homePos}><Bi i="aspect-ratio" /></div>
            <div className="trv-nav-spacer" key="spacer-2"></div>
            <div className="trv-nav-button" key="left" onClick={() => { setXPos(xPos - DEFAULT_MOVE_AMOUNT) }}><Bi i="arrow-left" /></div>
            <div className="trv-nav-button" key="down" onClick={() => { setYPos(yPos + DEFAULT_MOVE_AMOUNT) }}><Bi i="arrow-down" /></div>
            <div className="trv-nav-button" key="up" onClick={() => { setYPos(yPos - DEFAULT_MOVE_AMOUNT) }}><Bi i="arrow-up" /></div>
            <div className="trv-nav-button" key="right" onClick={() => { setXPos(xPos + DEFAULT_MOVE_AMOUNT) }}><Bi i="arrow-right" /></div>
            <div className="trv-nav-spacer" key="spacer-3"></div>
            <div className="trv-nav-button" key="zoom-in" onClick={() => { applyZoomDiff(1.1) }}><Bi i="zoom-in" /></div>
            <div className="trv-nav-button" key="zoom-out" onClick={() => { applyZoomDiff(.9) }}><Bi i="zoom-out" /></div>
            <div className="trv-nav-spacer" key="spacer-4"></div>
            <div className="trv-nav-button" key="hide"><Bi i="chevron-bar-up" /></div>
        </div>
        {edit ? <>
            <div className="trv-parts trv-sidebar" key="edit-parts">
                <div className="trv-sidebar-title">Bauteile</div>
                <div className="trv-sidebar-content">
                    {[...chanSymbolMap].map(([id]) => <div className="trv-lib-item" key={id}>
                        <div className="trv-lib-symbl">
                            <Chs id={id} />
                        </div>
                    </div>)}
                </div>
            </div>
            <div className="trv-props trv-sidebar" key="edit-settings">
                <div className="trv-sidebar-title">Eigenschaften</div>
                <div className="trv-sidebar-content">

                </div>
            </div>
        </>
            : null}
        {chanSel ? <div className="trv-chansel" key="chanSel">
            <div className="trv-chansel-content">
                <ChanView />
            </div>
        </div> : null}
        {toEdit ? <div className="trv-to-editor" key="turnout-editor">
            <div className="trv-to-editor-content">
            </div>
        </div> : null}
    </div>
}

export enum TrackColor {
    BEL = "bel",
    FST = "fst",
    NONE = "",
}

tablist.set("trackView", {
    id: "trackView",
    label: "Track View",
    comp: TVSheetSelection,
})
