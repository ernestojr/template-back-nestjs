import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { DeleteUserDto } from '../dtos/delete-user.dto';

@Injectable()
export class DeleteUserService {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) {}

    async handle(dto: DeleteUserDto): Promise<void> {
        const user = await this.repository.findOne({ where: { id: dto.id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${dto.id} no encontrado`);
        }
        await this.repository.remove(user);
    }
}
