import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../infra/database/repositories/user.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

@Injectable()
export class LogoutAction {
    constructor(private readonly userRepository: UserRepository) {}

    public async execute(userId: number): Promise<void> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundException('User not found');
        }

        await this.userRepository.update({ id: userId, refreshToken: null });
    }
}
