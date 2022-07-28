export function onDbUpdate(listener: () => PromiseLike<void>) {
    list.add(listener);
}

const list = new Set<() => PromiseLike<void>>();

export async function dbUpdated(): Promise<void> {
    await Promise.all([...list.entries()].map(([li]) => li()));
}