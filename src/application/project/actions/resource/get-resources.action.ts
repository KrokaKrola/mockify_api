import { Injectable } from '@nestjs/common';

import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';
import { GetResourcesResponse } from '../../../../ui/responses/project/get-resources.response';

@Injectable()
export class GetResourcesAction {
    constructor(private readonly resourceRepository: ResourceRepository) {}

    public async execute(projectId: number): Promise<GetResourcesResponse> {
        const resources = await this.resourceRepository.findByProjectId(projectId, ['fields']);

        return new GetResourcesResponse(resources);
    }
}
