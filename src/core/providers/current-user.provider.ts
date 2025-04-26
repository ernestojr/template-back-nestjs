import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserEntity } from '../entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserProvider {
    constructor(
        @Inject(REQUEST) private readonly request: Request
    ) {}

    getUser(): UserEntity {
        return this.request.user as UserEntity;
    }
}
