import { Controller, UseGuards, Put, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateUserService } from '../services/update-user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateUserController {
  constructor(private readonly service: UpdateUserService) {}

  @Put(':id')
  @Roles('admin')
  async handle(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const dto: UpdateUserDto = { id, ...body };
    return await this.service.handle(dto);
  }
}
