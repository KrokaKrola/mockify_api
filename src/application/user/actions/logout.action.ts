import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../infra/database/repositories/user.repository';

@Injectable()
export class LogoutAction {
    constructor(private readonly userRepository: UserRepository) {}

    public async execute(userId: number): Promise<void> {
        await this.userRepository.update({ id: userId, refreshToken: null });
    }
}
