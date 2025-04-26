export class EntityPaginationMetaDto {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
}

export class EntityPaginationDto<T> {
    meta: EntityPaginationMetaDto;

    records: T[];
}