import { EntityPaginationDto } from '../../../core/dtos/requests/entity-pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class UserPaginationDto extends EntityPaginationDto {
    @IsOptional()
    @IsString()
    search?: string;
}