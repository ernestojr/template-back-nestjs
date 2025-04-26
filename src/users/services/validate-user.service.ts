import { Injectable } from '@nestjs/common';
import { UserQueryService } from './user-query.service';
import { ValidateUserParams } from './params/validate-user.params';
import { comparePassword } from '../../core/helpers/password.helper';
@Injectable()
export class ValidateUserService {
    constructor(
        private readonly userService: UserQueryService,
    ) {}

    async handle(params: ValidateUserParams): Promise<any> {
        const { email, password } = params;
        const user = await this.userService.findOneBy({ email });
        const isPasswordValid = await comparePassword(
            password,
            user.password
        );
        if (user && isPasswordValid) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }
}
