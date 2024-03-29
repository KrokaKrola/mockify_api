import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
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
import { DeleteFieldAction } from '../../application/project/actions/resource-field/delete-field.action';
import { UpdateFieldAction } from '../../application/project/actions/resource-field/update-field.action';
import { CreateResourceAction } from '../../application/project/actions/resource/create-resource.action';
import { DeleteResourceAction } from '../../application/project/actions/resource/delete-resource.action';
import { GetResourcesAction } from '../../application/project/actions/resource/get-resources.action';
import { UpdateResourceAction } from '../../application/project/actions/resource/update-resource.action';
import { User } from '../../domain/user/decorators/user.decorator';
import { AccessTokenGuard } from '../../infra/auth/guards/access-token.guard';
import { CreateFieldRequest } from '../requests/project/create-field.request';
import { CreateProjectRequest } from '../requests/project/create-project.request';
import { CreateResourceRequest } from '../requests/project/create-resource.request';
import { UpdateFieldRequest } from '../requests/project/update-field.request';
import { UpdateProjectRequest } from '../requests/project/update-project.request';
import { UpdateResourceRequest } from '../requests/project/update-resource.request';

import type { CreateFieldResponse } from '../responses/project/create-field.response';
import type { CreateProjectResponse } from '../responses/project/create-project.response';
import type { CreateResourceResponse } from '../responses/project/create-resource.response';
import type { GetProjectsResponse } from '../responses/project/get-projects.response';
import type { GetResourcesResponse } from '../responses/project/get-resources.response';
import type { UpdateFieldResponse } from '../responses/project/update-field.response';
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
        private readonly updateFieldAction: UpdateFieldAction,
        private readonly deleteFieldAction: DeleteFieldAction,
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
        @Param('id', ParseIntPipe) id: number,
        @User() user: Request['user'],
    ): Promise<UpdateProjectResponse> {
        return this.updateProjectAction.execute(dto, id, user.id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(
        @Param('id', ParseIntPipe) id: number,
        @User() user: Request['user'],
    ): Promise<void> {
        return this.deleteProjectAction.execute(id, user.id);
    }

    @Get(':id/resources')
    public async getResources(
        @Param('id') id: number,
        @User() user: Request['user'],
    ): Promise<GetResourcesResponse> {
        return this.getResourcesAction.execute(id, user.id);
    }

    @Post(':id/resources')
    public async createResource(
        @Body() dto: CreateResourceRequest,
        @Param('id', ParseIntPipe) id: number,
        @User() user: Request['user'],
    ): Promise<CreateResourceResponse> {
        return this.createResourceAction.execute(dto, id, user.id);
    }

    @Patch(':id/resources/:resourceId')
    public async updateResource(
        @Body() dto: UpdateResourceRequest,
        @Param('id', ParseIntPipe) id: number,
        @Param('resourceId') resourceId: string,
        @User() user: Request['user'],
    ): Promise<UpdateResourceResponse> {
        return this.updateResourceAction.execute(dto, id, resourceId, user.id);
    }

    @Delete(':id/resources/:resourceId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteResource(
        @Param('id', ParseIntPipe) id: number,
        @Param('resourceId') resourceId: string,
        @User() user: Request['user'],
    ): Promise<void> {
        return this.deleteResourceAction.execute(id, resourceId, user.id);
    }

    @Post(':id/resources/:resourceId/fields')
    public async createField(
        @Body() dto: CreateFieldRequest,
        @Param('id', ParseIntPipe) id: number,
        @Param('resourceId') resourceId: string,
        @User() user: Request['user'],
    ): Promise<CreateFieldResponse> {
        return this.createFieldAction.execute(dto, id, resourceId, user.id);
    }

    @Patch(':id/resources/:resourceId/fields/:fieldId')
    public async updateField(
        @Body() dto: UpdateFieldRequest,
        @Param('id', ParseIntPipe) id: number,
        @Param('fieldId') fieldId: string,
        @Param('resourceId') resourceId: string,
        @User() user: Request['user'],
    ): Promise<UpdateFieldResponse> {
        return this.updateFieldAction.execute(dto, id, resourceId, fieldId, user.id);
    }

    @Delete(':id/resources/:resourceId/fields/:fieldId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteField(
        @Param('id', ParseIntPipe) id: number,
        @Param('resourceId') resourceId: string,
        @Param('fieldId') fieldId: string,
        @User() user: Request['user'],
    ): Promise<void> {
        return this.deleteFieldAction.execute(id, resourceId, fieldId, user.id);
    }
}
