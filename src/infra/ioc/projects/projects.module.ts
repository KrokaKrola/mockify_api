import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateProjectAction } from '../../../application/project/actions/project/create-project.action';
import { DeleteProjectAction } from '../../../application/project/actions/project/delete-project.action';
import { GetProjectsAction } from '../../../application/project/actions/project/get-projects.action';
import { UpdateProjectAction } from '../../../application/project/actions/project/update-project.action';
import { CreateFieldAction } from '../../../application/project/actions/resource-field/create-field.action';
import { DeleteFieldAction } from '../../../application/project/actions/resource-field/delete-field.action';
import { UpdateFieldAction } from '../../../application/project/actions/resource-field/update-field.action';
import { CreateResourceAction } from '../../../application/project/actions/resource/create-resource.action';
import { DeleteResourceAction } from '../../../application/project/actions/resource/delete-resource.action';
import { GetResourcesAction } from '../../../application/project/actions/resource/get-resources.action';
import { UpdateResourceAction } from '../../../application/project/actions/resource/update-resource.action';
import { ProjectsController } from '../../../ui/controllers/projects.controller';
import { ProjectMapper } from '../../database/postgres/mappers/project.mapper';
import { ResourceFieldMapper } from '../../database/postgres/mappers/resource-field.mapper';
import { ResourceMapper } from '../../database/postgres/mappers/resource.mapper';
import { ProjectRepository } from '../../database/postgres/repositories/project.repository';
import { ResourceFieldRepository } from '../../database/postgres/repositories/resource-field.repository';
import { ResourceRepository } from '../../database/postgres/repositories/resource.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectMapper, ResourceMapper, ResourceFieldMapper])],
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
        CreateFieldAction,
        ResourceFieldRepository,
        UpdateFieldAction,
        DeleteFieldAction,
    ],
})
export class ProjectsModule {}
