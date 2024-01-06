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

import { Request } from 'express';

import { CreateProjectAction } from '../../application/project/actions/create-project.action';
import { CreateResourceAction } from '../../application/project/actions/create-resource.action';
import { DeleteProjectAction } from '../../application/project/actions/delete-project.action';
import { DeleteResourceAction } from '../../application/project/actions/delete-resource.action';
import { GetProjectsAction } from '../../application/project/actions/get-projects.action';
import { GetResourcesAction } from '../../application/project/actions/get-resources.action';
import { UpdateProjectAction } from '../../application/project/actions/update-project.action';
import { UpdateResourceAction } from '../../application/project/actions/update-resource.action';
import { AccessTokenGuard } from '../../infra/auth/guards/access-token.guard';
import { CreateProjectRequest } from '../requests/project/create-project.request';
import { CreateResourceRequest } from '../requests/project/create-resource.request';
import { UpdateProjectRequest } from '../requests/project/update-project.request';
import { UpdateResourceRequest } from '../requests/project/update-resource.request';

import type { CreateProjectResponse } from '../responses/project/create-project.response';
import type { CreateResourceResponse } from '../responses/project/create-resource.response';
import type { GetProjectsResponse } from '../responses/project/get-projects.response';
import type { GetResourcesResponse } from '../responses/project/get-resources.response';
import type { UpdateProjectResponse } from '../responses/project/update-project.response';
import type { UpdateResourceResponse } from '../responses/project/update-resource.response';

@Controller('projects')
@UseGuards(AccessTokenGuard)
export class ProjectsController {
    constructor(
        private readonly createProjectAction: CreateProjectAction,
        private readonly updateProjectAction: UpdateProjectAction,
        private readonly deleteProjectAction: DeleteProjectAction,
        private readonly getProjectsAction: GetProjectsAction,
        private readonly createResourceAction: CreateResourceAction,
        private readonly getResourcesAction: GetResourcesAction,
        private readonly updateResourceAction: UpdateResourceAction,
        private readonly deleteResourceAction: DeleteResourceAction,
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

    @Post(':id/resources')
    public async createEntry(
        @Body() dto: CreateResourceRequest,
        @Param() id: number,
        @Req() req: Request,
    ): Promise<CreateResourceResponse> {
        return this.createResourceAction.execute(dto, req.user.id, id);
    }

    @Get(':id/resources')
    public async getEntries(
        @Param('id') id: number,
        @Req() req: Request,
    ): Promise<GetResourcesResponse> {
        return this.getResourcesAction.execute(id, req.user.id);
    }

    @Patch(':id/resources/:resourceId')
    public async updateEntry(
        @Body() dto: UpdateResourceRequest,
        @Param('id') projectId: number,
        @Param('resourceId') resourceId: number,
        @Param() req: Request,
    ): Promise<UpdateResourceResponse> {
        return this.updateResourceAction.execute(dto, projectId, resourceId, req.user.id);
    }

    @Delete(':id/entries/:resourceId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteEntry(
        @Param('id') projectId: number,
        @Param('resourceId') resourceId: number,
        @Req() req: Request,
    ): Promise<void> {
        return this.deleteResourceAction.execute(projectId, resourceId, req.user.id);
    }
}
