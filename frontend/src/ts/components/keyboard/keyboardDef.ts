type Key = [string, string];
type KeyRow = Key[];
type Col = KeyRow[];
type Row = Col[];
type KeyboardDef = Row[];

export const hardkeyBindings = new Map<string, string>();

function Key(id: string, label: string, hardkey: string | string[]): Key {
    if (!id)
        id = label;
    if (typeof hardkey == "string") {
        hardkeyBindings.set(hardkey, id);
    } else {
        hardkey.forEach(_ => hardkeyBindings.set(_, id));

    }
    return [id, label];
}

export const keyboardDef: KeyboardDef = [
    [ // top row
        [
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
        ],
        [
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
        ],
        [
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
        ],
    ],
    [ // bottom row
        [ // block left
            [
                Key("", "Weiche", "---w"),
                Key("", "Group", "---g"),
                Key("", "Signal", "+--Ss"),
            ],
            [
                Key("", "FAT", "--+F"),
                Key("", "Start", "--+S"),
                Key("", "Ziel", "--+Z"),
            ],
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
        ],
        [ // block middle
            [
                Key("", "-", "----"),
                Key("", "Thru", "---t"),
                Key("", "+", "---+"),
            ],
            [
                Key("", "7", "---7"),
                Key("", "8", "---8"),
                Key("", "9", "---9"),
            ],
            [
                Key("", "4", "---4"),
                Key("", "5", "---5"),
                Key("", "6", "---6"),
            ],
            [
                Key("", "1", "---1"),
                Key("", "2", "---2"),
                Key("", "3", "---3"),
            ],
            [
                Key("", "Clear", "***Backspace"),
                Key("", "0", "---0"),
                Key("", ",", ["---,", "---."]),
            ],
        ],
        [ // block right
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
            [
                Key("", "ON", ["--+!", "--*End", "---n"]),
                Key("", "OFF", ["--+=10", "--*Insert", "---f"]),
                Key("", "Hp2", ""),
            ],
            [
                Key("", "Hp00", "+-+0"),
                Key("", "Hp0", "+--0"),
                Key("", "Hp1", "+--1"),
            ],
            [
                Key("", "Left", "---l"),
                Key("", "Strait", "---s"),
                Key("", "Right", "---r"),
            ],
            [
                Key("", "@", ["---A", "***@"]),
                Key("enter", "Enter", "***Enter"),
                Key("*", "", ""),
            ],
        ],
    ],
];

