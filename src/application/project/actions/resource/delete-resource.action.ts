import { Injectable } from '@nestjs/common';

import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';
import { ResourceNotFoundException } from '../../../../infra/exceptions/resource-not-found.exception';

@Injectable()
export class DeleteResourceAction {
    constructor(private readonly resourceRepository: ResourceRepository) {}

    public async execute(resourceId: number): Promise<void> {
        const resource = this.resourceRepository.findResourceById(resourceId);

        if (!resource) {
            throw new ResourceNotFoundException('Resource with this id does not exist');
        }

        await this.resourceRepository.delete(resourceId);

        return;
    }
}
