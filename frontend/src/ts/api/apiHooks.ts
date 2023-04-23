import { DependencyList, useEffect, useState } from "react";
import { Incoming, onApi, unApi } from "./api";


type A = Incoming["tx"];

export function useServerSource<N, T extends keyof Incoming["tx"]>(method: T, defaultValue: NonNullable<Incoming["tx"][T]> | N, init?: VoidFunction, deps: DependencyList = []) {
    const [value, setValue] = useState<NonNullable<Incoming["tx"][T]> | N>(defaultValue);


    useEffect(() => {
        if (init)
            init();
        function onUpdate(value: Incoming["tx"]) {
            if (value[method])
                setValue(value[method] as NonNullable<Incoming["tx"][T]>);
        }
        onApi(onUpdate, method);
        return () => {
            unApi(onUpdate);
        };
    }, [deps]);

    return value;
}
