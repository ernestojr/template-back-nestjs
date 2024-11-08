import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SignInDto } from '../dto/sign-in.dto';

@Controller('auth')
export class SignInController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('signin')
  async run(@Request() req) {
    return this.authService.signIn(req.user as SignInDto);
  }
}
