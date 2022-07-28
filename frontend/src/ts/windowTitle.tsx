import React from "react";
import { useEffect } from "react";
import { $_, windowLoad } from "./lib/utils";
import { waitFor } from "./lib/waitFor";

let currentWindowTitle: string;
let lastSetWindowTitle: string;

export function WindowTitle({ title: newTitle }: { title: string }) {
    lastSetWindowTitle = newTitle;
    useEffect(() => {
        if (lastSetWindowTitle !== currentWindowTitle) {
            waitFor(windowLoad).then(() => {
                $_("#win-title").innerText = lastSetWindowTitle;
                document.title = lastSetWindowTitle;
            })
            currentWindowTitle = lastSetWindowTitle;
        }
    })
    return <></>
}