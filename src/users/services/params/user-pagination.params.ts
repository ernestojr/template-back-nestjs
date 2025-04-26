import { EntityPaginationParams } from "../../../core/services/params/entity-pagination.params"

export class UserPaginationParams extends EntityPaginationParams {
    search?: string;
}