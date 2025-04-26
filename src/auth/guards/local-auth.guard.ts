import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RequestValidationPipe } from '../../core/pipes/request-validation.pipe';
import { SignInDto } from '../dtos/requests/sign-in.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Convertir el body al DTO correspondiente
        const dtoInstance = plainToInstance(SignInDto, request.body);

        // Ejecutar la validación manual usando "RequestValidationPipe"
        const validationPipe = new RequestValidationPipe();
        await validationPipe.transform(dtoInstance, { type: 'body', metatype: SignInDto });

        // Proceder con la autenticación
        return (await super.canActivate(context)) as boolean;
    }
}
