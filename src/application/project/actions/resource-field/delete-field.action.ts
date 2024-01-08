import { Injectable } from '@nestjs/common';

import { ResourceFieldService } from '../../../../domain/project/services/resource-field.service';
import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';

@Injectable()
export class DeleteFieldAction {
    constructor(
        private readonly resourceFieldRepository: ResourceFieldRepository,
        private readonly resourceFieldService: ResourceFieldService,
    ) {}

    public async execute(resourceId: number, fieldId: number): Promise<void> {
        await this.resourceFieldService.validateAndCheckDeletability(resourceId, fieldId);

        await this.resourceFieldRepository.delete(fieldId);
    }
}
