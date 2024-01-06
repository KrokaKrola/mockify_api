import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ResourceRepository } from '../../../infra/database/postgres/repositories/resource.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

@Injectable()
export class DeleteResourceAction {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly resourceRepository: ResourceRepository,
    ) {}

    public async execute(projectId: number, resourceId: number, userId: number): Promise<void> {
        const project = await this.projectRepository.findProjectById(projectId, ['resources']);

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        const resource = project.resources.find((e) => e.id === resourceId);
        if (!resource) {
            throw new ResourceNotFoundException('Resource with this id does not exist');
        }

        await this.resourceRepository.delete(resourceId);

        return;
    }
}
