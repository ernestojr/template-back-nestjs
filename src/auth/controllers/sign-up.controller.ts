import { Controller, Post, Body } from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignUpService } from '../services/sign-up.service';

@Controller('auth')
export class SignUpController {
    constructor(private service: SignUpService) {}

    @Post('sign-up')
    async handle(@Body() dto: SignUpDto) {
        return this.service.handle(dto);
    }
}
