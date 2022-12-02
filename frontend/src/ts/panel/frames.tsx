import { cloneDeep } from "lodash-es";
import React, { useEffect, useState } from "react";
import { Keyboard } from "../components/keyboard/keyboard";
import { Bi } from "../lib/bi";
import { useHover } from "../lib/useHover";

export function Frames(props: {
    editing: boolean,
    splitting: Splitting,
    setSplitting: (splitting: Splitting) => void,
}) {
    const { splitting, setSplitting } = props;

    function getRecurse(arr: Splitting, index: number[]) {
        let current = arr;
        // console.log(current, index.length);
        if (index.length == 0) return current;
        while (index.length && current) {
            const n = current[index.shift() ?? 0].content;
            // console.log(n);
            if (n instanceof Array) {
                current = n;
            } else
                return current;
        }
        return current;
    }
    return <main className="frames">
        <Frame splitting={splitting} flex={1} dir="row" edit={{
            editing: props.editing,
            insertBefore(before) {
                // console.log("inserting", before);
                const index = before.pop() as number;
                // console.log(index);
                // before.shift();
                const copy = cloneDeep(splitting);

                getRecurse(copy, before)
                    .splice(index, 0, {
                        content: [],
                        flex: 1,
                    } as Area)


                // let current = spcp;
                // while (before.length) {
                //     const n = current[before.shift() ?? 0].content;
                //     if (n instanceof Array) {
                //         current = n;
                //         console.log(current);
                //     } else
                //         break;
                // }
                // console.log(current, before);
                setSplitting(copy);
            },
            deleteFrame(frame: number[]) {
                const copy = cloneDeep(splitting);
                const index = frame.pop() as number;
                const a = getRecurse(copy, frame);
                a.splice(index, 1);
                // console.log("delete", index)
                setSplitting(copy);
            },
            convertToTabFrame(frame: number[]) {
                const copy = cloneDeep(splitting);
                if (frame.length) {
                    const index = frame.pop() ?? 0;
                    getRecurse(copy, frame)[index].content = {
                        tabs: []
                    }
                } else {
                    copy.push({
                        flex: 1,
                        content: []
                    } as Area)
                }
                setSplitting(copy);
            },
            wrapTabFrame(frame: number[]) {
                // console.log(frame);
                const copy = cloneDeep(splitting);
                const index = frame.pop() as number;
                // console.log(copy, frame);
                const a = (getRecurse(copy, frame));
                // console.log(a);
                const flex = a[index].flex;
                a[index].flex = 1;
                a[index] = {
                    flex: flex,
                    content: [a[index]]
                }
                // a.content = [a];
                // console.log(copy);
                setSplitting(copy);
            },
            updateTabs(tabs, frame) {
                const copy = cloneDeep(splitting);
                const index = frame.pop() as number;
                const a = (getRecurse(copy, frame))[index].content;
                if (a instanceof Array) {
                    console.warn("updating tabs of non-tab frame");
                } else {
                    a.tabs = tabs;
                }
                setSplitting(copy);
            },
        }} index={[]}></Frame>
    </main>
}
type Edit = {
    editing: boolean,
    insertBefore(before: number[]): void,
    deleteFrame(index: number[]): void,
    convertToTabFrame(frame: number[]): void,
    wrapTabFrame(frame: number[]): void,
    updateTabs(tabs: string[], index: number[]): void
}
function Frame(props: {
    splitting: Splitting,
    flex: number,
    dir: Dir,
    edit: Edit,
    index: number[],
    tabs?: TabArea,
    firstEl?: boolean,
}) {
    const [markFrameRed, deleteButtonEvs] = useHover();
    return <>
        {props.edit.editing && props.firstEl ? <div className="insert-frame" onClick={() => {
            const a = [...props.index];
            a.last = 0;
            props.edit.insertBefore(a);
        }}>
            <Bi i="plus-lg" />
        </div> : null}
        <div className={"frame flex-dir-" + props.dir + (markFrameRed ? " mark-red" : "")} style={{
            flexGrow: props.flex,
            flexShrink: props.flex,
        }}>
            {props.edit.editing && props.index.length ? <div className="insert-frame box" style={{
                flexDirection: switchDir(props.dir)
            }}>
                <div className="insert-frame a-delete" onClick={() => {
                    props.edit.deleteFrame(props.index);
                }} {...deleteButtonEvs}>
                    <Bi i="trash" />
                </div>
                <div className="insert-frame" onClick={() => {
                    // props.edit.deleteFrame(props.index);
                }} >
                    <Bi i="arrows-angle-expand" />
                </div>
            </div> : null}
            {props.tabs ?
                <TabFrame
                    tabs={props.tabs}
                    edit={props.edit}
                    index={props.index}
                /> :
                (props.splitting.length ?
                    props.splitting.map((area, index) => {
                        return <Frame
                            splitting={area.content instanceof Array ? area.content : []}
                            flex={area.flex}
                            dir={switchDir(props.dir)}
                            edit={props.edit}
                            index={[...props.index, index]}
                            tabs={area.content instanceof Array ? undefined : area.content}
                            firstEl={!index}
                            key={[...props.index, index].toString()}
                        />
                    }) :
                    (((() => {
                        setTimeout(() => {
                            const a = [...props.index];
                            props.edit.convertToTabFrame(a);
                        }, 0)
                    })()), <div>
                            empty frame
                        </div>
                    )
                )
            }
        </div>
        {props.edit.editing && props.index.length > 0 ? <div className="insert-frame" onClick={() => {
            const a = [...props.index];
            a.last++;
            props.edit.insertBefore(a);
        }}>
            +
        </div> : null}
    </>
}
function TabFrame(props: {
    tabs: TabArea,
    edit: Edit,
    index: number[]
}) {
    return <div className="tab-frame">
        {/* props.index.join(".") */}
        <Keyboard />
        {props.edit.editing ? <div className="tab-edit">
            <div onClick={() => {
                props.edit.wrapTabFrame(props.index);
            }}>
                <Bi i="signpost-split" />
            </div>
            <div onClick={() => {
                // props.edit.wrapTabFrame(props.index);
            }}>
                <Bi i="arrows-angle-expand" />
            </div>
        </div> : props.tabs.tabs.map(_ => <div key={_}>{_}</div>)}
    </div>
}
type Dir = "row" | "column";
const switchDir = (dir: Dir) => dir == "column" ? "row" : "column";
export type Splitting = Area[]
interface Area {
    flex: number,
    content: Splitting | TabArea
}
interface TabArea {
    tabs: string[]
}
