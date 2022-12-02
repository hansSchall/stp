import { renderRoot } from "./app/renderRoot";
import React, { StrictMode, useEffect, useState } from "react";
import { App } from "./app/app";

require("./includeStyle");

export let windowButtonDOM: HTMLElement | undefined;

window.addEventListener("load", () => {
    windowButtonDOM = document.getElementById("window-buttons") ?? undefined;
    renderRoot(document.querySelector("#app") as HTMLElement, <StrictMode><App /></StrictMode>)
})
