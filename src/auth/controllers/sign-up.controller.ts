import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SignUpDto } from '../dto/sign-up.dto';

@Controller('auth')
export class SignUpController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async run(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
