import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogoutAction } from '../../../application/user/actions/logout.action';
import { RefreshTokensAction } from '../../../application/user/actions/refresh-tokens.action';
import { SignInAction } from '../../../application/user/actions/sign-in.action';
import { SignUpAction } from '../../../application/user/actions/sign-up.action';
import { AuthService } from '../../../domain/user/services/auth.service';
import { AuthController } from '../../../ui/controllers/auth.controller';
import { AccessTokenStrategy } from '../../auth/strategies/access-token.strategy';
import { RefreshTokenStrategy } from '../../auth/strategies/refresh-token.strategy';
import { UserMapper } from '../../database/postgres/mappers/user.mapper';
import { UserRepository } from '../../database/postgres/repositories/user.repository';

@Module({
    imports: [JwtModule.register({}), TypeOrmModule.forFeature([UserMapper])],
    controllers: [AuthController],
    providers: [
        AccessTokenStrategy,
        RefreshTokenStrategy,
        SignUpAction,
        SignInAction,
        AuthService,
        UserRepository,
        LogoutAction,
        RefreshTokensAction,
    ],
})
export class AuthModule {}
