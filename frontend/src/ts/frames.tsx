import { cloneDeep } from "lodash-es";
import React, { useEffect, useState } from "react";
import { Bi } from "./lib/bi";
import { useHover } from "./lib/useHover";
import { ShowModal } from "./modal";
import { Modal, ModalTitle, ModalContent, ModalInput, ModalButtonRow, ModalButton } from "./modalStyle";
import { Tabs } from "./tabs";

export function Frames(props: {
    editing: boolean,
    splitting: Splitting,
    loadedSplitting: boolean,
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
    return <main className={"frames" + (props.editing ? " -edit" : "")}>
        <Frame splitting={splitting} loadedSplitting={props.loadedSplitting} flex={1} dir="row" edit={{
            editing: props.editing,
            insertBefore(before) {
                const index = before.pop() as number;
                const copy = cloneDeep(splitting);

                getRecurse(copy, before)
                    .splice(index, 0, {
                        content: [],
                        flex: 1,
                    } as Area);

                setSplitting(copy);
            },
            deleteFrame(frame: number[]) {
                const copy = cloneDeep(splitting);
                const index = frame.pop() as number;
                const a = getRecurse(copy, frame);
                a.splice(index, 1);
                setSplitting(copy);
            },
            convertToTabFrame(frame: number[]) {
                const copy = cloneDeep(splitting);
                if (frame.length) {
                    const index = frame.pop() ?? 0;
                    getRecurse(copy, frame)[index].content = {
                        tabs: []
                    };
                } else {
                    copy.push({
                        flex: 1,
                        content: []
                    } as Area);
                }
                setSplitting(copy);
            },
            wrapTabFrame(frame: number[]) {
                const copy = cloneDeep(splitting);
                const index = frame.pop() as number;
                const a = (getRecurse(copy, frame));
                const flex = a[index].flex;
                a[index].flex = 1;
                a[index] = {
                    flex: flex,
                    content: [a[index]]
                };
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
                sessionStorage.setItem("editor-splitting", JSON.stringify(copy));
            },
            resizeFrame(frame) {
                const copy = cloneDeep(splitting);
                const index = frame.pop() as number;
                const a = (getRecurse(copy, frame));
                const oldFlex = a[index].flex;
                ShowModal<number>((props) => {
                    const [flexValue, setFlexValue] = useState(oldFlex);
                    return <Modal onEnter={() => props.resolve(flexValue)}>
                        <ModalTitle>enter frame size</ModalTitle>
                        <ModalContent>
                            <ModalInput placeholder="Flex-value" type="number" value={flexValue} onChange={(ev) => setFlexValue(parseFloat(ev.target.value))} autoFocus={true} />
                            <ModalButtonRow>
                                <ModalButton onClick={() => props.resolve(flexValue)}><Bi i="check-lg" /></ModalButton>
                                <ModalButton onClick={() => props.resolve(oldFlex)}><Bi i="x-lg" /></ModalButton>
                            </ModalButtonRow>
                        </ModalContent>
                    </Modal>;
                }).then((value) => {
                    a[index].flex = value;
                    setSplitting(copy);
                });
            }
        }} index={[]}></Frame>
    </main>;
}
type Edit = {
    editing: boolean,
    insertBefore(before: number[]): void,
    deleteFrame(index: number[]): void,
    convertToTabFrame(frame: number[]): void,
    wrapTabFrame(frame: number[]): void,
    updateTabs(tabs: TablistItem[], index: number[]): void,
    resizeFrame(frame: number[]): void,
};
function Frame(props: {
    splitting: Splitting,
    flex: number,
    dir: Dir,
    edit: Edit,
    index: number[],
    tabs?: TabArea,
    firstEl?: boolean,
    loadedSplitting: boolean,
}) {
    const [markFrameRed, deleteButtonEvs] = useHover();
    function isEmptyFrame() {
        return !props.tabs && !props.splitting.length;
    }
    useEffect(() => {
        if (isEmptyFrame() && props.loadedSplitting) {
            const a = [...props.index];
            props.edit.convertToTabFrame(a);
        }

    });
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
                    props.edit.resizeFrame(props.index);
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
                            loadedSplitting={props.loadedSplitting}
                        />;
                    }) :
                    (<div onClick={() => {


                    }}>
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
    </>;
}
function TabFrame(props: {
    tabs: TabArea,
    edit: Edit,
    index: number[];
}) {
    return <div className="tab-frame">
        <Tabs tabs={props.tabs.tabs} addTab={id => {
            props.edit.updateTabs([...props.tabs.tabs, { id, num: 0 }], props.index);
        }} closeTab={id => {
            props.edit.updateTabs(props.tabs.tabs.filter((_, ind) => ind != id), props.index);
        }} closeAllTabs={() => {
            props.edit.updateTabs([], props.index);
        }} />
        {props.edit.editing ? <div className="tab-edit">
            <div onClick={() => {
                props.edit.wrapTabFrame(props.index);
            }}>
                <Bi i="signpost-split" />
            </div>
            <div onClick={() => {
                props.edit.resizeFrame(props.index);
            }}>
                <Bi i="arrows-angle-expand" />
            </div>
        </div> : (props.tabs.tabs.map(_ => <div key={_.id}>{_.id}</div>), null)}
    </div>;
}
type Dir = "row" | "column";
const switchDir = (dir: Dir) => dir == "column" ? "row" : "column";
export type Splitting = Area[];
interface Area {
    flex: number,
    content: Splitting | TabArea;
}
export interface TablistItem {
    id: string;
    num: number;
}

interface TabArea {
    tabs: TablistItem[];
}
