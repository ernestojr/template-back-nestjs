import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { CreateUserController } from './controllers/create-user.controller';
import { PaginateUsersController } from './controllers/paginate-users.controller';
import { GetUsersController } from './controllers/get-users.controller';
import { FindUserController } from './controllers/find-user.controller';
import { UpdateUserController } from './controllers/update-user.controller';
import { DeleteUserController } from './controllers/delete-user.controller';
import { ChangeUserPasswordController } from './controllers/change-user-password.controller';
import { CreateUserService } from './services/create-user.service';
import { UserQueryService } from './services/user-query.service';
import { UpdateUserService } from './services/update-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { ValidateUserService } from './services/validate-user.service';
import { UserPaginationService } from './services/user-pagination.service';
import { ChangeUserPasswordService } from './services/change-user-password.service';

@Module({
  imports: [
    CoreModule,
  ],
  controllers: [
    CreateUserController,
    PaginateUsersController,
    GetUsersController,
    FindUserController,
    UpdateUserController,
    DeleteUserController,
    ChangeUserPasswordController,
  ],
  providers: [
    CreateUserService,
    UserQueryService,
    UpdateUserService,
    DeleteUserService,
    ValidateUserService,
    UserPaginationService,
    ChangeUserPasswordService,
  ],
  exports: [
    CreateUserService,
    UserQueryService,
    ValidateUserService,
  ],
})
export class UsersModule {}
