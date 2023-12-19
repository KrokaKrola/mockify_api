import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CreateProjectAction } from '../../application/project/actions/create-project.action';
import { CreateProjectResponse } from '../responses/project/create-project.response';
import { CreateProjectRequest } from '../requests/project/create-project.request';
import { AccessTokenGuard } from '../../infra/auth/guards/access-token.guard';
import { Request } from 'express';
import { UpdateProjectRequest } from '../requests/project/update-project.request';
import { UpdateProjectResponse } from '../responses/project/update-project.response';
import { UpdateProjectAction } from '../../application/project/actions/update-project.action';
import { DeleteProjectAction } from '../../application/project/actions/delete-project.action';
import { GetProjectsAction } from '../../application/project/actions/get-projects.action';
import { GetProjectsResponse } from '../responses/project/get-projects.response';
import { CreateEntryRequest } from '../requests/project/create-entry.request';
import { CreateProjectEntryAction } from '../../application/project/actions/create-project-entry.action';
import { CreateProjectEntryResponse } from '../responses/project/create-project-entry.response';
import { GetProjectEntriesAction } from '../../application/project/actions/get-project-entries.action';
import { GetProjectEntriesResponse } from '../responses/project/get-project-entries.response';
import { UpdateProjectEntryRequest } from '../requests/project/update-project-entry.request';
import { UpdateProjectEntryAction } from '../../application/project/actions/update-project-entry.action';
import { UpdateProjectEntryResponse } from '../responses/project/update-project-entry.response';
import { DeleteProjectEntryAction } from '../../application/project/actions/delete-project-entry.action';

@Controller('projects')
@UseGuards(AccessTokenGuard)
export class ProjectsController {
    constructor(
        private readonly createProjectAction: CreateProjectAction,
        private readonly updateProjectAction: UpdateProjectAction,
        private readonly deleteProjectAction: DeleteProjectAction,
        private readonly getProjectsAction: GetProjectsAction,
        private readonly createProjectEntryAction: CreateProjectEntryAction,
        private readonly getProjectEntries: GetProjectEntriesAction,
        private readonly updateProjectEntryAction: UpdateProjectEntryAction,
        private readonly deleteProjectEntryAction: DeleteProjectEntryAction,
    ) {}

    @Get()
    public async getProjects(@Req() request: Request): Promise<GetProjectsResponse> {
        return this.getProjectsAction.execute(request.user.id);
    }

    @Post()
    public async create(
        @Body() dto: CreateProjectRequest,
        @Req() req: Request,
    ): Promise<CreateProjectResponse> {
        return this.createProjectAction.execute(dto, req.user.id);
    }

    @Patch(':id')
    public async update(
        @Body() dto: UpdateProjectRequest,
        @Param('id') id: number,
    ): Promise<UpdateProjectResponse> {
        return this.updateProjectAction.execute(dto, id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param('id') id: number): Promise<void> {
        return this.deleteProjectAction.execute(id);
    }

    @Post(':id/entries')
    public async createEntry(
        @Body() dto: CreateEntryRequest,
        @Param() id: number,
        @Req() req: Request,
    ): Promise<CreateProjectEntryResponse> {
        return this.createProjectEntryAction.execute(dto, req.user.id, id);
    }

    @Get(':id/entries')
    public async getEntries(
        @Param('id') id: number,
        @Req() req: Request,
    ): Promise<GetProjectEntriesResponse> {
        return this.getProjectEntries.execute(id, req.user.id);
    }

    @Patch(':id/entries/:entryId')
    public async updateEntry(
        @Body() dto: UpdateProjectEntryRequest,
        @Param('id') projectId: number,
        @Param('entryId') entryId: number,
        @Param() req: Request,
    ): Promise<UpdateProjectEntryResponse> {
        return this.updateProjectEntryAction.execute(dto, projectId, entryId, req.user.id);
    }

    @Delete(':id/entries/:entryId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteEntry(
        @Param('id') projectId: number,
        @Param('entryId') entryId: number,
        @Req() req: Request,
    ): Promise<void> {
        return this.deleteProjectEntryAction.execute(projectId, entryId, req.user.id);
    }
}
