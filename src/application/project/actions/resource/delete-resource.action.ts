import { Injectable } from '@nestjs/common';

import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';

@Injectable()
export class DeleteResourceAction {
    constructor(private readonly resourceRepository: ResourceRepository) {}

    public async execute(resourceId: number): Promise<void> {
        await this.resourceRepository.delete(resourceId);
    }
}
