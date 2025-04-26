import { Controller, Delete, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { DeleteUserService } from '../services/delete-user.service';
import { DeleteUserParams } from '../services/params/delete-user.params';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteUserController {
  constructor(private readonly service: DeleteUserService) {}

  @Delete(':id')
  @Roles('admin')
  async handle(@Param('id', new ParseUUIDPipe()) id: string) {
    const params: DeleteUserParams = { id };
    return await this.service.handle(params);
  }
}
