import React, { Fragment } from "react";
import { TrackColor } from "./trackView";
import { TrackBase, TrackCornerBase, TrackCornerInner, TrackInner, TurnoutSwitch, TurnoutTrack } from "./tvEls";
import { add, mul, sub, vec2 } from "./vec2";
// @ts-ignore
import img from "C:/Users/hansi/Pictures/DSC02472.JPG";

export function TrackViewRender(props: {
    offset: vec2,
    scale: number,
    tracks: RenderOptions.Track[],
    turnouts: RenderOptions.Turnout[],
}) {
    function off(pos: vec2) {
        return pos;
    }
    return <div className="trv-view" style={{
        fontSize: props.scale + "rem",
        left: props.offset[0] + "px",
        top: props.offset[1] + "px",
    }}>
        <div className="trv-layer -track-base" key="trv-layer-track-base">
            {props.tracks.map(track => <Fragment key={track.id}>
                {[...G2T.g2t(track.points)].map((part, ind) =>
                    part.type == "point" ?
                        <TrackCornerBase pos={part.pos} key={`track-${track.id}-${ind}-bc`} />
                        :
                        <TrackBase from={part.from} to={part.to} key={`track-${track.id}-${ind}-bt`} />
                )}
            </Fragment>)}
        </div>
        <div className="trv-layer -track-inner" key="trv-layer-track-inner">
            {props.tracks.map(track => <Fragment key={track.id}>
                {[...G2T.g2t(track.points)].map((part, ind) =>
                    part.type == "point" ?
                        <TrackCornerInner pos={part.pos} color={track.color} key={`track-${track.id}-${ind}-ic`} />
                        :
                        <TrackInner from={part.from} to={part.to} color={track.color} key={`track-${track.id}-${ind}-it`} />
                )}
            </Fragment>)}
        </div>
        <div className="trv-layer -w-base" key="trv-layer-w-base">
            {props.turnouts.map(turnout => <Fragment key={turnout.id}>
                {turnout.tracks.map((track, ind) => <TurnoutTrack from={turnout.pos} to={track.to} locked={track.locked && turnout.locked} key={`turnout-${turnout.id}-${ind}-to-tr`} />)}
            </Fragment>)}
        </div>
        <div className="trv-layer -w-top" key="trv-layer-w-top">
            {props.turnouts.map(turnout => <TurnoutSwitch pos={turnout.pos} key={turnout.id} />)}
        </div>
    </div>
}

export namespace RenderOptions {
    export interface Track {
        id: string,
        points: vec2[],
        color: TrackColor,
    }
    export interface Turnout {
        id: string,
        pos: vec2,
        tracks: TurnoutTrack[],
        locked: boolean,
    }
    export interface TurnoutTrack {
        to: vec2,
        locked: boolean,
    }
}

namespace G2T {
    export function* g2t(g: vec2[]): Generator<Track | Point, void, void> {
        for (let i = 0; i < g.length; i++) {
            if (i > 0) {
                yield {
                    type: "track",
                    from: g[i - 1],
                    to: g[i],
                }
                if (i < (g.length - 1))
                    yield {
                        type: "point",
                        pos: g[i],
                    }
            }
        }
    }
    interface Track {
        type: "track",
        from: vec2,
        to: vec2,
    }
    interface Point {
        type: "point",
        pos: vec2,
    }
}
