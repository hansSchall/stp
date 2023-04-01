import { getDevStorageType } from "../devStore";
import { Driver, DriverChildMgr, DriverError, DriverType } from "../driver";
import { InterfaceClient } from "../interfaces";
import * as TC from "../../config/typecheck/drivers/root";
import { arrDiff } from "../helpers/arrDiff";
import { isEqual, uniqWith } from "lodash";

export class RootDriver extends Driver<void, void> {
    constructor(devID: string, uplink: InterfaceClient<void, void>) {
        super(devID, uplink);
        this.updateConfig();
    }
    public readonly driverName = "root";
    public getChildren(): Driver<void, void>[] {
        return [...this.children.values()].map(_ => _.getInstance());
    }
    public getName(): string {
        return "root"
    }
    public getDescription(): string {
        return "Root Node"
    }
    private oldConfig: TC.Children = [];
    private children = new Set<DriverChildMgr<void, void>>();
    private updateConfig() {
        const newConfig = getDevStorageType<TC.Children>(this, "Children")
        if (!newConfig.valid) {
            return;
        }

        const newConfigData = uniqWith(newConfig.data, (a, b) => isEqual(a.id, b.id));

        const { added, removed } = arrDiff(this.oldConfig, newConfigData);

        console.log({
            added,
            removed,
            oldConfig: this.oldConfig,
            newConfig,
        })
        this.oldConfig = newConfigData;

        added.forEach(conf => {
            const driver = rootUplinkSupport.get(conf.type);
            if (driver) {
                const mgr = new DriverChildMgr(driver, this.devID + "." + conf.id, this.uplink);
                mgr.link.server.lockR.unlock();
                this.children.add(mgr);
            } else {
                this.addError(new DriverError("driver not found", `Driver '${conf.type}' was not found for root`, [this.devID]))
            }
        })

        removed.forEach(conf => {
            const drv = ([...this.children.entries()]).find(_ => _[0].devID.endsWith("." + conf.id))?.[0];
            if (drv) {
                drv.unmount();
                this.children.delete(drv);
            } else {
                console.error("Internal Error: unmounting from root: ", conf, this.children, "matching driver not found, remounting all");
                process.nextTick(() => {
                    super.hotConfigChanged();
                })
            }
        })
    }

    public hotConfigChanged(): void {
        this.updateConfig();
    }
}

export const rootUplinkSupport: DriverType<void, void> = new Map();
