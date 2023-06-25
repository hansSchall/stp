import { Driver, DriverChildMgr, DriverError, DriverType, InterfaceClient } from "../drivers";
import { clone } from "lodash";
import { Static, Type } from "@sinclair/typebox";
import { getDevConf, setDevConf } from "../../../../devCore/devStore";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const RootConf = Type.Object({
    children: Type.Array(Type.Tuple([Type.String(), Type.String()])),
    label: Type.String(),
});
type RootConf = Static<typeof RootConf>;
const RootConfChecker = TypeCompiler.Compile(RootConf);

type RootChildListItem = {
    drvId: string;
    mgr: DriverChildMgr<void, void>;
};

export class RootDriver extends Driver<void, void> {
    constructor(devID: string, uplink: InterfaceClient<void, void>) {
        super(devID, uplink);
        this.updateConfig();
    }
    public readonly driverName = "root";
    public getChildren(): Driver<void, void>[] {
        return this.children.map((id, child) => child.mgr.getInstance());
    }
    public getName(): string {
        return "root";
    }
    public getDescription(): string {
        return "Root Node";
    }
    public cat: string = "";

    private static readonly defaultConfig: RootConf = {
        label: "Root",
        children: [],
    };

    private children = new Map<string, RootChildListItem>();

    private async updateConfig() {
        try {
            const rawConfig = await getDevConf(this.devID);
            if (!rawConfig) {
                await setDevConf(this.devID, JSON.stringify(RootDriver.defaultConfig));
            }
            const rawDefConf = rawConfig ? JSON.parse(rawConfig) : clone(RootDriver.defaultConfig);

            if (RootConfChecker.Check(rawDefConf)) {
                const devConf: RootConf = rawDefConf;
                const touched = new WeakSet<RootChildListItem>();

                const unmount = (id: string) => {
                    console.log(`[Driver::root::unmount] unmounting ${id} from ${this.devID}`.red);
                    const drv = this.children.get(id);
                    if (drv) {
                        drv.mgr.unmount();
                        this.children.delete(id);
                    } else {
                        console.error("Internal Error: unmounting from root: ", id, this.children, "matching driver not found, remounting all");

                        process.nextTick(() => {
                            super.hotConfigChanged(); // non overridden version
                        });
                    }
                };
                const mount = (id: string, type: string) => {
                    console.log(`[Driver::root::mount] mounting ${id}(${type}) on ${this.devID}`.red);
                    const driver = rootUplinkSupport.get(type);
                    if (driver) {
                        const mgr = new DriverChildMgr(driver, this.devID + "." + id, this.uplink);
                        mgr.link.server.lockR.unlock();
                        const child = {
                            drvId: type,
                            mgr
                        };
                        this.children.set(id, child);
                        touched.add(child);
                    } else {
                        this.addError(new DriverError("driver not found", `Driver '${type}' was not found for root`, [this.devID]));
                    }
                };

                devConf.children.map(([id, drv]) => {
                    const childItem = this.children.get(id);
                    if (childItem) { // existing
                        touched.add(childItem);
                        if (childItem?.drvId !== drv) {
                            // remount
                            unmount(id);
                            mount(id, drv);
                        }
                    } else { // new child
                        mount(id, drv);
                    }
                });

                this.children.forEach((child, id) => {
                    if (!touched.has(child)) {
                        unmount(id);
                    }
                });
            } else {
                this.addError(new DriverError("ConfigTypeError", `${JSON.stringify([...RootConfChecker.Errors(rawDefConf)])}`, [this.devID]));
            }
        } catch (err) {
            if (err instanceof SyntaxError) {

            }
            return null;
        }
    }

    public hotConfigChanged(): void {
        this.updateConfig();
    }
}

export const rootUplinkSupport: DriverType<void, void> = new Map();
