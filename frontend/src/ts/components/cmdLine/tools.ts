export function shortenNumbers(cmd: string[]): string[] {
    const res: string[] = [];
    let lastIndex: number = 0;
    for (let part of cmd) {
        lastIndex = res.length - 1;
        if (!isNaN(+res[lastIndex]) && !isNaN(+part)) {//number
            res[lastIndex] += part;
        } else {
            res.push(part);
        }
    }
    return res; // parse all numbers
}
