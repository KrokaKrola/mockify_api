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

import { CreateProjectAction } from '../../application/project/actions/project/create-project.action';
import { DeleteProjectAction } from '../../application/project/actions/project/delete-project.action';
import { GetProjectsAction } from '../../application/project/actions/project/get-projects.action';
import { UpdateProjectAction } from '../../application/project/actions/project/update-project.action';
import { CreateFieldAction } from '../../application/project/actions/resource-field/create-field.action';
import { CreateResourceAction } from '../../application/project/actions/resource/create-resource.action';
import { DeleteResourceAction } from '../../application/project/actions/resource/delete-resource.action';
import { GetResourcesAction } from '../../application/project/actions/resource/get-resources.action';
import { UpdateResourceAction } from '../../application/project/actions/resource/update-resource.action';
import { ProjectOwnershipGuard } from '../../domain/project/guards/project-ownership.guard';
import { ResourceOwnershipGuard } from '../../domain/project/guards/resource-ownership.guard';
import { AccessTokenGuard } from '../../infra/auth/guards/access-token.guard';
import { CreateFieldRequest } from '../requests/project/create-field.request';
import { CreateProjectRequest } from '../requests/project/create-project.request';
import { CreateResourceRequest } from '../requests/project/create-resource.request';
import { UpdateProjectRequest } from '../requests/project/update-project.request';
import { UpdateResourceRequest } from '../requests/project/update-resource.request';

import type { CreateFieldResponse } from '../responses/project/create-field.response';
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
        private readonly createFieldAction: CreateFieldAction,
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
    @UseGuards(ProjectOwnershipGuard)
    public async update(
        @Body() dto: UpdateProjectRequest,
        @Param('id') id: number,
    ): Promise<UpdateProjectResponse> {
        return this.updateProjectAction.execute(dto, id);
    }

    @Delete(':id')
    @UseGuards(ProjectOwnershipGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param('id') id: number): Promise<void> {
        return this.deleteProjectAction.execute(id);
    }

    @Post(':id/resources')
    @UseGuards(ProjectOwnershipGuard)
    public async createResource(
        @Body() dto: CreateResourceRequest,
        @Param('id') id: number,
    ): Promise<CreateResourceResponse> {
        return this.createResourceAction.execute(dto, id);
    }

    @Get(':id/resources')
    @UseGuards(ProjectOwnershipGuard)
    public async getResources(@Param('id') id: number): Promise<GetResourcesResponse> {
        return this.getResourcesAction.execute(id);
    }

    @Patch(':id/resources/:resourceId')
    @UseGuards(ProjectOwnershipGuard, ResourceOwnershipGuard)
    public async updateResource(
        @Body() dto: UpdateResourceRequest,
        @Param('resourceId') resourceId: number,
    ): Promise<UpdateResourceResponse> {
        return this.updateResourceAction.execute(dto, resourceId);
    }

    @Delete(':id/resources/:resourceId')
    @UseGuards(ProjectOwnershipGuard, ResourceOwnershipGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteResource(@Param('resourceId') resourceId: number): Promise<void> {
        return this.deleteResourceAction.execute(resourceId);
    }

    @Post(':id/resources/:resourceId/fields')
    @UseGuards(ProjectOwnershipGuard, ResourceOwnershipGuard)
    public async createField(
        @Body() dto: CreateFieldRequest,
        @Param('id') projectId: string,
        @Param('resourceId') resourceId: number,
        @Req() req: Request,
    ): Promise<CreateFieldResponse> {
        return this.createFieldAction.execute(dto, projectId, resourceId, req.user.id);
    }
}
