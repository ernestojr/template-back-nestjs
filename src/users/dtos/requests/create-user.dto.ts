import { IsString, IsEmail, IsBoolean, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { ChileanDniValidator } from 'src/core/validators/chilean-dni.validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Validate(ChileanDniValidator)
    dni: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}