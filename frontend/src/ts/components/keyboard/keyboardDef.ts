type Key = [string, string, string];
type KeyRow = Key[];
type Col = KeyRow[];
type Row = Col[];
type KeyboardDef = Row[];

function Key(id: string, label: string, hardkey: string): Key {
    return [id, label, hardkey];
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
                Key("Turnout", "Weiche", "w"),
                Key("Group", "Group", "g"),
                Key("", "Signal", ""),
            ],
            [
                Key("", "FAT", ""),
                Key("", "Start", ""),
                Key("", "Ziel", ""),
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
                Key("", "-", ""),
                Key("", "Thru", ""),
                Key("", "+", ""),
            ],
            [
                Key("", "7", ""),
                Key("", "8", ""),
                Key("", "9", ""),
            ],
            [
                Key("", "4", ""),
                Key("", "5", ""),
                Key("", "6", ""),
            ],
            [
                Key("", "1", ""),
                Key("", "2", ""),
                Key("", "3", ""),
            ],
            [
                Key("", "Clear", ""),
                Key("", "0", ""),
                Key("", ",", ""),
            ],
        ],
        [ // block right
            [
                Key("", "", ""),
                Key("", "", ""),
                Key("", "", ""),
            ],
            [
                Key("", "ON", ""),
                Key("", "OFF", ""),
                Key("", "Hp2", ""),
            ],
            [
                Key("", "Hp00", ""),
                Key("", "Hp0", ""),
                Key("", "Hp1", ""),
            ],
            [
                Key("", "Left", ""),
                Key("", "Strait", ""),
                Key("", "Right", ""),
            ],
            [
                Key("", "@", ""),
                Key("", "Enter", ""),
                Key("", "", ""),
            ],
        ],
    ],
];

