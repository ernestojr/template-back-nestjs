import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FindUserService } from '../services/find-user.service';
import { FindUserDto } from '../dtos/find-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FindUserController {
  constructor(private readonly service: FindUserService) {}

  @Get(':id')
  @Roles('admin')
  async handle(@Param('id') id: string) {
    const dto: FindUserDto = { id };
    return await this.service.handle(dto);
  }
}
