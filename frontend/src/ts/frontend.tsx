// import { LoadBar } from "./loadBar";
import { renderRoot } from "./renderRoot";
import { WindowTitle } from "./windowTitle";
// import { MS } from "./apps/ms/ms";
import { Frames, Splitting } from "./frames";
import React, { StrictMode, useEffect, useState } from "react";
import { WindowButtons } from "./windowButton";
import { LayoutSaveCancel } from "./components/layoutSaveCancel";
import { Modals, showExampleModal, ShowModal } from "./modal";
import { Bi } from "./lib/bi";
import { Modal, ModalTitle, ModalContent, ModalInput, ModalButtonrow, ModalButton } from "./modalStyle";
import { ChanView } from "./components/tabs/chanView/chanView";
import { TrackView } from "./components/tabs/trackView/trackView";
import "./api/api";

require("./includeStyle");


export let windowButtonDOM: HTMLElement | undefined;

window.addEventListener("load", () => {
    windowButtonDOM = document.getElementById("window-buttons") ?? undefined;
    renderRoot(document.querySelector("#app") as HTMLElement, <StrictMode><App /></StrictMode>)
})

function App() {
    const [editing, setEditMode] = useState(false);
    const [loadedSplitting, setLoadedsplitting] = useState(false);
    const [splitting, setSplitting_] = useState<Splitting>([]);
    function setSplitting(val: Splitting) {
        setSplitting_(val);
    }
    function loadSplittingFromStorage() {
        // console.log(sessionStorage.getItem("editor-splitting"));
        setSplitting(JSON.parse(sessionStorage.getItem("editor-splitting") ?? "[]") ?? []);
        setLoadedsplitting(true);
    }
    useEffect(loadSplittingFromStorage, []);
    return <>
        <WindowTitle title="Stellpult" />
        <WindowButtons onEdit={() => {
            if (editing) {
                ShowModal((props) => <Modal>
                    <ModalTitle>Layout-Änderungen speichern?</ModalTitle>
                    <ModalContent>
                        <ModalButtonrow>
                            <ModalButton onClick={() => props.resolve(true)}><Bi i="check-lg" /></ModalButton>
                            <ModalButton onClick={() => props.resolve(false)}><Bi i="x-lg" /></ModalButton>
                        </ModalButtonrow>
                    </ModalContent>
                </Modal>).then(res => {
                    if (res) {
                        sessionStorage.setItem("editor-splitting", JSON.stringify(splitting));
                        setEditMode(false);
                    } else {
                        loadSplittingFromStorage();
                        setEditMode(false);
                    }
                })
            } else {
                setEditMode(true);
            }
        }} onMenu={() => { }} onKeyboard={() => { }} edit={editing} />
        <Frames {...{ editing, splitting, setSplitting, loadedSplitting }} />
        {/* <button onClick={showExampleModal}>show modal</button> */}
        <Modals />
    </>
}


ChanView;
TrackView;
