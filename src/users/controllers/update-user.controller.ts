import { Controller, UseGuards, Put, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { RequestValidationPipe } from '../../core/pipes/request-validation.pipe';
import { UpdateUserService } from '../services/update-user.service';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { UpdateUserParams } from '../services/params/update-user.params';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateUserController {
  constructor(private readonly service: UpdateUserService) {}

  @Put(':id')
  @Roles('admin')
  async handle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new RequestValidationPipe()) body: UpdateUserDto
  ) {
    const params: UpdateUserParams = { id, ...body };
    await this.service.handle(params);
    return {
      message: 'Usuario actualizado correctamente',
    };
  }
}
