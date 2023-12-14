import { Injectable } from '@nestjs/common';
import { SignUpRequest } from '../../../ui/requests/auth/sign-up.request';
import { UserRepository } from '../../../infra/database/repositories/user.repository';
import { UserExistException } from '../exceptions/user-exist.exception';
import { AuthService } from '../../../domain/user/services/auth.service';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { SignUpResponse } from '../../../ui/responses/auth/sign-up.response';

@Injectable()
export class SignUpAction {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
    ) {}

    public async execute(dto: SignUpRequest): Promise<SignUpResponse> {
        const userExists = await this.userRepository.findByEmail(dto.email);

        if (userExists) {
            throw new UserExistException('User already exists');
        }

        const passwordHash = await this.authService.hashValue(dto.password);

        const userEntity = new UserEntity(dto.email, dto.name, passwordHash);

        const user = await this.userRepository.create(userEntity);

        const tokens = await this.authService.getTokens(user.id, dto.email);

        const hashedRefreshToken = await this.authService.hashValue(tokens.refreshToken);

        await this.userRepository.update({ id: user.id, refreshToken: hashedRefreshToken });

        return new SignUpResponse(
            user.id,
            user.email,
            user.name,
            tokens.accessToken,
            tokens.refreshToken,
        );
    }
}
