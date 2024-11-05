import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FindAllUsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles('admin')
  run(): Promise<User[]> {
    return this.userService.findAll();
  }
}
