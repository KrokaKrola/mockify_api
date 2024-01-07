import { Injectable } from '@nestjs/common';

import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';
import { ResourceNotFoundException } from '../../../../infra/exceptions/resource-not-found.exception';
import { UpdateFieldResponse } from '../../../../ui/responses/project/update-field.response';

import type { UpdateFieldRequest } from '../../../../ui/requests/project/update-field.request';

@Injectable()
export class UpdateFieldAction {
    constructor(private readonly resourceFieldRepository: ResourceFieldRepository) {}

    public async execute(
        dto: UpdateFieldRequest,
        resourceId: number,
        fieldId: number,
    ): Promise<UpdateFieldResponse> {
        const field = await this.resourceFieldRepository.findById(fieldId);

        if (!field) {
            throw new ResourceNotFoundException('Field not found');
        }

        if (field.resourceId !== resourceId) {
            throw new ResourceNotFoundException('Field not found');
        }

        field.name = dto.name;
        field.fieldType = dto.fieldType;
        field.value = dto.value;

        await this.resourceFieldRepository.update({ id: fieldId }, field);

        return new UpdateFieldResponse(field.id, field.name, field.fieldType, field.value);
    }
}
