import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dtos/sign-in.dto';

@Injectable()
export class SignInService {
    constructor(
        private readonly service: JwtService,
    ) {}

    async handle(dto: SignInDto): Promise<string> {
        const payload = {
            email: dto.email,
            sub: dto.sub,
            role: dto.role
        };
        return this.service.sign(payload)
    }
}
