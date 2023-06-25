export class DriverError {
    constructor(readonly name: string, readonly desc: string, readonly stack: string[] | null) {
        console.error(`DriverError:`, name, desc, stack);
    }
}

export interface DevTreeSnapshot {
    id: string,
    label: string,
    cat: string,
    children: DevTreeSnapshot[],
}
