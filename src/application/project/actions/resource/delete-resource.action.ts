import { Injectable } from '@nestjs/common';

import { ProjectService } from '../../../../domain/project/services/project.service';
import { ResourceService } from '../../../../domain/project/services/resource.service';
import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';

@Injectable()
export class DeleteResourceAction {
    constructor(
        private readonly resourceRepository: ResourceRepository,
        private readonly projectService: ProjectService,
        private readonly resourceService: ResourceService,
    ) {}

    public async execute(projectId: number, resourceId: string, userId: number): Promise<void> {
        await this.projectService.validateAndCheckExistence(projectId, userId);
        await this.resourceService.validateAndCheckExistence(projectId, resourceId);

        await this.resourceRepository.delete({ publicId: resourceId });
    }
}
