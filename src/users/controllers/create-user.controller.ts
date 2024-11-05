import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateUserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Roles('admin')
  run(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
