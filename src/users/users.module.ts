import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserController } from './controllers/create-user.controller';
import { FindUsersController } from './controllers/find-users.controller';
import { FindUserController } from './controllers/find-user.controller';
import { UpdateUserController } from './controllers/update-user.controller';
import { DeleteUserController } from './controllers/delete-user.controller';
import { CreateUserService } from './services/create-user.service';
import { FindUsersService } from './services/find-users.service';
import { FindUserService } from './services/find-user.service';
import { UpdateUserService } from './services/update-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { ValidateUserService } from './services/validate-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [
    CreateUserController,
    FindUsersController,
    FindUserController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [
    CreateUserService,
    FindUsersService,
    FindUserService,
    UpdateUserService,
    DeleteUserService,
    ValidateUserService,
  ],
  exports: [
    CreateUserService,
    FindUsersService,
    FindUserService,
    UpdateUserService,
    DeleteUserService,
    ValidateUserService,
  ],
})
export class UsersModule {}
