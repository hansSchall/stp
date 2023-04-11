import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { tablist } from "../../../exportonly";
import { Bi } from "../../../lib/bi";
import { chanSymbolMap } from "../../chs/chanSymblMap";
import { Chs } from "../../chs/chs";
import { ChanView } from "../chanView/chanView";
import { TVSheetSelection } from "./sheetSelection";
import { TrackViewRender } from "./tvRender";
import { add, mul, sub, vec2, vecDiff } from "./vec2";
import { USVContent, USVFrame, USVOptions, useUSV } from "../../userScaledView/userScledView";

export function TrackView(props: {
    id: number,
    sheetSelection: VoidFunction,
}) {
    const [edit, setEdit] = useState(false);
    const [toEdit, setToEdit] = useState(false);
    const [chanSel, setChanSel] = useState(false);
    const [usvCtrl, USV] = useUSV();

    return <div className="trv-container">
        <USVOptions value={USV}>
            <USVFrame>
                <USVContent fontScaling={true}>
                    <TrackViewRender tracks={[
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
                </USVContent>
            </USVFrame>
        </USVOptions>
        <div className="trv-nav" key="nav">
            <div className="trv-nav-button" key="edit" onClick={() => { setEdit(!edit) }}><Bi i="pencil" /></div>
            <div className="trv-nav-button" key="collection" onClick={(props.sheetSelection)}><Bi i="collection" /></div>
            <div className="trv-nav-button" key="reload"><Bi i="arrow-repeat" /></div>
            <div className="trv-nav-spacer" key="spacer-1"></div>
            <div className="trv-nav-button" key="viewHome" onClick={usvCtrl.homePos.bind(usvCtrl)}><Bi i="aspect-ratio" /></div>
            <div className="trv-nav-spacer" key="spacer-2"></div>
            <div className="trv-nav-button" key="left" onClick={usvCtrl.moveLeft.bind(usvCtrl)}><Bi i="arrow-left" /></div>
            <div className="trv-nav-button" key="down" onClick={usvCtrl.moveDown.bind(usvCtrl)}><Bi i="arrow-down" /></div>
            <div className="trv-nav-button" key="up" onClick={usvCtrl.moveUp.bind(usvCtrl)}><Bi i="arrow-up" /></div>
            <div className="trv-nav-button" key="right" onClick={usvCtrl.moveRight.bind(usvCtrl)}><Bi i="arrow-right" /></div>
            <div className="trv-nav-spacer" key="spacer-3"></div>
            <div className="trv-nav-button" key="zoom-in" onClick={usvCtrl.zoomIn.bind(usvCtrl)}><Bi i="zoom-in" /></div>
            <div className="trv-nav-button" key="zoom-out" onClick={usvCtrl.zoomOut.bind(usvCtrl)}><Bi i="zoom-out" /></div>
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
