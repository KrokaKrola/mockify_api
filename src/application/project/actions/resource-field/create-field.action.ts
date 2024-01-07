import { Injectable } from '@nestjs/common';

import { FieldTypeEnum } from '../../../../domain/project/enums/field-type.enum';
import { CreateFieldResponse } from '../../../../ui/responses/project/create-field.response';

import type { CreateFieldRequest } from '../../../../ui/requests/project/create-field.request';

@Injectable()
export class CreateFieldAction {
    public async execute(
        dto: CreateFieldRequest,
        projectId: string,
        resourceId: number,
        userId: number,
    ): Promise<CreateFieldResponse> {
        return new CreateFieldResponse(
            1,
            'name',
            FieldTypeEnum.CREATED_AT,
            'value',
            new Date(),
            new Date(),
        );
    }
}
