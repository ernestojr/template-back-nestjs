import { Controller, UseGuards, Post, Request, Body } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SignInDto } from '../dtos/sign-in.dto';
import { SignInService } from '../services/sign-in.service';

@Controller('auth')
@UseGuards(LocalAuthGuard)
export class SignInController {
    constructor(private service: SignInService) {}

    @Post('sign-in')
    async handle(@Request() req) {
        const dto: SignInDto = {
            email: req.user.email,
            password: req.user.password,
            sub: req.user.id,
            role: req.user.role,
        }
        const token = await this.service.handle(dto);
        return token;
    }
}
