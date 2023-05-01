type SQLParam = (string | number | Blob | ArrayBuffer);

export type SQLParams = Array<SQLParam> | Record<string, SQLParam>;

export interface DB_Downlink {
    call: string,
    type: string,
    query: string,
    params: SQLParams,
    id: number,
}
