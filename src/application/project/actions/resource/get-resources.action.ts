import { Injectable } from '@nestjs/common';

import { ProjectService } from '../../../../domain/project/services/project.service';
import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';
import { GetResourcesResponse } from '../../../../ui/responses/project/get-resources.response';

@Injectable()
export class GetResourcesAction {
    constructor(
        private readonly resourceRepository: ResourceRepository,
        private readonly projectService: ProjectService,
    ) {}

    public async execute(projectId: number, userId: number): Promise<GetResourcesResponse> {
        await this.projectService.validateAndCheckDeletability(projectId, userId);

        const resources = await this.resourceRepository.findByProjectId(projectId, ['fields']);

        return new GetResourcesResponse(resources);
    }
}
