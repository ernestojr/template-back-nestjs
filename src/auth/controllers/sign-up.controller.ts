import { Controller, Post, Body } from '@nestjs/common';
import { RequestValidationPipe } from '../../core/pipes/request-validation.pipe';
import { SignUpDto } from '../dtos/requests/sign-up.dto';
import { SignUpParams } from '../services/params/sign-up.params';
import { SignUpService } from '../services/sign-up.service';

@Controller('auth')
export class SignUpController {
    constructor(private service: SignUpService) {}

    @Post('sign-up')
    async handle(@Body(new RequestValidationPipe()) body: SignUpDto) {
        const params: SignUpParams = body;
        return this.service.handle(params);
    }
}
