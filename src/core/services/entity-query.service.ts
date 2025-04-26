import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class EntityQueryService<T> {
    constructor(
        protected readonly repository: Repository<T>
    ) {}

    async findById(id: string | number, relations?: string[]): Promise<T> {
        return this.repository.findOne({ where: { id } as any, relations });
    }

    async findOneBy(
        where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
        relations?: string[]
    ): Promise<T> {
        return this.repository.findOne({ where, relations });
    }

    async findManyBy(
        where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
        relations?: string[]
    ): Promise<T[]> {
        return this.repository.find({ where, relations });
    }

    async getAll(relations?: string[]): Promise<T[]> {
        return this.repository.find({ relations });
    }
}
