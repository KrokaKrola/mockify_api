import { Module } from '@nestjs/common';
import { UserApiController } from '../../../ui/controllers/user-api.controller';
import { ProjectRepository } from '../../database/repositories/project.repository';

@Module({
    controllers: [UserApiController],
    providers: [ProjectRepository],
})
export class UserApiModule {}
