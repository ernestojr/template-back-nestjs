import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateUserParams } from '../../users/services/params/validate-user.params';
import { ValidateUserService } from '../../users/services/validate-user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private service: ValidateUserService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const params: ValidateUserParams = { email, password };
    const user = await this.service.handle(params);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }
}
