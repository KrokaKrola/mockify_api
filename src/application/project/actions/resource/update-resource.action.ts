import { Injectable } from '@nestjs/common';

import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';
import { ResourceExistsException } from '../../../../infra/exceptions/resource-exists.exception';
import { UpdateResourceResponse } from '../../../../ui/responses/project/update-resource.response';

import type { UpdateResourceRequest } from '../../../../ui/requests/project/update-resource.request';

@Injectable()
export class UpdateResourceAction {
    constructor(private readonly resourceRepository: ResourceRepository) {}

    public async execute(
        dto: UpdateResourceRequest,
        resourceId: string,
    ): Promise<UpdateResourceResponse> {
        const resource = await this.resourceRepository.findByPublicId(resourceId);

        const existingResource = await this.resourceRepository.findByName(dto.name);

        if (existingResource) {
            throw new ResourceExistsException('Resource with this name already exists');
        }

        resource.name = dto.name;

        await this.resourceRepository.update({ publicId: resourceId }, resource);

        return new UpdateResourceResponse(resource.publicId, resource.name);
    }
}
