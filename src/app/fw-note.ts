export interface FwNote {
    text: string;
    dateStr: string;
    tags: FwTag[];
}

export interface FwTag {
    name: string;
    url: string;
}
