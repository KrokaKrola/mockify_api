import { Injectable } from '@nestjs/common';

import { ResourceFieldEntity } from '../../../../domain/project/entities/resource-field.entity';
import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';
import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';
import { ResourceExistsException } from '../../../../infra/exceptions/resource-exists.exception';
import { CreateFieldResponse } from '../../../../ui/responses/project/create-field.response';

import type { CreateFieldRequest } from '../../../../ui/requests/project/create-field.request';

@Injectable()
export class CreateFieldAction {
    constructor(
        private readonly resourceFieldRepository: ResourceFieldRepository,
        private readonly resourceRepository: ResourceRepository,
    ) {}

    public async execute(
        dto: CreateFieldRequest,
        resourceId: string,
    ): Promise<CreateFieldResponse> {
        const resourceField = await this.resourceFieldRepository.findByName(dto.name);

        if (resourceField) {
            throw new ResourceExistsException(
                `Resource field with name "${dto.name}" already exists`,
            );
        }

        const resource = await this.resourceRepository.findByPublicId(resourceId);
        const resourceFields = await this.resourceFieldRepository.findByResourceId(resource.id);

        if (resourceFields.length >= 20) {
            throw new ResourceExistsException(
                `Resource field with name "${dto.name}" already exists`,
            );
        }

        let field = new ResourceFieldEntity(dto.name, dto.fieldType, resource.id);
        field = await this.resourceFieldRepository.save(field);

        return new CreateFieldResponse(field.id, field.name, field.fieldType, field.value);
    }
}
