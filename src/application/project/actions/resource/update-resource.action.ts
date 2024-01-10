import { Injectable } from '@nestjs/common';

import { ProjectService } from '../../../../domain/project/services/project.service';
import { ResourceService } from '../../../../domain/project/services/resource.service';
import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';
import { ResourceExistsException } from '../../../../infra/exceptions/resource-exists.exception';
import { UpdateResourceResponse } from '../../../../ui/responses/project/update-resource.response';

import type { UpdateResourceRequest } from '../../../../ui/requests/project/update-resource.request';

@Injectable()
export class UpdateResourceAction {
    constructor(
        private readonly resourceRepository: ResourceRepository,
        private readonly projectService: ProjectService,
        private readonly resourceService: ResourceService,
    ) {}

    public async execute(
        dto: UpdateResourceRequest,
        projectId: number,
        resourceId: string,
        userId: number,
    ): Promise<UpdateResourceResponse> {
        await this.projectService.validateAndCheckExistence(projectId, userId);

        const resource = await this.resourceService.validateAndCheckExistence(
            projectId,
            resourceId,
        );

        const existingResource = await this.resourceRepository.findByName(dto.name);

        if (existingResource) {
            throw new ResourceExistsException('Resource with this name already exists');
        }

        resource.name = dto.name;

        await this.resourceRepository.update({ publicId: resourceId }, resource);

        return new UpdateResourceResponse(resource.publicId, resource.name);
    }
}
