import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateProjectAction } from '../../../application/project/actions/create-project.action';
import { CreateResourceAction } from '../../../application/project/actions/create-resource.action';
import { DeleteProjectAction } from '../../../application/project/actions/delete-project.action';
import { DeleteResourceAction } from '../../../application/project/actions/delete-resource.action';
import { GetProjectsAction } from '../../../application/project/actions/get-projects.action';
import { GetResourcesAction } from '../../../application/project/actions/get-resources.action';
import { UpdateProjectAction } from '../../../application/project/actions/update-project.action';
import { UpdateResourceAction } from '../../../application/project/actions/update-resource.action';
import { ProjectsController } from '../../../ui/controllers/projects.controller';
import { ProjectMapper } from '../../database/postgres/mappers/project.mapper';
import { ResourceMapper } from '../../database/postgres/mappers/resource.mapper';
import { ProjectRepository } from '../../database/postgres/repositories/project.repository';
import { ResourceRepository } from '../../database/postgres/repositories/resource.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectMapper, ResourceMapper])],
    controllers: [ProjectsController],
    providers: [
        ProjectRepository,
        ResourceRepository,
        CreateProjectAction,
        UpdateProjectAction,
        DeleteProjectAction,
        GetProjectsAction,
        CreateResourceAction,
        GetResourcesAction,
        UpdateResourceAction,
        DeleteResourceAction,
    ],
})
export class ProjectsModule {}
