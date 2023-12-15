import {
    Body,
    Controller,
    Delete,
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

@Controller('projects')
@UseGuards(AccessTokenGuard)
export class ProjectsController {
    constructor(
        private readonly createProjectAction: CreateProjectAction,
        private readonly updateProjectAction: UpdateProjectAction,
        private readonly deleteProjectAction: DeleteProjectAction,
    ) {}

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
