import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { UserRepository } from '../../../infra/database/postgres/repositories/user.repository';

@Injectable()
export class LogoutAction {
    constructor(private readonly userRepository: UserRepository) {}

    public async execute(userId: number): Promise<void> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundException('User not found');
        }

        await this.userRepository.update({ id: userId }, { refreshToken: null });
    }
}
