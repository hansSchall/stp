import React from "react";
import { Softkeyboard } from "../../keyboard/softkeyboard";
import { tablist } from "../../../exportonly";

function VirtualKeyboard(props: {

}) {
    return <div className="skb-tab">
        <Softkeyboard />
    </div>;
}

tablist.set("virtualKeyboard", {
    id: "virtualKeyboard",
    label: "Virtual Keyboard",
    comp: VirtualKeyboard,
});
