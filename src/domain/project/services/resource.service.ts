import { Injectable } from '@nestjs/common';

import { ResourceRepository } from '../../../infra/database/postgres/repositories/resource.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

import type { ResourceEntity } from '../entities/resource.entity';

@Injectable()
export class ResourceService {
    constructor(private readonly resourceRepository: ResourceRepository) {}

    public async validateAndCheckExistence(
        projectId: number,
        resourceId: string,
    ): Promise<ResourceEntity> {
        const resource = await this.resourceRepository.findByPublicId(resourceId, ['project']);

        if (!resource) {
            throw new ResourceNotFoundException('Resource not found');
        }

        if (resource.projectId !== +projectId) {
            throw new ResourceNotFoundException('Resource not found');
        }

        return resource;
    }
}
