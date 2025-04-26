import { IsString, IsEmail, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { ChileanDniValidator } from 'src/core/validators/chilean-dni.validator';

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @Validate(ChileanDniValidator)
    dni?: string;
}