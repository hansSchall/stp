// import { LoadBar } from "./loadBar";
import { renderRoot } from "./renderRoot";
import { WindowTitle } from "./windowTitle";
// import { MS } from "./apps/ms/ms";
import { Frames } from "./frames";
window.addEventListener("load", () => {
    renderRoot(document.querySelector("#app"), React.createElement(React.StrictMode, null,
        React.createElement(WindowTitle, { title: "Testtitel" }),
        React.createElement(Frames, null)));
});
