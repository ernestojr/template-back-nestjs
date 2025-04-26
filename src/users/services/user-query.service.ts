import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityQueryService } from '../../core/services/entity-query.service';
import { UserEntity } from '../../core/entities/user.entity';

export class UserQueryService extends EntityQueryService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        repository: Repository<UserEntity>
    ) {
        super(repository);
    }
}