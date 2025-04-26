import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { CreateUserService } from '../services/create-user.service';
import { RequestValidationPipe } from '../../core/pipes/request-validation.pipe';
import { CreateUserDto } from '../dtos/requests/create-user.dto';
import { CreateUserParams } from '../services/params/create-user.params';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateUserController {
  constructor(private readonly service: CreateUserService) {}

  @Post()
  @Roles('admin')
  async handle(@Body(new RequestValidationPipe()) body: CreateUserDto) {
    const params: CreateUserParams = body;
    await this.service.handle(params);
    return {
      message: 'Usuario creado correctamente',
    };
  }
}
