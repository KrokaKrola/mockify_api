import { Injectable, NotFoundException } from '@nestjs/common';

import type { Request } from 'express';

import { AuthService } from '../../../domain/user/services/auth.service';
import { UserRepository } from '../../../infra/database/postgres/repositories/user.repository';
import { AccessDeniedException } from '../../../infra/exceptions/access-denied.exception';
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
            throw new NotFoundException('User not found', 'user');
        }

        if (!user.refreshToken) {
            throw new NotFoundException('Refresh token not found', 'refreshToken');
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

        await this.userRepository.update({ id }, { refreshToken: hashedRefreshToken });

        return new RefreshTokensResponse(tokens.accessToken, tokens.refreshToken);
    }
}
