import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ResourceRepository } from '../../../infra/database/postgres/repositories/resource.repository';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { UpdateResourceResponse } from '../../../ui/responses/project/update-resource.response';

import type { UpdateResourceRequest } from '../../../ui/requests/project/update-resource.request';

@Injectable()
export class UpdateResourceAction {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly resourceRepository: ResourceRepository,
    ) {}

    public async execute(
        dto: UpdateResourceRequest,
        projectId: number,
        resourceId: number,
        userId: number,
    ): Promise<UpdateResourceResponse> {
        const project = await this.projectRepository.findProjectById(projectId, ['resources']);

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        const resource = project.resources.find((res) => res.id === resourceId);

        if (!resource) {
            throw new ResourceNotFoundException('Resource with this id does not exist');
        }

        const existingResource = project.resources.find(
            (e) => e.name === dto.name && e.id !== resourceId,
        );

        if (existingResource) {
            throw new ResourceExistsException('Resource with this name already exists');
        }

        resource.name = dto.name;

        await this.resourceRepository.update({ id: resourceId }, resource);

        return new UpdateResourceResponse(resource.id, resource.name);
    }
}
