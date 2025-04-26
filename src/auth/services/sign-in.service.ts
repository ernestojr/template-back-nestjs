import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInParams } from '../services/params/sign-in.params';

@Injectable()
export class SignInService {
    constructor(
        private readonly service: JwtService,
    ) {}

    async handle(params: SignInParams): Promise<string> {
        const payload = {
            email: params.email,
            sub: params.sub,
            role: params.role
        };
        return this.service.sign(payload)
    }
}
