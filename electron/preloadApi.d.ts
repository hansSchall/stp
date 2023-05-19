export interface PreloadAPI {
    getOS(): Promise<string>;
    getMaxState(): Promise<boolean>;
    winMin(): Promise<void>;
    winMax(): Promise<void>;
    winRes(): Promise<void>;
    winClose(): Promise<void>;
    devtools(): Promise<void>;
}
