import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [],
    providers: [
        JwtStrategy,
    ],
    exports: [
        JwtStrategy,
    ],
})
export class CommonModule {}
