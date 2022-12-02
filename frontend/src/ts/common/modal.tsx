import { clone } from "lodash-es";
import React, { useState } from "react";
import { Bi } from "../lib/bi";
import { Modal, ModalButton, ModalButtonrow, ModalContent, ModalInput, ModalTitle } from "./modalStyle";


export function Modals() {
    const [modals, setModals] = useState(new Map<ModalFnType, ModalResolve<any>>());
    function updateState() {
        setModals(clone(modals));
    }
    addModal = (fn, res) => {
        modals.set(fn, res);
        updateState();
    };
    return (<div className={"modal-container" + (modals.size ? " active" : "")}>
        {[...modals].map(([ModalFn, resolve], ind) => <ModalFn key={ind} resolve={(result: any) => {
            modals.delete(ModalFn);
            resolve(result);
            updateState();
        }} />)}
    </div>);
}
type ModalResolve<T> = (res: T) => void;
type ModalFnType = (props: {
    resolve: (res: any) => void,
}) => JSX.Element;
let addModal: (key: ModalFnType, value: ModalResolve<any>) => void
export function ShowModal<T>(ModalFn: ModalFnType) {
    return new Promise<T>(res => {
        addModal(ModalFn, res);
    })
}
export function showExampleModal() {
    ShowModal((props) => <Modal>
        <ModalTitle>Layout-Änderungen speichern?</ModalTitle>
        <ModalContent>
            <ModalInput placeholder="Label" />
            <ModalButtonrow>
                <ModalButton onClick={() => props.resolve(true)}><Bi i="check-lg" /></ModalButton>
                <ModalButton onClick={() => props.resolve(false)}><Bi i="x-lg" /></ModalButton>
            </ModalButtonrow>
        </ModalContent>
        {/* <button onClick={props.resolve}>Clickme</button> */}
    </Modal>).then(console.warn)
}
