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
        resourceId: number,
        fieldId: number,
    ): Promise<UpdateFieldResponse> {
        const field = await this.resourceFieldService.validateAndCheckDeletability(
            resourceId,
            fieldId,
        );

        field.name = dto.name;
        field.fieldType = dto.fieldType;
        field.value = dto.value;

        await this.resourceFieldRepository.update({ id: fieldId }, field);

        return new UpdateFieldResponse(field.id, field.name, field.fieldType, field.value);
    }
}
