import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { GetResourcesResponse } from '../../../ui/responses/project/get-resources.response';

@Injectable()
export class GetResourcesAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(projectId: number, userId: number): Promise<GetResourcesResponse> {
        const project = await this.projectRepository.findProjectById(projectId, ['resources']);

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        return new GetResourcesResponse(project.resources);
    }
}
