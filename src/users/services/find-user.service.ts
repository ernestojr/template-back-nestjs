import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { FindUserDto } from '../dtos/find-user.dto';

@Injectable()
export class FindUserService {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) {}

    async handle(dto: FindUserDto): Promise<UserEntity> {
        const user = await this.repository.findOne({ where: { id: dto.id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${dto.id} no encontrado`);
        }
        return user;
    }
}
