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

@Controller('projects')
@UseGuards(AccessTokenGuard)
export class ProjectsController {
    constructor(
        private readonly createProjectAction: CreateProjectAction,
        private readonly updateProjectAction: UpdateProjectAction,
        private readonly deleteProjectAction: DeleteProjectAction,
        private readonly getProjectsAction: GetProjectsAction,
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
}
