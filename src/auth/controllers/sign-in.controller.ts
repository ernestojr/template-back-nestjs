import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SignInParams } from '../services/params/sign-in.params';
import { SignInService } from '../services/sign-in.service';

@Controller('auth')
export class SignInController {
    constructor(private service: SignInService) {}

    @Post('sign-in')
    @UseGuards(LocalAuthGuard)
    async handle(@Request() req) {
        const params: SignInParams = {
            email: req.user.email,
            password: req.user.password,
            sub: req.user.id,
            role: req.user.role
        };
        const token = await this.service.handle(params);
        return {
            accessToken: token,
        };
    }
}
