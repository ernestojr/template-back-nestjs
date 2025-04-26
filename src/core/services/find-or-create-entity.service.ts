import { Injectable } from "@nestjs/common";
import { Repository, FindOptionsWhere, DeepPartial } from "typeorm";

@Injectable()
export abstract class FindOrCreateEntityService<T extends { id: any }> {
    constructor(private readonly repository: Repository<T>) {}

    async handle(
        findCriteria: FindOptionsWhere<T> | FindOptionsWhere<T>[],
        createData?: DeepPartial<T>
    ): Promise<T> {
        let entity = await this.repository.findOne({ where: findCriteria });

        if (!entity) {
            const baseData = Array.isArray(findCriteria) ? {} : findCriteria;
            const newEntity = this.repository.create({
                ...baseData,
                ...createData
            }as DeepPartial<T>);
            entity = await this.repository.save(newEntity);
        }

        return entity;
    }
}
