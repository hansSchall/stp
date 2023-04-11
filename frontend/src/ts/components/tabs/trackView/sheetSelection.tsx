import React, { useEffect, useState } from "react";
import { requestDB } from "../../../db/db";
import { Tablist } from "../../../exportonly";
import { Bi } from "../../../lib/bi";
import { TrackView } from "./trackView";

export function TVSheetSelection(props: {
    data: number,
    setData(data: number): void,
}) {
    const [sheet, setSheet_] = useState(props.data || -1);
    function setSheet(sheet: number) {
        setSheet_(sheet);
        props.setData(sheet);
    }
    console.log("current sheet is", sheet);
    if (sheet != -1) {
        return <TrackView id={sheet} sheetSelection={() => setSheet(-1)} />
    } else {
        return <SheetList sheetSelected={setSheet} />
    }
}

export function SheetList(props: {
    sheetSelected: (sheet: number) => void,
}) {
    const [sheetList, setSheetList] = useState<DB_SheetList>([]);
    const [addMenu, setAddMenu] = useState(false);
    const [addLabel, setaddLabel] = useState("");
    async function loadSheetList() {
        const res = await requestDB("trackView/sheet/list");
        if (res.ok) {
            const list = await res.json() as DB_SheetList;
            setSheetList(list);
        } else {
            console.error(`could not fetch api/trackView/sheet/list`, res);
        }
    }
    useEffect(() => void loadSheetList(), []);
    return <div className="trv-sheet-sel">
        {addMenu ?
            <div className="trv-sheet-add">
                <input placeholder="Add Sheet" autoFocus value={addLabel} onChange={ev => setaddLabel(ev.target.value)} onKeyDown={async ev => {
                    if (ev.key == "Enter") {
                        const res = await requestDB("trackView/sheet", "PUT", {
                            label: addLabel,
                        });
                        if (res.ok) {
                            const { id } = await res.json() as DB_AddSheetResult;
                            props.sheetSelected(id);
                        } else {
                            console.error(`coulkd not fetch PUT:api/trachView/sheet`, res);
                        }
                    }
                }} />
            </div>
            : null}
        <div className="trv-sheet-list">
            {addMenu ? null :
                <div className="trv-sheet-item" onClick={() => setAddMenu(true)} key="add-sheet">
                    <div className="-label">Add Sheet</div>
                </div>
            }
            {sheetList?.map(item => <div className="trv-sheet-item" key={item.id} onClick={() => props.sheetSelected(item.id)}>
                <div className="-label">{item.label}</div>
                <div className="-opt" onClick={async ev => {
                    ev.stopPropagation();
                    const res = await requestDB("trackView/sheet/" + item.id, "DELETE");
                    if (res.ok) {
                        await loadSheetList();
                    } else {
                        console.error(`coulkd not fetch DELETE:api/trachView/sheet`, res);
                    }
                }}>
                    <Bi i="trash" />
                </div>
            </div>)}

        </div>
    </div>
}

type DB_SheetList = {
    id: number,
    label: string,
}[]

interface DB_AddSheetResult {
    id: number,
}
