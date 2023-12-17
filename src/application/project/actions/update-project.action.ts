import { Injectable } from '@nestjs/common';
import { UpdateProjectRequest } from '../../../ui/requests/project/update-project.request';
import { ProjectRepository } from '../../../infra/database/repositories/project.repository';
import { UpdateProjectResponse } from '../../../ui/responses/project/update-project.response';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

@Injectable()
export class UpdateProjectAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(dto: UpdateProjectRequest, id: number): Promise<UpdateProjectResponse> {
        const project = await this.projectRepository.findById(id);

        if (!project) {
            throw new ResourceNotFoundException('Project not found');
        }

        project.name = dto.name;

        await this.projectRepository.update(project);

        return new UpdateProjectResponse(project.id, project.name);
    }
}
