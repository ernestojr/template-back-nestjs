import { Injectable } from '@nestjs/common';
import { SignUpParams } from '../services/params/sign-up.params';
import { CreateUserService } from '../../users/services/create-user.service';

@Injectable()
export class SignUpService {
    constructor(
        private readonly createUserService: CreateUserService,
    ) {}

    async handle(params: SignUpParams): Promise<any> {
        return this.createUserService.handle(params);
    }
}
