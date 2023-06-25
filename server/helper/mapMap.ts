interface Map<K, V> {
    map<T>(fn: (key: K, value: V) => T): T[],
}
Map.prototype.map = function (fn) {
    const res: ReturnType<typeof fn>[] = [];

    this.forEach((v, k) => {
        res.push(fn(k, v));
    });

    return res;
};
