import { Driver } from "./driver";
import { typecheck } from "./typecheck";

const devStorage = new Map<string, Map<string, any>>();

export function getDevStorage(driver: Driver<any, any>, key: string) {
    return devStorage.get(driver.devID.trim())?.get(key);
}
export function getDevStorageType<Type>(driver: Driver<any, any>, key: string) {
    return typecheck<Type>(devStorage.get(driver.devID.trim())?.get(key), driver.driverName, key);
}

export function setDevStorage(driver: Driver<any, any>, key: string, value: any) {
    devStorage.get(driver.devID.trim())?.set(key, value);
}

export function toFile(): string[] {
    return ([...devStorage].map(
        ([devID, data]) =>
            ["#" + devID.trim(), ...([...data].map(
                ([key, value]) =>
                    ["*" + key, "=" + JSON.stringify(value)]
            )).flat()]
    )).flat();
}

export function fromfile(file: string[]) {
    devStorage.clear();
    var devID = "";
    var key = "";
    file.forEach(line => {
        line = line.trim();
        if (line.startsWith("*")) {
            key = line.substring(1).trim();
        } else if (line.startsWith("=")) {
            devStorage.get(devID)?.set(key, JSON.parse(line.substring(1).trim()));
        } else if (line.startsWith("#")) {
            devID = line.substring(1).trim();
            devStorage.set(devID, new Map())
        }
    })
}
