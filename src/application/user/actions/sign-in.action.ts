import { Injectable } from '@nestjs/common';

import { AuthService } from '../../../domain/user/services/auth.service';
import { UserRepository } from '../../../infra/database/postgres/repositories/user.repository';
import { SignInResponse } from '../../../ui/responses/auth/sign-in.response';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';

import type { SignInRequest } from '../../../ui/requests/auth/sign-in.request';

@Injectable()
export class SignInAction {
    constructor(
        private readonly authService: AuthService,
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(dto: SignInRequest): Promise<SignInResponse> {
        const user = await this.userRepository.findOneByEmail(dto.email);

        if (!user) {
            throw new InvalidCredentialsException();
        }

        const isPasswordValid: boolean = await this.authService.verifyHashValue(
            user.password,
            dto.password,
        );

        if (!isPasswordValid) {
            throw new InvalidCredentialsException();
        }

        const tokens = await this.authService.getTokens(user.id, user.email);
        const hashedRefreshToken = await this.authService.hashValue(tokens.refreshToken);

        await this.userRepository.update({ id: user.id }, { refreshToken: hashedRefreshToken });

        return new SignInResponse(
            user.id,
            user.email,
            user.name,
            tokens.accessToken,
            tokens.refreshToken,
        );
    }
}
