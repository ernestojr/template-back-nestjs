import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserEntity } from './entities/user.entity';
import { EntitySerializerService } from './services/entity-serializer.service';
import { CurrentUserProvider } from './providers/current-user.provider';
import { RequestValidationPipe } from './pipes/request-validation.pipe';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity
        ]),
    ],
    providers: [
        JwtStrategy,
        EntitySerializerService,
        CurrentUserProvider,
        {
            provide: APP_PIPE,
            useClass: RequestValidationPipe,
        }
    ],
    exports: [
        TypeOrmModule.forFeature([
            UserEntity,
        ]),
        JwtStrategy,
        EntitySerializerService,
        CurrentUserProvider
    ],
})
export class CoreModule {}
