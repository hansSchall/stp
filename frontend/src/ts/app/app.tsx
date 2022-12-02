import React, { useState, useEffect } from "react";
import { ShowModal, showExampleModal, Modals } from "../common/modal";
import { Modal, ModalTitle, ModalContent, ModalButtonrow, ModalButton } from "../common/modalStyle";
import { LayoutSaveCancel } from "../components/layoutSaveCancel";
import { Bi } from "../lib/bi";
import { Frames, Splitting } from "../panel/frames";
import { WindowButtons } from "./windowButton";
import { WindowTitle } from "./windowTitle";

export function App() {
    const [user, setUser] = useState<string | null>("test");
    if (user) {
        return <MainView />;
    } else {
        return <UserSelect setUser={setUser} />;
    }
}

function UserSelect(props: {
    setUser: (user: string) => void,
}) {
    return <>
        <div id="app-user-selection">
            <div className="us-container">
                <div className="us-title">User auswählen</div>
                <div className="us-list">
                    <div className="us-list-item">Hardware</div>
                    <div className="us-list-item">User 1</div>
                    <div className="us-list-item">User 2</div>
                    <div className="us-list-item">User 3</div>
                    <div className="us-list-item">User 3</div>
                    <div className="us-list-item">User 3</div>
                    <div className="us-list-item">User 3</div>
                </div>
                <div className="us-new">
                    <input defaultValue={""} placeholder="Neuen User anlegen" tabIndex={0}></input>
                    <button className="us-new-bt" tabIndex={0}>
                        <Bi i="plus-lg" />
                    </button>
                </div>
            </div>
        </div>
    </>
}

function MainView() {
    const [editing, setEditMode] = useState(false);
    const [splitting, setSplitting] = useState<Splitting>([]);
    const [saveDialog, showSaveDialog] = useState(false);
    function loadSplittingFromStorage() {
        setTimeout(() => {
            setSplitting(JSON.parse(sessionStorage.getItem("editor-splitting") ?? "[]") ?? []);
        }, 100)
    }
    useEffect(loadSplittingFromStorage, []);
    return <>
        <WindowTitle title="Testtitel" />
        <div id="app-header">
            <div>bl</div>
            <div>Title</div>
            <div>br</div>
        </div>
        <div id="app-frames">
            <Frames {...{ editing, splitting, setSplitting }} />
        </div>
        <div id="app-cmd">

        </div>
        {/* <WindowButtons onEdit={() => {
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
                        showSaveDialog(false);
                        setEditMode(false);
                    } else {
                        loadSplittingFromStorage();
                        showSaveDialog(false);
                        setEditMode(false);
                    }
                })
                // showSaveDialog(true);
            } else {
                setEditMode(true);
            }
        }} onMenu={() => { }} onKeyboard={() => { }} edit={editing} /> */}
        {/* {saveDialog ? <LayoutSaveCancel onCancel={() => {
            loadSplittingFromStorage();
            showSaveDialog(false);
            setEditMode(false);
        }} onSave={() => {
            sessionStorage.setItem("editor-splitting", JSON.stringify(splitting));
            showSaveDialog(false);
            setEditMode(false);
        }} /> : null}
        <Modals /> */}
    </>
}
