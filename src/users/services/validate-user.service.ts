import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ValidateUserDto } from '../dtos/validate-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ValidateUserService {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) {}

    async handle(dto: ValidateUserDto): Promise<any> {
        const user = await this.repository.findOne({ where: { email: dto.email } });
        if (user && (await bcrypt.compare(dto.password, user.password))) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }
}
