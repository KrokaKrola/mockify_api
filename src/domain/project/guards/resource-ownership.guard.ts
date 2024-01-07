import { Injectable } from '@nestjs/common';

import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { ResourceRepository } from '../../../infra/database/postgres/repositories/resource.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
    constructor(private readonly resourceRepository: ResourceRepository) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request;

        const { id: projectId } = request.params;
        const { resourceId } = request.params;

        const resource = await this.resourceRepository.findById(+resourceId, ['project']);

        if (!resource) {
            throw new ResourceNotFoundException('Resource not found (1)');
        }

        if (resource.projectId !== +projectId) {
            throw new ResourceNotFoundException('Resource not found (2)');
        }

        return true;
    }
}
