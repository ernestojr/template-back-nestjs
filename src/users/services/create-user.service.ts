import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../core/entities/user.entity';
import { CreateUserParams } from './params/create-user.params';
import { hashPassword } from '../../core/helpers/password.helper';

@Injectable()
export class CreateUserService {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) {}

    async handle(params: CreateUserParams): Promise<UserEntity> {
        const { fullname, dni, email, password, role, active } = params;
        const hashedPassword = await hashPassword(password);
        const user = this.repository.create({
            fullname,
            dni,
            email,
            password: hashedPassword,
            role,
            active,
        });
        return await this.repository.save(user);
    }
}
