export const tablist = new Map<string, Tablist>();
export interface Tablist {
    id: string,
    label: string,
    comp: () => JSX.Element,
}
