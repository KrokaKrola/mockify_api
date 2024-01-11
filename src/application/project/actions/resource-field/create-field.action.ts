import { Injectable } from '@nestjs/common';

import { ResourceFieldEntity } from '../../../../domain/project/entities/resource-field.entity';
import { ProjectService } from '../../../../domain/project/services/project.service';
import { ResourceService } from '../../../../domain/project/services/resource.service';
import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';
import { ResourceExistsException } from '../../../../infra/exceptions/resource-exists.exception';
import { CreateFieldResponse } from '../../../../ui/responses/project/create-field.response';

import type { CreateFieldRequest } from '../../../../ui/requests/project/create-field.request';

@Injectable()
export class CreateFieldAction {
    constructor(
        private readonly resourceFieldRepository: ResourceFieldRepository,
        private readonly projectService: ProjectService,
        private readonly resourceService: ResourceService,
    ) {}

    public async execute(
        dto: CreateFieldRequest,
        projectId: number,
        resourceId: string,
        userId: number,
    ): Promise<CreateFieldResponse> {
        await this.projectService.validateAndCheckExistence(projectId, userId);

        const resource = await this.resourceService.validateAndCheckExistence(
            projectId,
            resourceId,
        );
        const resourceField = await this.resourceFieldRepository.findByName(dto.name);

        if (resourceField) {
            throw new ResourceExistsException(
                `Resource field with name "${dto.name}" already exists`,
            );
        }

        const resourceFields = await this.resourceFieldRepository.findByResourceId(resource.id);

        if (resourceFields.length >= 20) {
            throw new ResourceExistsException(`Resource "${resource.name}" already has 20 fields`);
        }

        let field = new ResourceFieldEntity(dto.name, dto.fieldType, resource.id);
        field = await this.resourceFieldRepository.save(field);

        return new CreateFieldResponse(field.id, field.name, field.fieldType, field.value);
    }
}
