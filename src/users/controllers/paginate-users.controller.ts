import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { EntitySerializerService } from '../../core/services/entity-serializer.service';
import { UserPaginationService } from '../services/user-pagination.service';
import { UserPaginationDto } from '../dtos/requests/user-pagination.dto';
import { UserPaginationParams } from '../services/params/user-pagination.params';
import { PaginatedUsersDto } from '../dtos/responses/paginated-users.dto';

@Controller('users')
export class PaginateUsersController {
    constructor(
        private service: UserPaginationService,
        private serializer: EntitySerializerService
    ) {}

    @Get('paginate')
    @UseGuards(JwtAuthGuard)
    async handle(@Query() query: UserPaginationDto) {
        const params: UserPaginationParams = { ...query }
        const pagination = await this.service.paginate(params)
        return this.serializer.pagination(pagination, PaginatedUsersDto)
    }
}