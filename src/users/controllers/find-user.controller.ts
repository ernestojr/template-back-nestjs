import { Controller, UseGuards, Get, Param, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { EntitySerializerService } from '../../core/services/entity-serializer.service';
import { UserQueryService } from '../services/user-query.service';
import { UserDto } from '../dtos/responses/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FindUserController {
  constructor(
    private readonly service: UserQueryService,
    private serializer: EntitySerializerService
  ) {}

  @Get(':id')
  @Roles('admin')
  async handle(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.service.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return this.serializer.single(user, UserDto);
  }
}

