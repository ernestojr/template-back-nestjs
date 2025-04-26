import { Repository, SelectQueryBuilder } from 'typeorm';
import { EntityPaginationParams } from './params/entity-pagination.params';
import { EntityPaginationResponse } from '../interfaces/entity-pagination.interface';

export abstract class EntityPaginationService<T> {
    constructor(
        protected readonly repository: Repository<T>,
        protected readonly alias: string
    ) {}

    async paginate(params: EntityPaginationParams): Promise<EntityPaginationResponse<T>> {
        const { page = 1, limit = 10, sortBy, sortOrder = 'DESC' } = params;
        const skip = (page - 1) * limit;

        let queryBuilder = this.repository.createQueryBuilder(this.alias);
        // Aplicar filtros específicos si existen
        queryBuilder = await this.applyFilters(queryBuilder, params);

        if (sortBy) {
            queryBuilder.orderBy(`${this.alias}.${sortBy}`, sortOrder);
        }

        const [records, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        const response: EntityPaginationResponse<T> = {
            records,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
                limit
            }
        };
        return response;
    }

    protected abstract applyFilters(
        queryBuilder: SelectQueryBuilder<T>,
        params: EntityPaginationParams
    ): Promise<SelectQueryBuilder<T>>;
}