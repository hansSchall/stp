import React, { useEffect, useState } from "react";
import { ChanView } from "./components/tabs/chanView/chanView";
import { tablist } from "./exportonly";
import { TablistItem } from "./frames";
import { Bi } from "./lib/bi";

export function Tabs(props: {
    tabs: TablistItem[],
    addTab(id: string): void,
    closeTab(id: number): void,
    closeAllTabs(): void,
}) {
    const [activeTab, setActiveTab] = useState(0);
    const [activeRealTab, setActiveRealTab] = useState(0);

    const [tabcontext] = useState(new WeakMap());

    useEffect(() => {
        if (activeTab >= props.tabs.length) {
            setActiveTab(props.tabs.length - 1);
        }
    })

    function appendTab(id: string) {
        setActiveTab(props.tabs.length);
        props.addTab(id);
    }
    return <>
        <div className="tab-nav">
            <div className="tab-menu" onClick={() => {
                setActiveTab(-2);
            }}>
                <Bi i="gear-fill"></Bi>
            </div>
            <div className="tab-menu" onClick={() => {
                setActiveTab(-1);
            }}>
                <Bi i="plus-lg"></Bi>
            </div>
            <div className="tab-tab-select">
                {props.tabs.map((val, ind) => {
                    return <div className={"tab-nav-item" + (ind == activeTab ? " active" : "")} key={ind} onClick={() => {
                        setActiveTab(ind);
                        setActiveRealTab(ind);
                    }}>{tablist.get(val.id)?.label || "No Label"}</div>
                })}
            </div>
        </div>
        <div className="tab-content">
            {(() => {
                if (activeTab == -1) {
                    return <TabSelection appendTab={appendTab} />;
                } else if (activeTab == -2) {
                    return <TabOptions closeTab={() => {
                        props.closeTab(activeRealTab);
                        setActiveTab(activeRealTab);
                    }} closeAllTabs={() => {
                        props.closeAllTabs();
                        setActiveTab(-1);
                    }} />;
                } else {
                    const tab = tablist.get(props.tabs[activeTab]?.id || "")
                    const Comp = tab?.comp;
                    if (Comp) {
                        return <Comp data={tabcontext.get(tab) || undefined} setData={data => {
                            tabcontext.set(tab, data);
                        }} />
                    } else {
                        return <div>Tab Component not found!</div>
                    }
                }
            })()}
        </div>
    </>
}

function TabSelection(props: {
    appendTab(id: string): void,
}) {
    return <div className="tab-ts-menu">
        <div className="tab-ts-list">
            {[...tablist].map(([, tab]) => <div className="tab-ts-item" key={tab.id} onClick={() => props.appendTab(tab.id)}>
                <div className="-icon"><i className="bi-box" /></div>
                <div className="-label">{tab.label}</div>
            </div>)}
        </div>
    </div>
}

function TabOptions(props: {
    closeTab(): void,
    closeAllTabs(): void;
}) {
    return <div className="tab-opt-menu">
        <div className="tab-opt-group">
            <div className="tab-opt-item" onClick={props.closeTab}>
                <div className="-icon"><Bi i="x-lg" /></div>
                <div className="-label">Close tab</div>
            </div>
            <div className="tab-opt-item" onClick={props.closeAllTabs}>
                <div className="-icon"><Bi i="x-lg" /></div>
                <div className="-label">Close all tabs</div>
            </div>
        </div>
        {/* <div className="tab-opt-group">
            <div className="tab-opt-item">
                <div className="-icon"><Bi i="x-lg" /></div>
                <div className="-label">Close tab</div>
            </div>
            <div className="tab-opt-item">
                <div className="-icon"><Bi i="x-lg" /></div>
                <div className="-label">Close all tabs</div>
            </div>
        </div> */}
    </div>
}

ChanView
