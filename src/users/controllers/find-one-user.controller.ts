import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FindOneUserController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @Roles('admin')
  run(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
}
