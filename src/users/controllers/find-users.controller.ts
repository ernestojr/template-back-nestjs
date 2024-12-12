import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FindUsersService } from '../services/find-users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FindUsersController {
  constructor(private readonly service: FindUsersService) {}

  @Get()
  @Roles('admin')
  async handle() {
    return await this.service.handle();
  }
}
