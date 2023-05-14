import React, { createContext, useContext, useEffect, useState, KeyboardEvent } from "react";
import { onApi } from "../../api/api";
import { last, uniq } from "lodash-es";
import { shortenNumbers } from "./tools";
import { hardkeyBindings } from "../keyboard/keyboardDef";

interface CmdLineDef {
    user: number,
    setUser(user: number): void;
    line: string[],
    mode: string[],
    enter: boolean,
    keydown(key: string): void,
    keyEvent(ev: KeyboardEvent<HTMLDivElement>): void,
}

export const CmdLineState = createContext<CmdLineDef>({
    user: -2,
    setUser() { },
    keydown() { },
    line: [],
    mode: ["DISCONNECTED:"],
    enter: false,
    keyEvent() { },
});

export function useCmdLine(): {
    value: CmdLineDef,
} {
    const [user, setUser] = useState(-1);
    const [mode, setMode] = useState<string[]>(["LIVE"]);
    const [line, setLine] = useState<string[]>([]);
    const enter = last(line)?.toLowerCase() == "enter";
    function keydown(key: string) {
        if (!key)
            return;

        // send to server

        //optimistic
        if (key.toLowerCase() == "clear") {
            setLine(line => line.slice(0, line.length - 1));
        } else if (enter) {
            setLine([key]);
        } else {
            setLine(line => [...line, key]);
        }
    }
    function opt(inp: string[], enabled: boolean) {
        return [...inp.map(_ => "*" + _), ...inp.map(_ => (enabled ? "+" : "-") + _)];
    }
    return {
        value: {
            user,
            setUser,
            line: shortenNumbers(line),
            mode,
            enter,
            keydown,
            keyEvent(ev) {
                uniq(opt(opt(opt([ev.key, ev.key.toUpperCase(), ev.key.toLowerCase(), "#" + ev.keyCode], ev.shiftKey), ev.altKey), ev.ctrlKey)).map(_ => hardkeyBindings.get(_)).filter(_ => _).forEach(_ => {
                    if (_)
                        keydown(_);

                });
            }
        },
    };
}

export function CmdLine(props: {
}) {
    const [userSelection, setUserSelection] = useState(false);
    const cmd = useContext(CmdLineState);
    const [userList, setUserList] = useState<string[]>(["", "", "", "", ""]);
    useEffect(() => {
        onApi((data) => {
            if (data.cmdUserLabels) {
                setUserList(data.cmdUserLabels);
            }
        }, "cmdUserLabels");
    });
    return <div className="cmdl">
        <div className="cmdl-line">
            {cmd.mode.map((item, ind) => <div className="-item" key={"mod-" + ind}>{item}:</div>)}
            {cmd.line.slice(0, cmd.line.length - (cmd.enter ? 1 : 0)).map((item, ind) => <div className="-item" key={"li-" + ind}>{item}</div>)}
            {cmd.enter ? <div className="-item -enter bi-suit-diamond-fill" key={"enter"}></div> : <div className="-item -cursor" key={"cursor"}>_</div>}
        </div>
        <div className="cmdl-opt">
            <div className="cmdl-user" onClick={() => setUserSelection(!userSelection)}>User {cmd.user + 1} {userList[cmd.user]}</div>
            {userSelection ?
                <div className="cmdl-user-select" onClick={() => setUserSelection(false)}>
                    <div className="-list">
                        {userList.map((label, id) => <div className="-item" key={id} onClick={() => {
                            cmd.setUser(id);
                        }}>User {id + 1} {label}</div>)}
                    </div>
                </div>
                : null}
        </div>
    </div>;
}
