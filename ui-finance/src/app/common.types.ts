export type Lookup = {
    key?: string;
    displayName?: string;
    value?: string;
}

export type ApiResponse<T> = {
    content: T;
    page: number; 
    size: number;
    totalElements: number;
    totalPages: number;
}
