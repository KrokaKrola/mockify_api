import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { UpdateProjectRequest } from '../../../ui/requests/project/update-project.request';
import { UpdateProjectResponse } from '../../../ui/responses/project/update-project.response';

@Injectable()
export class UpdateProjectAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(dto: UpdateProjectRequest, id: number): Promise<UpdateProjectResponse> {
        const project = await this.projectRepository.findProjectById(id);

        if (!project) {
            throw new ResourceNotFoundException('Project not found');
        }

        await this.projectRepository.update({ id }, { name: dto.name });

        project.name = dto.name;

        return new UpdateProjectResponse(project.id, project.name);
    }
}
