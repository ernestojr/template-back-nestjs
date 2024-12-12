import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up.dto';
import { CreateUserService } from '../../users/services/create-user.service';

@Injectable()
export class SignUpService {
    constructor(
        private readonly createUserService: CreateUserService,
    ) {}

    async handle(dto: SignUpDto): Promise<any> {
        return this.createUserService.handle(dto);
    }
}
