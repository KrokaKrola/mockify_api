import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { ResourceFieldRepository } from '../../../infra/database/postgres/repositories/resource-field.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { FieldTypeEnum } from '../enums/field-type.enum';

import type { ResourceFieldEntity } from '../entities/resource-field.entity';

@Injectable()
export class ResourceFieldService {
    constructor(private readonly resourceFieldRepository: ResourceFieldRepository) {}

    public async validateAndCheckDeletability(
        resourceId: number,
        fieldId: number,
    ): Promise<ResourceFieldEntity> {
        const field = await this.resourceFieldRepository.findById(fieldId);

        if (!field) {
            throw new ResourceNotFoundException('Field not found');
        }

        if (field.resourceId !== resourceId) {
            throw new ResourceNotFoundException('Field not found');
        }

        if (field.fieldType === FieldTypeEnum.PRIMARY_KEY) {
            throw new UnprocessableEntityException([
                {
                    property: 'fieldType',
                    errors: ['primaryKey'],
                    constraints: {
                        primaryKey: 'Primary key field cannot be deleted',
                    },
                },
            ]);
        }

        return field;
    }
}
