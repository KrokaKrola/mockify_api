import { Module } from '@nestjs/common';
import { ProjectsController } from '../../../ui/controllers/projects.controller';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { CreateProjectAction } from '../../../application/project/actions/create-project.action';

@Module({
    imports: [],
    controllers: [ProjectsController],
    providers: [ProjectRepository, CreateProjectAction],
})
export class ProjectsModule {}
