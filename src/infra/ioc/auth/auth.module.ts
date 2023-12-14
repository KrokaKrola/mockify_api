import { Module } from '@nestjs/common';
import { AuthController } from '../../../ui/controllers/auth.controller';
import { AccessTokenStrategy } from '../../auth/strategies/access-token.strategy';
import { RefreshTokenStrategy } from '../../auth/strategies/refresh-token.strategy';
import { SignUpAction } from '../../../application/user/actions/sign-up.action';
import { AuthService } from '../../../domain/user/services/auth.service';
import { SignInAction } from '../../../application/user/actions/sign-in.action';
import { UserRepository } from '../../database/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { LogoutAction } from '../../../application/user/actions/logout.action';
import { RefreshTokensAction } from '../../../application/user/actions/refresh-tokens.action';

@Module({
    imports: [JwtModule.register({})],
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
