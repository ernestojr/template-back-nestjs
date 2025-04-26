import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../core/entities/user.entity";
import { ChangeUserPasswordParams } from "./params/change-user-password.params";
import { comparePassword, hashPassword } from '../../core/helpers/password.helper';

@Injectable()
export class ChangeUserPasswordService {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) {}

    async handle(params: ChangeUserPasswordParams) {
        const user = await this.repository.findOne({ where: { id: params.id } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        // Comparar contraseña actual con bcrypt
        const isPasswordValid = await comparePassword(
            params.currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            throw new BadRequestException('Contraseña actual incorrecta');
        }
        user.password = await hashPassword(params.newPassword);
        await this.repository.save(user);
    }
}