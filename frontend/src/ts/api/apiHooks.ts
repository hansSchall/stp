import { DependencyList, useEffect, useState } from "react";
import { Incomming, onApi, unApi } from "./api";


type A = Incomming["tx"];

export function useServerSource<N, T extends keyof Incomming["tx"]>(method: T, defaultValue: NonNullable<Incomming["tx"][T]> | N, init?: VoidFunction, deps: DependencyList = []) {
    const [value, setValue] = useState<NonNullable<Incomming["tx"][T]> | N>(defaultValue);


    useEffect(() => {
        if (init)
            init();
        function onUpdate(value: Incomming["tx"]) {
            if (value[method])
                setValue(value[method] as NonNullable<Incomming["tx"][T]>);
        }
        onApi(onUpdate, method);
        return () => {
            unApi(onUpdate);
        }
    }, [deps]);

    return value;
}
