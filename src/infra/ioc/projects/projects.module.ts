import { Module } from '@nestjs/common';
import { ProjectsController } from '../../../ui/controllers/projects.controller';
import { CreateProjectAction } from '../../../application/project/actions/create-project.action';
import { UpdateProjectAction } from '../../../application/project/actions/update-project.action';
import { DeleteProjectAction } from '../../../application/project/actions/delete-project.action';
import { GetProjectsAction } from '../../../application/project/actions/get-projects.action';
import { CreateProjectEntryAction } from '../../../application/project/actions/create-project-entry.action';
import { GetProjectEntriesAction } from '../../../application/project/actions/get-project-entries.action';
import { UpdateProjectEntryAction } from '../../../application/project/actions/update-project-entry.action';
import { DeleteProjectEntryAction } from '../../../application/project/actions/delete-project-entry.action';
import { ProjectRepository } from '../../database/postgres/repositories/project.repository';
import { ProjectEntryRepository } from '../../database/postgres/repositories/project-entry.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMapper } from '../../database/postgres/mappers/project.mapper';
import { ProjectEntryMapper } from '../../database/postgres/mappers/project-entry.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectMapper, ProjectEntryMapper])],
    controllers: [ProjectsController],
    providers: [
        ProjectRepository,
        ProjectEntryRepository,
        CreateProjectAction,
        UpdateProjectAction,
        DeleteProjectAction,
        GetProjectsAction,
        CreateProjectEntryAction,
        GetProjectEntriesAction,
        UpdateProjectEntryAction,
        DeleteProjectEntryAction,
    ],
})
export class ProjectsModule {}
