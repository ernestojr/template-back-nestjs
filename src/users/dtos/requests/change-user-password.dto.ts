import { IsNotEmpty, IsString, MinLength, NotEquals } from "class-validator";

export class ChangeUserPasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @NotEquals('currentPassword', { message: 'La nueva contraseña no puede ser igual a la contraseña actual' })
    newPassword: string;
}