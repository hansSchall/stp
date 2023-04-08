import React from "react";
import { chanSymbolMap } from "./chanSymblMap";

export function Chs(props: {
    id: string,
}) {
    return <div className="chs-box">
        {chanSymbolMap.get(props.id)?.map(def => <div className={"chs-" + def} key={def} />)}
    </div>
}
