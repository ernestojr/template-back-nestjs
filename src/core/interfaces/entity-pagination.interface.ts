export interface EntityPaginationMeta {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
}

export interface EntityPaginationResponse<T> {
    meta: EntityPaginationMeta;
    records: T[];
} 