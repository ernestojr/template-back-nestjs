import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { UserEntity } from '../../core/entities/user.entity';
import { UpdateUserParams } from './params/update-user.params';

@Injectable()
export class UpdateUserService {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) {}

    async handle(params: UpdateUserParams): Promise<void> {
        // Verificar si existe otro usuario con el mismo email (excepto el actual)
        const EXISTING_EMAIL = await this.repository.findOne({
            where: [
                {
                    email: params.email, id: Not(params.id)
                }
            ]
        });
        if (EXISTING_EMAIL) {
            throw new ConflictException('Ya existe un usuario con ese email');
        }

        // Verificar si existe otro usuario con el mismo rut (excepto el actual)
        const EXISTING_DNI = await this.repository.findOne({
            where: [
                { dni: params.dni, id: Not(params.id) }
            ]
        });
        if (EXISTING_DNI) {
            throw new ConflictException('Ya existe un usuario con ese rut');
        }

        await this.repository.update(params.id, params);
    }
}
