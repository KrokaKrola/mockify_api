import { Injectable } from '@nestjs/common';

import { ProjectService } from '../../../../domain/project/services/project.service';
import { ProjectRepository } from '../../../../infra/database/postgres/repositories/project.repository';
import { UpdateProjectResponse } from '../../../../ui/responses/project/update-project.response';

import type { UpdateProjectRequest } from '../../../../ui/requests/project/update-project.request';

@Injectable()
export class UpdateProjectAction {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectService: ProjectService,
    ) {}

    public async execute(
        dto: UpdateProjectRequest,
        id: number,
        userId: number,
    ): Promise<UpdateProjectResponse> {
        const project = await this.projectService.validateAndCheckDeletability(id, userId);

        await this.projectRepository.update({ id, userId }, { name: dto.name });

        project.name = dto.name;

        return new UpdateProjectResponse(project.id, project.name, project.publicId);
    }
}
