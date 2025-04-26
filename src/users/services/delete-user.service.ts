import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../core/entities/user.entity';
import { DeleteUserParams } from './params/delete-user.params';

@Injectable()
export class DeleteUserService {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) {}

    async handle(params: DeleteUserParams): Promise<void> {
        const { id } = params;
        const user = await this.repository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await this.repository.remove(user);
    }
}
