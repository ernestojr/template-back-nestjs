import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserController } from './controllers/create-user.controller';
import { FindAllUsersController } from './controllers/find-all-users.controller';
import { FindOneUserController } from './controllers/find-one-user.controller';
import { UpdateUserController } from './controllers/update-user.controller';
import { DeleteUserController } from './controllers/delete-user.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [
    CreateUserController,
    FindAllUsersController,
    FindOneUserController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
