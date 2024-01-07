import { Injectable } from '@nestjs/common';

import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';
import { ResourceNotFoundException } from '../../../../infra/exceptions/resource-not-found.exception';

@Injectable()
export class DeleteFieldAction {
    constructor(private readonly resourceFieldRepository: ResourceFieldRepository) {}

    public async execute(resourceId: number, fieldId: number): Promise<void> {
        const field = await this.resourceFieldRepository.findById(fieldId);

        if (!field) {
            throw new ResourceNotFoundException('Field not found');
        }

        if (field.resourceId !== resourceId) {
            throw new ResourceNotFoundException('Field not found');
        }

        await this.resourceFieldRepository.delete(fieldId);
    }
}
