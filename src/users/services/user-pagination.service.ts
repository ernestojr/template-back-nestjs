import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { EntityPaginationService } from "../../core/services/entity-pagination.service";
import { UserEntity } from "../../core/entities/user.entity";
import { UserPaginationParams } from "./params/user-pagination.params";

@Injectable()
export class UserPaginationService extends EntityPaginationService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        protected readonly repository: Repository<UserEntity>
    ) {
        super(repository, 'user');
    }

    protected async applyFilters(
        queryBuilder: SelectQueryBuilder<UserEntity>,
        params: UserPaginationParams
    ): Promise<SelectQueryBuilder<UserEntity>> {
        /*
        queryBuilder.andWhere(`${this.alias}.email = :email`, {
            email: 'jane.smith@example.com'
        });*/
        return queryBuilder;
    }
}