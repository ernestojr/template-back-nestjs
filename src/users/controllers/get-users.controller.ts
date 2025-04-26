import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { EntitySerializerService } from '../../core/services/entity-serializer.service';
import { UserQueryService } from '../services/user-query.service';
import { UserDto } from '../dtos/responses/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetUsersController {
  constructor(
    private readonly service: UserQueryService,
    private serializer: EntitySerializerService
  ) {}

  @Get()
  @Roles('admin')
  async handle() {
    const users = await this.service.getAll();
    return this.serializer.collection(users, UserDto);
  }
}
