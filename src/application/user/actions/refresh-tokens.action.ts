import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../infra/database/repositories/user.repository';
import { AccessDeniedException } from '../../../infra/exceptions/access-denied.exception';
import { AuthService } from '../../../domain/user/services/auth.service';
import { Request } from 'express';
import { RefreshTokensResponse } from '../../../ui/responses/auth/refresh-tokens.response';

@Injectable()
export class RefreshTokensAction {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
    ) {}

    public async execute(req: Request): Promise<RefreshTokensResponse> {
        const { id, refreshToken, email } = req.user;
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AccessDeniedException();
        }

        if (!user.refreshToken) {
            throw new AccessDeniedException();
        }

        const verifyResult = await this.authService.verifyHashValue(
            user.refreshToken,
            refreshToken,
        );

        if (!verifyResult) {
            throw new AccessDeniedException();
        }

        const tokens = await this.authService.getTokens(id, email);

        const hashedRefreshToken = await this.authService.hashValue(tokens.refreshToken);

        await this.userRepository.update({ id, refreshToken: hashedRefreshToken });

        return new RefreshTokensResponse(tokens.accessToken, tokens.refreshToken);
    }
}