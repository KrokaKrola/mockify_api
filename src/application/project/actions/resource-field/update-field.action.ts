import { Injectable } from '@nestjs/common';

import { ResourceFieldService } from '../../../../domain/project/services/resource-field.service';
import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';
import { UpdateFieldResponse } from '../../../../ui/responses/project/update-field.response';

import type { UpdateFieldRequest } from '../../../../ui/requests/project/update-field.request';

@Injectable()
export class UpdateFieldAction {
    constructor(
        private readonly resourceFieldRepository: ResourceFieldRepository,
        private readonly resourceFieldService: ResourceFieldService,
    ) {}

    public async execute(
        dto: UpdateFieldRequest,
        resourceId: string,
        fieldId: string,
    ): Promise<UpdateFieldResponse> {
        const field = await this.resourceFieldService.validateAndCheckExistence(
            resourceId,
            fieldId,
        );

        field.name = dto.name;
        field.fieldType = dto.fieldType;
        field.value = dto.value;

        await this.resourceFieldRepository.update({ publicId: fieldId }, field);

        return new UpdateFieldResponse(field.id, field.name, field.fieldType, field.value);
    }
}
