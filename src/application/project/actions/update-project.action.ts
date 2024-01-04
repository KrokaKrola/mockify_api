import { Injectable } from '@nestjs/common';
import { UpdateProjectRequest } from '../../../ui/requests/project/update-project.request';
import { UpdateProjectResponse } from '../../../ui/responses/project/update-project.response';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';

@Injectable()
export class UpdateProjectAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(dto: UpdateProjectRequest, id: number): Promise<UpdateProjectResponse> {
        const project = await this.projectRepository.findOne({ where: { id } });

        if (!project) {
            throw new ResourceNotFoundException('Project not found');
        }

        await this.projectRepository.update({ id }, { name: dto.name });

        project.name = dto.name;

        return new UpdateProjectResponse(project.id, project.name);
    }
}
