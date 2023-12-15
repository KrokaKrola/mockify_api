import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateProjectAction } from '../../application/project/actions/create-project.action';
import { CreateProjectResponse } from '../responses/project/create-project.response';
import { CreateProjectRequest } from '../requests/project/create-project.request';
import { AccessTokenGuard } from '../../infra/auth/guards/access-token.guard';
import { Request } from 'express';

@Controller('projects')
@UseGuards(AccessTokenGuard)
export class ProjectsController {
    constructor(private readonly createProjectAction: CreateProjectAction) {}

    @Post()
    public async create(
        @Body() dto: CreateProjectRequest,
        @Req() req: Request,
    ): Promise<CreateProjectResponse> {
        return this.createProjectAction.execute(dto, req.user.id);
    }
}
