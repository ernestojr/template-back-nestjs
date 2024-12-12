import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserService } from '../services/create-user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateUserController {
  constructor(private readonly service: CreateUserService) {}

  @Post()
  @Roles('admin')
  async handle(@Body() dto: CreateUserDto) {
    return await this.service.handle(dto);
  }
}
