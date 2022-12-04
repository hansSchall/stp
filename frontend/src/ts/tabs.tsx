import React from "react";
import { TablistItem } from "./frames";
import { Bi } from "./lib/bi";

export function Tabs(props: {
    tabs: TablistItem[]
}) {
    return <>
        <div className="tab-nav">
            <div className="tab-menu">
                <Bi i="gear-fill"></Bi>
            </div>
            <div className="tab-tab-select">
                <div className="tab-nav-item">1.0 Live View</div>
                <div className="tab-nav-item">2.0 man ctrl</div>
            </div>
        </div>
        <div className="tab-content">

        </div>
    </>
}