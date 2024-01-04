import { Injectable } from '@nestjs/common';
import { SignUpRequest } from '../../../ui/requests/auth/sign-up.request';
import { AuthService } from '../../../domain/user/services/auth.service';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { SignUpResponse } from '../../../ui/responses/auth/sign-up.response';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { UserRepository } from '../../../infra/database/postgres/repositories/user.repository';

@Injectable()
export class SignUpAction {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
    ) {}

    public async execute(dto: SignUpRequest): Promise<SignUpResponse> {
        const userExists = await this.userRepository.exists({ where: { email: dto.email } });

        if (userExists) {
            throw new ResourceExistsException('User already exists');
        }

        const passwordHash = await this.authService.hashValue(dto.password);

        const userEntity = new UserEntity(dto.email, dto.name, passwordHash);

        const user = this.userRepository.create(userEntity);

        await this.userRepository.save(user);

        const tokens = await this.authService.getTokens(user.id, dto.email);

        const hashedRefreshToken = await this.authService.hashValue(tokens.refreshToken);

        await this.userRepository.update({ id: user.id }, { refreshToken: hashedRefreshToken });

        return new SignUpResponse(
            user.id,
            user.email,
            user.name,
            tokens.accessToken,
            tokens.refreshToken,
        );
    }
}
