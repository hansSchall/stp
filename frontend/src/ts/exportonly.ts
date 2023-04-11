export const tablist = new Map<string, Tablist<any>>();
export interface Tablist<T> {
    id: string,
    label: string,
    comp: (props: {
        data: T,
        setData(data: T): void,
    }) => JSX.Element,
}
