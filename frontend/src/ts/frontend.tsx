// require("./includeStyle");
import "./includeStyle";
import "./lib/mapMap";
// import { LoadBar } from "./loadBar";
import { renderRoot } from "./renderRoot";
import { WindowTitle } from "./windowTitle";
// import { MS } from "./apps/ms/ms";
import { Frames, Splitting } from "./frames";
import React, { StrictMode, useEffect, useState } from "react";
import { WindowButtons } from "./windowButton";
// import { LayoutSaveCancel } from "./components/layoutSaveCancel";
import { Modals, showExampleModal, ShowModal } from "./modal";
import { Bi } from "./lib/bi";
import { Modal, ModalTitle, ModalContent, ModalInput, ModalButtonRow, ModalButton } from "./modalStyle";
import "./components/tabs/chanView/chanView";
import "./components/tabs/trackView/trackView";
import "./components/tabs/devTree/devTree";
import "./api/api";
import "./components/tabs/virtualKeyboard/virtualKeyboard";
import { OverlaySoftkeyboard } from "./components/keyboard/softkeyboard";
import { CmdLine, CmdLineState, useCmdLine } from "./components/cmdLine/cmdLine";


export let windowButtonDOM: HTMLElement | undefined;

window.addEventListener("load", () => {
    windowButtonDOM = document.getElementById("window-buttons") ?? undefined;
    const el: HTMLElement = document.querySelector("#app") as HTMLElement;
    renderRoot(el, <StrictMode><App /></StrictMode>);

});

function App() {
    const [editing, setEditMode] = useState(false);
    const [overlaySoftkeyboard, setOverlaySoftkeyboard] = useState(false);
    const [loadedSplitting, setLoadedSplitting] = useState(false);
    const [splitting, setSplitting_] = useState<Splitting>([]);
    const cmd = useCmdLine();
    function setSplitting(val: Splitting) {
        setSplitting_(val);
    }
    function loadSplittingFromStorage() {
        // console.log(sessionStorage.getItem("editor-splitting"));
        setSplitting(JSON.parse(sessionStorage.getItem("editor-splitting") ?? "[]") ?? []);
        setLoadedSplitting(true);
    }
    useEffect(loadSplittingFromStorage, []);
    return <div id="app-wrapper" tabIndex={0} onKeyUp={cmd.value.keyEvent}>
        <CmdLineState.Provider value={cmd.value}>
            <WindowTitle title="Stellpult" />
            <WindowButtons onEdit={() => {
                if (editing) {
                    ShowModal((props) => <Modal>
                        <ModalTitle>save window configuration changes?</ModalTitle>
                        <ModalContent>
                            <ModalButtonRow>
                                <ModalButton onClick={() => props.resolve(true)}><Bi i="check-lg" /></ModalButton>
                                <ModalButton onClick={() => props.resolve(false)}><Bi i="x-lg" /></ModalButton>
                            </ModalButtonRow>
                        </ModalContent>
                    </Modal>).then(res => {
                        if (res) {
                            sessionStorage.setItem("editor-splitting", JSON.stringify(splitting));
                            setEditMode(false);
                        } else {
                            loadSplittingFromStorage();
                            setEditMode(false);
                        }
                    });
                } else {
                    setEditMode(true);
                }
            }} onMenu={() => { }} onKeyboard={() => { setOverlaySoftkeyboard(!overlaySoftkeyboard); }} edit={editing} />
            <Frames {...{ editing, splitting, setSplitting, loadedSplitting }} />
            {/* <button onClick={showExampleModal}>show modal</button> */}
            <CmdLine />
            <OverlaySoftkeyboard shown={overlaySoftkeyboard} />
            <Modals />
        </CmdLineState.Provider>
    </div>;
}
