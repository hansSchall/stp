import { flatten } from "lodash";
import { Driver } from "./driver";
import { typecheck } from "./typecheck";

const devStorage = new Map<string, Map<string, any>>();

export function getDevStorage(driver: { devID: string }, key: string) {
    return devStorage.get(driver.devID)?.get(key);
}
export function getDevStorageType<Type>(driver: { devID: string, driverName: string }, key: string) {
    return typecheck<Type>(devStorage.get(driver.devID)?.get(key), driver.driverName, key);
}

export function setDevStorage(driver: { devID: string }, key: string, value: any) {
    return devStorage.get(driver.devID)?.set(key, value);
}

export function toFile(): string[] {
    return ([...devStorage].map(
        ([devID, data]) =>
            ["#" + devID, ...([...data].map(
                ([key, value]) =>
                    ["*" + key, "=" + JSON.stringify(value)]
            )).flat()]
    )).flat();
}

export function fromfile(file: string[]) {
    devStorage.clear();
    // JSON.parse(file).forEach(([devID, data]: [string, [string,any][]]) => {
    //     data.forEach(([key, value]) => {

    //     })
    // })
}
