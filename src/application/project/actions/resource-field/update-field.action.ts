import { Injectable } from '@nestjs/common';

import { ProjectService } from '../../../../domain/project/services/project.service';
import { ResourceFieldService } from '../../../../domain/project/services/resource-field.service';
import { ResourceService } from '../../../../domain/project/services/resource.service';
import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';
import { UpdateFieldResponse } from '../../../../ui/responses/project/update-field.response';

import type { UpdateFieldRequest } from '../../../../ui/requests/project/update-field.request';

@Injectable()
export class UpdateFieldAction {
    constructor(
        private readonly resourceFieldRepository: ResourceFieldRepository,
        private readonly resourceFieldService: ResourceFieldService,
        private readonly resourceService: ResourceService,
        private readonly projectService: ProjectService,
    ) {}

    public async execute(
        dto: UpdateFieldRequest,
        projectId: number,
        resourceId: string,
        fieldId: string,
        userId: number,
    ): Promise<UpdateFieldResponse> {
        await this.projectService.validateAndCheckExistence(projectId, userId);
        await this.resourceService.validateAndCheckExistence(projectId, resourceId);

        const field = await this.resourceFieldService.validateAndCheckExistence(
            resourceId,
            fieldId,
        );

        field.name = dto.name;
        field.fieldType = dto.fieldType;
        field.value = dto.value;

        await this.resourceFieldRepository.update({ publicId: fieldId }, field);

        return new UpdateFieldResponse(field.publicId, field.name, field.fieldType, field.value);
    }
}
