import { Module } from '@nestjs/common';
import { ProjectsController } from '../../../ui/controllers/projects.controller';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { CreateProjectAction } from '../../../application/project/actions/create-project.action';
import { UpdateProjectAction } from '../../../application/project/actions/update-project.action';
import { DeleteProjectAction } from '../../../application/project/actions/delete-project.action';

@Module({
    imports: [],
    controllers: [ProjectsController],
    providers: [ProjectRepository, CreateProjectAction, UpdateProjectAction, DeleteProjectAction],
})
export class ProjectsModule {}
