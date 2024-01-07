import { Injectable } from '@nestjs/common';

import { ResourceFieldEntity } from '../../../../domain/project/entities/resource-field.entity';
import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';
import { ResourceExistsException } from '../../../../infra/exceptions/resource-exists.exception';
import { CreateFieldResponse } from '../../../../ui/responses/project/create-field.response';

import type { CreateFieldRequest } from '../../../../ui/requests/project/create-field.request';

@Injectable()
export class CreateFieldAction {
    constructor(private readonly resourceFieldRepository: ResourceFieldRepository) {}

    public async execute(
        dto: CreateFieldRequest,
        resourceId: number,
    ): Promise<CreateFieldResponse> {
        const resource = await this.resourceFieldRepository.findByName(dto.name);

        if (resource) {
            throw new ResourceExistsException(
                `Resource field with name "${dto.name}" already exists`,
            );
        }

        const resourceFields = await this.resourceFieldRepository.findByResourceId(resourceId);

        if (resourceFields.length >= 20) {
            throw new ResourceExistsException(
                `Resource field with name "${dto.name}" already exists`,
            );
        }

        let field = new ResourceFieldEntity(dto.name, dto.fieldType, resourceId);

        field = await this.resourceFieldRepository.save(field);

        return new CreateFieldResponse(field.id, field.name, field.fieldType, field.value);
    }
}
