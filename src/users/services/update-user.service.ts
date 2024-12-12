import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserService {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) {}

    async handle(dto: UpdateUserDto): Promise<UserEntity> {
        // Verificar si existe otro usuario con el mismo email (excepto el actual)
        const EXISTING_EMAIL = await this.repository.findOne({
            where: [
            { email: dto.email, id: Not(dto.id) }
            ]
        });
        if (EXISTING_EMAIL) {
            throw new ConflictException('Ya existe un usuario con ese email');
        }

        // Verificar si existe otro usuario con el mismo rut (excepto el actual)
        const EXISTING_DNI = await this.repository.findOne({
            where: [
                { dni: dto.dni, id: Not(dto.id) }
            ]
        });
        if (EXISTING_DNI) {
            throw new ConflictException('Ya existe un usuario con ese rut');
        }

        if (dto.password) {
            dto.password = await this.hashPassword(dto.password);
        }

        await this.repository.update(dto.id, dto);
        return await this.repository.findOneOrFail({
            where: { id: dto.id }
        });
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }
}
