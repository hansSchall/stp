export const chanSymbolMap = new Map<string, string[]>();

function add(id: string, ...els: string[]) {
    chanSymbolMap.set(id, els);
}

add("w/rh", "w-fm -ah", "w-tr -ah");
add("w/r/rh", "w-fm -ia", "w-tr -ah", "w-bm -ah");
add("w/r/gh", "w-tr -ia", "w-fm -ah");
add("w/r", "w-fm -a", "w-tr -a");
add("w/r/r", "w-fm -ia", "w-tr -a", "w-bm -a");
add("w/r/g", "w-tr -ia", "w-fm -a");


add("w/lh", "w-fm -ah", "w-tl -ah");
add("w/l/lh", "w-fm -ia", "w-tl -ah", "w-bm -ah");
add("w/l/gh", "w-tl -ia", "w-fm -ah");
add("w/l", "w-fm -a", "w-tl -a");
add("w/l/l", "w-fm -ia", "w-tl -a", "w-bm -a");
add("w/l/g", "w-tl -ia", "w-fm -a");

add("w/xlh", "w-fm -ah", "w-ftl -ah");
add("w/xl/xh", "w-fm -ia", "w-ftl -ah");
add("w/xl/ih", "w-ftl -ia", "w-fm -ah");
add("w/xl/klh", "w-ftl -ia", "w-fm -ia", "w-tl -ah", "w-bm -ah");
add("w/xl/krh", "w-ftl -ia", "w-fm -ia", "w-br -ah", "w-tm -ah");
add("w/xl", "w-fm -a", "w-ftl -a");
add("w/xl/x", "w-fm -ia", "w-ftl -a");
add("w/xl/i", "w-ftl -ia", "w-fm -a");
add("w/xl/kl", "w-ftl -ia", "w-fm -ia", "w-tl -a", "w-bm -a");
add("w/xl/kr", "w-ftl -ia", "w-fm -ia", "w-br -a", "w-tm -a");

add("w/xrh", "w-fm -ah", "w-ftr -ah");
add("w/xr/xh", "w-fm -ia", "w-ftr -ah");
add("w/xr/ih", "w-ftr -ia", "w-fm -ah");
add("w/xr/krh", "w-ftr -ia", "w-fm -ia", "w-tr -ah", "w-bm -ah");
add("w/xr/klh", "w-ftr -ia", "w-fm -ia", "w-bl -ah", "w-tm -ah");
add("w/xr", "w-fm -a", "w-ftr -a");
add("w/xr/x", "w-fm -ia", "w-ftr -a");
add("w/xr/i", "w-ftr -ia", "w-fm -a");
add("w/xr/kr", "w-ftr -ia", "w-fm -ia", "w-tr -a", "w-bm -a");
add("w/xr/kl", "w-ftr -ia", "w-fm -ia", "w-bl -a", "w-tm -a");

add("s/hp00,0,1,2", "s-rt-l", "s-rt-r", "s-gn", "s-ge");
add("s/hp00,0,1,2/hp00", "s-rt-l", "s-rt-r", "s-gn -ia", "s-ge -ia");
add("s/hp00,0,1,2/hp0", "s-rt-l", "s-rt-r -ia", "s-gn -ia", "s-ge -ia");
add("s/hp00,0,1,2/hp1", "s-rt-l -ia", "s-rt-r -ia", "s-gn", "s-ge -ia");
add("s/hp00,0,1,2/hp2", "s-rt-l -ia", "s-rt-r -ia", "s-gn -ia", "s-ge");

add("s/hp00,0,1", "s-rt-l", "s-rt-r", "s-gn");
add("s/hp00,0,1/hp00", "s-rt-l", "s-rt-r", "s-gn -ia");
add("s/hp00,0,1/hp0", "s-rt-l", "s-rt-r -ia", "s-gn -ia");
add("s/hp00,0,1/hp1", "s-rt-l -ia", "s-rt-r -ia", "s-gn");

add("s/hp0,1,2", "s-rt-r", "s-gn", "s-ge");
add("s/hp0,1,2/hp0", "s-rt-r", "s-gn -ia", "s-ge -ia");
add("s/hp0,1,2/hp1", "s-rt-r -ia", "s-gn", "s-ge -ia");
add("s/hp0,1,2/hp2", "s-rt-r -ia", "s-gn -ia", "s-ge");

add("s/hp0,1", "s-rt-r", "s-gn");
add("s/hp0,1/hp0", "s-rt-r", "s-gn -ia");
add("s/hp0,1/hp1", "s-rt-r -ia", "s-gn");

add("sh", "s-rt-ml", "s-rt-mr", "s-ws-1", "s-ws-2");
add("sh/hp00", "s-rt-ml", "s-rt-mr", "s-ws-1 -ia", "s-ws-2 -ia");
add("sh/sh1", "s-rt-ml -ia", "s-rt-mr -ia", "s-ws-1", "s-ws-2");


add("b/i", "b-i");
add("b/o", "b-o");


add("bel/bel", "bel");
add("bel/unbel", "unbel");

add("inv/ninv", "wv-base", "wv-ninv");
add("inv/inv", "wv-base", "wv-inv");
