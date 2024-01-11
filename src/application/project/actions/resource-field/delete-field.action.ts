import { Injectable } from '@nestjs/common';

import { ProjectService } from '../../../../domain/project/services/project.service';
import { ResourceFieldService } from '../../../../domain/project/services/resource-field.service';
import { ResourceService } from '../../../../domain/project/services/resource.service';
import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';

@Injectable()
export class DeleteFieldAction {
    constructor(
        private readonly resourceFieldRepository: ResourceFieldRepository,
        private readonly resourceFieldService: ResourceFieldService,
        private readonly resourceService: ResourceService,
        private readonly projectService: ProjectService,
    ) {}

    public async execute(
        projectId: number,
        resourceId: string,
        fieldId: string,
        userId: number,
    ): Promise<void> {
        await this.projectService.validateAndCheckExistence(projectId, userId);
        await this.resourceService.validateAndCheckExistence(projectId, resourceId);
        await this.resourceFieldService.validateAndCheckExistence(resourceId, fieldId);

        await this.resourceFieldRepository.delete({ publicId: fieldId });
    }
}
